const path = require("path")
module.exports = {
  parser: require("postcss-comment"),
  plugins: [
    require("postcss-import")({
      resolve(id, basedir, importOptions) {
        if (id.startsWith("~@/")) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith("@/")) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith("/") && !id.startsWith("//")) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      },
    }),
    /* ******* 引入tailwindcss ******* */
    require("tailwindcss")({}),
    // 根据平台差异进行不同的样式处理
    ...(process.env.UNI_PLATFORM !== "h5"
      ? [
          // 使用postcss-class-name 包将小程序不支持的类名转换为支持的类名
          require("postcss-class-rename")({
            "\\\\:": "--",
            // "\\\\/": "--",
            "\\\\.": "--",
            // ".:": "--",
          }),
          require("css-byebye")({
            rulesToRemove: [/\*/],
            map: false,
          }),
        ]
      : [
          require("autoprefixer")({
            remove: true,
          }),
        ]),
    /* ******* */
    require("@dcloudio/vue-cli-plugin-uni/packages/postcss"),
  ],
}
