module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: '#__root',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  prefix: '',
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
