export const colors = {
  primary: "#ffffff",
  secondary: "#1c4bb7ff",
  accent: "#e6c32f",
} as const;

export type BrandColor = keyof typeof colors;
export default colors;
