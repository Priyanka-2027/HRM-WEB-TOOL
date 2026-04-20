import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import { dashboardService } from '../api/dashboardService';
import { announcementService } from '../api/announcementService';
import { payrollService } from '../api/payrollService';
import { CalendarCheck, BookOpen, Clock, Activity, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

const MAX_BAR = 100;

const EmployeeDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [payslip, setPayslip] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await dashboardService.getEmployeeSummary();
        if (result.success) {
          setSummary(result.data);
        }
        
        const annResult = await announcementService.getAnnouncements();
        if (annResult.success) {
          setAnnouncements(annResult.data);
        }

        const date = new Date();
        const payResult = await payrollService.getMyPayslip(date.getFullYear(), date.getMonth() + 1);
        if (payResult.success) {
          setPayslip(payResult.data);
        }
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
            <div className="text-sm text-gray-400">My Attendance</div>
            <CalendarCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-cyan-400">{cards.attendanceThisMonth}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Approved Leaves</div>
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">{cards.approvedLeaves}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">Pending Leaves</div>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-yellow-400">{cards.pendingLeaves}</div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm text-gray-400">My Skills</div>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{cards.skillsCount}</div>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
          <div className="space-y-3">
            {[
              ['present', attendance.present],
              ['absent', attendance.absent],
              ['late', attendance.late],
              ['halfDay', attendance.halfDay],
              ['onLeave', attendance.onLeave],
            ].map(([label, value]) => {
              const width = ((value || 0) / totalAttendance) * MAX_BAR;
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
          <h3 className="text-lg font-semibold mb-4">My Skill Levels</h3>
          {topSkills.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">No skill data yet</div>
          ) : (
            <div className="space-y-3">
              {topSkills.map((skill) => {
                const width = (skill.level / 5) * MAX_BAR;
                return (
                  <div key={skill.name}>
                    <div className="mb-1 flex justify-between text-sm text-gray-300">
                      <span>{skill.name}</span>
                      <span>Level {skill.level}/5</span>
                    </div>
                    <div className="h-2 rounded bg-gray-800">
                      <div className="h-2 rounded bg-green-500" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
      >
        <Card>
          <h3 className="text-lg font-semibold mb-4">Notice Board</h3>
          {announcements.length === 0 ? (
            <div className="text-gray-500">No announcements.</div>
          ) : (
            <div className="space-y-4">
              {announcements.map((ann, idx) => (
                <div key={idx} className="p-3 border border-gray-700/50 rounded-md bg-gray-800/40">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-white">{ann.title}</h4>
                    <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-300">{ann.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Current Payroll Estimate</h3>
          {!payslip ? (
            <div className="text-gray-500">Payroll data not available.</div>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Base Salary</span>
                <span className="font-semibold">${payslip.baseSalary}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Working Days</span>
                <span className="font-semibold">{payslip.effectivePresentDays} / {payslip.totalDaysInMonth}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Paid Leaves</span>
                <span className="font-semibold">{payslip.paidLeaveDaysInMonth}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg text-white">Est. Salary</span>
                <span className="text-2xl font-bold text-green-400">${payslip.finalSalary}</span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AppShell>
  );
};

export default EmployeeDashboardPage;
