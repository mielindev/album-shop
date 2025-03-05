import axios from "axios";
import { API_URL } from "../constants";

const fetcher = axios.create({
  baseURL: API_URL,
});

fetcher.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (currentUser) {
    config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
  }
  return config;
});

export default fetcher;
