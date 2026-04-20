import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { Users, UserCheck, Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_BAR = 100;

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
        if (result.success) {
          setSummary(result.data);
        }
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
        <div className="mb-6 rounded border border-red-600/50 bg-red-900/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Total Employees</div>
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold text-white">{cards.totalEmployees}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Active Employees</div>
            <UserCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400">{cards.activeEmployees}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Pending Leaves</div>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{cards.pendingLeaves}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Skill Library</div>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{cards.totalSkills}</div>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
          <div className="space-y-3">
            {Object.entries(attendance).map(([label, value]) => {
              const width = (value / totalAttendance) * MAX_BAR;
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm text-gray-300">
                    <span className="capitalize">{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded bg-gray-800">
                    <div className="h-2 rounded bg-cyan-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Leave Status</h3>
          <div className="space-y-3">
            {Object.entries(leaveStatus).map(([label, value]) => {
              const width = (value / leaveTotal) * MAX_BAR;
              return (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm text-gray-300">
                    <span className="capitalize">{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded bg-gray-800">
                    <div className="h-2 rounded bg-yellow-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <Card>
          <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
          {topSkills.length === 0 ? (
            <p className="text-gray-500">No skill assignment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topSkills.map((skill) => (
                <div key={skill._id} className="flex items-center justify-between rounded border border-gray-700/50 bg-gray-800/40 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{skill._id}</p>
                    <p className="text-sm text-gray-400">Average level: {Number(skill.avgLevel || 0).toFixed(1)}</p>
                  </div>
                  <p className="text-cyan-400 font-semibold">{skill.assignedCount} assigned</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="mt-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Notice Board Management</h3>
          
          <form onSubmit={handlePostAnnouncement} className="mb-6 bg-gray-800/40 p-4 rounded-md border border-gray-700/50">
            <h4 className="text-sm font-semibold mb-3 text-cyan-400">Post New Announcement</h4>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Announcement Title"
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Announcement Message..."
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
                rows="3"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded text-sm transition-colors"
            >
              {isSubmitting ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>

          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements active.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann._id} className="p-3 border border-gray-700/50 rounded-md bg-gray-800/20">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-white">{ann.title}</h4>
                    <span className="text-xs text-gray-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-400">{ann.message}</p>
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
