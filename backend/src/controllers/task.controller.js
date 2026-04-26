import Task from '../models/Task.js';
import Employee from '../models/Employee.js';
import { sendResponse, sendError } from '../utils/response.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    
    if (!title || !assignedTo || !dueDate) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    const manager = await Employee.findOne({ userId: req.user.id });
    if (!manager) {
      return sendError(res, 404, 'Manager employee record not found');
    }

    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    if (employee.reportingTo?.toString() !== manager._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'You can only assign tasks to employees who report to you');
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      dueDate,
    });

    await task.populate('assignedTo', 'email designation department');
    await task.populate('assignedBy', 'firstName lastName');

    return sendResponse(res, 201, {
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getManagerTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.id })
      .populate('assignedTo', 'email designation department')
      .populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, {
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeTasks = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return sendError(res, 404, 'Employee record not found');
    }

    const tasks = await Task.find({ assignedTo: employee._id })
      .populate('assignedTo', 'email designation department')
      .populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, {
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return sendError(res, 400, 'Invalid status');
    }

    const task = await Task.findById(id);
    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    // Determine authorization: Admin, the assigned manager, or the assigned employee
    const isEmployee = await Employee.findOne({ userId: req.user.id, _id: task.assignedTo });
    const isManager = task.assignedBy.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isEmployee && !isManager && !isAdmin) {
      return sendError(res, 403, 'Not authorized to update this task');
    }

    task.status = status;
    await task.save();

    await task.populate('assignedTo', 'email designation department');
    await task.populate('assignedBy', 'firstName lastName');

    return sendResponse(res, 200, {
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return sendError(res, 404, 'Task not found');
    }

    const isManager = task.assignedBy.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isManager && !isAdmin) {
      return sendError(res, 403, 'Not authorized to delete this task');
    }

    await task.deleteOne();

    return sendResponse(res, 200, {
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
