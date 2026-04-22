import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { Users, UserCheck, Clock, BookOpen, TrendingUp, AlertCircle, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_BAR = 100;

const ATTENDANCE_COLORS = {
  present: { bar: 'from-cyan-500 to-cyan-400', text: 'text-cyan-400' },
  absent:  { bar: 'from-red-500 to-red-400',  text: 'text-red-400'  },
  late:    { bar: 'from-amber-500 to-amber-400', text: 'text-amber-400' },
  halfDay: { bar: 'from-orange-500 to-orange-400', text: 'text-orange-400' },
  onLeave: { bar: 'from-purple-500 to-purple-400', text: 'text-purple-400' },
};

const LEAVE_COLORS = {
  pending:   { bar: 'from-yellow-500 to-yellow-400',  text: 'text-yellow-400' },
  approved:  { bar: 'from-green-500 to-green-400',    text: 'text-green-400'  },
  rejected:  { bar: 'from-red-500 to-red-400',        text: 'text-red-400'    },
  cancelled: { bar: 'from-gray-500 to-gray-400',      text: 'text-gray-400'   },
};

const kpiCards = [
  {
    key: 'totalEmployees',
    label: 'Total Employees',
    Icon: Users,
    glowColor: '260 70 75',
    colors: ['#a78bfa', '#818cf8', '#c4b5fd'],
    valueClass: 'text-violet-300',
    iconClass: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border-violet-500/20',
  },
  {
    key: 'activeEmployees',
    label: 'Active Employees',
    Icon: UserCheck,
    glowColor: '200 85 65',
    colors: ['#22d3ee', '#06b6d4', '#67e8f9'],
    valueClass: 'text-cyan-300',
    iconClass: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 border-cyan-500/20',
  },
  {
    key: 'pendingLeaves',
    label: 'Pending Leaves',
    Icon: Clock,
    glowColor: '38 90 65',
    colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
    valueClass: 'text-amber-300',
    iconClass: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/20',
  },
  {
    key: 'totalSkills',
    label: 'Skill Library',
    Icon: BookOpen,
    glowColor: '160 75 60',
    colors: ['#34d399', '#10b981', '#6ee7b7'],
    valueClass: 'text-emerald-300',
    iconClass: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
  },
];

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

  const attendance = summary?.attendanceToday || {
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    onLeave: 0,
  };

  const leaveStatus = summary?.leaveStatus || {
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };

  const topSkills = summary?.topSkills || [];

  const totalAttendance = Object.values(attendance).reduce((acc, curr) => acc + curr, 0) || 1;
  const leaveTotal = Object.values(leaveStatus).reduce((acc, curr) => acc + curr, 0) || 1;

  return (
    <AppShell userRole="admin">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back to your admin dashboard"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-4 py-3 text-sm text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        {kpiCards.map(({ key, label, Icon, glowColor, colors, valueClass, iconClass, iconBg }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 + idx * 0.07 }}
          >
            <BorderGlow
              glowColor={glowColor}
              colors={colors}
              backgroundColor="rgba(6, 8, 20, 0.55)"
              borderRadius={16}
              glowRadius={36}
              glowIntensity={1.0}
              animated
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/60">{label}</span>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconClass}`} />
                  </div>
                </div>
                <div className={`text-4xl font-bold tracking-tight ${valueClass}`}>
                  {cards[key]}
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Attendance Chart */}
        <Card glowColor="200 85 65" colors={['#22d3ee', '#06b6d4', '#67e8f9']}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Today's Attendance</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(attendance).map(([label, value]) => {
              const width = (value / totalAttendance) * MAX_BAR;
              const style = ATTENDANCE_COLORS[label] || { bar: 'from-cyan-500 to-cyan-400', text: 'text-cyan-400' };
              return (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="capitalize text-white/70">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`font-semibold ${style.text}`}>{value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Leave Status Chart */}
        <Card glowColor="38 90 65" colors={['#fbbf24', '#f59e0b', '#fcd34d']}>
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Leave Status</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(leaveStatus).map(([label, value]) => {
              const width = (value / leaveTotal) * MAX_BAR;
              const style = LEAVE_COLORS[label] || { bar: 'from-yellow-500 to-yellow-400', text: 'text-yellow-400' };
              return (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="capitalize text-white/70">{label}</span>
                    <span className={`font-semibold ${style.text}`}>{value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${style.bar}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Top Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-5"
      >
        <Card glowColor="160 75 60" colors={['#34d399', '#10b981', '#6ee7b7']}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Top Skills</h3>
          </div>
          {topSkills.length === 0 ? (
            <p className="text-white/40 text-sm">No skill assignment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topSkills.map((skill, idx) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.4 + idx * 0.06 }}
                  className="flex items-center justify-between rounded-lg border border-white/8 bg-white/4 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-white text-sm">{skill._id}</p>
                    <p className="text-xs text-white/40 mt-0.5">Avg level: {Number(skill.avgLevel || 0).toFixed(1)}</p>
                  </div>
                  <span className="text-emerald-400 font-semibold text-sm">{skill.assignedCount} assigned</span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Notice Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="mt-5"
      >
        <Card glowColor="260 70 75" colors={['#a78bfa', '#818cf8', '#c4b5fd']}>
          <div className="flex items-center gap-2 mb-5">
            <Megaphone className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">Notice Board Management</h3>
          </div>

          {/* Post Form */}
          <form onSubmit={handlePostAnnouncement} className="mb-6">
            <div className="rounded-xl border border-white/8 bg-white/4 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/80">Post New Announcement</p>
              <input
                type="text"
                placeholder="Announcement Title"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Announcement Message..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
                rows="3"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 hover:border-violet-400/60 text-violet-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all disabled:opacity-40 shadow-[0_0_12px_rgba(167,139,250,0.2)] hover:shadow-[0_0_20px_rgba(167,139,250,0.35)]"
              >
                {isSubmitting ? 'Posting…' : 'Post Announcement'}
              </button>
            </div>
          </form>

          {announcements.length === 0 ? (
            <p className="text-white/40 text-sm">No announcements active.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann._id} className="p-4 border border-white/8 rounded-xl bg-white/4">
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-semibold text-white text-sm">{ann.title}</h4>
                    <span className="text-xs text-white/30 ml-4 shrink-0">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-white/55">{ann.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </AppShell>
  );
};

export default AdminDashboardPage;
