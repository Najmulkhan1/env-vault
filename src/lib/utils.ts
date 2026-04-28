import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS ক্লাসগুলোকে মার্জ করার জন্য ইউটিলিটি ফাংশন
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}