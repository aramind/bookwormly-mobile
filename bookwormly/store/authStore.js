import { create } from "zustand";
import axios from "axios";

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

      console.log(response?.data);
      return response?.data;
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
