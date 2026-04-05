import { useState, useRef, useEffect, useCallback } from 'react';
import { ALPHABET } from '@/alphabet';
import { ArrowLeft, Mic, MicOff, Volume2, Send } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DEG = Math.PI / 180;

// Word animations (full body, like Hand Talk)
const WORDS: Record<string, { dur: number; kf: { t: number; p: any }[] }> = {
  'привет': { dur: 1500, kf: [
    { t:0, p:{ ra:{u:[0,0,-70],f:[-90,0,0]}, rf:{thumb:{curl:0,spread:.5},index:{curl:0,spread:.2},middle:{curl:0},ring:{curl:0},pinky:{curl:0}}, hd:[0,5,0], sp:[3,0,0] }},
    { t:.35, p:{ ra:{u:[0,0,-80],f:[-70,0,0]}, rw:[0,0,20], hd:[0,5,0] }},
    { t:.65, p:{ ra:{u:[0,0,-70],f:[-90,0,0]}, rw:[0,0,-20], hd:[0,-5,0] }},
    { t:1, p:{ ra:{u:[0,0,-80],f:[-70,0,0]}, rw:[0,0,20] }},
  ]},
  'спасибо': { dur: 1500, kf: [
    { t:0, p:{ ra:{u:[20,0,-30],f:[-60,0,0]}, rf:{thumb:{curl:0},index:{curl:0},middle:{curl:0},ring:{curl:0},pinky:{curl:0}}, hd:[5,0,0], sp:[5,0,0] }},
    { t:.5, p:{ ra:{u:[30,0,-20],f:[-40,0,0]}, hd:[15,0,0], sp:[10,0,0] }},
    { t:1, p:{ ra:{u:[20,0,-30],f:[-60,0,0]}, hd:[5,0,0], sp:[5,0,0] }},
  ]},
  'да': { dur: 1000, kf: [
    { t:0, p:{ ra:{u:[20,0,-20],f:[-70,0,0]}, rf:{thumb:{curl:.8},index:{curl:1},middle:{curl:1},ring:{curl:1},pinky:{curl:1}}, hd:[0,0,0] }},
    { t:.3, p:{ rw:[-30,0,0], hd:[15,0,0] }},
    { t:.6, p:{ rw:[0,0,0], hd:[0,0,0] }},
    { t:1, p:{ rw:[-30,0,0], hd:[15,0,0] }},
  ]},
  'нет': { dur: 1200, kf: [
    { t:0, p:{ ra:{u:[10,0,-40],f:[-80,0,0]}, rf:{thumb:{curl:0,spread:.5},index:{curl:0},middle:{curl:1},ring:{curl:1},pinky:{curl:1}} }},
    { t:.25, p:{ rw:[0,30,0], hd:[0,-15,0] }},
    { t:.5, p:{ rw:[0,-30,0], hd:[0,15,0] }},
    { t:.75, p:{ rw:[0,30,0], hd:[0,-15,0] }},
    { t:1, p:{ rw:[0,0,0], hd:[0,0,0] }},
  ]},
  'я': { dur: 800, kf: [
    { t:0, p:{ ra:{u:[30,0,-10],f:[-90,0,0]}, rf:{thumb:{curl:.8},index:{curl:0},middle:{curl:1},ring:{curl:1},pinky:{curl:1}} }},
    { t:.5, p:{ ra:{u:[40,0,-5],f:[-100,0,0]}, sp:[3,0,0] }},
    { t:1, p:{ ra:{u:[30,0,-10],f:[-90,0,0]} }},
  ]},
  'ты': { dur: 800, kf: [
    { t:0, p:{ ra:{u:[20,0,-30],f:[-50,0,0]}, rf:{thumb:{curl:.8},index:{curl:0},middle:{curl:1},ring:{curl:1},pinky:{curl:1}} }},
    { t:.5, p:{ ra:{u:[10,0,-40],f:[-30,0,0]} }},
    { t:1, p:{ ra:{u:[20,0,-30],f:[-50,0,0]} }},
  ]},
  'хорошо': { dur: 1000, kf: [
    { t:0, p:{ ra:{u:[20,0,-40],f:[-70,0,0]}, rf:{thumb:{curl:0,spread:.8},index:{curl:1},middle:{curl:1},ring:{curl:1},pinky:{curl:1}}, hd:[5,0,0] }},
    { t:.5, p:{ ra:{u:[15,0,-50],f:[-60,0,0]}, hd:[10,0,0] }},
    { t:1, p:{ ra:{u:[20,0,-40],f:[-70,0,0]}, hd:[5,0,0] }},
  ]},
  'помощь': { dur: 1400, kf: [
    { t:0, p:{ ra:{u:[30,0,-30],f:[-80,0,0]}, la:{u:[30,0,30],f:[-80,0,0]}, rf:{thumb:{curl:1},index:{curl:1},middle:{curl:1},ring:{curl:1},pinky:{curl:1}}, lf:{thumb:{curl:0},index:{curl:0},middle:{curl:0},ring:{curl:0},pinky:{curl:0}} }},
    { t:.5, p:{ ra:{u:[40,0,-20],f:[-60,0,0]}, la:{u:[40,0,20],f:[-60,0,0]}, sp:[5,0,0] }},
    { t:1, p:{ ra:{u:[30,0,-30],f:[-80,0,0]}, la:{u:[30,0,30],f:[-80,0,0]} }},
  ]},
};

function letterPose(ld: any) {
  return {
    ra: { u:[10,0,-50], f:[-90,0,0] },
    rw: ld.pose.wristRotation || [0,0,0],
    rf: { thumb:ld.pose.thumb, index:ld.pose.index, middle:ld.pose.middle, ring:ld.pose.ring, pinky:ld.pose.pinky },
    sp: [2,-3,0], hd: [0,-5,0],
  };
}

export function TranslatorPage({ onBack }: { onBack: () => void }) {
  const [inputText, setInputText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSign, setCurrentSign] = useState('');
  const [statusText, setStatusText] = useState('Введите текст или используйте микрофон');
  const [speed, setSpeed] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const bonesRef = useRef<Record<string, THREE.Object3D>>({});
  const initialPosesRef = useRef<Record<string, { r: THREE.Euler; p: THREE.Vector3 }>>({});
  const clockRef = useRef(new THREE.Clock());
  const curAnimRef = useRef<any>(null);
  const signQueueRef = useRef<any[]>([]);
  const isAnimRef = useRef(false);
  const speedRef = useRef(1);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
  }>({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(30, 1, 0.1, 100),
    renderer: null,
    controls: null,
  });

  // Keep speedRef in sync
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Bone helper
  const B = useCallback((name: string) => bonesRef.current[name] || null, []);

  const lerpBone = useCallback((bone: THREE.Object3D | null, rx: number, ry: number, rz: number, p: number) => {
    if (!bone) return;
    bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, rx, p);
    bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, ry, p);
    bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, rz, p);
  }, []);

  const applyPose = useCallback((pose: any, p: number) => {
    // RIGHT FINGERS
    if (pose.rf) {
      const map: Record<string, string[]> = { thumb: ['R_Thumb1','R_Thumb2'], index: ['R_Index1','R_Index2','R_Index3'], middle: ['R_Middle1','R_Middle2','R_Middle3'], ring: ['R_Ring1','R_Ring2','R_Ring3'], pinky: ['R_Pinky1','R_Pinky2','R_Pinky3'] };
      for (const [k, names] of Object.entries(map)) {
        const d = pose.rf[k]; if (!d) continue;
        names.forEach((n: string, i: number) => {
          const bone = B(n); if (!bone) return;
          const curl = (d.curl || 0) * (k === 'thumb' ? 0.8 : 1.2);
          bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, curl, p);
          if (i === 0 && k !== 'thumb' && d.spread)
            bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, d.spread * 0.3, p);
        });
      }
    }
    // LEFT FINGERS
    if (pose.lf) {
      const map: Record<string, string[]> = { thumb: ['L_Thumb1','L_Thumb2','L_Thumb3'], index: ['L_Index1','L_Index2'], middle: ['L_Middle1','L_Middle2','L_Middle3'], ring: ['L_Ring1','L_Ring2','L_Ring3'], pinky: ['L_Pinky1','L_Pinky2','L_Pinky3'] };
      for (const [k, names] of Object.entries(map)) {
        const d = pose.lf[k]; if (!d) continue;
        names.forEach((n: string) => { const bone = B(n); if (bone) bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, (d.curl||0)*1.2, p); });
      }
    }
    // WRISTS
    if (pose.rw) lerpBone(B('R_Hand'), pose.rw[0]*DEG, pose.rw[1]*DEG, pose.rw[2]*DEG, p);
    if (pose.lw) lerpBone(B('L_Hand'), pose.lw[0]*DEG, pose.lw[1]*DEG, pose.lw[2]*DEG, p);
    // ARMS
    if (pose.ra) {
      if (pose.ra.u) lerpBone(B('R_Upperarm'), pose.ra.u[0]*DEG, pose.ra.u[1]*DEG, pose.ra.u[2]*DEG, p);
      if (pose.ra.f) lerpBone(B('R_Forearm'), pose.ra.f[0]*DEG, pose.ra.f[1]*DEG, pose.ra.f[2]*DEG, p);
      if (pose.ra.c) lerpBone(B('R_Clavicle'), pose.ra.c[0]*DEG, pose.ra.c[1]*DEG, pose.ra.c[2]*DEG, p);
    }
    if (pose.la) {
      if (pose.la.u) lerpBone(B('L_Upperarm'), pose.la.u[0]*DEG, pose.la.u[1]*DEG, pose.la.u[2]*DEG, p);
      if (pose.la.f) lerpBone(B('L_ForearmTwist01'), pose.la.f[0]*DEG, pose.la.f[1]*DEG, pose.la.f[2]*DEG, p);
    }
    // BODY
    if (pose.sp) lerpBone(B('Spine01'), pose.sp[0]*DEG, pose.sp[1]*DEG, pose.sp[2]*DEG, p);
    if (pose.sp2) lerpBone(B('Spine02'), pose.sp2[0]*DEG, pose.sp2[1]*DEG, pose.sp2[2]*DEG, p);
    // HEAD
    if (pose.hd) {
      lerpBone(B('Head'), pose.hd[0]*DEG, pose.hd[1]*DEG, pose.hd[2]*DEG, p);
      lerpBone(B('NeckTwist01'), pose.hd[0]*DEG*0.3, pose.hd[1]*DEG*0.3, pose.hd[2]*DEG*0.3, p);
    }
  }, [B, lerpBone]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { scene, camera } = sceneRef.current;
    scene.background = new THREE.Color(0x111111);

    const w0 = container.clientWidth || 480;
    const h0 = container.clientHeight || 360;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w0, h0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    sceneRef.current.renderer = renderer;

    camera.position.set(0, 1.0, 3.0);
    camera.aspect = w0 / h0;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.8, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 3, 2); mainLight.castShadow = true; scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0xf97316, 0.4);
    fillLight.position.set(-2, 1, -1); scene.add(fillLight);

    // Ground circle
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, transparent: true, opacity: 0.5 })
    );
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    // Load avatar
    new GLTFLoader().loadAsync('/avatar.glb').then((gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.set(-center.x, -box.min.y, -center.z);
      model.rotation.y = -Math.PI / 2;
      scene.add(model);

      const h = size.y;
      camera.position.set(0, h * 0.45, h * 2.2);
      camera.lookAt(0, h * 0.42, 0);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, h * 0.42, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = h * 0.5;
      controls.maxDistance = h * 5;
      controls.update();
      sceneRef.current.controls = controls;

      model.traverse((child: any) => {
        if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
        if (child.name) {
          bonesRef.current[child.name] = child;
          initialPosesRef.current[child.name] = { r: child.rotation.clone(), p: child.position.clone() };
        }
      });

      setAvatarLoaded(true);
    }).catch((err) => {
      console.error('Failed to load avatar:', err);
    });

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clockRef.current.getElapsedTime();
      if (curAnimRef.current) curAnimRef.current.update(time);
      if (!isAnimRef.current && !curAnimRef.current) {
        const sp = bonesRef.current['Spine01'];
        if (sp) sp.rotation.x = (initialPosesRef.current['Spine01']?.r.x || 0) + Math.sin(time * 0.8) * 0.015;
        const hd = bonesRef.current['Head'];
        if (hd) {
          hd.rotation.y = (initialPosesRef.current['Head']?.r.y || 0) + Math.sin(time * 0.4) * 0.03;
          hd.rotation.x = (initialPosesRef.current['Head']?.r.x || 0) + Math.sin(time * 0.7) * 0.01;
        }
      }
      if (sceneRef.current.controls) sceneRef.current.controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
      sceneRef.current.controls?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // Animation engine
  const interpKF = useCallback((kfs: any[], t: number) => {
    let a = kfs[0], b = kfs[kfs.length - 1];
    for (let i = 0; i < kfs.length - 1; i++) {
      if (t >= kfs[i].t && t <= kfs[i + 1].t) { a = kfs[i]; b = kfs[i + 1]; break; }
    }
    const range = b.t - a.t;
    const lt = range > 0 ? (t - a.t) / range : 1;
    return { a: a.p, b: b.p, blend: lt * lt * (3 - 2 * lt) };
  }, []);

  const processQueue = useCallback(() => {
    if (!signQueueRef.current.length) {
      isAnimRef.current = false;
      const st = clockRef.current.getElapsedTime();
      curAnimRef.current = { update(time: number) {
        const t = Math.min((time - st) / 0.8, 1);
        for (const [n, ip] of Object.entries(initialPosesRef.current)) {
          const bone = bonesRef.current[n]; if (!bone) continue;
          bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, ip.r.x, t * 0.08);
          bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, ip.r.y, t * 0.08);
          bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, ip.r.z, t * 0.08);
        }
        if (t >= 1) curAnimRef.current = null;
      }};
      setIsPlaying(false);
      setStatusText('Перевод завершён');
      setProgress(100);
      return;
    }

    const data = signQueueRef.current.shift()!;
    const st = clockRef.current.getElapsedTime();
    const dur = (data.duration || 500) / 1000 / speedRef.current;

    setCurrentSign(data.displayValue || data.value);
    if (data.total > 0) setProgress(((data.index + 1) / data.total) * 100);

    if (data.type === 'pause') {
      setTimeout(processQueue, data.duration / speedRef.current);
      return;
    }

    const word = WORDS[data.value?.toLowerCase()];

    curAnimRef.current = { update(time: number) {
      const t = Math.min((time - st) / dur, 1);
      if (word) {
        const { a, b, blend } = interpKF(word.kf, t);
        applyPose(a, 0.15);
        if (b !== a) applyPose(b, blend * 0.15);
      } else if (data.keyframes?.length) {
        const fi = Math.min(Math.floor(t * data.keyframes.length), data.keyframes.length - 1);
        applyPose(letterPose({ pose: data.keyframes[fi] }), 0.15);
      } else if (data.pose) {
        applyPose(letterPose(data), 0.12);
      }
      if (t >= 1) { curAnimRef.current = null; processQueue(); }
    }};
  }, [applyPose, interpKF]);

  const textToSign = useCallback((text: string) => {
    const n = text.trim().replace(/[^а-яёА-ЯЁ\s]/g, '').replace(/\s+/g, ' ');
    if (!n) return [];
    const words = n.split(' '), seq: any[] = [];
    for (let w = 0; w < words.length; w++) {
      const wl = words[w].toLowerCase();
      if (WORDS[wl]) {
        seq.push({ type: 'word', value: wl, displayValue: words[w], duration: WORDS[wl].dur });
      } else {
        for (const ch of words[w].toUpperCase()) {
          const ld = (ALPHABET as any)[ch];
          if (ld) seq.push({ type: 'letter', value: ch, displayValue: ch, ...ld });
        }
      }
      if (w < words.length - 1) seq.push({ type: 'pause', value: ' ', displayValue: ' ', duration: 400 });
    }
    return seq.map((s, i) => ({ ...s, index: i, total: seq.length }));
  }, []);

  const translateText = useCallback(() => {
    if (!inputText.trim() || isPlaying) return;
    const seq = textToSign(inputText);
    if (!seq.length) return;
    signQueueRef.current = seq;
    isAnimRef.current = true;
    setIsPlaying(true);
    setProgress(0);
    processQueue();
  }, [inputText, isPlaying, textToSign, processQueue]);

  // Speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Используйте Chrome'); return; }

    const recog = new SR();
    recog.lang = 'ru-RU'; recog.interimResults = true; recog.continuous = true;
    recog.onresult = (e: any) => {
      let f = '';
      for (let i = e.resultIndex; i < e.results.length; i++)
        if (e.results[i].isFinal) f += e.results[i][0].transcript;
      if (f) setInputText(prev => (prev ? prev + ' ' : '') + f);
    };
    recog.onend = () => { setIsListening(false); };
    recog.onerror = () => { setIsListening(false); };
    recog.start();
    recognitionRef.current = recog;
    setIsListening(true);
  }, [isListening]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col relative z-10" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Назад</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white">Q</div>
          <h1 className="text-lg font-semibold">Qyran Translator</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-[480px] w-full mx-auto p-3 gap-3">
        {/* 3D Avatar */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/80" style={{ aspectRatio: '4/3' }}>
          {!avatarLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
              <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-gray-400 text-sm mt-4">Loading avatar...</span>
            </div>
          )}
          {currentSign && currentSign.trim() && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-orange-500/15 border border-orange-500/30 text-orange-300 px-6 py-2 rounded-full text-xl font-semibold tracking-widest pointer-events-none">
              {currentSign}
            </div>
          )}
          <div ref={containerRef} className="w-full h-full absolute inset-0" />
        </div>

        {/* Status Bar */}
        <div className={`rounded-xl border border-white/10 p-3.5 text-center ${isPlaying ? 'bg-white/[0.06]' : 'bg-white/[0.03]'}`}>
          <span className={`text-sm ${isPlaying ? 'text-orange-300 text-xl font-bold tracking-widest' : 'text-gray-500'}`}>
            {isPlaying ? currentSign : statusText}
          </span>
          {isPlaying && (
            <div className="h-1 bg-white/10 rounded-sm mt-2.5 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-sm transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> Speed:
          </span>
          <div className="flex gap-1.5 flex-1">
            {[0.5, 0.75, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  speed === s
                    ? 'bg-orange-500/15 border-orange-500 text-orange-400'
                    : 'border-white/10 text-gray-500 hover:border-orange-500/50 hover:text-orange-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-2.5">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Введите текст на русском..."
            maxLength={500}
            rows={3}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); translateText(); } }}
            className={`w-full bg-white/[0.04] border rounded-xl p-3.5 text-white placeholder-gray-500 resize-none font-[inherit] outline-none transition-colors ${
              isListening ? 'border-red-500' : 'border-white/10 focus:border-orange-500'
            }`}
          />
          <div className="flex gap-2.5">
            <button
              onClick={translateText}
              disabled={isPlaying || !inputText.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-orange-500 text-white font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              <Send className="w-4 h-4" />
              Translate
            </button>
            <button
              onClick={toggleListening}
              className={`w-13 h-13 flex items-center justify-center rounded-xl border text-xl transition-all ${
                isListening
                  ? 'bg-red-500/15 border-red-500/30 animate-pulse'
                  : 'bg-white/[0.04] border-white/10 hover:border-orange-500/50'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
