import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utilitário para concatenar e fazer merge de classes Tailwind CSS.
 * Ele previne conflitos de classes (ex: p-4 p-2 vira p-2) usando o tailwind-merge,
 * enquanto permite condicionalidades usando o clsx.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
