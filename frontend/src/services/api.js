const API_BASE_URL = 'http://localhost:3000/api';

export const getArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};