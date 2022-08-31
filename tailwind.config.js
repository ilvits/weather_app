/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "*.html",
  ],
  theme: {
    screens: {
      xs: '400px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['Hauora'],
      },
    },
    colors: {
      black: '#000',
      white: '#fff',
      // gray: colors.slate,
      // green: colors.emerald,
      // purple: colors.violet,
      // yellow: colors.amber,
      // pink: colors.fuchsia,
      // blue: colors.blue,
      'slate-100': '#f1f5f9',
      'bg': '#011839',
      'cyan': '#3FD5FE',
      'blue': '#0090C3',
      'yellow': '#FEB800',
      // primary: colors.indigo,
      // secondary: colors.yellow,
      // neutral: colors.gray,
      // transparent: 'transparent',
      // current: 'currentColor',
    },
    plugins: [],
  }
}
