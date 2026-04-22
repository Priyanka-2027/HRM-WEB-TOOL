import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, BarChart3, Globe } from 'lucide-react';
import HeroSpotlight from '../ui/HeroSpotlight';

const AuthInformatics = () => {
  const benefits = [
    { icon: Shield, text: 'Enterprise-grade security' },
    { icon: Zap, text: 'Real-time performance metrics' },
    { icon: BarChart3, text: 'Automated skill mapping' },
    { icon: Globe, text: 'Global workforce mobility' },
  ];

  return (
    <div className="relative h-full w-full flex flex-col justify-center p-12 lg:p-24 overflow-hidden bg-[#0f111a]">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <HeroSpotlight>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <img src="/hironix.png" alt="Hironix Logo" className="w-16 h-16 mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
          
          <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            INTELLIGENCE <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent italic">
              AT SCALE
            </span>
          </h2>
          
          <p className="text-lg text-slate-400 font-medium mb-12 max-w-md leading-relaxed">
            Orchestrate your workforce with glassmorphic beauty and data-driven precision. The future of HRM operations is here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                  <benefit.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </HeroSpotlight>

      {/* Decorative Mesh */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
             backgroundSize: '40px 40px' 
           }} 
      />
    </div>
  );
};

export default AuthInformatics;
