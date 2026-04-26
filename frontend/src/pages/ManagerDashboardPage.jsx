import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { employeeService } from '../api/employeeService';
import { taskService } from '../api/taskService';
import { attendanceService } from '../api/attendanceService';
import { useTheme } from '../contexts/ThemeContext';
import { Users, Clock, AlertCircle, CheckCircle, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

const ManagerDashboardPage = () => {
  const [team, setTeam] = useState([]);
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

    </AppShell>
  );
};

export default ManagerDashboardPage;
