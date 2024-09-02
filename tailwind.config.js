/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors:
      {
        'xogo':'#00b5e1',
        'headline':'#3d3e43'
      },
      fontFamily:
      {
        'xogofont':'xogofont'
      }
    
    },
  },
  plugins: [],
}