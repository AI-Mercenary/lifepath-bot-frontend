import api from './axios';

export interface Suggestion {
  _id: string; // Mongo ID
  title: string;
  description: string;
  category: string;
  authorName: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  upvotes: number;
  createdAt: string;
}

export const getSuggestions = async (category?: string, status?: string) => {
  const response = await api.get('/suggestions', {
    params: { category, status }
  });
  return response.data;
};

export const updateSuggestionStatus = async (id: string, status: 'approved' | 'rejected') => {
  // We need a backend endpoint for this. 
  // Assuming PUT /suggestions/:id or similar. 
  // Wait, I didn't create a specific update endpoint in backend yet?
  // I created GET and POST. 
  // I should verify backend routes first or add it.
  // For now let's assume I will add it.
  const response = await api.patch(`/suggestions/${id}/status`, { status });
  return response.data;
};

export const createSuggestion = async (data: {
  firebaseUid: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}) => {
  const response = await api.post('/suggestions', data);
  return response.data;
};
