import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

const App = () => {
  return (
    <Router>
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
