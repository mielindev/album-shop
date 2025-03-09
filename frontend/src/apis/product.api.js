import fetcher from "./fetcher";

const productApi = {
  getListProduct: async () => {
    try {
      const response = await fetcher.get("/products");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  lockProduct: async (id) => {
    try {
      const response = await fetcher.put(`/products/${id}/lock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createProduct: async (payload) => {
    try {
      const response = await fetcher.post(`/products`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateProduct: async ({ id, payload }) => {
    try {
      const response = await fetcher.put(`/products/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;
