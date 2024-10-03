import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function encryptPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

// generate a fake profile same as the user
export function generateAnonymousProfile() {
  return {
    uid: `anon-${Math.random().toString(36).substr(2, 9)}`,
    fullname: `U-${Math.floor(Math.random() * 1000)}`,
    email: `anon${Math.floor(Math.random() * 10000)}@example.com`,
    avatarUrl: `https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`,
    points: 0,
    phone: "0909090909",
  };
}
// Generate a random number with 9 digits
export function generateAffiliateId() {
  return Math.floor(Math.random() * 1000000000);
}
