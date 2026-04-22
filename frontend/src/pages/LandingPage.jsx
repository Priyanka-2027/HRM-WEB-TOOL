import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PublicNavbar from '../components/layout/PublicNavbar';
import BorderGlow from '../components/ui/BorderGlow';
import { motion } from 'framer-motion';
import { Users, Clock, Activity, BookOpen, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      title: 'Workforce Records',
      description: 'Comprehensive employee lifecycle management with interactive profiles.',
      Icon: Users,
      glow: '200 85 65',
      color: '#22d3ee'
    },
    {
      title: 'Time Intelligence',
      description: 'Precision attendance tracking with automated anomaly detection.',
      Icon: Clock,
      glow: '160 75 60',
      color: '#34d399'
    },
    {
      title: 'Dynamic Leaves',
      description: 'Streamlined approval engines with real-time balance calculations.',
      Icon: Activity,
      glow: '38 90 65',
      color: '#fbbf24'
    },
    {
      title: 'Skill Architecture',
      description: 'Map and visualize talent proficiency across your entire organization.',
      Icon: BookOpen,
      glow: '260 70 75',
      color: '#a78bfa'
    }
  ];

  return (
    <AppLayout>
      <PublicNavbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Experience the future of talent operations
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                MASTER YOUR <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  WORKFORCE
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Hironix orchestrates your HR operations with glassmorphic intelligence and data-driven precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/login">
                  <button className="px-8 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all shadow-2xl shadow-white/10 flex items-center gap-2 group">
                    Enter Portal
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-xl">
                  Documentation
                </button>
              </div>

              {/* Data Highlights */}
              <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/5 pt-16">
                <div>
                  <p className="text-4xl font-black text-white mb-2 leading-none tracking-tighter">500+</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Clients</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white mb-2 leading-none tracking-tighter">10K+</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Managed Talents</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <p className="text-4xl font-black text-white mb-2 leading-none tracking-tighter">99.9%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Uptime</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <p className="text-cyan-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Core Ecosystem</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Everything you need to <br /> Scale with confidence
                </h2>
              </div>
              <div className="text-slate-500 text-sm font-medium max-w-xs">
                Modular HR intelligence designed for hyper-growth environments.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <BorderGlow
                    glowColor={feature.glow}
                    colors={[feature.color, feature.color]}
                    borderRadius={24}
                    glowIntensity={0.6}
                    animated
                  >
                    <div className="p-8 h-full">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                        <feature.Icon className="w-6 h-6" style={{ color: feature.color }} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </BorderGlow>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4">
          <div className="max-w-5xl mx-auto">
            <BorderGlow glowColor="260 70 75" colors={['#a78bfa', '#818cf8']} borderRadius={32} animated>
              <div className="p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 blur-[100px] -z-10" />
                
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                  Ready to evolve your <br /> HR Experience?
                </h2>
                <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                  Join the elite teams already orchestrating their growth with Hironix.
                </p>
                <Link to="/login">
                  <button className="px-10 py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all shadow-2xl shadow-white/10">
                    Get Started Free
                  </button>
                </Link>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-white tracking-tighter">HIRONIX</span>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-1">© 2026 NEXUS SYSTEMS</span>
            </div>
            <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </AppLayout>
  );
};

export default LandingPage;
