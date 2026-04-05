import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function QyranHero({ onGetStarted, onTranslate, onRecognize }: { onGetStarted?: () => void; onTranslate?: () => void; onRecognize?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-20">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[#0F172A]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Glowing orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4F46E5] rounded-full blur-[120px] opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FDE047] rounded-full blur-[120px] opacity-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/30 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span className="text-sm text-[#FDE047]">AI-Powered Recognition</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight">
            <span className="inline-block bg-gradient-to-r from-white via-[#4F46E5] to-[#FDE047] bg-clip-text text-transparent">
              Qyran
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Breaking communication barriers with cutting-edge AI.
          Real-time sign language recognition for a more inclusive world.
        </motion.p>

        {/* Glassmorphism CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onTranslate}
            className="group relative inline-block px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] cursor-pointer"
          >
            {/* Glassmorphism effect */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />

            {/* Glowing border */}
            <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-[#FDE047] via-[#4F46E5] to-[#FDE047] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-[2px] rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1]" />
            </div>

            <span className="relative z-10 text-lg font-bold text-white flex items-center gap-2">
              Перевод с речи на язык жестов
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>

          <button
            onClick={onRecognize}
            className="group relative inline-block px-8 py-4 bg-gradient-to-r from-[#6366F1] to-[#FDE047] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(253,224,71,0.4)] cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            <span className="relative z-10 text-lg font-bold text-white flex items-center gap-2">
              Распознавание жестов
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: '99.2%', label: 'Accuracy' },
            { value: '<50ms', label: 'Latency' },
            { value: '200+', label: 'Signs' }
          ].map((stat, i) => (
            <div key={i} className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[#4F46E5]/20 to-transparent rounded-xl blur-xl" />
              <div className="relative p-6 rounded-xl bg-[#0F172A]/50 border border-[#4F46E5]/30 backdrop-blur-sm">
                <div className="text-3xl font-bold text-[#FDE047] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
