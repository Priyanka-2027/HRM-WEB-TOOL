import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BorderGlow from '../components/ui/BorderGlow';
import AuthInformatics from '../components/auth/AuthInformatics';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Lock, Mail, ArrowLeft, ChevronRight } from 'lucide-react';
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setServerError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <AppLayout showPrism={true}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#050507]">
        {/* Left Side: Informatics (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0">
          <AuthInformatics />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10 lg:hidden text-center">
                <img src="/hironix.png" alt="Hironix Logo" className="w-[50px] h-[50px] mx-auto mb-2 dark:invert" />
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">HIRONIX</h1>
              </div>

              <div className="mb-10">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-4">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Back to Home</span>
                </Link>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome Back</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Please enter your credentials to access the portal.</p>
              </div>

              <BorderGlow borderRadius={32}>
                <div className="p-8 md:p-10">
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
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@company.com"
                          className={`w-full bg-slate-100 dark:bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/40 transition-all`}
                          disabled={loading}
                          required
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-400 ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className={`w-full bg-slate-100 dark:bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/40 transition-all`}
                          disabled={loading}
                          required
                        />
                      </div>
                      {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-2xl bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-[0_4px_30px_rgba(124,58,237,0.4)] disabled:opacity-50 mt-4 active:scale-[0.98] flex items-center justify-center gap-2 group border border-purple-400/20"
                    >
                      {loading ? 'Authenticating...' : (
                        <>
                          Sign In to Portal
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 font-medium mb-4">New to Hironix?</p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoginPage;
