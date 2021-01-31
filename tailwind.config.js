module.exports = {
  purge: ["./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    // Disable breakpoints
    screen: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    divideOpacity: false,
  },
}
