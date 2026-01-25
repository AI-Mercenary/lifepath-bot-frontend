import api from './axios';

export const syncUserToBackend = async (userData: {
  firebaseUid: string;
  email: string;
  name: string;
  role?: string;
}) => {
  const response = await api.post('/users/sync', userData);
  return response.data;
};

export const updateUserProfile = async (userData: {
    firebaseUid: string;
    student_id?: string;
    age?: number;
    dept?: string;
    specialization?: string;
    year?: string;
    branch?: string;
}) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
};
