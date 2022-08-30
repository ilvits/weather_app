/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hauora'],
      },
    },
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
      blue: colors.blue,
      slate: colors.slate,
      'bg': '#011839',
      'cyan': '#3FD5FE',
      'blue': '#0090C3',
      'yellow': '#FEB800',
      primary: colors.indigo,
      secondary: colors.yellow,
      neutral: colors.gray,
      transparent: 'transparent',
      current: 'currentColor',
    },
    plugins: [],
  }
}
