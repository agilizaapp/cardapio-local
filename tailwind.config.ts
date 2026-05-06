import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    `./assets/**/*.js`,
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./plugins/**/*.{js,ts}`,
    `./nuxt.config.{js,ts}`,
    `./layers/**/*.{vue,js,ts}`
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
    },
  },
}
