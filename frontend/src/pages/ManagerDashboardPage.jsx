import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { employeeService } from '../api/employeeService';
import { taskService } from '../api/taskService';
import { attendanceService } from '../api/attendanceService';
import { useTheme } from '../contexts/ThemeContext';
import { Users, Clock, AlertCircle, CheckCircle, ListTodo, Eye, X, Mail, Phone, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManagerDashboardPage = () => {
  const [team, setTeam] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    (async () => {
      try {
        const teamRes = await employeeService.getMyTeam();
        if (teamRes.success) setTeam(teamRes.data || []);

        const taskRes = await taskService.getManagerTasks();
        if (taskRes.success) setTasks(taskRes.data || []);

        // Fetch team attendance for today
        const today = new Date().toISOString().split('T')[0];
        const attRes = await attendanceService.getTeamAttendance({ startDate: today, endDate: today });
        if (attRes.success) setAttendance(attRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard insights');
      }
    })();
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  
  const presentToday = attendance.filter(a => a.status === 'present').length;

  const kpiCards = [
    { key: 'teamSize', label: 'Team Size', value: team.length, Icon: Users, color: '#a855f7', sub: 'Direct reports' },
    { key: 'presentToday', label: 'Present Today', value: presentToday, Icon: Clock, color: '#10b981', sub: 'In office' },
    { key: 'pendingTasks', label: 'Pending Tasks', value: pendingTasks, Icon: AlertCircle, color: '#f59e0b', sub: 'To be started' },
    { key: 'completedTasks', label: 'Completed Tasks', value: completedTasks, Icon: CheckCircle, color: '#8b5cf6', sub: 'All time' },
  ];

  return (
    <AppShell userRole="manager">
      <PageHeader title="Manager Hub" subtitle="Live team insights and task overview" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpiCards.map(({ key, label, value, Icon, color, sub }, idx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.09 }}>
            <BorderGlow borderRadius={26}>
              <div className="p-6 relative overflow-hidden">
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</p>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-700 mt-0.5">{sub}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">{value}</span>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      {/* Overview Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Team</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Quick roster view</p>
              </div>
            </div>
            {!team.length ? (
              <div className="py-10 text-center text-slate-600 text-sm italic">No team members assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {team.map((emp, idx) => (
                  <motion.div key={emp._id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                    className={`p-3 rounded-xl border group hover:border-emerald-500/20 transition-all flex justify-between items-center shadow-sm ${
                        isLight 
                          ? 'bg-white border-slate-200' 
                          : 'bg-white/4 border-white/5'
                    }`}>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{emp.userId?.firstName} {emp.userId?.lastName}</p>
                      <p className="text-[10px] text-slate-500">{emp.designation}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedEmployee(emp)} 
                        className={`p-1.5 w-7 h-7 rounded-lg border transition-colors flex items-center justify-center ${
                          isLight 
                            ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30'
                        }`}
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </BorderGlow>

        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <ListTodo className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Tasks Assigned</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Latest 5 tasks</p>
              </div>
            </div>
            {!tasks.length ? (
              <div className="py-10 text-center text-slate-600 text-sm italic">No tasks assigned yet.</div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0,5).map((task, idx) => (
                  <motion.div key={task._id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                    className={`p-3 rounded-xl border group hover:border-violet-500/20 transition-all shadow-sm ${
                      isLight 
                        ? 'bg-white border-slate-200' 
                        : 'bg-white/4 border-white/5'
                    }`}>
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">{task.title}</h4>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        task.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">To: {task.assignedTo?.email}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </BorderGlow>
      </div>

      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative z-10 w-full max-w-md rounded-3xl border shadow-2xl p-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0f111a] border-white/10'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Employee Details</h3>
                <button onClick={() => setSelectedEmployee(null)} className="p-2 -mr-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-500 text-xl font-black shrink-0">
                  {((selectedEmployee.userId?.firstName?.[0]) || (selectedEmployee.email?.[0]) || '?').toUpperCase()}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1">{selectedEmployee.userId?.firstName} {selectedEmployee.userId?.lastName}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    selectedEmployee.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedEmployee.designation} <span className="text-slate-400 mx-1">·</span> {selectedEmployee.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedEmployee.email}</p>
                  </div>
                </div>
                {selectedEmployee.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedEmployee.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AppShell>
  );
};

export default ManagerDashboardPage;
