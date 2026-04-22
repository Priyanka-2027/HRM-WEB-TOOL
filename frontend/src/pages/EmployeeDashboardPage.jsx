import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { payrollService } from '../api/payrollService';
import { CalendarCheck, BookOpen, Clock, Activity, Coins, AlertCircle, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_BAR = 100;

const ATTENDANCE_COLORS = {
  present: { bar: 'from-cyan-500 to-cyan-400',    text: 'text-cyan-400'    },
  absent:  { bar: 'from-red-500 to-red-400',      text: 'text-red-400'     },
  late:    { bar: 'from-amber-500 to-amber-400',  text: 'text-amber-400'   },
  halfDay: { bar: 'from-orange-500 to-orange-400',text: 'text-orange-400'  },
  onLeave: { bar: 'from-purple-500 to-purple-400',text: 'text-purple-400'  },
};

const SKILL_COLORS = ['from-cyan-500 to-cyan-400', 'from-violet-500 to-violet-400', 'from-emerald-500 to-emerald-400', 'from-amber-500 to-amber-400', 'from-pink-500 to-pink-400'];

const kpiCards = [
  {
    key: 'attendanceThisMonth',
    label: 'My Attendance',
    Icon: CalendarCheck,
    glowColor: '200 85 65',
    colors: ['#22d3ee', '#06b6d4', '#67e8f9'],
    valueClass: 'text-cyan-300',
    iconClass: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15 border-cyan-500/20',
  },
  {
    key: 'approvedLeaves',
    label: 'Approved Leaves',
    Icon: Clock,
    glowColor: '160 75 60',
    colors: ['#34d399', '#10b981', '#6ee7b7'],
    valueClass: 'text-emerald-300',
    iconClass: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/20',
  },
  {
    key: 'pendingLeaves',
    label: 'Pending Leaves',
    Icon: Activity,
    glowColor: '38 90 65',
    colors: ['#fbbf24', '#f59e0b', '#fcd34d'],
    valueClass: 'text-amber-300',
    iconClass: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/20',
  },
  {
    key: 'skillsCount',
    label: 'My Skills',
    Icon: BookOpen,
    glowColor: '260 70 75',
    colors: ['#a78bfa', '#818cf8', '#c4b5fd'],
    valueClass: 'text-violet-300',
    iconClass: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border-violet-500/20',
  },
];

const EmployeeDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [payslip, setPayslip] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await dashboardService.getEmployeeSummary();
        if (result.success) setSummary(result.data);

        const annResult = await announcementService.getAnnouncements();
        if (annResult.success) setAnnouncements(annResult.data);

        const date = new Date();
        const payResult = await payrollService.getMyPayslip(date.getFullYear(), date.getMonth() + 1);
        if (payResult.success) setPayslip(payResult.data);
      } catch (err) {
        setError('Failed to load some dashboard insights');
      }
    })();
  }, []);

  const cards = summary?.cards || {
    attendanceThisMonth: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    skillsCount: 0,
  };

  const attendance = summary?.attendanceSummary || {
    totalDays: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    onLeave: 0,
  };

  const topSkills = summary?.topSkills || [];
  const totalAttendance = attendance.totalDays || 1;

  return (
    <AppShell userRole="employee">
      <PageHeader
        title="My Dashboard"
        subtitle="Track your attendance, leaves, and skills"
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
        {/* Monthly Attendance */}
        <Card glowColor="200 85 65" colors={['#22d3ee', '#06b6d4', '#67e8f9']}>
          <div className="flex items-center gap-2 mb-5">
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white">Monthly Attendance</h3>
          </div>
          <div className="space-y-4">
            {[
              ['present', attendance.present],
              ['absent', attendance.absent],
              ['late', attendance.late],
              ['halfDay', attendance.halfDay],
              ['onLeave', attendance.onLeave],
            ].map(([label, value]) => {
              const width = ((value || 0) / totalAttendance) * MAX_BAR;
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

        {/* Skill Levels */}
        <Card glowColor="260 70 75" colors={['#a78bfa', '#818cf8', '#c4b5fd']}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h3 className="text-base font-semibold text-white">My Skill Levels</h3>
          </div>
          {topSkills.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-white/30 text-sm">No skill data yet</div>
          ) : (
            <div className="space-y-4">
              {topSkills.map((skill, idx) => {
                const width = (skill.level / 5) * MAX_BAR;
                const colorClass = SKILL_COLORS[idx % SKILL_COLORS.length];
                return (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-white/70">{skill.name}</span>
                      <span className="text-violet-300 font-semibold">Level {skill.level}/5</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.7, delay: 0.4 + idx * 0.05, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Notice Board + Payroll */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5"
      >
        {/* Announcements */}
        <Card glowColor="38 90 65" colors={['#fbbf24', '#f59e0b', '#fcd34d']}>
          <div className="flex items-center gap-2 mb-5">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Notice Board</h3>
          </div>
          {announcements.length === 0 ? (
            <div className="text-white/30 text-sm">No announcements.</div>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.06 }}
                  className="p-4 border border-white/8 rounded-xl bg-white/4"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 className="font-semibold text-white text-sm">{ann.title}</h4>
                    <span className="text-xs text-white/30 ml-4 shrink-0">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-white/55">{ann.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Payroll */}
        <Card glowColor="160 75 60" colors={['#34d399', '#10b981', '#6ee7b7']}>
          <div className="flex items-center gap-2 mb-5">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">Current Payroll Estimate</h3>
          </div>
          {!payslip ? (
            <div className="text-white/30 text-sm">Payroll data not available.</div>
          ) : (
            <div className="space-y-0">
              {[
                { label: 'Base Salary', value: `$${payslip.baseSalary}` },
                { label: 'Working Days', value: `${payslip.effectivePresentDays} / ${payslip.totalDaysInMonth}` },
                { label: 'Paid Leaves', value: `${payslip.paidLeaveDaysInMonth}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-white/8">
                  <span className="text-sm text-white/55">{label}</span>
                  <span className="font-semibold text-white text-sm">{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <span className="text-white/70 font-medium">Est. Salary</span>
                <span className="text-2xl font-bold text-emerald-300">${payslip.finalSalary}</span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AppShell>
  );
};

export default EmployeeDashboardPage;
