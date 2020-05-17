# shadow-loader

用于根据打包配置，动态加载不同资源

### install
```
npm install shadow-loader -D
```

### 使用场景
如：一个应用需要兼容，A、B两个环境

A 环境需要用到 `/platform/a.js`
B 环境需要用到 `/platform/b.js`

- 传统实现方式：
```
// /platform/index.js 
import { hello as A } from 'a.js'
import { hello as B } from 'b.js'

const hello = () => {
  if (process.env.APP_NAME === 'A') {
    return A
  }
  if (process.env.APP_NAME === 'B') {
    return B
  }
}
export {
  hello
}
```
- 使用`shadow-loader`


打包时，可通过配置进行区分加载。
**webpack.config.js**

```js
const appName = process.env.APP_NAME === 'A' ? 'a' : 'b'
module.exports = {
  module: {
    rules: [
      {
        test: /platform/,
        use: [
          {
            loader: `shadow-loader`,
            options: {
              rules: [{
                reg: /platform\/index\.js/,
                new: `platform/${appName}.js`
              }]
            }
          },
        ],
      },
    ],
  },
};
```
这样在引入`/platfrom/index.js` 时，会根据环境加载不同的js.
相比在脚本中进行判断（webpack 认为两个脚本都有可能被使用，所以不会进行treeshaking），这样的方式打包后，去除了非目标环境的代码，体积减小。

