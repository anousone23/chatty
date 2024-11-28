import { create } from "zustand";
import { IThemeStore } from "../types";

export const useThemeStore = create<IThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || "dark",
  setTheme: (theme: string) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
