import { useEffect, useRef, useState, useCallback } from 'react';
import { useSignModel } from '@/hooks/useSignModel';

// MediaPipe Holistic key face indices (same as training)
const FACE_KEY_INDICES = [0, 13, 14, 61, 291, 33, 263, 159, 386, 152];
const NUM_POSE = 33;
const NUM_FACE_KEY = 10;
const NUM_HAND = 21;
const FEATURES = 255; // (33 + 10 + 21 + 21) * 3
const SEQ_LEN = 60;

interface RecognizerPageProps {
  onBack: () => void;
}

export function RecognizerPage({ onBack }: RecognizerPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holisticRef = useRef<any>(null);
  const framesBufferRef = useRef<number[][]>([]);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const isRunningRef = useRef(false);
  const predictRef = useRef<typeof predict | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [history, setHistory] = useState<{ word: string; confidence: number; time: string }[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [holisticReady, setHolisticReady] = useState(false);
  const [status, setStatus] = useState('Loading model...');
  const [frameCount, setFrameCount] = useState(0);

  const { predict, isLoaded, isLoading, error, labels, numClasses } = useSignModel();

  // Keep predict ref in sync
  useEffect(() => {
    predictRef.current = predict;
  }, [predict]);

  // Extract landmarks from MediaPipe results
  const extractLandmarks = useCallback((results: any): number[] => {
    const frame = new Array(FEATURES).fill(0);
    let offset = 0;

    // 1. Pose (33 * 3 = 99)
    if (results.poseLandmarks) {
      for (let i = 0; i < NUM_POSE; i++) {
        const lm = results.poseLandmarks[i];
        if (lm) {
          frame[offset + i * 3] = lm.x;
          frame[offset + i * 3 + 1] = lm.y;
          frame[offset + i * 3 + 2] = lm.z;
        }
      }
    }
    offset += NUM_POSE * 3;

    // 2. Face key landmarks (10 * 3 = 30)
    if (results.faceLandmarks) {
      for (let i = 0; i < FACE_KEY_INDICES.length; i++) {
        const idx = FACE_KEY_INDICES[i];
        const lm = results.faceLandmarks[idx];
        if (lm) {
          frame[offset + i * 3] = lm.x;
          frame[offset + i * 3 + 1] = lm.y;
          frame[offset + i * 3 + 2] = lm.z;
        }
      }
    }
    offset += NUM_FACE_KEY * 3;

    // 3. Left hand (21 * 3 = 63)
    if (results.leftHandLandmarks) {
      for (let i = 0; i < NUM_HAND; i++) {
        const lm = results.leftHandLandmarks[i];
        if (lm) {
          frame[offset + i * 3] = lm.x;
          frame[offset + i * 3 + 1] = lm.y;
          frame[offset + i * 3 + 2] = lm.z;
        }
      }
    }
    offset += NUM_HAND * 3;

    // 4. Right hand (21 * 3 = 63)
    if (results.rightHandLandmarks) {
      for (let i = 0; i < NUM_HAND; i++) {
        const lm = results.rightHandLandmarks[i];
        if (lm) {
          frame[offset + i * 3] = lm.x;
          frame[offset + i * 3 + 1] = lm.y;
          frame[offset + i * 3 + 2] = lm.z;
        }
      }
    }

    return frame;
  }, []);

  // Run prediction on accumulated frames
  const runPrediction = useCallback(async () => {
    const buffer = framesBufferRef.current;
    if (buffer.length < SEQ_LEN || !predictRef.current) return;

    // Take last SEQ_LEN frames
    const frames = buffer.slice(-SEQ_LEN);
    const result = await predictRef.current(frames);

    if (result && result.confidence > 0.3) {
      setCurrentPrediction(result.label);
      setConfidence(result.confidence);
      setHistory(prev => [
        { word: result.label, confidence: result.confidence, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
    }

    // Keep last 30 frames for overlap
    framesBufferRef.current = buffer.slice(-30);
    setFrameCount(framesBufferRef.current.length);
  }, []);

  // Initialize MediaPipe Holistic ONCE
  useEffect(() => {
    let cancelled = false;

    async function initHolistic() {
      try {
        // @ts-ignore - MediaPipe loaded via npm
        const { Holistic } = await import('@mediapipe/holistic');

        const holistic = new Holistic({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
        });

        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.3,
          minTrackingConfidence: 0.3,
        });

        holistic.onResults((results: any) => {
          if (!isRunningRef.current) return;

          const landmarks = extractLandmarks(results);
          framesBufferRef.current.push(landmarks);
          setFrameCount(framesBufferRef.current.length);

          // Draw on canvas
          const canvas = canvasRef.current;
          const video = videoRef.current;
          if (canvas && video) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0);

              // Draw pose landmarks
              if (results.poseLandmarks) {
                ctx.fillStyle = '#f97316';
                for (const lm of results.poseLandmarks) {
                  ctx.beginPath();
                  ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 3, 0, 2 * Math.PI);
                  ctx.fill();
                }
              }
              // Draw hand landmarks
              const drawHand = (handLandmarks: any[], color: string) => {
                if (!handLandmarks) return;
                ctx.fillStyle = color;
                for (const lm of handLandmarks) {
                  ctx.beginPath();
                  ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
                  ctx.fill();
                }
              };
              drawHand(results.leftHandLandmarks, '#22c55e');
              drawHand(results.rightHandLandmarks, '#3b82f6');
            }
          }

          // Run prediction when buffer is full
          if (framesBufferRef.current.length >= SEQ_LEN) {
            runPrediction();
          }
        });

        if (!cancelled) {
          holisticRef.current = holistic;
          setHolisticReady(true);
          setStatus('Ready');
          console.log('[Qyran] MediaPipe Holistic initialized');
        }
      } catch (err: any) {
        console.error('[Qyran] Holistic init error:', err);
        if (!cancelled) {
          setStatus(`Holistic error: ${err.message}`);
        }
      }
    }

    initHolistic();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera processing loop — sends frames to Holistic
  useEffect(() => {
    if (!isRunning || !holisticRef.current || !videoRef.current) return;

    let running = true;

    async function processFrame() {
      if (!running || !videoRef.current || !holisticRef.current) return;
      if (videoRef.current.readyState >= 2) {
        try {
          await holisticRef.current.send({ image: videoRef.current });
        } catch (e) {
          // Ignore send errors during teardown
        }
      }
      if (running) {
        animFrameRef.current = requestAnimationFrame(processFrame);
      }
    }

    processFrame();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, cameraReady, holisticReady]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('Camera access denied');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  // Toggle recognition
  const toggleRecognition = useCallback(async () => {
    if (isRunning) {
      isRunningRef.current = false;
      setIsRunning(false);
      stopCamera();
      framesBufferRef.current = [];
      setFrameCount(0);
    } else {
      await startCamera();
      framesBufferRef.current = [];
      setFrameCount(0);
      setCurrentPrediction(null);
      isRunningRef.current = true;
      setIsRunning(true);
    }
  }, [isRunning, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      stopCamera();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [stopCamera]);

  return (
    <div className="relative z-10 min-h-screen" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Sign Language Recognition
        </h1>
        <div className="w-16" />
      </nav>

      <div className="pt-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Panel */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-white font-medium">
                    {isRunning ? 'Recording...' : 'Camera Off'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Frames: {frameCount}/{SEQ_LEN}</span>
                  {isLoaded && holisticReady && <span className="text-green-400">Ready</span>}
                  {isLoading && <span className="text-yellow-400">Loading model...</span>}
                  {!holisticReady && !isLoading && <span className="text-yellow-400">Loading Holistic...</span>}
                  {error && <span className="text-red-400">Error</span>}
                </div>
              </div>

              <div className="relative aspect-video bg-gray-900">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover hidden"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!isRunning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center">
                      <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">Press Start to begin recognition</p>
                  </div>
                )}

                {/* Live prediction overlay */}
                {isRunning && currentPrediction && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-400 text-xs uppercase tracking-wider">Detected Sign</p>
                        <p className="text-white text-2xl font-bold">{currentPrediction}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-400 text-xs uppercase tracking-wider">Confidence</p>
                        <p className="text-white text-2xl font-bold">{(confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-center gap-4">
                <button
                  onClick={toggleRecognition}
                  disabled={!isLoaded || !holisticReady || !!error}
                  className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                    isRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isRunning ? 'Stop' : 'Start Recognition'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Model Info */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Model Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Status</span>
                  <span className={isLoaded ? 'text-green-400' : 'text-yellow-400'}>
                    {isLoaded ? 'Ready' : isLoading ? 'Loading...' : error || 'Waiting'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Classes</span>
                  <span className="text-white">{numClasses}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Architecture</span>
                  <span className="text-white">Conv1D + BiLSTM</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Features</span>
                  <span className="text-white">255 (Holistic)</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Accuracy</span>
                  <span className="text-green-400">100%</span>
                </div>
              </div>
            </div>

            {/* Available Signs */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Available Signs ({numClasses})
              </h3>
              <div className="flex flex-wrap gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      currentPrediction === label
                        ? 'bg-orange-500/30 border-orange-500 text-orange-300'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Recognition History
              </h3>
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No gestures detected yet</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
                    >
                      <div>
                        <span className="text-white font-medium">{item.word}</span>
                        <span className="text-gray-500 text-xs ml-2">{item.time}</span>
                      </div>
                      <span className="text-orange-400 text-sm font-mono">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
