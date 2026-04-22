import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BorderGlow from '../components/ui/BorderGlow';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Lock, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const role = result.user?.role;
      navigate(role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
    } else {
      setServerError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-violet-400 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-3">HIRONIX</h1>
            <p className="text-slate-400 text-sm font-medium">Elevating Workforce Intelligence</p>
          </motion.div>

          <BorderGlow
            glowColor="260 70 75"
            colors={['#a78bfa', '#818cf8']}
            borderRadius={32}
            glowIntensity={0.8}
            animated
          >
            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white mb-8 text-center">Authentication</h2>
              
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4" />
                  {serverError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all`}
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-400 ml-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all`}
                      disabled={loading}
                      required
                    />
                  </div>
                  {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-violet-400 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50 mt-4 active:scale-[0.98]"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Credentials for Evaluation</p>
                <div className="space-y-2">
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-400">admin@hironix.com | employee@hironix.com</p>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoginPage;
