import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import AdminAttendancePage from './pages/AdminAttendancePage';
import EmployeeAttendancePage from './pages/EmployeeAttendancePage';
import AdminLeavePage from './pages/AdminLeavePage';
import EmployeeLeavePage from './pages/EmployeeLeavePage';
import AdminSkillsPage from './pages/AdminSkillsPage';
import EmployeeSkillsPage from './pages/EmployeeSkillsPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import ManagerTasksPage from './pages/ManagerTasksPage';
import ManagerTeamPage from './pages/ManagerTeamPage';
import EmployeeTasksPage from './pages/EmployeeTasksPage';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees/new"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees/:id/edit"
            element={
              <ProtectedRoute requiredRole="admin">
                <EmployeeFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLeavePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSkillsPage />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/tasks"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/team"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerTeamPage />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/leaves"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLeavePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/skills"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeSkillsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeTasksPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </Router>

  );
};

export default App;
