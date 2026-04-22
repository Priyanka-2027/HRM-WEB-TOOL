import { useEffect, useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import BorderGlow from '../components/ui/BorderGlow';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { payrollService } from '../api/payrollService';
import {
  CalendarCheck, BookOpen, Clock, Activity, Coins, AlertCircle,
  Megaphone, TrendingUp, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
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

// Custom filled radar dot
const CustomRadarDot = (props) => {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill="#a78bfa" stroke="rgba(167,139,250,0.3)" strokeWidth={4} />;
};

const EmployeeDashboardPage = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);

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
        // 404 means no employee profile yet
        if (err?.response?.status === 404) {
          setError('No employee profile linked to your account. Please contact your admin to create a profile.');
        } else {
          setError('Failed to load some dashboard insights. Please try again later.');
        }
      }
    })();
  }, []);

  const attendanceData = useMemo(() => {
    const raw = summary?.attendanceSummary || { present: 0, absent: 0, late: 0, halfDay: 0, onLeave: 0 };
    return [
      { name: 'Present',  value: raw.present,  fill: '#22d3ee' },
      { name: 'Absent',   value: raw.absent,   fill: '#ef4444' },
      { name: 'Late',     value: raw.late,     fill: '#f59e0b' },
      { name: 'Half Day', value: raw.halfDay,  fill: '#fb923c' },
      { name: 'On Leave', value: raw.onLeave,  fill: '#a78bfa' },
    ].filter(d => d.value > 0);
  }, [summary]);

  const skillData = useMemo(() => (
    (summary?.topSkills || []).map(s => ({ subject: s.name, A: s.level, fullMark: 5 }))
  ), [summary]);

  const cards = summary?.cards || { attendanceThisMonth: 0, approvedLeaves: 0, pendingLeaves: 0, skillsCount: 0 };

  const kpiCards = [
    { key: 'attendanceThisMonth', label: 'Days Present',    Icon: CalendarCheck, color: '#22d3ee', sub: 'This month'       },
    { key: 'approvedLeaves',      label: 'Approved Leaves', Icon: Clock,          color: '#34d399', sub: 'Leaves cleared'  },
    { key: 'pendingLeaves',       label: 'Pending Apps',    Icon: Activity,       color: '#fbbf24', sub: 'Awaiting review' },
    { key: 'skillsCount',         label: 'Skills',          Icon: BookOpen,       color: '#a78bfa', sub: 'On your profile' },
  ];

  const totalAttendance = attendanceData.reduce((s, d) => s + d.value, 0);

  return (
    <AppShell userRole="employee">
      <PageHeader title="My Dashboard" subtitle="Your personal performance and metrics hub" />

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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Attendance Donut with center overlay */}
        <div className="lg:col-span-5">
          <BorderGlow borderRadius={28}>
            <div className="p-6 h-[380px] flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <CalendarCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Monthly Attendance</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Your attendance distribution</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 relative">
                {attendanceData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">No attendance data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={attendanceData} cx="50%" cy="46%" innerRadius={58} outerRadius={84}
                        paddingAngle={5} dataKey="value" strokeWidth={0}>
                        {attendanceData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip content={<GlassTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* Center stat */}
                {attendanceData.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '10%' }}>
                    <div className="text-center">
                      <p className="text-2xl font-black text-white leading-none">{totalAttendance}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Total Days</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
                {attendanceData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    <span className="text-[10px] text-slate-500">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </BorderGlow>
        </div>

        {/* Skills Radar */}
        <div className="lg:col-span-7">
          <BorderGlow borderRadius={28}>
            <div className="p-6 h-[380px] flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <TrendingUp className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Skill Competency Map</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Proficiency across endorsed skills</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                {skillData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">No skills endorsed yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.38)', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 9 }} />
                      <Radar name="Skill Level" dataKey="A"
                        stroke="#a78bfa" strokeWidth={2}
                        fill="#a78bfa" fillOpacity={0.25}
                        dot={<CustomRadarDot />}
                      />
                      <Tooltip content={<GlassTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </BorderGlow>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Notice Board */}
        <BorderGlow borderRadius={28}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Megaphone className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Company Notices</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Latest from your team</p>
              </div>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <AnimatePresence>
                {announcements.length === 0 ? (
                  <div className="py-10 text-center text-slate-600 italic text-sm">No new notices</div>
                ) : announcements.map(ann => (
                  <motion.div key={ann._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="group p-4 rounded-xl bg-white/4 border border-white/5 hover:border-amber-500/20 transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{ann.title}</h4>
                      <span className="text-[10px] text-slate-600 shrink-0 ml-2">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ann.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </BorderGlow>

        {/* Payroll Card */}
        <BorderGlow borderRadius={28}>
          <div className="p-6 flex flex-col" style={{ minHeight: 300 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Payroll Estimation</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">This month's projected take-home</p>
              </div>
            </div>

            {!payslip ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Coins className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-600 text-sm italic">Financial data syncing…</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Base Salary', value: `$${payslip.baseSalary}`                                               },
                    { label: 'Paid Days',   value: payslip.effectivePresentDays + payslip.paidLeaveDaysInMonth            },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                      <p className="text-lg font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-5 rounded-2xl border flex items-center justify-between" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.2)' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Estimated Take-home</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">Before tax &amp; deductions</p>
                  </div>
                  <p className="text-3xl font-black text-emerald-400 tracking-tight">${payslip.finalSalary}</p>
                </div>

                <button 
                  onClick={() => setShowBreakdown(true)}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/8 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                  Full Breakdown
                </button>
              </div>
            )}
          </div>
        </BorderGlow>
      </div>

      {/* Breakdown Modal */}
      <AnimatePresence>
        {showBreakdown && payslip && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setShowBreakdown(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}>
              <BorderGlow borderRadius={32}>
                <div className="w-[360px] bg-[#0d1020] p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Salary Breakdown</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Payout Computation</p>
                    </div>
                    <button onClick={() => setShowBreakdown(false)} className="text-slate-500 hover:text-white transition-colors">
                      <AlertCircle className="w-5 h-5 rotate-45" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Earnings Formula</p>
                      <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <span>(${payslip.baseSalary} / {payslip.totalDaysInMonth})</span>
                        <span className="text-slate-600">×</span>
                        <span className="text-emerald-400">{payslip.totalPayableDays} days</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1">Working Days</p>
                        <p className="text-sm font-black text-white">{payslip.effectivePresentDays}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1">Paid Leaves</p>
                        <p className="text-sm font-black text-white">{payslip.paidLeaveDaysInMonth}</p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gross Total</span>
                      <span className="text-2xl font-black text-white tabular-nums">${payslip.finalSalary}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-orange-200/60 leading-relaxed uppercase font-bold tracking-tighter">
                        This is an estimate based on current attendance records. Final payout may vary after tax deductions.
                      </p>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
};

export default EmployeeDashboardPage;

