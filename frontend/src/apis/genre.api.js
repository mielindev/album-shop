import fetcher from "./fetcher";

const genreApi = {
  getGenreList: async ({ page = 1, pageSize = 15 }) => {
    try {
      const response = await fetcher.get(
        `/genres?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default genreApi;
