import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Badge, Button, Card, Table } from '../components/ui';
import { leaveService } from '../api/leaveService';

const AdminLeavePage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;

      const result = await leaveService.getLeaves(params);
      if (result.success) {
        setLeaves(result.data || []);
        setError('');
      }
    } catch (err) {
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      const proceed = window.confirm(
        status === 'approved'
          ? 'Approve this leave request?'
          : 'Reject this leave request?'
      );
      if (!proceed) return;

      setActionLoadingId(id);
      const result = await leaveService.reviewLeave(id, { status });
      if (result.success) {
        setLeaves((prev) => prev.map((item) => (item._id === id ? result.data : item)));
      }
    } catch (err) {
      setError('Failed to update leave status');
    } finally {
      setActionLoadingId('');
    }
  };

  const columns = [
    {
      label: 'Employee',
      render: (_, row) => `${row.userId?.firstName || ''} ${row.userId?.lastName || ''}`.trim(),
    },
    {
      label: 'Type',
      key: 'leaveType',
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      label: 'Dates',
      render: (_, row) => (
        <span>
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
        </span>
      ),
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
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => updateStatus(row._id, 'approved')} disabled={row.status !== 'pending'}>
            Approve
          </Button>
          <Button size="sm" variant="danger" onClick={() => updateStatus(row._id, 'rejected')} disabled={row.status !== 'pending'}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Leave Management"
        subtitle="Review and manage employee leave requests"
        actions={[
          { label: 'All', onClick: () => setStatusFilter(''), variant: statusFilter === '' ? 'primary' : 'secondary' },
          { label: 'Pending', onClick: () => setStatusFilter('pending'), variant: statusFilter === 'pending' ? 'primary' : 'secondary' },
          { label: 'Approved', onClick: () => setStatusFilter('approved'), variant: statusFilter === 'approved' ? 'primary' : 'secondary' },
        ]}
      />

      {error && <div className="mb-6 rounded border border-red-600/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-400">Visible Requests</p>
          <p className="text-3xl font-bold text-white">{leaves.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">{leaves.filter((leave) => leave.status === 'pending').length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Reviewed</p>
          <p className="text-3xl font-bold text-cyan-400">{leaves.filter((leave) => leave.status !== 'pending').length}</p>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading leave requests...</div>
        ) : leaves.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No leave requests match the current filter.
          </div>
        ) : (
          <Table columns={columns} data={leaves} />
        )}
      </Card>
    </AppShell>
  );
};

export default AdminLeavePage;
