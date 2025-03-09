import fetcher from "./fetcher";

const formatApi = {
  getFormatList: async ({ page = 1, pageSize = 20 }) => {
    try {
      const response = await fetcher.get(
        `/formats?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default formatApi;
