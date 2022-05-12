module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['iranyekan'],
      }
    },
  },
    plugins: [
      require('@tailwindcss/forms'),
    ],
};
