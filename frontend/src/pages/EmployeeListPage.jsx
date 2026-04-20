import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Button, Input, Table, Badge, Card } from '../components/ui';
import { employeeService } from '../api/employeeService';

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, [search, department, status, page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getAllEmployees({
        search,
        department: department || undefined,
        status: status || undefined,
        page,
        limit: 10,
      });

      if (result.success) {
        setEmployees(result.data);
        setPagination(result.pagination);
        setError('');
      } else {
        setError(result.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Error fetching employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await employeeService.deleteEmployee(id);
        if (result.success) {
          setEmployees(employees.filter(emp => emp._id !== id));
        }
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (value) => <span className="text-sm font-medium">{value}</span>,
    },
    {
      key: 'department',
      label: 'Department',
      render: (value) => <span className="text-sm">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          color={
            value === 'active'
              ? 'green'
              : value === 'inactive'
              ? 'red'
              : 'yellow'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/admin/employees/${row._id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/admin/employees/${row._id}/edit`)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell>
      <PageHeader title="Employees" subtitle="Manage employee records">
        <Button onClick={() => navigate('/admin/employees/new')}>
          + Add Employee
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search"
                placeholder="Email or designation..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Employee Table */}
        <Card>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <p className="mt-4 text-gray-400">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No employees found</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/admin/employees/new')}
              >
                Add First Employee
              </Button>
            </div>
          ) : (
            <>
              <Table columns={columns} data={employees} />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <Button
                    variant="secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-gray-400 text-sm flex items-center px-4">
                    Page {page} of {pagination.pages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={page === pagination.pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </AppShell>
  );
};

export default EmployeeListPage;
