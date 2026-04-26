import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { employeeService } from '../api/employeeService';
import { attendanceService } from '../api/attendanceService';
import { leaveService } from '../api/leaveService';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Users, CalendarCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ManagerTeamPage = () => {
  const [team, setTeam] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [teamRes, attRes, leavesRes] = await Promise.all([
          employeeService.getMyTeam(),
          attendanceService.getTeamAttendance(),
          leaveService.getTeamLeaves()
        ]);
        if (teamRes.success) setTeam(teamRes.data || []);
        if (attRes.success) setAttendance(attRes.data || []);
        if (leavesRes.success) setLeaves(leavesRes.data || []);
      } catch (err) {
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AppShell userRole="manager">
      <PageHeader title="Team Overview" subtitle="Manage your direct reports' attendance and leaves" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Members */}
          <BorderGlow borderRadius={28}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Roster</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Your direct reports</p>
                </div>
              </div>
              <div className="space-y-3">
                {team.map((emp) => (
                  <div key={emp._id} className={`p-4 rounded-xl border flex items-center gap-4 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/4 border-white/5'
                  }`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black">
                      {(emp.userId?.firstName?.[0] || 'E').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{emp.userId?.firstName} {emp.userId?.lastName}</p>
                      <p className="text-[10px] text-slate-500">{emp.email} • {emp.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BorderGlow>

          <div className="space-y-6">
            {/* Recent Leaves */}
            <BorderGlow borderRadius={28}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Leaves</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Team's leave requests</p>
                  </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {!leaves.length ? (
                    <div className="py-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">No recent leaves</div>
                  ) : leaves.map(leave => (
                    <div key={leave._id} className={`p-4 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/4 border-white/5'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{leave.userId?.firstName} {leave.userId?.lastName}</p>
                          <p className="text-[10px] text-slate-500">{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          leave.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          leave.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Reason: {leave.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </BorderGlow>

            {/* Recent Attendance */}
            <BorderGlow borderRadius={28}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <CalendarCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Attendance</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Latest attendance logs</p>
                  </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {!attendance.length ? (
                    <div className="py-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">No recent attendance</div>
                  ) : attendance.map(record => (
                    <div key={record._id} className={`p-4 rounded-xl border flex justify-between items-center ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/4 border-white/5'
                    }`}>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{record.userId?.firstName} {record.userId?.lastName}</p>
                        <p className="text-[10px] text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          record.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          record.status === 'absent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          record.status === 'late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {record.status}
                        </span>
                    </div>
                  ))}
                </div>
              </div>
            </BorderGlow>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ManagerTeamPage;
