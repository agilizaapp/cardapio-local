import type { Store } from "~/types/app"

export const getFontFamily = (fontName: string): string => {
  const map: Record<string, string> = {
    playfair: "Playfair Display",
    inter: "Inter",
    outfit: "Outfit",
    roboto: "Roboto",
  }
  return map[fontName?.toLowerCase()] || "Inter"
}

export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export const buildThemeVars = (store: Store | null | undefined): string => {
  if (!store?.themeSettings) return ""
  const fontFamily = store.themeSettings.font
    ? getFontFamily(store.themeSettings.font)
    : "Inter"
  const primaryBg = store.themeSettings.bgPrimaryColor || "#FFFFFF"
  const r = parseInt(primaryBg.slice(1, 3), 16)
  const g = parseInt(primaryBg.slice(3, 5), 16)
  const b = parseInt(primaryBg.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const isDark = luminance < 0.5
  const textMain = isDark ? "#FFFFFF" : "#1A1A1A"
  const textMuted = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
  const bgSurface = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"
  const borderSubtle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
  return `:root {
    --primary: ${store.themeSettings.primaryColor || "#1A1A1A"};
    --secondary: ${store.themeSettings.secondaryColor || "#FFFFFF"};
    --bg-primary: ${primaryBg};
    --bg-primary-rgb: ${r}, ${g}, ${b};
    --bg-secondary: ${store.themeSettings.bgSecondaryColor || "#F9FAFB"};
    --text-main: ${textMain};
    --text-muted: ${textMuted};
    --bg-surface: ${bgSurface};
    --border-subtle: ${borderSubtle};
    --font-primary: '${fontFamily}', sans-serif;
  }`
}
