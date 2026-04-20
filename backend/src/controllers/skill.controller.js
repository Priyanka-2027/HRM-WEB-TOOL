import EmployeeSkill from '../models/EmployeeSkill.js';
import Employee from '../models/Employee.js';
import Skill from '../models/Skill.js';
import { sendError, sendResponse } from '../utils/response.js';

export const createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return sendError(res, 400, 'Please provide name and category');
    }

    const existing = await Skill.findOne({ name });
    if (existing) {
      return sendError(res, 400, 'Skill with this name already exists');
    }

    const skill = await Skill.create({ name, category, description: description || '' });

    return sendResponse(res, 201, {
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const skills = await Skill.find(filter).sort({ category: 1, name: 1 });

    return sendResponse(res, 200, {
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const skill = await Skill.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return sendError(res, 404, 'Skill not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;

    const linked = await EmployeeSkill.countDocuments({ skillId: id });
    if (linked > 0) {
      await Skill.findByIdAndUpdate(id, { isActive: false });
      return sendResponse(res, 200, {
        success: true,
        message: 'Skill has assignments and was deactivated instead of deleted',
      });
    }

    const deleted = await Skill.findByIdAndDelete(id);
    if (!deleted) {
      return sendError(res, 404, 'Skill not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const assignSkillToEmployee = async (req, res, next) => {
  try {
    const {
      employeeId,
      skillId,
      proficiencyLevel,
      yearsOfExperience,
      lastUsedYear,
      isPrimary,
      notes,
    } = req.body;

    if (!employeeId || !skillId || !proficiencyLevel) {
      return sendError(res, 400, 'Please provide employeeId, skillId, and proficiencyLevel');
    }

    const [employee, skill] = await Promise.all([
      Employee.findById(employeeId),
      Skill.findById(skillId),
    ]);

    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }
    if (!skill || !skill.isActive) {
      return sendError(res, 404, 'Skill not found');
    }

    const assignment = await EmployeeSkill.findOneAndUpdate(
      { employeeId, skillId },
      {
        userId: employee.userId,
        proficiencyLevel,
        yearsOfExperience: yearsOfExperience ?? 0,
        lastUsedYear: lastUsedYear ?? new Date().getFullYear(),
        isPrimary: Boolean(isPrimary),
        notes: notes || '',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    )
      .populate('skillId', 'name category')
      .populate('userId', 'firstName lastName email');

    return sendResponse(res, 200, {
      success: true,
      message: 'Skill assigned successfully',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeSkill = async (req, res, next) => {
  try {
    const assignment = await EmployeeSkill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('skillId', 'name category')
      .populate('userId', 'firstName lastName email');

    if (!assignment) {
      return sendError(res, 404, 'Skill assignment not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Skill assignment updated successfully',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeSkills = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return sendError(res, 404, 'Employee not found');
    }

    if (req.user.role !== 'admin' && employee.userId.toString() !== req.user.id) {
      return sendError(res, 403, 'Not authorized to access these skills');
    }

    const skills = await EmployeeSkill.find({ employeeId })
      .populate('skillId', 'name category')
      .sort({ proficiencyLevel: -1, createdAt: -1 });

    return sendResponse(res, 200, {
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySkills = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id }).select('_id');
    if (!employee) {
      return sendError(res, 404, 'Employee record not found');
    }

    const skills = await EmployeeSkill.find({ employeeId: employee._id })
      .populate('skillId', 'name category')
      .sort({ proficiencyLevel: -1, createdAt: -1 });

    return sendResponse(res, 200, {
      success: true,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployeeSkill = async (req, res, next) => {
  try {
    const deleted = await EmployeeSkill.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return sendError(res, 404, 'Skill assignment not found');
    }

    return sendResponse(res, 200, {
      success: true,
      message: 'Skill assignment removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
