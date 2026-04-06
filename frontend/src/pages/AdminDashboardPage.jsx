import AppShell from '../components/layout/AppShell';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';

const AdminDashboardPage = () => {
  return (
    <AppShell userRole="admin">
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="Welcome back to your admin dashboard"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-sm text-gray-400 mb-1">Total Employees</div>
          <div className="text-3xl font-bold text-white">124</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">Present Today</div>
          <div className="text-3xl font-bold text-cyan-400">98</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">Pending Leaves</div>
          <div className="text-3xl font-bold text-yellow-400">12</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-400 mb-1">Top Skills</div>
          <div className="text-3xl font-bold text-white">45</div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - will be implemented in Phase 8
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Leave Status</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - will be implemented in Phase 8
          </div>
        </Card>
      </div>
    </AppShell>
  );
};

export default AdminDashboardPage;
