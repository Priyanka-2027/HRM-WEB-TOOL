import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { taskService } from '../api/taskService';
import { employeeService } from '../api/employeeService';
import { AlertCircle, Plus, Trash2, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManagerTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tRes, tasksRes] = await Promise.all([
        employeeService.getMyTeam(),
        taskService.getManagerTasks()
      ]);
      if (tRes.success) setTeam(tRes.data || []);
      if (tasksRes.success) setTasks(tasksRes.data || []);
    } catch (err) {
      setError('Failed to load tasks and team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) return;
    setIsSubmitting(true);
    try {
      await taskService.createTask(newTask);
      setShowCreate(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
      loadData();
    } catch (err) {
      setError('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.deleteTask(id);
      loadData();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return (
    <AppShell userRole="manager">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <PageHeader title="Task Management" subtitle="Assign and oversee team goals" />
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(124,58,237,0.3)]">
          <Plus className="w-4 h-4" /> Assign New Task
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <BorderGlow borderRadius={24}>
              <form onSubmit={handleCreateTask} className="p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><ListTodo className="w-4 h-4 text-purple-400"/> New Task Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Title</label>
                    <input type="text" value={newTask.title} onChange={e=>setNewTask({...newTask, title: e.target.value})} required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-purple-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign To</label>
                    <select value={newTask.assignedTo} onChange={e=>setNewTask({...newTask, assignedTo: e.target.value})} required
                      className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition-all">
                      <option value="">Select Team Member...</option>
                      {team.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.userId?.firstName} {emp.userId?.lastName} ({emp.designation})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5 min-w-0 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                    <textarea value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 h-24 resize-none focus:border-purple-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Due Date</label>
                    <input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask, dueDate: e.target.value})} required
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition-all" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={()=>setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all disabled:opacity-50 uppercase tracking-widest">Assign Task</button>
                </div>
              </form>
            </BorderGlow>
          </motion.div>
        )}
      </AnimatePresence>

      <BorderGlow borderRadius={28}>
        <div className="p-1 min-h-[400px]">
          {loading ? (
             <div className="flex items-center justify-center h-48"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : !tasks.length ? (
             <div className="flex flex-col items-center justify-center py-20 text-center"><ListTodo className="w-12 h-12 text-slate-700 mb-4"/><p className="text-sm font-bold text-slate-400">No tasks assigned yet.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Task Title</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Assigned To</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Due Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-white/5">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4.5">
                        <p className="font-bold text-slate-900 dark:text-white">{task.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-sm truncate">{task.description}</p>
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="font-bold text-slate-700 dark:text-slate-300">{task.assignedTo?.email}</p>
                      </td>
                      <td className="px-6 py-4.5 text-slate-400 whitespace-nowrap">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          task.status === 'pending' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          task.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <button onClick={() => handleDeleteTask(task._id)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/20 border border-transparent hover:border-red-200 dark:hover:border-red-500/30 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </BorderGlow>
    </AppShell>
  );
};

export default ManagerTasksPage;
