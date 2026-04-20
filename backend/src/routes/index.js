import { Router } from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/auth.controller.js';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeByUserId,
  getEmployeeStats,
} from '../controllers/employee.controller.js';
import {
  markAttendance,
  getAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getEmployeeAttendanceSummary,
  getOrganizationAttendanceSummary,
  getTodayAttendance,
} from '../controllers/attendance.controller.js';
import {
  requestLeave,
  getLeaves,
  getLeaveById,
  reviewLeave,
  deleteLeave,
} from '../controllers/leave.controller.js';
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  assignSkillToEmployee,
  updateEmployeeSkill,
  getEmployeeSkills,
  getMySkills,
  deleteEmployeeSkill,
} from '../controllers/skill.controller.js';
import {
  getAdminDashboardSummary,
  getEmployeeDashboardSummary,
} from '../controllers/dashboard.controller.js';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller.js';
import { getMyPayslip } from '../controllers/payroll.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Hironix API is running',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getCurrentUser);
router.post('/auth/logout', protect, logout);

// Employee routes - All require auth, create/update/delete require admin
router.get('/employees/stats', protect, authorize('admin'), getEmployeeStats);
router.post('/employees', protect, authorize('admin'), createEmployee);
router.get('/employees', protect, authorize('admin'), getAllEmployees);
router.get('/employees/:id', protect, authorize('admin'), getEmployeeById);
router.put('/employees/:id', protect, authorize('admin'), updateEmployee);
router.delete('/employees/:id', protect, authorize('admin'), deleteEmployee);
router.get('/employees/user/:userId', protect, getEmployeeByUserId);

// Attendance routes
router.post('/attendance', protect, authorize('admin'), markAttendance);
router.get('/attendance', protect, getAttendance);
router.get('/attendance/today', protect, authorize('admin'), getTodayAttendance);
router.get('/attendance/summary/employee', protect, getEmployeeAttendanceSummary);
router.get('/attendance/summary/organization', protect, authorize('admin'), getOrganizationAttendanceSummary);
router.get('/attendance/:id', protect, getAttendanceById);
router.put('/attendance/:id', protect, authorize('admin'), updateAttendance);
router.delete('/attendance/:id', protect, authorize('admin'), deleteAttendance);

// Leave routes
router.post('/leaves', protect, requestLeave);
router.get('/leaves', protect, getLeaves);
router.get('/leaves/:id', protect, getLeaveById);
router.patch('/leaves/:id/status', protect, authorize('admin'), reviewLeave);
router.delete('/leaves/:id', protect, deleteLeave);

// Skill routes (master)
router.post('/skills', protect, authorize('admin'), createSkill);
router.get('/skills', protect, getSkills);
router.put('/skills/:id', protect, authorize('admin'), updateSkill);
router.delete('/skills/:id', protect, authorize('admin'), deleteSkill);

// Employee skill assignment routes
router.post('/skills/assign', protect, authorize('admin'), assignSkillToEmployee);
router.put('/skills/assign/:id', protect, authorize('admin'), updateEmployeeSkill);
router.delete('/skills/assign/:id', protect, authorize('admin'), deleteEmployeeSkill);
router.get('/skills/employee/:employeeId', protect, getEmployeeSkills);
router.get('/skills/my', protect, getMySkills);

// Dashboard routes
router.get('/dashboard/admin-summary', protect, authorize('admin'), getAdminDashboardSummary);
router.get('/dashboard/employee-summary', protect, getEmployeeDashboardSummary);

// Announcement routes
router.get('/announcements', protect, getAnnouncements);
router.post('/announcements', protect, authorize('admin'), createAnnouncement);
router.put('/announcements/:id', protect, authorize('admin'), updateAnnouncement);
router.delete('/announcements/:id', protect, authorize('admin'), deleteAnnouncement);

// Payroll routes
router.get('/payroll/my-slip', protect, getMyPayslip);

export default router;
