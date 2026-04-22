import { useState, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import GlassSelect from '../components/ui/GlassSelect';
import { attendanceService } from '../api/attendanceService';
import { employeeService } from '../api/employeeService';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, AlertCircle, CheckCircle, XCircle, Activity } from 'lucide-react';

const STATUS_CFG = {
  present: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  absent:  { bg: 'bg-red-500/10',  border: 'border-red-500/20',  text: 'text-red-400'  },
  late:    { bg: 'bg-amber-500/10',border: 'border-amber-500/20',text: 'text-amber-400' },
  'half-day':{ bg: 'bg-orange-500/10',border: 'border-orange-500/20',text: 'text-orange-400' },
  'on-leave':{ bg: 'bg-violet-500/10',border: 'border-violet-500/20',text: 'text-violet-400' },
};

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March'   }, { value: 4, label: 'April'    },
  { value: 5, label: 'May'     }, { value: 6, label: 'June'     },
  { value: 7, label: 'July'    }, { value: 8, label: 'August'   },
  { value: 9, label: 'September'},{ value: 10,label: 'October'  },
  { value: 11,label: 'November' }, { value: 12,label: 'December'  },
];

const StatCard = ({ label, value, accent }) => {
  const clrs = {
    cyan:   'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20 text-cyan-400',
    emerald:'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20 text-emerald-400',
    red:    'from-red-500/10 to-red-500/0 border-red-500/20 text-red-400',
    amber:  'from-amber-500/10 to-amber-500/0 border-amber-500/20 text-amber-400',
    blue:   'from-blue-500/10 to-blue-500/0 border-blue-500/20 text-blue-400',
  }[accent] || 'from-white/5 to-white/0 border-white/10 text-white';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-b p-5 ${clrs}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</p>
      <p className={`text-3xl font-black`}>{value ?? '—'}</p>
    </motion.div>
  );
};

const EmployeeAttendancePage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const yearOptions = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]
    .map(y => ({ value: y, label: String(y) }));

  useEffect(() => { fetchAttendance(); }, [month, year]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');

      // Look up the employee record to get the employeeId for the summary call
      let employeeId = null;
      try {
        const empResult = await employeeService.getEmployeeByUserId(user?._id);
        if (empResult.success) employeeId = empResult.data._id;
      } catch (e) {
        // No employee profile linked yet — show empty state, don't crash
        setLoading(false);
        setError('No employee record linked to your account. Ask your admin to create your profile.');
        return;
      }

      // Fetch records and summary in parallel
      // For employees, getAttendance is filtered by userId automatically (no params needed)
      const [attResult, sumResult] = await Promise.all([
        attendanceService.getAttendance({ page: 1, limit: 100 }),
        employeeId
          ? attendanceService.getEmployeeAttendanceSummary(employeeId, year, month)
          : Promise.resolve({ success: false }),
      ]);
      if (attResult.success) setAttendance(attResult.data || []);
      if (sumResult.success) setSummary(sumResult.data?.summary || null);
    } catch (err) { setError('Error fetching attendance'); }
    finally { setLoading(false); }
  };

  return (
    <AppShell>
      <PageHeader title="My Attendance" subtitle="Track your attendance history and monthly summary" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Days" value={summary.totalDays}   accent="cyan"    />
          <StatCard label="Present"    value={summary.present}     accent="emerald" />
          <StatCard label="Absent"     value={summary.absent}      accent="red"     />
          <StatCard label="Late"       value={summary.late}        accent="amber"   />
          <StatCard label="Half Day"   value={summary.halfDay}     accent="blue"    />
        </div>
      )}

      {/* Month/Year Filter */}
      <BorderGlow borderRadius={20}>
        <div className="p-5 flex gap-4 items-end">
          <div className="flex-1">
            <GlassSelect label="Month" value={month} onChange={v => setMonth(Number(v))} options={MONTHS} />
          </div>
          <div className="w-40">
            <GlassSelect label="Year" value={year} onChange={v => setYear(Number(v))} options={yearOptions} />
          </div>
        </div>
      </BorderGlow>

      {/* Records */}
      <BorderGlow borderRadius={28} className="mt-5">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-black text-white">Attendance Records</h3>
            <span className="ml-auto text-[10px] text-slate-600 font-bold">{attendance.length} records</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading attendance…</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <CalendarDays className="w-10 h-10 text-slate-700" />
              <p className="text-slate-500 text-sm">No attendance records found for this period</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-12 gap-4 px-4 pb-3 border-b border-white/5">
                {['Date', 'Day', 'Status', 'Check In', 'Check Out', 'Notes'].map((h, i) => (
                  <div key={h} className={`${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-2' : i === 2 ? 'col-span-2' : i === 5 ? 'col-span-3' : 'col-span-1'} text-[10px] font-black uppercase tracking-widest text-slate-600`}>{h}</div>
                ))}
              </div>
              <AnimatePresence mode="popLayout">
                {attendance.map((rec, idx) => {
                  const dt = new Date(rec.date);
                  const cfg = STATUS_CFG[rec.status] || STATUS_CFG.absent;
                  return (
                    <motion.div key={rec._id} layout
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                      className="grid grid-cols-12 gap-4 items-center px-4 py-3.5 rounded-2xl hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/5">
                      <div className="col-span-2 text-xs text-white font-semibold font-mono">{dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="col-span-2 text-xs text-slate-500">{dt.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="col-span-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                          {rec.status}
                        </span>
                      </div>
                      <div className="col-span-2 text-xs text-slate-400 font-mono">{rec.checkInTime || '—'}</div>
                      <div className="col-span-1 text-xs text-slate-400 font-mono">{rec.checkOutTime || '—'}</div>
                      <div className="col-span-3 text-[11px] text-slate-600 italic truncate">{rec.notes || '—'}</div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </>
          )}
        </div>
      </BorderGlow>
    </AppShell>
  );
};

export default EmployeeAttendancePage;
