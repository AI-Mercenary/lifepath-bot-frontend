import api from './axios';

export const getReflections = async (uid: string) => {
    const res = await api.get(`/reflections/${uid}`);
    return res.data;
};

export const createReflection = async (data: any) => {
    const res = await api.post('/reflections', data);
    return res.data;
};
