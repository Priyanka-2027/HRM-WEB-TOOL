import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import {
  Users, UserCheck, Clock, BookOpen, AlertCircle, Megaphone, Send,
  TrendingUp, ArrowUpRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(8,8,18,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '10px 14px', backdropFilter: 'blur(20px)' }}>
      {label && <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill || p.color, display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{p.name || p.dataKey}</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', marginLeft: 8 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// Custom gradient bar shape
const GradientBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const id = `bar-grad-${fill?.replace('#', '')}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <rect x={x} y={y} width={width} height={height} rx={8} ry={8} fill={`url(#${id})`} />
    </g>
  );
};

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadAnnouncements = async () => {
    try {
      const res = await announcementService.getAnnouncements();
      if (res.success) setAnnouncements(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await dashboardService.getAdminSummary();
        if (result.success) setSummary(result.data);
        await loadAnnouncements();
      } catch (err) { setError('Failed to load dashboard insights'); }
    })();
  }, []);

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) return;
    setIsSubmitting(true);
    try {
      await announcementService.createAnnouncement(newAnnouncement);
      setNewAnnouncement({ title: '', message: '' });
      await loadAnnouncements();
    } catch (err) { setError('Failed to post announcement'); }
    finally { setIsSubmitting(false); }
  };

  const cards = summary?.cards || { totalEmployees: 0, activeEmployees: 0, pendingLeaves: 0, totalSkills: 0 };

  const attendanceData = useMemo(() => {
    const raw = summary?.attendanceToday || { present: 0, absent: 0, late: 0, halfDay: 0, onLeave: 0 };
    return [
      { name: 'Present',  value: raw.present,  fill: '#22d3ee' },
      { name: 'Absent',   value: raw.absent,   fill: '#ef4444' },
      { name: 'Late',     value: raw.late,     fill: '#f59e0b' },
      { name: 'Half Day', value: raw.halfDay,  fill: '#fb923c' },
      { name: 'On Leave', value: raw.onLeave,  fill: '#a78bfa' },
    ];
  }, [summary]);

  const leaveData = useMemo(() => {
    const raw = summary?.leaveStatus || { pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    return [
      { name: 'Pending',   value: raw.pending,   fill: '#f59e0b' },
      { name: 'Approved',  value: raw.approved,  fill: '#10b981' },
      { name: 'Rejected',  value: raw.rejected,  fill: '#ef4444' },
      { name: 'Cancelled', value: raw.cancelled, fill: '#6b7280' },
    ];
  }, [summary]);

  const kpiCards = [
    { key: 'totalEmployees',  label: 'Total Workforce',  Icon: Users,      color: '#a78bfa', sub: 'Registered' },
    { key: 'activeEmployees', label: 'Active Today',     Icon: UserCheck,  color: '#22d3ee', sub: 'On duty'    },
    { key: 'pendingLeaves',   label: 'Pending Requests', Icon: Clock,      color: '#fbbf24', sub: 'Needs review'},
    { key: 'totalSkills',     label: 'Skill Modules',    Icon: BookOpen,   color: '#34d399', sub: 'All teams'  },
  ];

  return (
    <AppShell userRole="admin">
      <PageHeader title="Analytics Hub" subtitle="Live organizational health metrics and insights" />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpiCards.map(({ key, label, Icon, color, sub }, idx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.09 }}>
            <BorderGlow borderRadius={26}>
              <div className="p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: color }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-black text-white tabular-nums">{cards[key]}</span>
                    <span className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />Live
                    </span>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Attendance Bar Chart */}
        <div className="lg:col-span-8">
          <BorderGlow borderRadius={28}>
            <div className="p-6 h-[380px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Today's Attendance Breakdown</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Real-time workforce distribution</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                    <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" maxBarSize={56} shape={<GradientBar />}>
                      {attendanceData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Leave Donut */}
        <div className="lg:col-span-4">
          <BorderGlow borderRadius={28}>
            <div className="p-6 h-[380px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Leave Status</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Distribution overview</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={leaveData} cx="50%" cy="42%" innerRadius={55} outerRadius={78}
                      paddingAngle={6} dataKey="value" strokeWidth={0}>
                      {leaveData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<GlassTooltip />} />
                    <Legend verticalAlign="bottom" height={44}
                      formatter={(value) => (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{value}</span>
                      )} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills */}
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Top Skill Competencies</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Most endorsed capabilities</p>
              </div>
            </div>
            {!summary?.topSkills?.length ? (
              <div className="py-10 text-center text-slate-600 text-sm italic">No skill data yet</div>
            ) : (
              <div className="space-y-4">
                {summary.topSkills.slice(0, 5).map((skill, idx) => {
                  const pct = Math.min(100, (skill.assignedCount / 5) * 100);
                  const colors = ['#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#fb923c'];
                  const c = colors[idx % colors.length];
                  return (
                    <motion.div key={skill._id}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{skill._id}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c }}>
                          {skill.assignedCount} members
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${c}88, ${c})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </BorderGlow>

        {/* Notice Board */}
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <Megaphone className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Broadcast Center</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Post company-wide announcements</p>
              </div>
            </div>
            <form onSubmit={handlePostAnnouncement} className="mb-5 space-y-3">
              <input type="text" placeholder="Subject line…"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-violet-500/50 outline-none transition-all"
                value={newAnnouncement.title}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required />
              <textarea placeholder="Write your message…"
                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 h-20 resize-none focus:border-violet-500/50 outline-none transition-all"
                value={newAnnouncement.message}
                onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                required />
              <button type="submit" disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Sending...' : 'Broadcast'}
              </button>
            </form>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {announcements.map(ann => (
                  <motion.div key={ann._id} layout
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="p-4 rounded-xl bg-white/4 border border-white/5 group hover:border-violet-500/20 transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">{ann.title}</h4>
                      <span className="text-[10px] text-slate-600 shrink-0 ml-2">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ann.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </BorderGlow>
      </div>
    </AppShell>
  );
};

export default AdminDashboardPage;
