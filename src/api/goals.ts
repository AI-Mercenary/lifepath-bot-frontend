import api from './axios';

export const getGoals = async (uid: string) => {
    const res = await api.get(`/goals/${uid}`);
    return res.data;
};

export const createGoal = async (data: any) => {
    const res = await api.post('/goals', data);
    return res.data;
};

export const updateGoal = async (id: string, data: any) => {
    const res = await api.put(`/goals/${id}`, data);
    return res.data;
};

export const deleteGoal = async (id: string) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
};
