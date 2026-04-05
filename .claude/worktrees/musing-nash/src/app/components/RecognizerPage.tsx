import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Camera, CameraOff, Trash2, Copy } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';

const SEQUENCE_LENGTH = 60;
const FEATURES_PER_FRAME = 255;
const PREDICT_EVERY = 15;
const CONFIDENCE_THRESHOLD = 0.7;
const FACE_KEY_INDICES = [0, 13, 14, 61, 291, 33, 263, 159, 386, 152];

const HOLISTIC_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function extractFeatures(results: HolisticResults): number[] {
  const features: number[] = [];

  // Pose: 33 landmarks × 3
  for (let i = 0; i < 33; i++) {
    const lm = results.poseLandmarks?.[i];
    features.push(lm?.x ?? 0, lm?.y ?? 0, lm?.z ?? 0);
  }

  // Face key: 10 landmarks × 3
  for (const idx of FACE_KEY_INDICES) {
    const lm = results.faceLandmarks?.[idx];
    features.push(lm?.x ?? 0, lm?.y ?? 0, lm?.z ?? 0);
  }

  // Left hand: 21 landmarks × 3
  for (let i = 0; i < 21; i++) {
    const lm = results.leftHandLandmarks?.[i];
    features.push(lm?.x ?? 0, lm?.y ?? 0, lm?.z ?? 0);
  }

  // Right hand: 21 landmarks × 3
  for (let i = 0; i < 21; i++) {
    const lm = results.rightHandLandmarks?.[i];
    features.push(lm?.x ?? 0, lm?.y ?? 0, lm?.z ?? 0);
  }

  return features;
}

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  results: HolisticResults,
  w: number,
  h: number
) {
  ctx.clearRect(0, 0, w, h);

  const dot = (x: number, y: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x * w, y * h, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  results.poseLandmarks?.forEach((lm) => dot(lm.x, lm.y, '#22c55e'));
  FACE_KEY_INDICES.forEach((idx) => {
    const lm = results.faceLandmarks?.[idx];
    if (lm) dot(lm.x, lm.y, '#60a5fa');
  });
  results.leftHandLandmarks?.forEach((lm) => dot(lm.x, lm.y, '#f87171'));
  results.rightHandLandmarks?.forEach((lm) => dot(lm.x, lm.y, '#fbbf24'));
}

export function RecognizerPage({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [sentence, setSentence] = useState<string[]>([]);
  const [statusText, setStatusText] = useState('Загрузка модели...');
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameBufferRef = useRef<number[][]>([]);
  const frameCountRef = useRef(0);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const scalerRef = useRef<{ mean: number[]; scale: number[] } | null>(null);
  const indexToLabelRef = useRef<Record<number, string>>({});
  const holisticRef = useRef<Holistic | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRunningRef = useRef(false);
  const lastWordRef = useRef('');
  const lastWordTimeRef = useRef(0);
  const sendingRef = useRef(false);

  // Keep ref in sync
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

  // Initialize everything
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Load model assets in parallel
        const [scalerData, labelMap, model] = await Promise.all([
          fetch('/model/scaler.json').then((r) => r.json()),
          fetch('/model/label_map.json').then((r) => r.json()),
          tf.loadLayersModel('/model/model.json'),
        ]);

        if (cancelled) { model.dispose(); return; }

        scalerRef.current = scalerData;
        modelRef.current = model;

        // Invert label map: {word: idx} → {idx: word}
        const inverted: Record<number, string> = {};
        for (const [word, idx] of Object.entries(labelMap)) {
          inverted[idx as number] = word;
        }
        indexToLabelRef.current = inverted;

        // Load MediaPipe Holistic from CDN
        setStatusText('Загрузка MediaPipe...');
        await loadScript(`${HOLISTIC_CDN}/holistic.js`);

        if (cancelled) return;

        const holistic = new (window as any).Holistic({
          locateFile: (file: string) => `${HOLISTIC_CDN}/${file}`,
        });
        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        holisticRef.current = holistic;

        // Setup results callback
        holistic.onResults((results: HolisticResults) => {
          // Draw landmarks
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (canvas && video) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (ctx) drawLandmarks(ctx, results, canvas.width, canvas.height);
          }

          if (!isRunningRef.current) return;

          // Extract and buffer
          const features = extractFeatures(results);
          const buf = frameBufferRef.current;
          if (buf.length >= SEQUENCE_LENGTH) buf.shift();
          buf.push(features);
          frameCountRef.current++;

          // Predict every N frames once buffer is full
          if (buf.length >= SEQUENCE_LENGTH && frameCountRef.current % PREDICT_EVERY === 0) {
            predict();
          }
        });

        // Open camera
        setStatusText('Запрос камеры...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });

        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setIsLoading(false);
        setStatusText('Нажмите "Старт" для распознавания');
      } catch (err: any) {
        if (!cancelled) {
          console.error('Init error:', err);
          setError(err.message || 'Ошибка инициализации');
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      modelRef.current?.dispose();
      holisticRef.current?.close();
    };
  }, []);

  const predict = useCallback(() => {
    const model = modelRef.current;
    const scaler = scalerRef.current;
    const buf = frameBufferRef.current;
    if (!model || !scaler || buf.length < SEQUENCE_LENGTH) return;

    const result = tf.tidy(() => {
      // Normalize
      const flat: number[] = [];
      for (let f = 0; f < SEQUENCE_LENGTH; f++) {
        for (let i = 0; i < FEATURES_PER_FRAME; i++) {
          const val = buf[f][i];
          flat.push((val - scaler.mean[i]) / scaler.scale[i]);
        }
      }

      const input = tf.tensor3d(flat, [1, SEQUENCE_LENGTH, FEATURES_PER_FRAME]);
      const output = model.predict(input) as tf.Tensor;
      return output.dataSync();
    });

    // Find argmax
    let maxIdx = 0;
    let maxVal = result[0];
    for (let i = 1; i < result.length; i++) {
      if (result[i] > maxVal) { maxVal = result[i]; maxIdx = i; }
    }

    const word = indexToLabelRef.current[maxIdx] || `class_${maxIdx}`;
    const conf = maxVal;

    setCurrentWord(word);
    setConfidence(conf);

    if (conf >= CONFIDENCE_THRESHOLD) {
      const now = Date.now();
      if (word !== lastWordRef.current || now - lastWordTimeRef.current > 2000) {
        lastWordRef.current = word;
        lastWordTimeRef.current = now;
        setSentence((prev) => [...prev, word]);
      }
    }
  }, []);

  // Frame sending loop
  useEffect(() => {
    if (!isRunning || !holisticRef.current || !videoRef.current) return;

    let animId: number;

    async function loop() {
      if (!isRunningRef.current || !holisticRef.current || !videoRef.current) return;
      if (videoRef.current.readyState >= 2 && !sendingRef.current) {
        sendingRef.current = true;
        try {
          await holisticRef.current.send({ image: videoRef.current });
        } catch {
          // ignore frame errors
        }
        sendingRef.current = false;
      }
      animId = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  const toggleRunning = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setStatusText('Остановлено');
    } else {
      frameBufferRef.current = [];
      frameCountRef.current = 0;
      setIsRunning(true);
      setCurrentWord('');
      setConfidence(0);
      setStatusText('Распознавание...');
    }
  }, [isRunning]);

  const clearSentence = useCallback(() => {
    setSentence([]);
    setCurrentWord('');
    setConfidence(0);
    lastWordRef.current = '';
  }, []);

  const copySentence = useCallback(() => {
    const text = sentence.join(' ');
    if (text) navigator.clipboard.writeText(text);
  }, [sentence]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center font-bold text-white">Q</div>
          <h1 className="text-lg font-semibold">Qyran Recognizer</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-[480px] w-full mx-auto p-3 gap-3">
        {/* Webcam view */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#334155] bg-[#0F172A]" style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0F172A]">
              <div className="w-10 h-10 border-3 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin" />
              <span className="text-gray-400 text-sm mt-4">{statusText}</span>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0F172A]/90">
              <span className="text-red-400 text-sm text-center px-4">{error}</span>
            </div>
          )}

          {/* Prediction overlay */}
          {currentWord && !isLoading && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-[#4F46E5]/15 border border-[#4F46E5]/30 text-[#A5B4FC] px-6 py-2 rounded-full text-xl font-semibold tracking-widest pointer-events-none">
              {currentWord} <span className="text-sm text-[#A5B4FC]/60">{Math.round(confidence * 100)}%</span>
            </div>
          )}

          {/* Running indicator */}
          {isRunning && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">REC</span>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className={`rounded-xl border border-[#334155] p-3.5 text-center ${isRunning ? 'bg-[#1E293B]/50' : 'bg-[#1E293B]/30'}`}>
          <span className={`text-sm ${isRunning ? 'text-[#A5B4FC]' : 'text-[#64748B]'}`}>
            {statusText}
          </span>
          {isRunning && frameBufferRef.current.length < SEQUENCE_LENGTH && (
            <div className="h-1 bg-white/10 rounded-sm mt-2.5 overflow-hidden">
              <div
                className="h-full bg-[#4F46E5] rounded-sm transition-[width] duration-150"
                style={{ width: `${(frameBufferRef.current.length / SEQUENCE_LENGTH) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Sentence display */}
        <div className="rounded-xl border border-[#334155] p-4 bg-[#1E293B]/50 min-h-[80px]">
          <p className="text-white text-lg leading-relaxed">
            {sentence.length > 0
              ? sentence.join(' ')
              : <span className="text-[#64748B] text-sm">Распознанные слова появятся здесь...</span>
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={toggleRunning}
            disabled={isLoading || !!error}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isRunning
                ? 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25'
                : 'bg-[#4F46E5] text-white hover:opacity-90'
            }`}
          >
            {isRunning ? <><CameraOff className="w-4 h-4" /> Стоп</> : <><Camera className="w-4 h-4" /> Старт</>}
          </button>
          <button
            onClick={clearSentence}
            className="px-4 py-3.5 rounded-xl bg-[#1E293B]/50 border border-[#334155] text-gray-400 hover:text-white hover:border-[#4F46E5] transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={copySentence}
            className="px-4 py-3.5 rounded-xl bg-[#1E293B]/50 border border-[#334155] text-gray-400 hover:text-white hover:border-[#4F46E5] transition-all"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
