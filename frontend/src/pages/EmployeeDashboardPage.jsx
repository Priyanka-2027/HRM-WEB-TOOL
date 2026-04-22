import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { payrollService } from '../api/payrollService';
import { 
  CalendarCheck, BookOpen, Clock, Activity, Coins, AlertCircle, 
  Megaphone, PieChart as PieIcon, BarChart3, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

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

  const attendanceData = useMemo(() => {
    const raw = summary?.attendanceSummary || { present: 0, absent: 0, late: 0, halfDay: 0, onLeave: 0 };
    return [
      { name: 'Present', value: raw.present, color: '#22d3ee' },
      { name: 'Absent', value: raw.absent, color: '#ef4444' },
      { name: 'Late', value: raw.late, color: '#f59e0b' },
      { name: 'Half Day', value: raw.halfDay, color: '#fb923c' },
      { name: 'On Leave', value: raw.onLeave, color: '#a78bfa' },
    ].filter(d => d.value > 0);
  }, [summary]);

  const skillData = useMemo(() => {
    return (summary?.topSkills || []).map(s => ({
      subject: s.name,
      A: s.level,
      fullMark: 5
    }));
  }, [summary]);

  const cards = summary?.cards || {
    attendanceThisMonth: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
    skillsCount: 0,
  };

  const kpiCards = [
    { key: 'attendanceThisMonth', label: 'My Presence', Icon: CalendarCheck, color: '#22d3ee', glow: '200 85 65' },
    { key: 'approvedLeaves', label: 'Approved Off', Icon: Clock, color: '#34d399', glow: '160 75 60' },
    { key: 'pendingLeaves', label: 'Pending Apps', Icon: Activity, color: '#fbbf24', glow: '38 90 65' },
    { key: 'skillsCount', label: 'Endorsements', Icon: BookOpen, color: '#a78bfa', glow: '260 70 75' },
  ];

  return (
    <AppShell userRole="employee">
      <PageHeader
        title="My Dashboard"
        subtitle="Real-time tracking of your performance and status"
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
              colors={[color, color]}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Attendance Pie Chart */}
        <div className="lg:col-span-12 xl:col-span-5">
          <BorderGlow glowColor="200 85 65" colors={['#22d3ee', '#06b6d4']}>
            <div className="p-6 h-[400px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <PieIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Monthly Attendance</h3>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                      formatter={(value) => <span className="text-[11px] text-slate-400">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Skill Radar Chart */}
        <div className="lg:col-span-12 xl:col-span-7">
          <BorderGlow glowColor="260 70 75" colors={['#a78bfa', '#818cf8']}>
            <div className="p-6 h-[400px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">My Skill Insights</h3>
              </div>
              <div className="flex-1 min-h-0">
                {skillData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 italic">No skills endorsed yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                      <Radar
                        name="Skill Level"
                        dataKey="A"
                        stroke="#a78bfa"
                        fill="#a78bfa"
                        fillOpacity={0.5}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 17, 26, 0.9)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices */}
        <BorderGlow glowColor="38 90 65" colors={['#fbbf24', '#f59e0b']}>
          <div className="p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Notice Board</h3>
            </div>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {announcements.length === 0 ? (
                  <div className="text-slate-500 italic text-sm">No new notices for you.</div>
                ) : (
                  announcements.map((ann) => (
                    <motion.div
                      key={ann._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">{ann.title}</h4>
                        <span className="text-[10px] text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{ann.message}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </BorderGlow>

        {/* Payroll Glance */}
        <BorderGlow glowColor="160 75 60" colors={['#34d399', '#10b981']}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <Coins className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Payroll Estimation</h3>
            </div>
            {!payslip ? (
              <div className="flex-1 flex items-center justify-center text-slate-500 italic">Financial data syncing...</div>
            ) : (
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Base Salary</p>
                    <p className="text-xl font-bold text-white">${payslip.baseSalary}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Paid Days</p>
                    <p className="text-xl font-bold text-white">{payslip.effectivePresentDays + payslip.paidLeaveDaysInMonth}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Estimated Take-home</p>
                    <p className="text-[10px] text-slate-500 mt-1">*Excluding dynamic incentives and tax</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-400 tracking-tight">${payslip.finalSalary}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all uppercase tracking-widest text-[11px]">
                    Detailed Breakdown
                  </button>
                </div>
              </div>
            )}
          </div>
        </BorderGlow>
      </div>
    </AppShell>
  );
};

export default EmployeeDashboardPage;
