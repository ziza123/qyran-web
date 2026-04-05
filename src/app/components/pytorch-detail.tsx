import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Zap, Target, TrendingUp, Flame, BookOpen, Code } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PyTorchDetailProps {
  onBack: () => void;
}

const trainingData = [
  { epoch: 0, train_loss: 3.2, val_loss: 3.5 },
  { epoch: 10, train_loss: 1.8, val_loss: 2.1 },
  { epoch: 20, train_loss: 0.9, val_loss: 1.2 },
  { epoch: 30, train_loss: 0.4, val_loss: 0.6 },
  { epoch: 40, train_loss: 0.2, val_loss: 0.35 },
  { epoch: 50, train_loss: 0.1, val_loss: 0.25 }
];

const learningRateData = [
  { step: 0, lr: 0.001 },
  { step: 100, lr: 0.0008 },
  { step: 200, lr: 0.0005 },
  { step: 300, lr: 0.0003 },
  { step: 400, lr: 0.0001 },
  { step: 500, lr: 0.00005 }
];

const features = [
  {
    icon: Flame,
    title: 'Dynamic Computation',
    description: 'Define-by-run paradigm enables flexible model architectures and debugging',
    metric: 'Real-time graphs'
  },
  {
    icon: BookOpen,
    title: 'Research Flexibility',
    description: 'Pythonic interface perfect for rapid experimentation and prototyping',
    metric: '100+ experiments'
  },
  {
    icon: Zap,
    title: 'Transfer Learning',
    description: 'Pre-trained models adapted from ImageNet to sign language recognition',
    metric: '90% faster training'
  },
  {
    icon: Target,
    title: 'Custom Architectures',
    description: 'Built specialized attention mechanisms for gesture sequence modeling',
    metric: '3D-CNN + LSTM'
  }
];

export function PyTorchDetail({ onBack }: PyTorchDetailProps) {
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
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#EE4C2C] rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-yellow-400 rounded-full blur-[150px] opacity-20" />

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
            className="inline-flex items-center justify-center w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br from-[#EE4C2C] to-[#F05732] shadow-[0_0_50px_rgba(238,76,44,0.5)]"
          >
            <Flame className="w-16 h-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-7xl font-bold text-white mb-6"
          >
            PyTorch
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-semibold">Research-Grade Framework</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            PyTorch drives Qyran's research and development, enabling rapid experimentation with cutting-edge
            architectures and training sophisticated models that push the boundaries of sign language AI.
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
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#EE4C2C] to-[#F05732] flex items-center justify-center">
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

            {/* Training Loss Chart */}
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
                  <h3 className="text-xl font-bold text-white">Training Loss</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trainingData}>
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
                    <Line type="monotone" dataKey="train_loss" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} name="Training" />
                    <Line type="monotone" dataKey="val_loss" stroke="#EE4C2C" strokeWidth={3} dot={{ fill: '#EE4C2C', r: 4 }} name="Validation" />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">0.25</div>
                  <div className="text-sm text-gray-400">Final Val Loss</div>
                </div>
              </div>
            </motion.div>

            {/* Learning Rate Schedule */}
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
                  <h3 className="text-xl font-bold text-white">Learning Rate</h3>
                </div>
                
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={learningRateData}>
                    <defs>
                      <linearGradient id="colorLR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.1} />
                    <XAxis dataKey="step" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #fbbf24',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="lr" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorLR)" />
                  </AreaChart>
                </ResponsiveContainer>
                
                <div className="mt-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400">Cosine</div>
                  <div className="text-sm text-gray-400">Annealing Schedule</div>
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
                    <h3 className="text-xl font-bold text-white">Custom Architecture</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                
                <div className="relative p-6 rounded-xl bg-black/60 border border-orange-500/30 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                    <code>{`import torch
import torch.nn as nn

class QyranSignLanguageModel(nn.Module):
    def __init__(self, num_classes=50):
        super().__init__()
        
        # 3D CNN for spatial-temporal features
        self.conv3d = nn.Sequential(
            nn.Conv3d(3, 64, kernel_size=(3, 3, 3), padding=1),
            nn.ReLU(),
            nn.MaxPool3d((1, 2, 2)),
            nn.Conv3d(64, 128, kernel_size=(3, 3, 3), padding=1),
            nn.ReLU(),
            nn.MaxPool3d((2, 2, 2))
        )
        
        # LSTM for temporal dynamics
        self.lstm = nn.LSTM(input_size=128*8*8, 
                           hidden_size=256,
                           num_layers=2,
                           batch_first=True,
                           dropout=0.3)
        
        # Attention mechanism
        self.attention = nn.MultiheadAttention(256, num_heads=8)
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, num_classes)
        )
    
    def forward(self, x):
        # x shape: (batch, channels, time, height, width)
        x = self.conv3d(x)
        # ... LSTM + Attention processing
        return self.classifier(x)`}</code>
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
              Accelerating Qyran's Research & Development
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                PyTorch is Qyran's <span className="text-yellow-400 font-semibold">primary research platform</span>, enabling our 
                data science team to rapidly prototype and experiment with novel architectures. Its intuitive, Pythonic API and 
                dynamic computation graphs make it the perfect tool for pushing the boundaries of sign language AI.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center p-6 rounded-xl bg-[#EE4C2C]/10 border border-[#EE4C2C]/30">
                  <div className="text-3xl font-bold text-[#EE4C2C] mb-2">1</div>
                  <div className="text-sm text-gray-400">Experimentation</div>
                  <div className="text-xs text-gray-500 mt-2">Test 100+ model variants</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-3xl font-bold text-amber-400 mb-2">2</div>
                  <div className="text-sm text-gray-400">Model Training</div>
                  <div className="text-xs text-gray-500 mt-2">Train on 50K gesture sequences</div>
                </div>
                <div className="text-center p-6 rounded-xl bg-yellow-400/10 border border-yellow-400/30">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
                  <div className="text-sm text-gray-400">Production Export</div>
                  <div className="text-xs text-gray-500 mt-2">Convert to TensorFlow Lite</div>
                </div>
              </div>
              
              <p>
                Our custom <span className="text-orange-400 font-semibold">3D-CNN + LSTM hybrid architecture</span>, developed 
                entirely in PyTorch, captures both the spatial hand configurations and temporal motion patterns that are essential 
                for accurate sign language recognition. The attention mechanism we built allows the model to focus on the most 
                discriminative frames in each gesture sequence.
              </p>
              
              <p>
                Through PyTorch's transfer learning capabilities, we leverage pre-trained models from ImageNet and adapt them 
                to sign language recognition, achieving <span className="text-yellow-400 font-semibold">90% faster convergence</span> and 
                requiring 70% less training data. Once validated, our PyTorch models are seamlessly exported to TensorFlow Lite 
                for production deployment on mobile devices.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
