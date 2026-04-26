import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import GlassSelect from '../components/ui/GlassSelect';
import { attendanceService } from '../api/attendanceService';
import { employeeService } from '../api/employeeService';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, List, AlertCircle, CheckCircle, Clock,
  CalendarDays, Filter
} from 'lucide-react';

const EMPLOYEE_STATUS_OPTS = [
  { value: 'present',  label: 'Present'  },
  { value: 'absent',   label: 'Absent'   },
  { value: 'late',     label: 'Late'     },
  { value: 'half-day', label: 'Half Day' },
  { value: 'on-leave', label: 'On Leave' },
];
const FILTER_STATUS_OPTS = [{ value: '', label: 'All Status' }, ...EMPLOYEE_STATUS_OPTS];

const STATUS_MAP = {
  present:  { color: '#7c3aed', bg: 'bg-purple-500/10',    border: 'border-purple-500/20',    text: 'text-purple-400'    },
  absent:   { color: '#ef4444', bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-400'     },
  late:     { color: '#f59e0b', bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400'   },
  'half-day': { color: '#fb923c', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400'  },
  'on-leave': { color: '#a78bfa', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400'  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_MAP[status] || STATUS_MAP.absent;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
      {status}
    </span>
  );
};

const glassSelect = "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/40 outline-none transition-all appearance-none cursor-pointer";
const glassInput  = "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500/40 outline-none transition-all";

const AdminAttendancePage = () => {
  const [searchParams] = useSearchParams();
  const initialEmpId = searchParams.get('employeeId') || '';
  const [activeTab, setActiveTab] = useState(initialEmpId ? 'view' : 'mark');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [markForm, setMarkForm] = useState({
    employeeId: initialEmpId, 
    date: new Date().toISOString().split('T')[0],
    status: 'present', checkInTime: '', checkOutTime: '', notes: '',
  });

  const [filters, setFilters] = useState({ 
    status: '', 
    startDate: '', 
    endDate: '', 
    employeeId: initialEmpId,
    page: 1 
  });
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => { 
    fetchEmployees(); 
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters.status, filters.startDate, filters.endDate, filters.page, activeTab, filters.employeeId]);

  const fetchEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees({ limit: 100 });
      if (result.success) setEmployees(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { page: filters.page, limit: 15 };
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const result = await attendanceService.getAttendance(params);
      if (result.success) { setAttendance(result.data); setError(''); }
    } catch (err) { setError('Error fetching attendance records'); }
    finally { setLoading(false); }
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!markForm.employeeId) { setError('Please select an employee'); return; }
    try {
      setLoading(true);
      const result = await attendanceService.markAttendance(markForm);
      if (result.success) {
        setError('');
        setSuccessMsg('Attendance marked successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        setMarkForm({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'present', checkInTime: '', checkOutTime: '', notes: '' });
        fetchAttendance();
      } else { setError(result.message || 'Error marking attendance'); }
    } catch (err) { setError(err.response?.data?.message || 'Error marking attendance'); }
    finally { setLoading(false); }
  };

  const avatarColors = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb923c'];

  return (
    <AppShell userRole="admin">
      <PageHeader title="Attendance Management" subtitle="Mark and track employee attendance records" />

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-8">
        {[{ id: 'mark', label: 'Mark Attendance', Icon: ClipboardCheck }, { id: 'view', label: 'View Records', Icon: List }].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === id 
                ? (isLight ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-black shadow-lg shadow-white/10')
                : (isLight ? 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10')
            }`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-400">
            <CheckCircle className="w-4 h-4 shrink-0" />{successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MARK ATTENDANCE TAB */}
      {activeTab === 'mark' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <BorderGlow borderRadius={28}>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <ClipboardCheck className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Mark Attendance</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Record today's attendance for an employee</p>
                </div>
              </div>

              <form onSubmit={handleMarkSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <GlassSelect label="Employee *"
                    value={markForm.employeeId}
                    onChange={v => setMarkForm({ ...markForm, employeeId: v })}
                    options={employees.map(emp => ({ value: emp._id, label: `${emp.email} — ${emp.designation}` }))}
                    placeholder="Select Employee"
                    required />

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Date *</label>
                    <input type="date" value={markForm.date}
                      onChange={e => setMarkForm({ ...markForm, date: e.target.value })}
                      className={glassInput} required />
                  </div>

                  <GlassSelect label="Status *"
                    value={markForm.status}
                    onChange={v => setMarkForm({ ...markForm, status: v })}
                    options={EMPLOYEE_STATUS_OPTS}
                    required />

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Check In Time</label>
                    <input type="time" value={markForm.checkInTime}
                      onChange={e => setMarkForm({ ...markForm, checkInTime: e.target.value })}
                      className={glassInput} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Check Out Time</label>
                    <input type="time" value={markForm.checkOutTime}
                      onChange={e => setMarkForm({ ...markForm, checkOutTime: e.target.value })}
                      className={glassInput} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Notes</label>
                    <textarea value={markForm.notes}
                      onChange={e => setMarkForm({ ...markForm, notes: e.target.value })}
                      placeholder="Add optional notes…" rows={3}
                      className={`${glassInput} resize-none`} />
                  </div>
                </div>

                 <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ClipboardCheck className="w-4 h-4" />
                  {loading ? 'Marking…' : 'Mark Attendance'}
                </motion.button>
              </form>
            </div>
          </BorderGlow>
        </motion.div>
      )}

      {/* VIEW RECORDS TAB */}
      {activeTab === 'view' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-5">
          {/* Filters */}
          <BorderGlow borderRadius={24}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Filters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassSelect label="Employee"
                    value={filters.employeeId}
                    onChange={v => { setFilters({ ...filters, employeeId: v, page: 1 }); }}
                    options={[{ value: '', label: 'All Employees' }, ...employees.map(e => ({ value: e._id, label: e.email }))]}
                    placeholder="All Employees" />
                <GlassSelect label="Status"
                    value={filters.status}
                    onChange={v => { setFilters({ ...filters, status: v, page: 1 }); }}
                    options={FILTER_STATUS_OPTS}
                    placeholder="All Status" />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">From Date</label>
                  <input type="date" value={filters.startDate}
                    onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                    className={glassInput} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">To Date</label>
                  <input type="date" value={filters.endDate}
                    onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                    className={glassInput} />
                </div>
              </div>
            </div>
          </BorderGlow>

          {/* Records */}
          <BorderGlow borderRadius={28}>
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
                  <p className="text-slate-500 text-sm">Loading records…</p>
                </div>
              ) : attendance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <CalendarDays className="w-12 h-12 text-slate-700" />
                  <p className="text-slate-500 text-sm">No attendance records found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-200 dark:border-white/5">
                    {['Employee', 'Date', 'Status', 'Check In', 'Check Out'].map((h, i) => (
                      <div key={h} className={`${i === 0 ? 'col-span-4' : 'col-span-2'} text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-600`}>{h}</div>
                    ))}
                  </div>
                  <AnimatePresence mode="popLayout">
                    {attendance.map((rec, idx) => {
                      const empName = rec.userId ? `${rec.userId.firstName || ''} ${rec.userId.lastName || ''}`.trim() : 'Unknown';
                      const color = avatarColors[idx % avatarColors.length];
                      return (
                        <motion.div key={rec._id} layout
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                          className={`grid grid-cols-12 gap-4 items-center px-4 py-3.5 rounded-2xl transition-all border border-transparent ${
                            isLight
                              ? 'hover:bg-slate-50 hover:border-slate-200'
                              : 'hover:bg-white/[0.04] hover:border-white/5'
                          }`}>
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black"
                              style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                              {empName[0] || '?'}
                            </div>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{empName}</span>
                          </div>
                          <div className="col-span-2 text-xs text-slate-400">{new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</div>
                          <div className="col-span-2"><StatusBadge status={rec.status} /></div>
                          <div className="col-span-2 text-xs text-slate-400 font-mono">{rec.checkInTime || '—'}</div>
                          <div className="col-span-2 text-xs text-slate-400 font-mono">{rec.checkOutTime || '—'}</div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </BorderGlow>
        </motion.div>
      )}
    </AppShell>
  );
};

export default AdminAttendancePage;
