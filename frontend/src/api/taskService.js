import axios from './axios';

export const taskService = {
  createTask: async (data) => {
    const response = await axios.post('/tasks', data);
    return response.data;
  },

  getManagerTasks: async () => {
    const response = await axios.get('/tasks/manager');
    return response.data;
  },

  getEmployeeTasks: async () => {
    const response = await axios.get('/tasks/employee');
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await axios.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axios.delete(`/tasks/${id}`);
    return response.data;
  },
};
