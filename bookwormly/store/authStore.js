import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        { username, email, password },
        {
          headers: {
            "X-Client-Type": "mobile",
            // "Content-Type": "application/json", // 👈 optional, Axios will set this automatically
          },
        }
      );
      return response?.data;
    } catch (error) {
      console.error(error);
      return error?.response?.data;
    } finally {
      set({ isLoading: false });
    }
  },

  signin: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/signin",
        { email, password },
        {
          headers: {
            "X-Client-Type": "mobile",
            // "Content-Type": "application/json", // 👈 optional, Axios will set this automatically
          },
        }
      );

      console.log("RES DATA", response?.data);

      await AsyncStorage.setItem("user", JSON.stringify(response?.data?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      return error?.response?.data;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
