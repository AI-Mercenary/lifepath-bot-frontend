import api from './axios';

export const saveChatMessage = async (data: { firebaseUid: string, userName?: string, sessionId: string, role: string, text: string, agentType?: string }) => {
    const res = await api.post('/chat', data);
    return res.data;
};

export const askChatbot = async (message: string, context?: any) => {
    const res = await api.post('/chat/ask', { message, context });
    return res.data.response;
};

export const getUserChatHistory = async (firebaseUid: string) => {
    const res = await api.get(`/chat/${firebaseUid}`);
    return res.data;
};

export const getUserSessions = async (firebaseUid: string) => {
    const res = await api.get(`/chat/sessions/${firebaseUid}`);
    return res.data;
};

export const getSessionMessages = async (sessionId: string) => {
    const res = await api.get(`/chat/session/${sessionId}`);
    return res.data;
};

export const deleteChatSession = async (sessionId: string) => {
    const res = await api.delete(`/chat/session/${sessionId}`);
    return res.data;
};

export const getAllChatHistory = async () => {
    const res = await api.get('/chat/admin/all');
    return res.data;
};
export const uploadMaterial = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/chat/upload-material', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
};
