import { motion } from 'motion/react';
import { Brain, Zap, Globe, Shield, Cpu, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Deep Learning',
    description: 'Advanced neural networks trained on millions of sign language gestures',
    size: 'large',
    gradient: 'from-[#4F46E5] to-[#6366F1]'
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Sub-50ms latency for seamless communication',
    size: 'small',
    gradient: 'from-[#FDE047] to-[#FCD34D]'
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description: 'ASL, BSL, and 15+ regional sign languages',
    size: 'small',
    gradient: 'from-[#8B5CF6] to-[#A78BFA]'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'On-device processing with zero data collection',
    size: 'medium',
    gradient: 'from-[#4F46E5] to-[#8B5CF6]'
  },
  {
    icon: Cpu,
    title: 'Edge Computing',
    description: 'Optimized for mobile and embedded devices',
    size: 'medium',
    gradient: 'from-[#FDE047] to-[#F59E0B]'
  },
  {
    icon: Sparkles,
    title: 'Continuous Learning',
    description: 'AI model improves with every interaction',
    size: 'small',
    gradient: 'from-[#6366F1] to-[#4F46E5]'
  }
];

export function BentoFeatures() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cutting-edge technology meets human-centered design
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const gridClass = 
              feature.size === 'large' ? 'md:col-span-2 md:row-span-2' :
              feature.size === 'medium' ? 'md:col-span-1 md:row-span-2' :
              'md:col-span-1 md:row-span-1';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative ${gridClass}`}
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${
                      feature.gradient === 'from-[#4F46E5] to-[#6366F1]' ? '#4F46E5, #6366F1' :
                      feature.gradient === 'from-[#FDE047] to-[#FCD34D]' ? '#FDE047, #FCD34D' :
                      feature.gradient === 'from-[#8B5CF6] to-[#A78BFA]' ? '#8B5CF6, #A78BFA' :
                      feature.gradient === 'from-[#4F46E5] to-[#8B5CF6]' ? '#4F46E5, #8B5CF6' :
                      feature.gradient === 'from-[#FDE047] to-[#F59E0B]' ? '#FDE047, #F59E0B' :
                      '#6366F1, #4F46E5'
                    })`
                  }}
                />

                {/* Card */}
                <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#4F46E5]/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#FDE047]/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] flex flex-col">
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(79, 70, 229, 0.2) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(79, 70, 229, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />

                  {/* Icon */}
                  <div className={`relative mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className={`relative text-gray-400 ${feature.size === 'large' ? 'text-lg' : 'text-sm'}`}>
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#FDE047] to-[#4F46E5] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
