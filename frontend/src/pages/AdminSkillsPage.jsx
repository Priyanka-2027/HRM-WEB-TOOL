import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Badge, Button, Card, Input, Table } from '../components/ui';
import { employeeService } from '../api/employeeService';
import { skillService } from '../api/skillService';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [skillSubmitting, setSkillSubmitting] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const [skillForm, setSkillForm] = useState({ name: '', category: '', description: '' });
  const [assignForm, setAssignForm] = useState({ employeeId: '', skillId: '', proficiencyLevel: 3, yearsOfExperience: 0 });

  const loadData = async () => {
    try {
      setLoading(true);
      const [skillResult, employeeResult] = await Promise.all([
        skillService.getSkills(),
        employeeService.getAllEmployees({ limit: 200 }),
      ]);
      if (skillResult.success) setSkills(skillResult.data || []);
      if (employeeResult.success) setEmployees(employeeResult.data || []);
    } catch (err) {
      setError('Failed to load skills data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createSkill = async (e) => {
    e.preventDefault();
    try {
      setSkillSubmitting(true);
      const result = await skillService.createSkill(skillForm);
      if (result.success) {
        setSkills((prev) => [result.data, ...prev]);
        setSkillForm({ name: '', category: '', description: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create skill');
    } finally {
      setSkillSubmitting(false);
    }
  };

  const assignSkill = async (e) => {
    e.preventDefault();
    try {
      setAssignSubmitting(true);
      const result = await skillService.assignSkill({
        ...assignForm,
        proficiencyLevel: Number(assignForm.proficiencyLevel),
        yearsOfExperience: Number(assignForm.yearsOfExperience),
      });

      if (result.success) {
        setAssignments((prev) => [result.data, ...prev.filter((a) => a._id !== result.data._id)]);
        setAssignForm({ employeeId: '', skillId: '', proficiencyLevel: 3, yearsOfExperience: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign skill');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const loadAssignmentsForEmployee = async (employeeId) => {
    if (!employeeId) return;
    try {
      const result = await skillService.getEmployeeSkills(employeeId);
      if (result.success) {
        setAssignments(result.data || []);
      }
    } catch (err) {
      setError('Failed to load employee skills');
    }
  };

  const skillColumns = [
    { label: 'Skill', key: 'name' },
    { label: 'Category', key: 'category' },
    {
      label: 'Status',
      key: 'isActive',
      render: (value) => <Badge color={value ? 'green' : 'red'}>{value ? 'active' : 'inactive'}</Badge>,
    },
  ];

  const assignmentColumns = [
    { label: 'Skill', render: (_, row) => row.skillId?.name || '-' },
    { label: 'Category', render: (_, row) => row.skillId?.category || '-' },
    { label: 'Level', key: 'proficiencyLevel' },
    { label: 'Experience (yrs)', key: 'yearsOfExperience' },
  ];

  return (
    <AppShell>
      <PageHeader title="Skill Matrix" subtitle="Manage master skills and employee skill assignments" />

      {error && <div className="mb-6 rounded border border-red-600/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>}

      <div className="space-y-6">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Create Skill</h3>
          <form onSubmit={createSkill} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input label="Skill Name" value={skillForm.name} onChange={(e) => setSkillForm((p) => ({ ...p, name: e.target.value }))} required />
            <Input label="Category" value={skillForm.category} onChange={(e) => setSkillForm((p) => ({ ...p, category: e.target.value }))} required />
            <Input label="Description" value={skillForm.description} onChange={(e) => setSkillForm((p) => ({ ...p, description: e.target.value }))} />
            <div className="md:col-span-3">
              <Button type="submit" disabled={skillSubmitting}>
                {skillSubmitting ? 'Adding...' : 'Add Skill'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Assign Skill to Employee</h3>
          <form onSubmit={assignSkill} className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Employee</label>
              <select
                value={assignForm.employeeId}
                onChange={(e) => {
                  const id = e.target.value;
                  setAssignForm((p) => ({ ...p, employeeId: id }));
                  loadAssignmentsForEmployee(id);
                }}
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                required
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Skill</label>
              <select
                value={assignForm.skillId}
                onChange={(e) => setAssignForm((p) => ({ ...p, skillId: e.target.value }))}
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                required
              >
                <option value="">Select skill</option>
                {skills.map((skill) => (
                  <option key={skill._id} value={skill._id}>{skill.name} ({skill.category})</option>
                ))}
              </select>
            </div>

            <Input
              label="Proficiency (1-5)"
              type="number"
              min="1"
              max="5"
              value={assignForm.proficiencyLevel}
              onChange={(e) => setAssignForm((p) => ({ ...p, proficiencyLevel: e.target.value }))}
              required
            />

            <Input
              label="Years of Experience"
              type="number"
              min="0"
              value={assignForm.yearsOfExperience}
              onChange={(e) => setAssignForm((p) => ({ ...p, yearsOfExperience: e.target.value }))}
            />

            <div className="md:col-span-4">
              <Button type="submit" disabled={assignSubmitting}>
                {assignSubmitting ? 'Assigning...' : 'Assign Skill'}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Skill Library</h3>
          {loading ? <div className="py-10 text-center text-gray-400">Loading skills...</div> : skills.length === 0 ? <div className="py-10 text-center text-gray-400">No skills in the library yet.</div> : <Table columns={skillColumns} data={skills} />}
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Employee Skill Assignments</h3>
          {assignments.length === 0 ? <div className="py-10 text-center text-gray-400">Select an employee to view assignments.</div> : <Table columns={assignmentColumns} data={assignments} />}
        </Card>
      </div>
    </AppShell>
  );
};

export default AdminSkillsPage;
