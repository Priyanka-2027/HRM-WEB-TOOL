import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Button, Input, Card } from '../components/ui';
import { employeeService } from '../api/employeeService';
import { authService } from '../api/authService';

const EmployeeFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    userId: '',
    designation: '',
    department: '',
    email: '',
    phoneNumber: '',
    dateOfJoining: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentType: 'full-time',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Fetch employee if editing
  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const result = await employeeService.getEmployee(id);
      if (result.success) {
        const emp = result.data;
        setFormData({
          firstName: emp.userId?.firstName || '',
          lastName: emp.userId?.lastName || '',
          password: '',
          userId: emp.userId?._id || '',
          designation: emp.designation || '',
          department: emp.department || '',
          email: emp.email || '',
          phoneNumber: emp.phoneNumber || '',
          dateOfJoining: emp.dateOfJoining?.split('T')[0] || '',
          dateOfBirth: emp.dateOfBirth?.split('T')[0] || '',
          address: emp.address || '',
          city: emp.city || '',
          state: emp.state || '',
          zipCode: emp.zipCode || '',
          employmentType: emp.employmentType || 'full-time',
          salary: emp.salary || '',
        });
      }
    } catch (err) {
      setServerError('Failed to load employee');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
    if (!isEdit && !formData.firstName) newErrors.firstName = 'First name is required';
    if (!isEdit && !formData.lastName) newErrors.lastName = 'Last name is required';
    if (!isEdit && !formData.password) newErrors.password = 'Password is required';
    if (!isEdit && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError('');

      let result;

      if (isEdit) {
        const submitData = {
          designation: formData.designation,
          department: formData.department,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfJoining: formData.dateOfJoining,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          employmentType: formData.employmentType,
          salary: formData.salary,
        };
        result = await employeeService.updateEmployee(id, submitData);
      } else {
        const registerResult = await authService.register({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          role: 'employee',
        });

        if (!registerResult.success) {
          setServerError(registerResult.message || 'Failed to create user account');
          setLoading(false);
          return;
        }

        const submitData = {
          userId: registerResult.data.user._id,
          designation: formData.designation,
          department: formData.department,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfJoining: formData.dateOfJoining,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          employmentType: formData.employmentType,
          salary: formData.salary,
        };
        result = await employeeService.createEmployee(submitData);
      }

      if (result.success) {
        navigate('/admin/employees');
      } else {
        setServerError(result.message || 'Failed to save employee');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
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

  return (
    <AppShell>
      <PageHeader
        title={isEdit ? 'Edit Employee' : 'Add Employee'}
        subtitle={isEdit ? 'Update employee information' : 'Create new employee record'}
      />

      <Card className="max-w-2xl">
        {serverError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-600/50 rounded text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEdit && (
              <>
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="e.g., John"
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="e.g., Doe"
                  required
                />

                <Input
                  label="Initial Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Minimum 6 characters"
                  required
                />
              </>
            )}

            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
              placeholder="e.g., Senior Developer"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-800 border rounded text-white text-sm focus:outline-none focus:border-cyan-500 ${
                  errors.department ? 'border-red-600' : 'border-gray-700'
                }`}
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              {errors.department && (
                <p className="text-red-400 text-xs mt-1">{errors.department}</p>
              )}
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="employee@company.com"
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1234567890"
            />

            <Input
              label="Date of Joining"
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              error={errors.dateOfJoining}
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />

            <Input
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="12345"
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <Input
              label="Salary"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Annual salary"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/employees')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
};

export default EmployeeFormPage;
