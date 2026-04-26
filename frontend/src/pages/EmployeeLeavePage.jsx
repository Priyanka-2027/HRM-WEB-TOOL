import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import Input from '../components/ui/Input';
import GlassSelect from '../components/ui/GlassSelect';
import { leaveService } from '../api/leaveService';
import { employeeService } from '../api/employeeService';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarOff, Clock, CheckCircle2, XCircle, AlertCircle, Send, Trash2 } from 'lucide-react';

const STATUS_MAP = {
  pending:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400'  },
  approved: { bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',text: 'text-emerald-400' },
  rejected: { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400'     },
  cancelled:{ bg: 'bg-slate-500/10',  border: 'border-slate-500/20',  text: 'text-slate-400'   },
};

const LEAVE_TYPES = [
  { value: 'casual',  label: 'Casual'  },
  { value: 'sick',    label: 'Sick'    },
  { value: 'earned',  label: 'Earned'  },
  { value: 'unpaid',  label: 'Unpaid'  },
  { value: 'other',   label: 'Other'   },
];

const ACCENT_DARK = {
  amber:   'from-amber-500/10 to-amber-500/0 border-amber-500/20 text-amber-400',
  emerald: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20 text-emerald-400',
  white:   'from-white/5 to-white/0 border-white/10 text-white',
};
const ACCENT_LIGHT = {
  amber:   'bg-white border-amber-200 text-amber-600',
  emerald: 'bg-white border-emerald-200 text-emerald-700',
  white:   'bg-white border-slate-200 text-slate-900',
};

const StatCard = ({ Icon, label, value, accent }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const clrs = isLight
    ? ACCENT_LIGHT[accent] || ACCENT_LIGHT.white
    : (ACCENT_DARK[accent] || ACCENT_DARK.white);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-sm ${isLight ? clrs : `bg-gradient-to-b ${clrs}`}`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 opacity-60" />}
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
      </div>
      <p className="text-3xl font-black">{value}</p>
    </motion.div>
  );
};


const EmployeeLeavePage = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState('');
  const [form, setForm] = useState({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });

  const loadEmployee = async () => {
    const result = await employeeService.getEmployeeByUserId(user?._id);
    if (result.success) { setEmployeeId(result.data._id); return result.data._id; }
    return '';
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await leaveService.getLeaves({ limit: 100 });
      if (result.success) setLeaves(result.data || []);
    } catch (err) { setError('Failed to load leave history'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError('');
        
        let id = '';
        try {
          const result = await employeeService.getEmployeeByUserId(user?._id);
          if (result.success) {
            id = result.data._id;
            setEmployeeId(id);
          }
        } catch (e) {
          // No employee profile linked yet
          setError('No employee profile linked to your account. Please contact an admin.');
          setLoading(false);
          return;
        }

        if (!id) {
          setError('No employee record found for your account.');
          setLoading(false);
          return;
        }

        await fetchLeaves();
      } catch (err) {
        setError('Failed to initialize leave page');
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const submitLeave = async (e) => {
    e.preventDefault();
    if (!employeeId) { setError('Employee record not found'); return; }
    try {
      setSubmitting(true);
      const result = await leaveService.requestLeave({ ...form, employeeId });
      if (result.success) {
        setForm({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
        setLeaves(prev => [result.data, ...prev]);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally { setSubmitting(false); }
  };

  const cancelLeave = async (id) => {
    if (!window.confirm('Cancel this pending leave request?')) return;
    try {
      setCancellingId(id);
      const result = await leaveService.deleteLeave(id);
      if (result.success) setLeaves(prev => prev.filter(l => l._id !== id));
    } catch (err) { setError('Failed to cancel leave'); }
    finally { setCancellingId(''); }
  };

  const pending  = leaves.filter(l => l.status === 'pending').length;
  const approved = leaves.filter(l => l.status === 'approved').length;
  const total    = leaves.length;

  return (
    <AppShell>
      <PageHeader title="My Leaves" subtitle="Submit and track your leave requests" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
          <button onClick={() => setError('')} className="ml-auto text-red-400/50 hover:text-red-400">✕</button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard Icon={Clock}         label="Pending Requests" value={pending}  accent="amber"   />
        <StatCard Icon={CheckCircle2}  label="Approved"         value={approved} accent="emerald" />
        <StatCard Icon={CalendarOff}   label="Total Requests"   value={total}    accent="white"   />
      </div>

      <div className="space-y-5">
        {/* Request Form */}
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <CalendarOff className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Request Leave</h3>
            </div>
            <form onSubmit={submitLeave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassSelect label="Leave Type" value={form.leaveType}
                onChange={v => setForm(p => ({ ...p, leaveType: v }))} options={LEAVE_TYPES} />
              <Input label="Start Date" type="date" value={form.startDate}
                onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required />
              <Input label="End Date" type="date" value={form.endDate}
                onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} required />
              <div className="md:col-span-2">
                <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-500">Reason *</label>
                <textarea value={form.reason}
                  onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  rows={3} required placeholder="Brief reason for leave…"
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50">
                  <Send className="w-4 h-4" />{submitting ? 'Submitting…' : 'Submit Request'}
                </motion.button>
              </div>
            </form>
          </div>
        </BorderGlow>

        {/* Leave History */}
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Leave History</h3>
              <span className="ml-auto text-[10px] text-slate-600 font-bold">{total} total</span>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm">Loading history…</p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <CalendarOff className="w-10 h-10 text-slate-700" />
                <p className="text-slate-500 text-sm">No leave requests yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-200 dark:border-white/5">
                  {['Type', 'Period', 'Days', 'Status', 'Action'].map((h, i) => (
                    <div key={h} className={`${i === 1 ? 'col-span-3' : i === 0 ? 'col-span-2' : i === 4 ? 'col-span-2' : 'col-span-2'} text-[10px] font-black uppercase tracking-widest text-slate-500`}>{h}</div>
                  ))}
                </div>
                <AnimatePresence mode="popLayout">
                  {leaves.map((leave, idx) => {
                    const cfg = STATUS_MAP[leave.status] || STATUS_MAP.pending;
                    return (
                      <motion.div key={leave._id} layout
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                        className="grid grid-cols-12 gap-4 items-center px-4 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/5">
                        <div className="col-span-2 text-xs text-slate-900 dark:text-white font-bold capitalize">{leave.leaveType}</div>
                        <div className="col-span-3 text-xs text-slate-500">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' — '}
                          {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="col-span-2 text-xs text-slate-600 dark:text-slate-300 font-bold">{leave.daysCount || '—'} d</div>
                        <div className="col-span-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            {leave.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          {leave.status === 'pending' && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              disabled={cancellingId === leave._id}
                              onClick={() => cancelLeave(leave._id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black hover:bg-red-500/20 transition-all disabled:opacity-40">
                              <Trash2 className="w-3 h-3" /> Cancel
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </BorderGlow>
      </div>
    </AppShell>
  );
};

export default EmployeeLeavePage;
