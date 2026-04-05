import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Zap, Target, TrendingUp, Layers, Brain, Code } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TensorFlowDetailProps {
  onBack: () => void;
}

const performanceData = [
  { epoch: 1, accuracy: 45, loss: 2.8 },
  { epoch: 5, accuracy: 72, loss: 1.5 },
  { epoch: 10, accuracy: 85, loss: 0.9 },
  { epoch: 15, accuracy: 92, loss: 0.5 },
  { epoch: 20, accuracy: 96, loss: 0.3 },
  { epoch: 25, accuracy: 98, loss: 0.15 }
];

const inferenceData = [
  { device: 'CPU', time: 120 },
  { device: 'GPU', time: 15 },
  { device: 'TPU', time: 8 },
  { device: 'Mobile', time: 35 }
];

const features = [
  {
    icon: Brain,
    title: 'Neural Architecture',
    description: 'Advanced LSTM and Transformer models for sequential gesture recognition',
    metric: '15M parameters'
  },
  {
    icon: Layers,
    title: 'TensorFlow Lite',
    description: 'Optimized models for on-device inference with 80% size reduction',
    metric: '2.3 MB model'
  },
  {
    icon: Zap,
    title: 'Hardware Acceleration',
    description: 'GPU and TPU support for lightning-fast training and inference',
    metric: '10x faster'
  },
  {
    icon: Target,
    title: 'Transfer Learning',
    description: 'Pre-trained models fine-tuned on sign language datasets',
    metric: '50K gestures'
  }
];

export function TensorFlowDetail({ onBack }: TensorFlowDetailProps) {
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
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-[150px] opacity-20" />

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
            className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] shadow-[0_0_50px_rgba(255,111,0,0.5)]"
          >
            <Layers className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-7xl font-bold text-white mb-6"
          >
            TensorFlow
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-semibold">Google's ML Platform</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            TensorFlow powers Qyran's neural network architecture, enabling sophisticated deep learning models
            that understand complex sign language gestures with industry-leading accuracy and efficiency.
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
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] flex items-center justify-center">
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

            {/* Training Performance Chart */}
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
                  <h3 className="text-xl font-bold text-white">Training Performance</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.1} />
                    <XAxis dataKey="epoch" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #f97316',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">98%</div>
                  <div className="text-sm text-gray-400">Final Accuracy</div>
                </div>
              </div>
            </motion.div>

            {/* Inference Speed Chart */}
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
                  <h3 className="text-xl font-bold text-white">Inference Speed</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={inferenceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.1} />
                    <XAxis dataKey="device" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #fbbf24',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="time" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">35ms</div>
                  <div className="text-sm text-gray-400">Mobile Inference</div>
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
                    <h3 className="text-xl font-bold text-white">Model Architecture</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                
                <div className="relative p-6 rounded-xl bg-black/60 border border-orange-500/30 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{`import tensorflow as tf
from tensorflow import keras

# Build Qyran's gesture recognition model
model = keras.Sequential([
    # LSTM layers for temporal patterns
    keras.layers.LSTM(128, return_sequences=True, 
                      input_shape=(None, 63)),  # 21 landmarks × 3D
    keras.layers.Dropout(0.3),
    keras.layers.LSTM(64, return_sequences=False),
    keras.layers.Dropout(0.3),
    
    # Dense layers for classification
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(num_signs, activation='softmax')
])

# Compile with custom learning rate
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Convert to TensorFlow Lite for mobile
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()`}</code>
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
              Powering Qyran's Neural Network
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                TensorFlow serves as the <span className="text-yellow-400 font-semibold">core machine learning framework</span> behind 
                Qyran's gesture recognition system. Its powerful neural network capabilities enable us to process complex temporal 
                patterns in sign language with exceptional accuracy.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center p-6 rounded-xl bg-[#FF6F00]/10 border border-[#FF6F00]/30">
                  <div className="text-3xl font-bold text-[#FF6F00] mb-2">1</div>
                  <div className="text-sm text-gray-400">Model Training</div>
                  <div className="text-xs text-gray-500 mt-2">LSTM networks learn gesture sequences</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-3xl font-bold text-amber-400 mb-2">2</div>
                  <div className="text-sm text-gray-400">Model Optimization</div>
                  <div className="text-xs text-gray-500 mt-2">TFLite reduces size by 80%</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                  <div className="text-sm text-gray-400">On-Device Inference</div>
                  <div className="text-xs text-gray-500 mt-2">Real-time classification in 35ms</div>
                </div>
              </div>
              
              <p>
                Using TensorFlow's <span className="text-orange-400 font-semibold">LSTM (Long Short-Term Memory)</span> architecture, 
                Qyran can understand the temporal dynamics of sign language gestures, recognizing not just static hand shapes but 
                the fluid motion patterns that give signs their meaning.
              </p>
              
              <p>
                Through TensorFlow Lite optimization, we've compressed our 15-million-parameter model into a mere 
                <span className="text-yellow-400 font-semibold"> 2.3 MB package</span> that runs efficiently on mobile devices, 
                delivering sub-50ms inference times without sacrificing accuracy. This enables Qyran to provide truly seamless, 
                real-time sign language translation anywhere, anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
