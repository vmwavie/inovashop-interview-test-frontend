/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryDark: 'rgb(19, 31, 36)',
        primaryLight: 'rgb(247, 247, 247)',
        secondaryDark: '#49c0f8',
        secondaryDarkHover: '#58d7fd',
        subItemLight: '#f6f6f6',
        subItemDark: '#131f24',
        tertiaryDark: '#202f36',
        tertiaryLight: '#f3f4f6',
        textDark: '#3c3c3c',
        inputBackgroundLight: '#f7f7f7',
        inputBackgroundDark: '#202f36',
        textInfo: '#8396a1',
      },
      borderRadius: {
        default: '.6rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
