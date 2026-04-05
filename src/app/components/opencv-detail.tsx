import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Zap, Target, TrendingUp, Camera, Image, Code } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OpenCVDetailProps {
  onBack: () => void;
}

const processingData = [
  { operation: 'Resize', time: 2.5 },
  { operation: 'Denoise', time: 8.3 },
  { operation: 'Enhance', time: 5.7 },
  { operation: 'Normalize', time: 1.2 }
];

const frameRateData = [
  { lighting: 'Bright', fps: 58 },
  { lighting: 'Normal', fps: 60 },
  { lighting: 'Low Light', fps: 55 },
  { lighting: 'Very Dark', fps: 48 }
];

const features = [
  {
    icon: Camera,
    title: 'Video Processing',
    description: 'Real-time video capture and frame extraction at 60 FPS',
    metric: '< 3ms latency'
  },
  {
    icon: Image,
    title: 'Image Enhancement',
    description: 'Advanced preprocessing for optimal model input quality',
    metric: '40% better SNR'
  },
  {
    icon: Zap,
    title: 'GPU Acceleration',
    description: 'Hardware-accelerated operations using CUDA and OpenCL',
    metric: '8x faster'
  },
  {
    icon: Target,
    title: 'Adaptive Filtering',
    description: 'Dynamic noise reduction and contrast adjustment',
    metric: 'Auto-tuning'
  }
];

export function OpenCVDetail({ onBack }: OpenCVDetailProps) {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(249, 115, 22, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(249, 115, 22, 0.3) 1px, transparent 1px)
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
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#5C9E31] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-400 rounded-full blur-[150px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group flex items-center gap-2 px-6 py-3 mb-12 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 hover:border-yellow-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
        >
          <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:translate-x-[-4px] transition-transform duration-300" />
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
            className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br from-[#5C9E31] to-[#7CB342] shadow-[0_0_50px_rgba(92,158,49,0.5)]"
          >
            <Camera className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-7xl font-bold text-white mb-6"
          >
            OpenCV
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-semibold">Computer Vision Library</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            OpenCV forms Qyran's image preprocessing pipeline, ensuring optimal video quality through advanced
            filtering, enhancement, and normalization techniques for superior model performance.
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
              <div className="group relative h-full p-8 rounded-2xl bg-gradient-to-br from-black/50 to-black/70 border-2 border-orange-500/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
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
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#5C9E31] to-[#7CB342] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                          <div className="inline-flex px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30">
                            <span className="text-xs font-semibold text-yellow-400">{feature.metric}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Processing Time Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-black/50 to-black/70 border-2 border-orange-500/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Processing Time</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={processingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.1} />
                    <XAxis dataKey="operation" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #f97316',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="time" fill="#5C9E31" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">17.7ms</div>
                  <div className="text-sm text-gray-400">Total Pipeline Time</div>
                </div>
              </div>
            </motion.div>

            {/* Frame Rate Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-black/50 to-black/70 border-2 border-orange-500/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Frame Rate</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={frameRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.1} />
                    <XAxis dataKey="lighting" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 65]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #fbbf24',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="fps" stroke="#fbbf24" strokeWidth={3} dot={{ fill: '#fbbf24', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">60 FPS</div>
                  <div className="text-sm text-gray-400">Peak Performance</div>
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
              <div className="group relative h-full p-6 rounded-2xl bg-gradient-to-br from-black/50 to-black/70 border-2 border-orange-500/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Preprocessing Pipeline</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                
                <div className="relative p-6 rounded-xl bg-black/60 border border-orange-500/30 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{`import cv2
import numpy as np

def preprocess_frame(frame):
    """Qyran's OpenCV preprocessing pipeline"""
    
    # 1. Resize to model input size
    frame = cv2.resize(frame, (224, 224), 
                      interpolation=cv2.INTER_AREA)
    
    # 2. Convert color space for better hand detection
    frame_hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # 3. Apply bilateral filter to reduce noise
    # while preserving hand edges
    frame = cv2.bilateralFilter(frame, 9, 75, 75)
    
    # 4. Adaptive histogram equalization
    # for better performance in various lighting
    clahe = cv2.createCLAHE(clipLimit=2.0, 
                            tileGridSize=(8,8))
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    lab[:,:,0] = clahe.apply(lab[:,:,0])
    frame = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    
    # 5. Normalize pixel values
    frame = frame.astype(np.float32) / 255.0
    frame = (frame - 0.5) / 0.5  # [-1, 1] range
    
    return frame

# Process video stream
cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    processed = preprocess_frame(frame)
    # Feed to MediaPipe + TensorFlow pipeline`}</code>
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
          <div className="relative p-10 rounded-2xl bg-gradient-to-br from-black/50 to-black/70 border-2 border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-yellow-400/50 rounded-br-2xl" />
            
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              Powering Qyran's Vision Pipeline
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                OpenCV serves as the <span className="text-yellow-400 font-semibold">critical preprocessing layer</span> in 
                Qyran's sign language recognition pipeline. Before any machine learning happens, OpenCV ensures that every 
                video frame is optimally prepared for analysis, regardless of lighting conditions or camera quality.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center p-6 rounded-xl bg-[#5C9E31]/10 border border-[#5C9E31]/30">
                  <div className="text-3xl font-bold text-[#5C9E31] mb-2">1</div>
                  <div className="text-sm text-gray-400">Frame Capture</div>
                  <div className="text-xs text-gray-500 mt-2">60 FPS video stream processing</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-3xl font-bold text-amber-400 mb-2">2</div>
                  <div className="text-sm text-gray-400">Enhancement</div>
                  <div className="text-xs text-gray-500 mt-2">Noise reduction & contrast adjustment</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                  <div className="text-sm text-gray-400">Normalization</div>
                  <div className="text-xs text-gray-500 mt-2">Standardize input for ML models</div>
                </div>
              </div>
              
              <p>
                Through advanced techniques like <span className="text-orange-400 font-semibold">bilateral filtering</span> and 
                <span className="text-orange-400 font-semibold"> CLAHE (Contrast Limited Adaptive Histogram Equalization)</span>, 
                OpenCV dramatically improves Qyran's performance in challenging environments. Our preprocessing pipeline achieves a 
                40% improvement in signal-to-noise ratio, enabling accurate recognition even in dim lighting or with low-quality cameras.
              </p>
              
              <p>
                By leveraging GPU acceleration through CUDA, OpenCV processes each frame in under 
                <span className="text-yellow-400 font-semibold"> 18 milliseconds</span>, maintaining real-time performance while 
                delivering studio-quality frames to MediaPipe and TensorFlow. This ensures that Qyran works reliably across all 
                devices and environments, from flagship smartphones to budget models.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
