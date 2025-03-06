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
  deleteArtist: async (id) => {
    try {
      const response = await fetcher.delete(`/artists/${id}`);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  addArtist: async (payload) => {
    try {
      const response = await fetcher.post(`/artists`, payload);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  getArtistById: async (id) => {
    try {
      const response = await fetcher.post(`/artists/${id}`);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
};

export default artistApi;
