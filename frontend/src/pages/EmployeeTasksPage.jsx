import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { taskService } from '../api/taskService';
import { AlertCircle, CheckCircle, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getEmployeeTasks();
      if (res.success) setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdating(id);
      await taskService.updateTaskStatus(id, status);
      await loadTasks();
    } catch (err) {
      setError('Failed to update task status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <AppShell userRole="employee">
      <PageHeader title="My Tasks" subtitle="Track and update your assigned tasks" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : !tasks.length ? (
        <BorderGlow borderRadius={28}>
          <div className="flex flex-col items-center justify-center py-20 text-center p-6"><ListTodo className="w-12 h-12 text-slate-700 mb-4"/><p className="text-sm font-bold text-slate-400">You have no assigned tasks.</p></div>
        </BorderGlow>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <motion.div key={task._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <BorderGlow borderRadius={24}>
                <div className="p-6 h-full flex flex-col relative">
                  {updating === task._id && (
                    <div className="absolute inset-0 bg-black/50 rounded-[24px] z-10 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          task.status === 'pending' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          task.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {task.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{task.title}</h3>
                  <p className="text-xs text-slate-400 mb-6 flex-grow">{task.description}</p>
                  
                  <div className="pt-4 border-t border-white/5 mt-auto">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Update Status</p>
                    <div className="flex gap-2">
                      <button 
                        disabled={task.status === 'pending' || updating === task._id}
                        onClick={() => handleUpdateStatus(task._id, 'pending')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          task.status === 'pending' 
                            ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' 
                            : 'bg-transparent text-slate-400 border-white/10 hover:bg-white/5 hover:text-white'
                        }`}>
                        Pending
                      </button>
                      <button 
                        disabled={task.status === 'in-progress' || updating === task._id}
                        onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          task.status === 'in-progress' 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                            : 'bg-transparent text-amber-400 border-amber-500/20 hover:bg-amber-500/10'
                        }`}>
                        Active
                      </button>
                      <button 
                        disabled={task.status === 'completed' || updating === task._id}
                        onClick={() => handleUpdateStatus(task._id, 'completed')}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          task.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                            : 'bg-transparent text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'
                        }`}>
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default EmployeeTasksPage;
