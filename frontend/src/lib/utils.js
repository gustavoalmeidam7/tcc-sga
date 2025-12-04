import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatLicensePlate(value) {
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const limitedValue = cleanValue.slice(0, 7);

  if (limitedValue.length <= 3) {
    return limitedValue;
  } else if (limitedValue.length <= 7) {
    return `${limitedValue.slice(0, 3)}-${limitedValue.slice(3)}`;
  }

  return limitedValue;
}
