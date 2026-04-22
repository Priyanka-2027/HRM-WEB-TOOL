import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { Users, UserCheck, Clock, BookOpen, TrendingUp, AlertCircle, Megaphone, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await dashboardService.getAdminSummary();
        if (result.success) setSummary(result.data);
        await loadAnnouncements();
      } catch (err) {
        setError('Failed to load dashboard insights');
      }
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
    } catch (err) {
      setError('Failed to post announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cards = summary?.cards || {
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    totalSkills: 0,
  };

  const attendanceData = useMemo(() => {
    const raw = summary?.attendanceToday || { present: 0, absent: 0, late: 0, halfDay: 0, onLeave: 0 };
    return Object.entries(raw).map(([key, value]) => ({
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      value,
      fullKey: key
    }));
  }, [summary]);

  const leaveData = useMemo(() => {
    const raw = summary?.leaveStatus || { pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    return Object.entries(raw).map(([key, value]) => ({ name: key, value }));
  }, [summary]);

  const ATTENDANCE_COLORS = {
    present: '#22d3ee',
    absent: '#ef4444',
    late: '#f59e0b',
    halfDay: '#fb923c',
    onLeave: '#a78bfa',
  };

  const LEAVE_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#6b7280'];

  const kpiCards = [
    { key: 'totalEmployees', label: 'Total Workforce', Icon: Users, color: '#a78bfa', glow: '260 70 75' },
    { key: 'activeEmployees', label: 'Active Now', Icon: UserCheck, color: '#22d3ee', glow: '200 85 65' },
    { key: 'pendingLeaves', label: 'Pending Requests', Icon: Clock, color: '#fbbf24', glow: '38 90 65' },
    { key: 'totalSkills', label: 'Skill Library', Icon: BookOpen, color: '#34d399', glow: '160 75 60' },
  ];

  return (
    <AppShell userRole="admin">
      <PageHeader
        title="Admin Analytics"
        subtitle="Comprehensive overview of organizational health"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-md px-5 py-4 text-sm text-red-400"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map(({ key, label, Icon, color, glow }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <BorderGlow
              glowColor={glow}
              colors={[color, color, color]}
              backgroundColor="rgba(15, 17, 26, 0.5)"
              borderRadius={24}
              glowIntensity={0.8}
              animated
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-slate-400 capitalize">{label}</p>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold tracking-tight text-white">{cards[key]}</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main Attendance Chart */}
        <div className="lg:col-span-8">
          <BorderGlow glowColor="200 85 65" colors={['#22d3ee', '#06b6d4']}>
            <div className="p-6 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Daily Attendance Distribution</h3>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[entry.fullKey] || '#22d3ee'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Leave Pie Chart */}
        <div className="lg:col-span-4">
          <BorderGlow glowColor="38 90 65" colors={['#fbbf24', '#f59e0b']}>
            <div className="p-6 h-[400px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <PieIcon className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Leave Status</h3>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leaveData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {leaveData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={LEAVE_COLORS[index % LEAVE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      formatter={(value) => <span className="text-xs text-slate-400 capitalize">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Card */}
        <BorderGlow glowColor="160 75 60" colors={['#34d399', '#10b981']}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Skill Proficiency</h3>
            </div>
            {summary?.topSkills?.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic">No skill data available.</div>
            ) : (
              <div className="space-y-4">
                {summary?.topSkills?.slice(0, 5).map((skill, idx) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-white/[0.07]"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white">{skill._id}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        High competence across {skill.assignedCount} individuals
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">{skill.assignedCount}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Members</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </BorderGlow>

        {/* Announcements/Notice Board */}
        <BorderGlow glowColor="260 70 75" colors={['#a78bfa', '#818cf8']}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Notice Board</h3>
            </div>
            
            <form onSubmit={handlePostAnnouncement} className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Subject line"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm transition-all focus:border-violet-500/50 outline-none"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Write your message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm h-24 resize-none transition-all focus:border-violet-500/50 outline-none"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-violet-900/20"
              >
                {isSubmitting ? 'Verifying...' : 'Broadcast Announcement'}
              </button>
            </form>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {announcements.map((ann) => (
                  <motion.div
                    key={ann._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-semibold text-slate-200">{ann.title}</h4>
                      <span className="text-[10px] text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{ann.message}</p>
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
