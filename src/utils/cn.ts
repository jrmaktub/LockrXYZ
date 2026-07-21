type ClassValue = string | number | null | false | undefined;

/** Join conditional NativeWind/Tailwind class names into a single string. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
