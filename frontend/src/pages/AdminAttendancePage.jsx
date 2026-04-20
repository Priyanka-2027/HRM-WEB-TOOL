import { useState, useEffect } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Button, Input, Table, Badge, Card } from '../components/ui';
import { attendanceService } from '../api/attendanceService';
import { employeeService } from '../api/employeeService';

const AdminAttendancePage = () => {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' or 'view'
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for marking attendance
  const [markForm, setMarkForm] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkInTime: '',
    checkOutTime: '',
    notes: '',
  });

  // Filter state for viewing
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
  });

  // Load employees for dropdown
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const result = await employeeService.getAllEmployees({ limit: 100 });
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: 10,
      };
      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const result = await attendanceService.getAttendance(params);
      if (result.success) {
        setAttendance(result.data);
        setError('');
      }
    } catch (err) {
      setError('Error fetching attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle mark attendance submit
  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!markForm.employeeId) {
      setError('Please select an employee');
      return;
    }

    try {
      setLoading(true);
      const result = await attendanceService.markAttendance(markForm);
      if (result.success) {
        setError('');
        setMarkForm({
          employeeId: '',
          date: new Date().toISOString().split('T')[0],
          status: 'present',
          checkInTime: '',
          checkOutTime: '',
          notes: '',
        });
        // Refresh attendance list
        fetchAttendance();
        alert('Attendance marked successfully');
      } else {
        setError(result.message || 'Error marking attendance');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'userId.firstName',
      label: 'Employee',
      render: (_, row) =>
        `${row.userId?.firstName} ${row.userId?.lastName}`,
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString();
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
  ];

  return (
    <AppShell>
      <PageHeader
        title="Attendance Management"
        subtitle="Mark and track employee attendance"
      />

      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('mark')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'mark'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'view'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            View Records
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Mark Attendance Tab */}
        {activeTab === 'mark' && (
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6">
              Mark Attendance
            </h3>
            <form onSubmit={handleMarkSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Employee *
                  </label>
                  <select
                    value={markForm.employeeId}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        employeeId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.email} - {emp.designation}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Date"
                  type="date"
                  value={markForm.date}
                  onChange={(e) =>
                    setMarkForm({ ...markForm, date: e.target.value })
                  }
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    value={markForm.status}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <Input
                  label="Check In Time"
                  type="time"
                  value={markForm.checkInTime}
                  onChange={(e) =>
                    setMarkForm({
                      ...markForm,
                      checkInTime: e.target.value,
                    })
                  }
                />

                <Input
                  label="Check Out Time"
                  type="time"
                  value={markForm.checkOutTime}
                  onChange={(e) =>
                    setMarkForm({
                      ...markForm,
                      checkOutTime: e.target.value,
                    })
                  }
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={markForm.notes}
                    onChange={(e) =>
                      setMarkForm({
                        ...markForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add any notes..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                    rows="3"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Marking...' : 'Mark Attendance'}
              </Button>
            </form>
          </Card>
        )}

        {/* View Records Tab */}
        {activeTab === 'view' && (
          <>
            {/* Filters */}
            <Card>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value,
                          page: 1,
                        })
                      }
                      onBlur={fetchAttendance}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">All Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="half-day">Half Day</option>
                      <option value="on-leave">On Leave</option>
                    </select>
                  </div>

                  <Input
                    label="Start Date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        startDate: e.target.value,
                      })
                    }
                    onBlur={fetchAttendance}
                  />

                  <Input
                    label="End Date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        endDate: e.target.value,
                      })
                    }
                    onBlur={fetchAttendance}
                  />
                </div>
              </div>
            </Card>

            {/* Attendance Table */}
            <Card>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                  <p className="mt-4 text-gray-400">Loading records...</p>
                </div>
              ) : attendance.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No attendance records found</p>
                </div>
              ) : (
                <Table columns={columns} data={attendance} />
              )}
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default AdminAttendancePage;
