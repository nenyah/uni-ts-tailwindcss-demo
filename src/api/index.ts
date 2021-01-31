const files = require.context("./modules", false, /\.ts$/)

let api: any = {}
files.keys().map((key) => {
  api[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default
})
export default api
