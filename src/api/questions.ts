import api from './axios';

export const createQuestion = async (data: { firebaseUid: string, authorName?: string, title: string, body: string, category: string, tags?: string[] }) => {
    const res = await api.post('/questions', data);
    return res.data;
};

export const getQuestions = async (category?: string, search?: string) => {
    const res = await api.get('/questions', { params: { category, search } });
    return res.data;
};

export const answerQuestion = async (questionId: string, data: { firebaseUid: string, authorName?: string, text: string }) => {
    const res = await api.post(`/questions/${questionId}/answer`, data);
    return res.data;
};
