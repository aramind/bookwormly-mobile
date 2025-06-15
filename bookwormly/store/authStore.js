import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = `https://bookwormly-api.onrender.com`;

const useAuthStore = create((set) => ({
  user: null,
  refreshToken: null,
  isLoading: false,
  signup: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${url}/api/v1/auth/signup`,
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
        `${url}/api/v1/auth/signin`,
        { email, password },
        {
          headers: {
            "X-Client-Type": "mobile",
            // "Content-Type": "application/json", // 👈 optional, Axios will set this automatically
          },
        }
      );

      const user = response?.data?.data?.userInfo;
      const refreshToken = response?.data?.data?.refreshToken;

      console.log("RES DATA", response?.data);

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response?.data?.data?.userInfo)
      );
      await AsyncStorage.setItem(
        "refreshToken",
        JSON.stringify(response?.data?.data?.refreshToken)
      );
      // ✅ Set to Zustand store
      set({ user, refreshToken });
      return response?.data;
    } catch (error) {
      console.error(error);
      return error?.response?.data;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      console.log("TOKEN", refreshToken);
      console.log("USER", userJson);
      set({ refreshToken, user });
    } catch (error) {
      console.log("AUTH CHECK FAILED", error);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");
    set({ refreshToken: null, user: null });
  },
}));

export default useAuthStore;
