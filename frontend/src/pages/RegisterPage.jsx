import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BorderGlow from '../components/ui/BorderGlow';
import AuthInformatics from '../components/auth/AuthInformatics';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Lock, Mail, ArrowLeft, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [portal, setPortal] = useState('employee'); // 'employee' or 'manager'
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    } else if (!/[A-Za-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = 'Must include letter & number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(
      formData.email, 
      formData.firstName, 
      formData.lastName, 
      formData.password,
      portal // Pass the selected portal as the role
    );

    if (result.success) {
      navigate(portal === 'manager' ? '/manager/dashboard' : '/employee/dashboard');
    } else {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <AppLayout showPrism={true}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-[#050507]">
        {/* Left Side: Informatics (Hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 h-screen sticky top-0">
          <AuthInformatics role={portal} />
        </div>

        {/* Right Side: Register Form */}
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
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group mb-4">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Back to Login</span>
                </Link>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {portal === 'manager' ? 'Admin Onboarding' : 'Join Hironix'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {portal === 'manager' 
                    ? 'Register as a manager to begin orchestrating your teams.' 
                    : 'Create your talent account to start your professional journey.'}
                </p>
              </div>

              <BorderGlow borderRadius={32} colors={portal === 'manager' ? ['#6366f1', '#4338ca'] : ['#a855f7', '#7c3aed']}>
                <div className="p-8 md:p-10">
                  {/* Portal Selection Toggle */}
                  <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl mb-8 relative">
                    <motion.div 
                      className={`absolute inset-y-1 rounded-xl shadow-lg ${portal === 'manager' ? 'bg-indigo-600' : 'bg-purple-600'}`}
                      initial={false}
                      animate={{ 
                        x: portal === 'manager' ? '100.5%' : '0%',
                        width: '49%'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <button 
                      onClick={() => setPortal('employee')}
                      className={`relative z-10 flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${portal === 'employee' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Talent Portal
                    </button>
                    <button 
                      onClick={() => setPortal('manager')}
                      className={`relative z-10 flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${portal === 'manager' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Manager Portal
                    </button>
                  </div>
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

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">First Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className={`w-full bg-slate-100 dark:bg-white/5 border ${errors.firstName ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/40 transition-all`}
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`w-full bg-slate-100 dark:bg-white/5 border ${errors.lastName ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/40 transition-all`}
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>

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
                      {errors.email && <p className="text-[10px] text-red-400 ml-1 mt-1">{errors.email}</p>}
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
                      {errors.password && <p className="text-[10px] text-red-400 ml-1 mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full bg-slate-100 dark:bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'} rounded-2xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/40 transition-all`}
                        disabled={loading}
                        required
                      />
                      {errors.confirmPassword && <p className="text-[10px] text-red-400 ml-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg disabled:opacity-50 mt-4 active:scale-[0.98] flex items-center justify-center gap-2 group border ${
                        portal === 'manager' 
                          ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 border-indigo-400/20' 
                          : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 border-purple-400/20'
                      }`}
                    >
                      {loading ? 'Creating Account...' : (
                        <>
                          Complete {portal === 'manager' ? 'Admin' : 'Talent'} Registration
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 font-medium mb-4">Already have an account?</p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      Sign In Instead
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

export default RegisterPage;
