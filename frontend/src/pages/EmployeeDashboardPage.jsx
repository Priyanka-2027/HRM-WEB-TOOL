import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

const EmployeeDashboardPage = () => {
  return (
    <AppShell userRole="employee">
      <PageHeader 
        title="My Dashboard" 
        subtitle="Track your attendance, leaves, and skills"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-sm text-gray-400 mb-1">My Attendance</div>
          <div className="text-3xl font-bold text-cyan-400">22/23</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">Approved Leaves</div>
          <div className="text-3xl font-bold text-green-400">3</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">Pending Leaves</div>
          <div className="text-3xl font-bold text-yellow-400">1</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">My Skills</div>
          <div className="text-3xl font-bold text-white">12</div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Attendance</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - will be implemented in Phase 8
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">My Skill Levels</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - will be implemented in Phase 8
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default EmployeeDashboardPage;
