import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Search, Bell, Menu, X, ChevronRight, CheckCheck, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeService } from '../../api/employeeService';

// ─── Static mock notifications (replace with real API later) ─────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'info',    title: 'Leave Request Pending',    body: '3 new leave requests awaiting review', time: '5m ago',  read: false },
  { id: 2, type: 'success', title: 'Payroll Processed',        body: 'May 2025 payroll has been finalized',   time: '2h ago',  read: false },
  { id: 3, type: 'warning', title: 'Contract Expiring Soon',   body: 'Raj Kumar\'s contract ends in 7 days',  time: '1d ago',  read: true  },
  { id: 4, type: 'info',    title: 'New Employee Joined',       body: 'David Park added to Engineering',       time: '2d ago',  read: true  },
];

const NOTIF_ICON = {
  info:    { Icon: Bell,          color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  success: { Icon: CheckCheck,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  warning: { Icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
};

// ─── Component ────────────────────────────────────────────────────────────────
const AppTopNav = ({ userRole = 'employee' }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  // Panel states
  const [showMenu,       setShowMenu]       = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications,  setNotifications]  = useState(MOCK_NOTIFICATIONS);

  // Search state
  const [searchQuery,    setSearchQuery]    = useState('');
  const [searchResults,  setSearchResults]  = useState([]);
  const [searchLoading,  setSearchLoading]  = useState(false);
  const [showResults,    setShowResults]    = useState(false);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminLinks    = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/employees', label: 'Employees'  },
    { path: '/admin/attendance',label: 'Attendance' },
    { path: '/admin/leaves',    label: 'Leaves'     },
    { path: '/admin/skills',    label: 'Skills'     },
  ];
  const employeeLinks = [
    { path: '/employee/dashboard',  label: 'Dashboard'  },
    { path: '/employee/attendance', label: 'Attendance' },
    { path: '/employee/leaves',     label: 'Leaves'     },
    { path: '/employee/skills',     label: 'Skills'     },
  ];
  const links    = userRole === 'admin' ? adminLinks : employeeLinks;
  const isActive = (p) => location.pathname === p;

  // Close panels on outside click
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Employee search with debounce
  useEffect(() => {
    clearTimeout(searchTimer.current);
    if (!searchQuery.trim() || userRole !== 'admin') { setSearchResults([]); setShowResults(false); return; }
    setSearchLoading(true);
    setShowResults(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const result = await employeeService.getAllEmployees({ search: searchQuery, limit: 6 });
        if (result.success) setSearchResults(result.data || []);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <nav className="sticky top-6 z-50 mx-4 md:mx-auto max-w-7xl">
      <div className="bg-[#0f111a]/60 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl shadow-black/40 px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3">
              <img src="/hironix.png" alt="Hironix" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
              <span className="text-2xl font-black text-white tracking-tighter hidden sm:block">HIRONIX</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {links.map(link => (
                <Link key={link.path} to={link.path}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    isActive(link.path) ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                  }`}>
                  {link.label}
                  {isActive(link.path) && (
                    <motion.div layoutId="nav-indicator"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Global Search — admin only */}
            {userRole === 'admin' && (
              <div className="hidden md:block relative" ref={searchRef}>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="search"
                    placeholder="Search employees…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
                    className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] focus:w-64 transition-all w-48"
                  />
                </div>
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute top-full mt-2 left-0 w-72 bg-[#0d1020]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden py-2 z-50">
                      {searchLoading ? (
                        <div className="flex items-center justify-center py-6 gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                          <span className="text-xs text-slate-500">Searching…</span>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-600">No employees found</div>
                      ) : searchResults.map(emp => (
                        <button key={emp._id}
                          onClick={() => { setSearchQuery(''); setShowResults(false); navigate(`/admin/employees/${emp._id}`); }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.07] transition-all text-left">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-400 shrink-0">
                              {(emp.email?.[0] || 'E').toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{emp.email}</p>
                              <p className="text-[10px] text-slate-500">{emp.designation} · {emp.department}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(v => !v); setShowMenu(false); }}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f111a] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-[#0f111a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-20 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-black text-white uppercase tracking-widest">Notifications</p>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-black">{unreadCount}</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] font-bold text-slate-500 hover:text-cyan-400 transition-colors">Mark all read</button>
                        )}
                      </div>
                      {/* Items */}
                      {notifications.map(n => {
                        const cfg = NOTIF_ICON[n.type] || NOTIF_ICON.info;
                        return (
                          <button key={n.id} onClick={() => { markRead(n.id); setShowNotifications(false); }}
                            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all text-left relative ${n.read ? 'opacity-60' : ''}`}>
                            <div className={`p-2 rounded-lg ${cfg.bg} shrink-0 mt-0.5`}>
                              <cfg.Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white">{n.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="w-2.5 h-2.5 text-slate-700" />
                                <span className="text-[9px] text-slate-600 font-bold">{n.time}</span>
                              </div>
                            </div>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => { setShowMenu(v => !v); setShowNotifications(false); }}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-white text-sm font-black">
                  {(user?.firstName?.[0] || 'U').toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[10px] font-black text-white uppercase tracking-tight leading-none mb-1">{user?.firstName || 'User'}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{userRole}</p>
                </div>
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-60 bg-[#0f111a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl py-2 z-20 overflow-hidden">
                      {/* Profile header inside dropdown */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-white text-sm font-black">
                            {(user?.firstName?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      {/* Role badge */}
                      <div className="px-4 py-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />{userRole}
                        </span>
                      </div>
                      <div className="h-px bg-white/5 my-1" />
                      {/* Profile Details */}
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate(userRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest">
                        <User className="w-4 h-4" /> My Profile
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      {/* Logout */}
                      <button
                        onClick={async () => { await logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400"
              onClick={() => setShowMobileMenu(v => !v)}>
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-2 bg-[#0f111a]/90 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-4 space-y-1">
              {/* Mobile search for admin */}
              {userRole === 'admin' && (
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="search" placeholder="Search employees…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
                </div>
              )}
              {links.map(link => (
                <Link key={link.path} to={link.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
                    isActive(link.path) ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 hover:bg-white/5'
                  }`}>
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
