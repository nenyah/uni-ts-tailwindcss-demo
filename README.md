# jenny-app

## Project setup

```
# 全局安装vue-cli
$ npm install -g @vue/cli
$ cd ... // 切换到工程保存目录
$ vue create -p dcloudio/uni-preset-vue jenny-app
```

根据提示进行选择，这里选择 默认模板 （ Typescript ）

安装 tailwindcss

```
yarn add tailwindcss@latest postcss@latest autoprefixer@latest
```

如果 tailwindcss 和老版本 postCss 不兼容， 会出现如下报错:

```
Error: PostCSS plugin tailwindcss requires PostCSS 8.
```

这时，可以采用兼容方式：

```
yarn remove tailwindcss
yarn remove postcss
yarn remove autoprefixer
yarn add tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

等后面 PostCss 兼容后，可以重新安装最新版：

```
yarn remove tailwindcss
yarn remove @tailwindcss/postcss7-compat
yarn add tailwindcss@latest postcss@latest autoprefixer@latest
```

为了支持小程序使用，我们还得做一些配置，先生成 tailwindcss 配置文件：

```
npx tailwindcss init
```

执行命令后，会生成 `tailwind.config.js` 文件：

```
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
```

全局引入有两种方式：一种是在 `app.vue` 的 style 中引入:

```
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

一种是在 ``app.ts` 中直接引入:

```
// app.ts
import "tailwindcss/tailwind.css"
```

这时，已经可以在项目中使用 tailwindcss 了， 为了能适配微信小程序，下面就要做些修
改：

```
yarn add -D postcss-class-rename css-byebye
```

- postcss-class-rename 是将小程序不支持的 css 类重命名
- css-byebye 移除不支持的 css 类，比如：\* {}

tailwindcss 配置移除不支持的 css 样式

```
// tailwind.config.js
module.exports = {
  // Tree-shake unused styles in production build
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx,html}'],
  // purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    // Disable breakpoints
    screen: {}
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
  }
}
```

> 由于上面 space/divideWidth 等样式包含微信小程序不支持的写法：.className >
> :not([hidden]) ~ :not([hidden])，所以移除。

uniapp 配置 postcss.config.js 如下:

```
// postcss.config.js
const path = require('path')
module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve(id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      }
    }),

    /* ******* 引入tailwindcss ******* */
    require('tailwindcss')({}),

    // 根据平台差异进行不同的样式处理
    //  开始的 ... 不是省略了内容，而是 es6 的解构
    ...(
      process.env.UNI_PLATFORM !== "h5"
        ? [
          // 使用postcss-class-name 包将小程序不支持的类名转换为支持的类名
          require("postcss-class-rename")({
            "\\\\:": "--",
            // "\\\\/": "--",
            "\\\\.": "--",
            ".:": "--"
          }),
          require("css-byebye")({
            rulesToRemove: [
              /\*/
            ],
            map: false
          })
        ]
        : [
          require("autoprefixer")({
            remove: true,
          }),
        ]
    ),
    /* ******* */

    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
```

这样， 就可以正常使用 tailwindcss, 并且微信小程序也正常显示样式了。
