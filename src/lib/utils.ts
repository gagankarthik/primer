import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn's expected helper location. Mirrors components/ui/cn.ts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
