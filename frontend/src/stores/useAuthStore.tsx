import { create } from "zustand";
import { io } from "socket.io-client";

import toast from "react-hot-toast";
import { axiosIntance } from "../libs/axios";
import { IAuthStore } from "../types";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";

export const useAuthStore = create<IAuthStore>((set, get) => ({
  onlineUsers: [],
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosIntance.get("/auth/check");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error: any) {
      console.log(error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosIntance.post("/auth/sign-up", data);

      set({ authUser: res.data });

      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosIntance.post("/auth/logout");

      set({ authUser: null });

      toast.success("Logout successfully");

      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosIntance.post("/auth/login", data);

      set({ authUser: res.data });

      toast.success("Login successfully");

      get().connectSocket();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosIntance.put("/auth/update-profile", data);

      toast.success("Profile updated successfully");

      console.log(res);

      set({ authUser: res.data });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket() {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
  },

  disconnectSocket() {
    if (get().socket?.connected) get().socket?.disconnect();

    return;
  },
}));
