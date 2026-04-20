import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Button, Card, Badge } from '../components/ui';
import { employeeService } from '../api/employeeService';

const EmployeeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getEmployee(id);
      if (result.success) {
        setEmployee(result.data);
      } else {
        setError(result.message || 'Failed to fetch employee');
      }
    } catch (err) {
      setError('Error fetching employee');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const result = await employeeService.deleteEmployee(id);
        if (result.success) {
          navigate('/admin/employees');
        }
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!employee) {
    return (
      <AppShell>
        <PageHeader title="Employee Not Found" />
        <Card>
          <p className="text-gray-400 text-center py-8">
            The employee you're looking for doesn't exist.
          </p>
          <div className="text-center">
            <Button onClick={() => navigate('/admin/employees')}>
              Back to Employees
            </Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title={`${employee.userId?.firstName} ${employee.userId?.lastName}`}
        subtitle={employee.designation}
      >
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/admin/employees/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </PageHeader>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Number</p>
                <p className="text-white font-medium">
                  {employee.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date of Birth</p>
                <p className="text-white font-medium">
                  {employee.dateOfBirth
                    ? formatDate(employee.dateOfBirth)
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Address</p>
                <p className="text-white font-medium">
                  {employee.address || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">City</p>
                <p className="text-white font-medium">{employee.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">State</p>
                <p className="text-white font-medium">
                  {employee.state || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Zip Code</p>
                <p className="text-white font-medium">
                  {employee.zipCode || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400">Designation</p>
                <p className="text-white font-medium">{employee.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Department</p>
                <p className="text-white font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Employment Type</p>
                <p className="text-white font-medium capitalize">
                  {employee.employmentType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date of Joining</p>
                <p className="text-white font-medium">
                  {formatDate(employee.dateOfJoining)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Salary</p>
                <p className="text-white font-medium">
                  ${employee.salary ? employee.salary.toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <Badge
                  color={
                    employee.status === 'active'
                      ? 'green'
                      : employee.status === 'inactive'
                      ? 'red'
                      : 'yellow'
                  }
                >
                  {employee.status}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => navigate(`/admin/employees/${id}/edit`)}
              >
                Edit Details
              </Button>
              <Button variant="secondary" className="w-full">
                View Attendance
              </Button>
              <Button variant="secondary" className="w-full">
                View Leave Requests
              </Button>
              <Button variant="secondary" className="w-full">
                Assign Skills
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Additional Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Created</p>
                <p className="text-gray-300">
                  {formatDate(employee.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <p className="text-gray-300">
                  {formatDate(employee.updatedAt)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Employee ID</p>
                <p className="text-gray-300 font-mono text-xs break-all">
                  {employee._id}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default EmployeeDetailPage;
