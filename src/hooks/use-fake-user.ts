import { generateAnonymousProfile } from "@/lib/utils";
import { create } from "zustand";
import { ResponseType } from "./use-profile";

export const useFakeUser = create<{
  user: ResponseType["data"];
  streamToken: string;
  setUser: (user: ResponseType["data"]) => void;
  setStreamToken: (streamToken: string) => void;
}>((set) => ({
  user: generateAnonymousProfile(),
  setUser: (user) => set({ user }),
  streamToken: `fake-token-${Math.random().toString(36).substring(2, 15)}`,
  setStreamToken: (streamToken) => set({ streamToken }),
}));
