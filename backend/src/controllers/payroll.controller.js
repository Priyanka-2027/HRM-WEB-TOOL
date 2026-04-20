import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';

// @desc    Get dynamic payslip for an employee for a specific month
// @route   GET /api/v1/payroll/my-slip?year=2026&month=4
// @access  Private
export const getMyPayslip = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ success: false, message: 'Please provide year and month' });
    }

    // Find the current employee profile
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const baseSalary = employee.salary || 0;
    
    // Calculate total days in month
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    
    // Get distinct attendance records for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const attendances = await Attendance.find({
      employeeId: employee._id,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['present', 'half-day'] }
    });

    const presentDays = attendances.filter(a => a.status === 'present').length;
    const halfDays = attendances.filter(a => a.status === 'half-day').length;
    const effectivePresentDays = presentDays + (halfDays * 0.5);

    // Paid leaves in the month
    const paidLeaves = await Leave.find({
      employeeId: employee._id,
      status: 'approved',
      leaveType: { $in: ['sick', 'earned', 'casual'] }, // assuming these are paid
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    // Approximate paid leave days strictly within this month
    let paidLeaveDaysInMonth = 0;
    paidLeaves.forEach(leave => {
      let current = new Date(leave.startDate);
      if (current < startDate) current = new Date(startDate);
      let end = new Date(leave.endDate);
      if (end > endDate) end = new Date(endDate);
      
      while (current <= end) {
        paidLeaveDaysInMonth += 1;
        current.setDate(current.getDate() + 1);
      }
    });

    const totalPayableDays = effectivePresentDays + paidLeaveDaysInMonth;
    const finalSalary = (baseSalary / totalDaysInMonth) * totalPayableDays;

    res.status(200).json({
      success: true,
      data: {
        baseSalary,
        totalDaysInMonth,
        effectivePresentDays,
        paidLeaveDaysInMonth,
        totalPayableDays,
        finalSalary: Math.round(finalSalary),
        month: parseInt(month),
        year: parseInt(year)
      }
    });

  } catch (error) {
    next(error);
  }
};
