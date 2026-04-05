import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Gradients */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4F46E5] rounded-full blur-[120px] opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FDE047] rounded-full blur-[120px] opacity-5"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(79, 70, 229, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-white via-[#4F46E5] to-[#FDE047] bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <p className="text-gray-400">{subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative group"
        >
          {/* Glowing Border Effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#4F46E5] via-transparent to-[#FDE047] rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
          
          <div className="relative bg-[#0F172A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl overflow-hidden">
            {/* Inner Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
