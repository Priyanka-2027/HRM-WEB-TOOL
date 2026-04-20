import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Badge, Button, Card, Input, Table } from '../components/ui';
import { leaveService } from '../api/leaveService';
import { employeeService } from '../api/employeeService';
import { useAuth } from '../contexts/AuthContext';

const EmployeeLeavePage = () => {
  const { user } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState('');
  const [form, setForm] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const loadEmployee = async () => {
    const result = await employeeService.getEmployeeByUserId(user?._id);
    if (result.success) {
      setEmployeeId(result.data._id);
      return result.data._id;
    }
    return '';
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const result = await leaveService.getLeaves({ limit: 100 });
      if (result.success) {
        setLeaves(result.data || []);
      }
    } catch (err) {
      setError('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const id = await loadEmployee();
        if (!id) {
          setError('Employee record not found');
        }
        await fetchLeaves();
      } catch (err) {
        setError('Failed to initialize leave page');
      }
    })();
  }, []);

  const submitLeave = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setError('Employee record not found');
      return;
    }

    try {
      setSubmitting(true);
      const result = await leaveService.requestLeave({ ...form, employeeId });
      if (result.success) {
        setForm({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
        setLeaves((prev) => [result.data, ...prev]);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelLeave = async (id) => {
    try {
      const proceed = window.confirm('Cancel this pending leave request?');
      if (!proceed) return;

      setCancellingId(id);
      const result = await leaveService.deleteLeave(id);
      if (result.success) {
        setLeaves((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setError('Failed to cancel leave request');
    } finally {
      setCancellingId('');
    }
  };

  const columns = [
    {
      label: 'Type',
      key: 'leaveType',
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      label: 'Period',
      render: (_, row) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,
    },
    {
      label: 'Days',
      key: 'daysCount',
    },
    {
      label: 'Status',
      key: 'status',
      render: (value) => (
        <Badge color={value === 'approved' ? 'green' : value === 'rejected' ? 'red' : value === 'pending' ? 'yellow' : 'gray'}>
          {value}
        </Badge>
      ),
    },
    {
      label: 'Action',
      render: (_, row) => (
        <Button size="sm" variant="danger" disabled={row.status !== 'pending'} onClick={() => cancelLeave(row._id)}>
          Cancel
        </Button>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="My Leaves" subtitle="Submit and track your leave requests" />

      {error && <div className="mb-6 rounded border border-red-600/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-400">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-400">{leaves.filter((leave) => leave.status === 'pending').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Approved</p>
          <p className="text-3xl font-bold text-green-400">{leaves.filter((leave) => leave.status === 'approved').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Total Requests</p>
          <p className="text-3xl font-bold text-white">{leaves.length}</p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Request Leave</h3>
          <form onSubmit={submitLeave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Leave Type</label>
              <select
                value={form.leaveType}
                onChange={(e) => setForm((prev) => ({ ...prev, leaveType: e.target.value }))}
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
              >
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="earned">Earned</option>
                <option value="unpaid">Unpaid</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              required
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                rows="3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          {loading ? (
            <div className="py-10 text-center text-gray-400">Loading leave history...</div>
          ) : leaves.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No leave requests yet. Submit your first request above.</div>
          ) : (
            <Table columns={columns} data={leaves} />
          )}
        </Card>
      </div>
    </AppShell>
  );
};

export default EmployeeLeavePage;
