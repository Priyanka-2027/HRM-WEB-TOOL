import { useState, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Table, Badge, Card } from '../components/ui';
import { attendanceService } from '../api/attendanceService';
import { employeeService } from '../api/employeeService';
import { useAuth } from '../contexts/AuthContext';

const EmployeeAttendancePage = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current month and year
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      // Fetch employee ID first
      const empResult = await employeeService.getEmployeeByUserId(user?._id);
      if (!empResult.success) {
        setError('Employee record not found');
        setLoading(false);
        return;
      }

      const employeeId = empResult.data._id;

      // Fetch employee attendance records
      const result = await attendanceService.getAttendance({
        employeeId,
        page: 1,
        limit: 100,
      });

      if (result.success) {
        setAttendance(result.data);
        setError('');
      }

      // Fetch summary
      const summaryResult = await attendanceService.getEmployeeAttendanceSummary(
        employeeId,
        year,
        month
      );
      if (summaryResult.success) {
        setSummary(summaryResult.data.summary);
      }
    } catch (err) {
      setError('Error fetching attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          color={
            value === 'present'
              ? 'green'
              : value === 'absent'
              ? 'red'
              : value === 'late'
              ? 'yellow'
              : value === 'half-day'
              ? 'blue'
              : 'purple'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'checkInTime',
      label: 'Check In',
      render: (value) => value || '-',
    },
    {
      key: 'checkOutTime',
      label: 'Check Out',
      render: (value) => value || '-',
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value) => (
        <span className="text-xs text-gray-400">{value || '-'}</span>
      ),
    },
  ];

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <AppShell>
      <PageHeader
        title="My Attendance"
        subtitle="View your attendance history and summary"
      />

      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Days</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {summary.totalDays}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Present</p>
                <p className="text-2xl font-bold text-green-400">
                  {summary.present}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Absent</p>
                <p className="text-2xl font-bold text-red-400">
                  {summary.absent}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Late</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {summary.late}
                </p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Half Day</p>
                <p className="text-2xl font-bold text-blue-400">
                  {summary.halfDay}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Month/Year Selector */}
        <Card>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Attendance Table */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <p className="mt-4 text-gray-400">Loading attendance...</p>
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No attendance records found</p>
            </div>
          ) : (
            <Table columns={columns} data={attendance} />
          )}
        </Card>
      </div>
    </AppShell>
  );
};

export default EmployeeAttendancePage;
