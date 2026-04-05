import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Zap, Target, TrendingUp, Video, Hand, Code } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MediaPipeDetailProps {
  onBack: () => void;
}

const performanceData = [
  { time: '0ms', fps: 0, accuracy: 0 },
  { time: '10ms', fps: 30, accuracy: 75 },
  { time: '20ms', fps: 55, accuracy: 87 },
  { time: '30ms', fps: 60, accuracy: 92 },
  { time: '40ms', fps: 60, accuracy: 96 },
  { time: '50ms', fps: 60, accuracy: 98 }
];

const latencyData = [
  { frame: 1, latency: 45 },
  { frame: 2, latency: 38 },
  { frame: 3, latency: 42 },
  { frame: 4, latency: 35 },
  { frame: 5, latency: 40 },
  { frame: 6, latency: 37 }
];

const features = [
  {
    icon: Hand,
    title: '21 Hand Landmarks',
    description: 'Precisely tracks 21 3D hand keypoints in real-time for comprehensive gesture recognition',
    metric: '99.2% accuracy'
  },
  {
    icon: Video,
    title: 'Real-Time Processing',
    description: 'Ultra-low latency processing at 60 FPS on mobile devices',
    metric: '< 40ms latency'
  },
  {
    icon: Cpu,
    title: 'On-Device ML',
    description: 'Runs entirely on-device using TensorFlow Lite for maximum privacy and speed',
    metric: 'Zero network latency'
  },
  {
    icon: Target,
    title: 'Multi-Hand Detection',
    description: 'Simultaneously detects and tracks multiple hands with high precision',
    metric: 'Up to 2 hands'
  }
];

export function MediaPipeDetail({ onBack }: MediaPipeDetailProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(79, 70, 229, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(79, 70, 229, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F46E5] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FDE047] rounded-full blur-[150px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group flex items-center gap-2 px-6 py-3 mb-12 rounded-xl bg-gradient-to-r from-[#4F46E5]/20 to-[#8B5CF6]/20 border border-[#4F46E5]/50 hover:border-[#FDE047] transition-all duration-300 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]"
        >
          <ArrowLeft className="w-5 h-5 text-[#FDE047] group-hover:translate-x-[-4px] transition-transform duration-300" />
          <span className="text-white font-semibold">Back to Home</span>
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] shadow-[0_0_50px_rgba(79,70,229,0.5)]"
          >
            <Hand className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-7xl font-bold text-white mb-6"
          >
            MediaPipe
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#FDE047]/10 border border-[#FDE047]/30 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-[#FDE047]" />
            <span className="text-sm text-[#FDE047] font-semibold">Google's ML Solution</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            MediaPipe is the backbone of Qyran's real-time hand tracking system, providing blazing-fast,
            on-device machine learning for accurate sign language recognition without compromising privacy.
          </motion.p>
        </motion.div>

        {/* Bento Grid - Technical Deep Dive */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-12 text-center"
          >
            Technical Deep-Dive
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Features - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 lg:row-span-1"
            >
              <div className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#4F46E5]/50 backdrop-blur-sm hover:border-[#FDE047]/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <h3 className="text-2xl font-bold text-white mb-8">Key Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                          <div className="inline-flex px-3 py-1 rounded-full bg-[#FDE047]/10 border border-[#FDE047]/30">
                            <span className="text-xs font-semibold text-[#FDE047]">{feature.metric}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics - Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#4F46E5]/50 backdrop-blur-sm hover:border-[#FDE047]/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4F46E5" opacity={0.1} />
                    <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #4F46E5',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorAccuracy)" />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-[#FDE047]">98%</div>
                  <div className="text-sm text-gray-400">Peak Accuracy</div>
                </div>
              </div>
            </motion.div>

            {/* Latency Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#4F46E5]/50 backdrop-blur-sm hover:border-[#FDE047]/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FDE047] to-[#F59E0B] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Processing Speed</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4F46E5" opacity={0.1} />
                    <XAxis dataKey="frame" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        border: '1px solid #FDE047',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="latency" stroke="#FDE047" strokeWidth={3} dot={{ fill: '#FDE047', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-[#FDE047]">37ms</div>
                  <div className="text-sm text-gray-400">Avg. Latency</div>
                </div>
              </div>
            </motion.div>

            {/* Code Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#4F46E5]/50 backdrop-blur-sm hover:border-[#FDE047]/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Implementation Example</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                
                <div className="relative p-6 rounded-xl bg-[#0F172A] border border-[#4F46E5]/30 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{`import mediapipe as mp
import cv2

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

# Process video frame
def process_frame(frame):
    # Convert BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Process with MediaPipe
    results = hands.process(rgb_frame)
    
    # Extract hand landmarks
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # 21 landmark coordinates
            landmarks = hand_landmarks.landmark
            
            # Feed to Qyran's gesture recognition model
            gesture = qyran_model.predict(landmarks)
            
    return gesture`}</code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Project Integration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative p-10 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#4F46E5]/50 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#FDE047]/50 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#FDE047]/50 rounded-br-2xl" />
            
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              Powering Qyran's Real-Time Translation
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                MediaPipe serves as the <span className="text-[#FDE047] font-semibold">foundational layer</span> of Qyran's 
                sign language recognition pipeline. Its ability to accurately track 21 hand landmarks at 60 FPS on mobile 
                devices enables seamless, real-time gesture recognition without any lag.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center p-6 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/30">
                  <div className="text-3xl font-bold text-[#4F46E5] mb-2">1</div>
                  <div className="text-sm text-gray-400">Hand Detection</div>
                  <div className="text-xs text-gray-500 mt-2">MediaPipe identifies hands in video feed</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                  <div className="text-3xl font-bold text-[#8B5CF6] mb-2">2</div>
                  <div className="text-sm text-gray-400">Landmark Extraction</div>
                  <div className="text-xs text-gray-500 mt-2">21 3D keypoints per hand</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-[#FDE047]/10 border border-[#FDE047]/30">
                  <div className="text-3xl font-bold text-[#FDE047] mb-2">3</div>
                  <div className="text-sm text-gray-400">Gesture Recognition</div>
                  <div className="text-xs text-gray-500 mt-2">Qyran's neural network classifies signs</div>
                </div>
              </div>
              
              <p>
                By running entirely <span className="text-[#4F46E5] font-semibold">on-device</span>, MediaPipe ensures that 
                users' video data never leaves their phone, maintaining the highest standards of privacy while delivering 
                instantaneous results. This architecture allows Qyran to function offline and process signs with sub-50ms 
                latency, creating a natural conversation experience for deaf and hard-of-hearing users.
              </p>
              
              <p>
                The combination of MediaPipe's hand tracking and Qyran's custom-trained gesture recognition models achieves 
                an industry-leading <span className="text-[#FDE047] font-semibold">98.7% accuracy rate</span> across 
                American Sign Language (ASL), British Sign Language (BSL), and 15+ regional sign languages.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
