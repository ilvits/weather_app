/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: 'class',
  content: [
    // "*.html",
    "weather/js/*.js",
    "weather/*.html",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    screens: {
      xs: '380px',
      sm: '500px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['Nunito'],
        'emoji': ['Noto_Emoji']
      },
      boxShadow: {
        '3xl': '20px 20px 30px -15px #000000',
      },
      // keyframes: {
      //   wiggle: {
      //     '0%, 100%': { transform: 'rotate(-3deg)' },
      //     '50%': { transform: 'rotate(3deg)' },
      //   },
      //   changeLetter: {
      //     '0%': { content: '°C' },
      //     '50%': { color: '#FEB800' },
      //     '100%': { content: '°F' },
      //   }
      // },
      // animation: {
      //   wiggle: 'wiggle 1s ease-in-out infinite',
      //   changeLetter: 'changeLetter 1s ease-in-out 1',
      //   changeLetter2: 'changeLetter 1s ease-in-out 1 reverse',
      // }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      red: colors.red,
      green: colors.green,
      purple: colors.purple,
      orange2: colors.orange,
      pink: colors.pink,
      blue: colors.blue,
      slate: colors.slate,
      sky: colors.sky,
      'slate-100': '#f1f5f9',
      'bg': '#10213A',
      'cyan': '#3FD5FE',
      'blue': '#0090C3',
      'yellow': '#FEB800',
      'orange': '#F5804E',
      'violet': '#D580FF',
      primary: colors.indigo,
      secondary: colors.yellow,
      neutral: colors.neutral,
    },
  },
  plugins: [
    require('preline/plugin'),
    require('tailwindcss-gradient'),
  ],
}
