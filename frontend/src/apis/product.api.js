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
};

export default productApi;
