import fetcher from "./fetcher";

const userApi = {
  login: async (payload) => {
    try {
      const response = await fetcher.post("/users/login", payload);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  register: async (payload) => {
    try {
      const response = await fetcher.post("/users/register", payload);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  getProfile: async (id) => {
    try {
      const response = await fetcher.get(`/users/${id}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getUserList: async () => {
    try {
      const response = await fetcher.get(`/users`);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  lockUser: async (id) => {
    try {
      const response = await fetcher.patch(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  updateUser: async ({ id, payload }) => {
    try {
      const response = await fetcher.put(`/users/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
};

export default userApi;
