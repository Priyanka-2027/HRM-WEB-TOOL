import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import GlassSelect from '../components/ui/GlassSelect';
import { leaveService } from '../api/leaveService';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, CalendarDays, AlertCircle, Filter, ChevronRight } from 'lucide-react';

const STATUS_OPTS = [
  { value: '',         label: 'All Status' },
  { value: 'pending',  label: 'Pending'    },
  { value: 'approved', label: 'Approved'   },
  { value: 'rejected', label: 'Rejected'   },
  { value: 'cancelled',label: 'Cancelled'  },
];

const STATUS_CONFIG = {
  pending:  { color: '#f59e0b', bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  label: 'Pending'  },
  approved: { color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Approved' },
  rejected: { color: '#ef4444', bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    label: 'Rejected' },
  cancelled:{ color: '#6b7280', bg: 'bg-slate-500/10',  border: 'border-slate-500/20',  text: 'text-slate-400',  label: 'Cancelled'},
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
      {cfg.label}
    </span>
  );
};

const AdminLeavePage = () => {
  const [searchParams] = useSearchParams();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'pending');
  const [employeeFilter, setEmployeeFilter] = useState(searchParams.get('employeeId') || '');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      if (employeeFilter) params.employeeId = employeeFilter;
      const result = await leaveService.getLeaves(params);
      if (result.success) {
        setLeaves(result.data || []);
        setError('');
      }
    } catch (err) {
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, [statusFilter, employeeFilter]);

  const updateStatus = async (id, status) => {
    try {
      const proceed = window.confirm(status === 'approved' ? 'Approve this leave request?' : 'Reject this leave request?');
      if (!proceed) return;
      setActionLoadingId(id);
      const result = await leaveService.reviewLeave(id, { status });
      if (result.success) {
        setLeaves(prev => prev.map(item => (item._id === id ? result.data : item)));
      }
    } catch (err) {
      setError('Failed to update leave status');
    } finally {
      setActionLoadingId('');
    }
  };

  const filters = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const totalPending = leaves.filter(l => l.status === 'pending').length;
  const totalApproved = leaves.filter(l => l.status === 'approved').length;
  const totalRejected = leaves.filter(l => l.status === 'rejected').length;

  return (
    <AppShell userRole="admin">
      <PageHeader title="Leave Management" subtitle="Review and process employee time-off requests" />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Awaiting Review', value: totalPending, icon: Clock, color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Approved', value: totalApproved, icon: CheckCircle, color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Rejected', value: totalRejected, icon: XCircle, color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        ].map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <BorderGlow borderRadius={24}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{card.label}</p>
                  <div className={`p-2.5 rounded-xl ${card.bg} border ${card.border}`}>
                    <card.icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{card.value}</p>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassSelect label="Status Filter"
          value={statusFilter}
          onChange={v => setStatusFilter(v)}
          options={STATUS_OPTS}
          placeholder="All Status"
        />
        {employeeFilter && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Filtering by Employee</span>
            </div>
            <button onClick={() => setEmployeeFilter('')} className="px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-[10px] font-black tracking-tight transition-all">CLEAR FILTER</button>
          </div>
        )}
      </div>

      {/* Leave Cards */}
      <BorderGlow borderRadius={28}>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading leave requests...</p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <CalendarDays className="w-12 h-12 text-slate-700" />
              <p className="text-slate-500 text-sm">No leave requests match the current filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {leaves.map((leave, idx) => {
                  const cfg = STATUS_CONFIG[leave?.status] || STATUS_CONFIG.pending;
                  const empName = leave?.userId 
                    ? `${leave.userId.firstName || ''} ${leave.userId.lastName || ''}`.trim() || 'Unknown'
                    : 'Unknown Employee';
                  const isLoading = actionLoadingId === leave?._id;
                  
                  if (!leave) return null;
                  
                  return (
                    <motion.div
                      key={leave._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all shadow-sm dark:shadow-none ${
                        isLight 
                          ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50' 
                          : 'bg-white/4 border-white/5 hover:border-white/10 hover:bg-white/[0.06]'
                      }`}
                    >
                      {/* Left: Employee details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                          <span className={`text-xs font-black ${cfg.text}`}>{empName[0] || '?'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{empName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-widest capitalize">{leave.leaveType} leave</p>
                        </div>
                      </div>

                      {/* Center: Dates + reason */}
                      <div className="flex flex-col gap-1 sm:text-center min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' → '}
                            {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            <span className="ml-1.5 text-slate-600">({leave.daysCount}d)</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{leave.reason}</p>
                      </div>

                      {/* Right: Status + Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={leave.status} />
                        {leave.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateStatus(leave._id, 'approved')}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-40 flex items-center gap-1"
                            >
                              {isLoading ? '...' : <><CheckCircle className="w-3.5 h-3.5" /> Approve</>}
                            </button>
                            <button
                              onClick={() => updateStatus(leave._id, 'rejected')}
                              disabled={isLoading}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold hover:bg-red-500/20 transition-all disabled:opacity-40 flex items-center gap-1"
                            >
                              {isLoading ? '...' : <><XCircle className="w-3.5 h-3.5" /> Reject</>}
                            </button>
                          </div>
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
    </AppShell>
  );
};

export default AdminLeavePage;
