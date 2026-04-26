import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import GlassSelect from '../components/ui/GlassSelect';
import { employeeService } from '../api/employeeService';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, Pencil, Trash2, Users, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'HR', 'Finance', 'Legal', 'Management', 'Sales'];

const StatusBadge = ({ status }) => {
  const cfg = {
    active:   { bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500 dark:bg-emerald-400' },
    inactive: { bg: 'bg-red-50 dark:bg-red-500/10',     border: 'border-red-200 dark:border-red-500/20',     text: 'text-red-700 dark:text-red-400',     dot: 'bg-red-500 dark:bg-red-400'     },
    'on-leave': { bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20',   text: 'text-amber-700 dark:text-amber-400',   dot: 'bg-amber-500 dark:bg-amber-400'   },
  }[status] || { bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20', text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-500 dark:bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
};

const avatarColors = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb923c', '#f472b6'];

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchEmployees(); }, [search, department, status, page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getAllEmployees({
        search, department: department || undefined,
        status: status || undefined, page, limit: 10,
      });
      if (result.success) {
        setEmployees(result.data);
        setPagination(result.pagination || {});
        setError('');
      }
    } catch (err) {
      setError('Error fetching employees');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee record? This cannot be undone.')) return;
    try {
      const result = await employeeService.deleteEmployee(id);
      if (result.success) setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (err) { setError('Error deleting employee'); }
  };

  const selectClass = "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500/50 outline-none transition-all appearance-none cursor-pointer";

  return (
    <AppShell userRole="admin">
      <PageHeader title="Employees" subtitle="Manage and search your full workforce directory">
         <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/admin/employees/new')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:bg-purple-600 dark:hover:bg-purple-400 transition-all shadow-lg dark:shadow-white/10"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </motion.button>
      </PageHeader>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="relative group md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text" placeholder="Search by email or designation…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 rounded-xl pl-12 pr-4 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-purple-500/50 outline-none transition-all shadow-sm dark:shadow-none"
          />
        </div>
        <GlassSelect
          value={department}
          onChange={v => { setDepartment(v); setPage(1); }}
          options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
          placeholder="All Departments"
        />
        <GlassSelect
          value={status}
          onChange={v => { setStatus(v); setPage(1); }}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'on-leave', label: 'On Leave' }
          ]}
          placeholder="All Status"
        />
      </div>

      {/* Employee Cards / Table */}
      <BorderGlow borderRadius={28}>
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading employees…</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Users className="w-12 h-12 text-slate-700" />
              <p className="text-slate-500 text-sm">No employees found</p>
              <button onClick={() => navigate('/admin/employees/new')}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
                Add First Employee
              </button>
            </div>
          ) : (
            <>
               {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 pb-3 mb-1 border-b border-slate-100 dark:border-white/5">
                {['Employee', 'Department', 'Designation', 'Status', 'Actions'].map((h, i) => (
                  <div key={h} className={`${i === 0 ? 'col-span-4' : i === 4 ? 'col-span-2' : 'col-span-2'} text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600`}>{h}</div>
                ))}
              </div>

              <AnimatePresence mode="popLayout">
                {employees.map((emp, idx) => {
                  const initials = (emp.email || '?')[0].toUpperCase();
                  const avatarColor = avatarColors[idx % avatarColors.length];
                  return (
                     <motion.div key={emp._id} layout
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="grid grid-cols-12 gap-4 items-center px-4 py-4 rounded-2xl hover:bg-slate-100/50 dark:hover:bg-white/[0.04] transition-all group border border-transparent hover:border-slate-200 dark:hover:border-white/5 mb-1"
                    >
                      {/* Employee col */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                          style={{ background: `${avatarColor}20`, color: avatarColor, border: `1px solid ${avatarColor}30` }}>
                          {initials}
                        </div>
                         <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{emp.email}</p>
                          <p className="text-[10px] text-slate-500 truncate">{emp.userId?.firstName} {emp.userId?.lastName}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-xs text-slate-500 dark:text-slate-400 font-medium">{emp.department || '—'}</div>
                      <div className="col-span-2 text-xs text-slate-900 dark:text-slate-300 font-bold">{emp.designation || '—'}</div>
                      <div className="col-span-2"><StatusBadge status={emp.status} /></div>
                       <div className="col-span-2 flex items-center gap-1.5">
                        <button onClick={() => navigate(`/admin/employees/${emp._id}`)}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => navigate(`/admin/employees/${emp._id}/edit`)}
                          className="p-2 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/20 transition-all shadow-sm dark:shadow-none" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(emp._id)}
                          className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all shadow-sm dark:shadow-none" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

               {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                  <p className="text-[11px] text-slate-500 font-medium tracking-tight">Page <span className="text-slate-900 dark:text-white font-black">{page}</span> of <span className="text-slate-900 dark:text-white font-black">{pagination.pages}</span></p>
                  <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm dark:shadow-none">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm dark:shadow-none">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </BorderGlow>
    </AppShell>
  );
};

export default EmployeeListPage;
