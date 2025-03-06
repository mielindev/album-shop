import fetcher from "./fetcher";

const imageApi = {
  uploadImage: async (file) => {
    try {
      const response = await fetcher.post("/images/cloudinary/upload", file);
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
  removeImage: async (url) => {
    try {
      const response = await fetcher.delete("images/delete", {
        data: { url },
      });
      return response.data;
    } catch (error) {
      throw error.response;
    }
  },
};

export default imageApi;
