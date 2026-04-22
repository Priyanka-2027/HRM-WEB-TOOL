import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Search, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppTopNav = ({ userRole = 'employee' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/employees', label: 'Employees' },
    { path: '/admin/attendance', label: 'Attendance' },
    { path: '/admin/leaves', label: 'Leaves' },
    { path: '/admin/skills', label: 'Skills' }
  ];

  const employeeLinks = [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/attendance', label: 'Attendance' },
    { path: '/employee/leaves', label: 'Leaves' },
    { path: '/employee/skills', label: 'Skills' }
  ];

  const links = userRole === 'admin' ? adminLinks : employeeLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-6 z-50 mx-4 md:mx-auto max-w-7xl">
      <div className="bg-[#0f111a]/60 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl shadow-black/40 transition-all px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <img src="/hironix.png" alt="Hironix Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              <span className="text-2xl font-black text-white tracking-tighter hidden sm:block">HIRONIX</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive(link.path) ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-4 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input
                type="search"
                placeholder="Global Search..."
                className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:w-64 transition-all w-48"
              />
            </div>

            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f111a]" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-white text-sm font-black">
                  {(user?.firstName?.[0] || 'U').toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                    {userRole}
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-[#0f111a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-10 overflow-hidden"
                    >
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest">
                        <User className="w-4 h-4" /> Profile Details
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <button
                        onClick={async () => {
                          await logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest"
                      >
                        <LogOut className="w-4 h-4" /> Terminate Session
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-2 bg-[#0f111a]/90 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                    isActive(link.path) 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                      : 'text-slate-500 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default AppTopNav;
