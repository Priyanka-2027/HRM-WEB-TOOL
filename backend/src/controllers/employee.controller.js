import Employee from '../models/Employee.js';
import { sendResponse, sendError } from '../utils/response.js';

// Create Employee
export const createEmployee = async (req, res, next) => {
  try {
    const {
      userId,
      designation,
      department,
      email,
      phoneNumber,
      dateOfJoining,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      employmentType,
      salary,
      reportingTo,
    } = req.body;

    // Validate required fields
    if (!userId || !designation || !department || !email || !dateOfJoining) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    // Check if employee already exists with this email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return sendError(res, 400, 'Employee with this email already exists');
    }

    const employee = await Employee.create({
      userId,
      designation,
      department,
      email,
      phoneNumber,
      dateOfJoining,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      employmentType,
      salary,
      reportingTo,
    });

    return sendResponse(res, 201, {
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Get all employees
export const getAllEmployees = async (req, res, next) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter)
      .populate('userId', 'email firstName lastName')
      .populate('reportingTo', 'email designation')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(filter);

    return sendResponse(res, 200, {
      success: true,
      data: employees,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single employee
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .populate('userId', 'email firstName lastName')
      .populate('reportingTo', 'email designation');

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    return sendResponse(res, 200, {
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Update employee
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent email change to already existing email
    if (updates.email) {
      const existing = await Employee.findOne({
        email: updates.email,
        _id: { $ne: id },
      });
      if (existing) {
        return sendError(res, 400, 'Email already in use by another employee');
      }
    }

    const employee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'email firstName lastName')
      .populate('reportingTo', 'email designation');

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Delete employee
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get employee by user ID
export const getEmployeeByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return sendError(res, 403, 'Not authorized to access this employee record');
    }

    const employee = await Employee.findOne({ userId })
      .populate('userId', 'email firstName lastName')
      .populate('reportingTo', 'email designation');

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    return sendResponse(res, 200, {
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Get employee statistics
export const getEmployeeStats = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'active' });
    const inactive = await Employee.countDocuments({ status: 'inactive' });
    const onLeave = await Employee.countDocuments({ status: 'on-leave' });

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return sendResponse(res, 200, {
      success: true,
      data: {
        total,
        active,
        inactive,
        onLeave,
        byDepartment: departmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
