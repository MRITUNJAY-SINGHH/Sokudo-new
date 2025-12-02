import apiClient from '../../utils/Base';

export const getAllProducts = async () => {
   try {
      const response = await apiClient.get('/products');
      return response.data.products || [];
   } catch (error) {
      console.error('API Error:', error);
      throw error;
   }
};
