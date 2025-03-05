import fetcher from "./fetcher";

const artistApi = {
  getArtistList: async ({ page = 1, pageSize = 10 }) => {
    try {
      const response = await fetcher.get(
        `/artists?page=${page}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default artistApi;
