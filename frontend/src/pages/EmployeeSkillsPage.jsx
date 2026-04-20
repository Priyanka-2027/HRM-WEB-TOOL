import { useEffect, useState } from 'react';
import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import { Badge, Card, Table } from '../components/ui';
import { skillService } from '../api/skillService';

const EmployeeSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const stats = {
    total: skills.length,
    expert: skills.filter((skill) => skill.proficiencyLevel >= 4).length,
    beginner: skills.filter((skill) => skill.proficiencyLevel <= 2).length,
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await skillService.getMySkills();
        if (result.success) {
          setSkills(result.data || []);
        }
      } catch (err) {
        setError('Failed to load your skills');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    { label: 'Skill', render: (_, row) => row.skillId?.name || '-' },
    { label: 'Category', render: (_, row) => row.skillId?.category || '-' },
    {
      label: 'Level',
      key: 'proficiencyLevel',
      render: (value) => <Badge color={value >= 4 ? 'green' : value === 3 ? 'yellow' : 'blue'}>Level {value}</Badge>,
    },
    { label: 'Experience (yrs)', key: 'yearsOfExperience' },
  ];

  return (
    <AppShell>
      <PageHeader title="My Skills" subtitle="Track your current proficiency profile" />

      {error && <div className="mb-6 rounded border border-red-600/50 bg-red-900/20 p-4 text-sm text-red-400">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-400">Total Skills</p>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Expert Level</p>
          <p className="text-3xl font-bold text-green-400">{stats.expert}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">Beginner Level</p>
          <p className="text-3xl font-bold text-yellow-400">{stats.beginner}</p>
        </Card>
      </div>

      <Card>
        {loading ? (
          <div className="py-10 text-center text-gray-400">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No skills have been assigned yet.</div>
        ) : (
          <Table columns={columns} data={skills} />
        )}
      </Card>
    </AppShell>
  );
};

export default EmployeeSkillsPage;
