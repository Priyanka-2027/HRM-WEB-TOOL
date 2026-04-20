import api from './axios';

export const payrollService = {
  getMyPayslip: async (year, month) => {
    const response = await api.get(`/payroll/my-slip?year=${year}&month=${month}`);
    return response.data;
  }
};
