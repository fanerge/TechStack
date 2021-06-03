# Webpack 的基本工作流程（Webpack4）

# 添加配置智能提示

```
// 在对应的 webpack.config.js中添加
/** @type {import('webpack').Configuration} */
```

## 原理

1.  VSCode 中的类型系统都是基于 TypeScript 的，所以可以直接按照这种方式使用
2.  @type 类型注释的方式是基于  JSDoc  实现的

# Webpack 的构建流程是什么?

<pre>
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
确定入口：根据配置中的 entry 找出所有的入口文件；
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
</pre>

# Webpack 配置

process.env.NODE_ENV 第三方模块都是通过这个成员去判断运行环境，从而决定是否执行例如打印日志之类的操作

## 不同环境下的配置

```
// ./webpack.config.js
// 第一个是 env，是我们通过 CLI 传递的环境名参数，第二个是 argv，是运行 CLI 过程中的所有参数。
module.exports = (env, argv) => {
  return {
    // ... Webpack 配置
  }
}
```

## 不同环境的配置文件

```
// webpack-merge 三方包
// ./webpack.common.js
module.exports = {
  // ... 公共配置
}
// ./webpack.prod.js
const merge = require('webpack-merge')
const common = require('./webpack.common')
module.exports = merge(common, {
  // 生产模式配置
})
// ./webpack.dev.js
const merge = require('webpack-merge')
const common = require('./webpack.common')
module.exports = merge(common, {
  // 开发模式配置
})
```

## 生产模式优化插件

```
plugins: [
  // DefinePlugin 为我们代码中注入全局成员的
  // 使用console.log(API_BASE_URL)
  new webpack.DefinePlugin({
    API_BASE_URL: JSON.stringify('https://***.com')
  }),
  // style-loader 处理 CSS 代码会内嵌到 JS 代码中
  // mini-css-extract-plugin 是一个可以将 CSS 代码从打包结果中提取出来的插件（还需要更换loader/* MiniCssExtractPlugin.loader */）
  new MiniCssExtractPlugin(),
],
optimization: {
  // 关于资源压缩的插件需要放这里
  // 且当配置了 minimizer 会覆盖掉 Webpack 内部的 JS 压缩器就会被覆盖掉（Webpack 默认只通过 TerserWebpackPlugin 插件压缩js，其余资源未压缩）
  minimizer: [
    // js压缩被覆盖了，需要重新添加回来
    new TerserWebpackPlugin(),
    // 压缩我们的样式文件
    new OptimizeCssAssetsWebpackPlugin()
  ]
},
```

# Loaders

loader 让 Webpack 能够去处理那些非 JavaScript 文件（Webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 Webpack 能够处理的有效模块，然后你就可以利用 Webpack 的打包能力，对它们进行处理。<br>
loader 的本质其实就是一个方法，接收到的字符串，对字符串进行操作后输出字符串。<br>
同类型的文件（后缀名区分）通过 use 配置的 loader 处理<span style="color: red">顺序为从后向前</span>。<br>

## 常用 Loaders 作用

```
html-loader：将 HTML 导出为字符串
sass-loader：加载 sass、scss 编译为 css
css-loader：将css代码转化为js代码（数组）
style-loader：将css注入到DOM中
file-loader：在 JavaScript 代码里 import/require 一个文件时，会将该文件生成到输出目录，并且在 JavaScript 代码里返回该文件的地址
url-loader：将文件转换为 base64 的url
babel-loader：将ESnext转换为ES5代码
ImageMinimizerPlugin.loader：通过 imagemin 来优化压缩图片资源
postcss-loader：把 CSS 代码解析成抽象语法树结构（AST），再交由插件来进行处理（PostCSS如添加浏览器前缀、CSS模块解决命名冲突、stylelint检查css中语法）
eslint-loader：EslintWebpackPlugin 检查js代码语法
source-map-loader：从源文件 sourceMappingURL 中提取出 source map
```

## 开发 Loader

```
// markdown-loader.js
将 markdown 文件转化为 html
// loader的大体结构，其实就是对特殊文件的一个预处理函数
const marked = require('marked')
module.exports = function (source) {
    const html = marked(source);
    // 也可以直接 return html 在 rules 中串联 html-loader
    const code = `export default ${JSON.stringify(html)}`
    return code
}
```

# Plugins

插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。<br>
plugin 扩展 Webpack 的功能来满足自己的需要，换句话说，loader 不能满足的时候，就需要 plugin 了。<br>
Webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 Webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

## 常用 Plugins 作用

```
clean-webpack-plugin：实现自动在打包之前清除上次的打包结果
html-webpack-plugin：用于生成 HTML 的插件（自动注入 Webpack 打包生成的 bundle）
// 该插件的 template 属性还可以制定 html template，模板中动态的内容，可以使用 Lodash 模板语法，<%= htmlWebpackPlugin.options.title %>
// 该插件还可以实现多页面应用，多个 HTML 文件（一个页面实例化一次 html-webpack-plugin 类 + Webpack 多入口打包）
copy-webpack-plugin：用于复制文件的插件（不参与构建的静态文件）
sentry-webpack-plugin // 在构建过程中把 source maps 上传到 Sentry
```

## 开发插件

```
// 清除 webpack 打包后js文件前面的注释 /*****/
const pluginName = 'RemoveCommentsPlugin';

module.exports = class RemoveCommentsPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap(pluginName, compilation => {
          // compilation => 可以理解为此次打包的上下文
          for(let name in compilation.assets) {
            // 只处理 js 结尾的文件
            if(name.endsWith('.js')) {
              const contents = compilation.assets[name].source()
              const noComments = contents.replace(/\/\*{2,}\/\s?/g, '')
              compilation.assets[name] = {
                source: () => noComments,
                size: () => noComments.length
              }
            }
          }
        })
    }
}
```

# Loader 和 Plugin 的不同？

## 编写 loader 或 plugin 的思路

Loader 像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个 Loader 通过链式操作，将源文件一步步翻译成想要的样子。
编写 Loader 时要遵循单一原则，每个 Loader 只做一种"转义"工作。 每个 Loader 的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用 this.callback()方法，将内容返回给 Webpack。 还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去。 此外 Webpack 还为开发者准备了开发 loader 的工具函数集——loader-utils。
相对于 Loader 而言，Plugin 的编写就灵活了许多。 Webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

## 不同的作用

Loader 直译为"加载器"。Webpack 将一切文件视为模块，但是 Webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 Webpack 拥有了加载和解析非 JavaScript 文件的能力。
Plugin 直译为"插件"。Plugin 可以扩展 Webpack 的功能，让 Webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

## 不同的用法

Loader 在 module.rules 中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）
Plugin 在 plugins 中单独配置。 类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入。

# SourceMap

将生产环境中运行的代码转换为开发阶段编写的源代码，便于调试和定位 bug
生产环境需要注意 Source Map 文件的访问权限

```
devtool: 'source-map'
// 会为打包的文件生成对应的 .map 文件
// 会为打包的文件中末尾添加 //# sourceMappingURL=***.js.map
eval('console.log(1) //# sourceURL=***.js') // 控制台实现来源位于***.js
eval模式，通过在上面原理
eval-source-map模式，生成了 map 文件，能定位到行和列
cheap-eval-source-map模式，生成了 map 文件，只能定位到行（定位的源码是经过loader处理的）
cheap-module-eval-source-map模式，生成了 map 文件，只能定位到行（不经过loader处理的）
inline-source-map模式：sorce-map效果一样，不产生真是的map文件而是data URLs
nosources-source-map模式：可以看见出现错误的行列位置，但点进去看不见源码（保护源码暴露）

总结：
// cheap 相当缩减版，只有行信息
// module 定位到源码不经过loader处理
// eval 通过 eval 执行代码
```

# Webpack Dev Serve

如 browser-sync 模块可以监听某个目录刷新浏览器
为了提升效率，将打包放于内存中。

```
devServer: {
  // 额外静态文件目录，开发环境一般不用
  contentBase: 'public',
  proxy: {
    '/api': {
      target: 'https://***.com/',
      pathRewrite: {
        // 替换掉代理地址中的/api
        '^/api': ''
      },
      // 将请求的 host 重置为 https://***.com
      changeOrigin: true
    }
  },
  port: 6666,
  compress: true
}
```

# 热更新原理（HMR）

```
decServer: {
  // 开启HMR，如果资源不支持则 fallback live reloading
  hot: true,
  // 开启HMR，如果资源不支持则不会 live reloading
  hotOnly: true,
},
plugins: [
  // HMR 需要的插件
  new webpack.HotModuleReplacementPlugin()
]
// why css 更改直接生效，js却不能
css 经过style loader 可以直接覆盖掉以前的样式
// js 需要单独处理，需要对当前模块所依赖的模块执行 module.hot.accept 方法
// 如图片热更新
import background from './base.png'
// ...
if(module.hot) {
  module.hot.accept('./base.png', () => {
    // 当 base.png 更新后执行
    img.src = background
  });
}
```

Webpack 监控文件状态，文件发生改变重新打包代码（通过 fs.watch 递归监控）<br>
Express 建立服务，并和客户端见一个 EventSource http 链接，有打包更新通知客户端<br>
客户端，收到服务器有打包更新的请求，客户端通过 ajax 请求，请求打包结果并解析。<br>
[知乎-Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

# Code Splitting

Code Splitting 通过把项目中的资源模块按照我们设计的规则打包到不同的 bundle 中，从而降低应用的启动成本，提高响应速度。

## 多入口打包（多页应用）

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js',
    about: './src/about.js'
  },
  output: {
    // [name] 是入口名称
    filename: '[name].bundle.js'
  },
  //...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/about.html',
      filename: 'about.html'
    })
  ],
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  }
};

chunks配置
chunks:'initial' 将同步加载和异步加载分开处理
chunks: 'all' 将满足条件的如 minSize 以及 import() 异步都将分 bundle
chunks: 'async' 只将import() 异步加载分 bundle

```

## ESModules 的 Dynamic imports 动态导入

指的是在应用运行过程中，需要某个资源模块时，才去加载这个模块。

```
// 动态导入需要的资源
// 如果以默认成员导出，所以我们需要解构模块对象中的 default
// 使用魔法注释，可以指定动态导入打包后的文件名
// 如果多个模块 webpackChunkName 相同会打包到一起
import(/* webpackChunkName: 'album' */'./album/album').then(({ default: album }) => {
  mainElement.appendChild(album())
})
```

# Webpack 中的 hash、chunkhash、contenthash

## hash

hash 是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 值都会更改，并且全部文件都共用相同的 hash 值

```
// 每次构建都会产生一个新的hash，这会导致之前浏览器加载的有用的文件失效，不利于浏览器缓存
output:{
    path: path.resolve(__dirname,'./dist'),
    publicPath: '/dist/',
    filename: '[name]-[hash].js'
}
```

## chunkhash

它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。

```
output:{
    path:path.resolve(__dirname,'./dist'),
    publicPath: '/dist/',
    filename: '[name]-[chunkhash].js'
}
```

但仍然存在一个问题，如果将一个 js 文件里面引入了 css 文件。这时要是我修改了 js，但没修改 css，也会导致 css 生成新的 chunkhash 文件 （可以使用下面 contenthash 来解决该问题）。

## contenthash

contenthash 是针对文件内容级别的，只有你自己模块的内容变了，那么 contenthash 值才改变。

```
module:{
  rules:[
    {
      test: /\.css$/,
      use:[
          miniCssExtractPlugin.loader,
          'css-loader'
      ]
    }
  ]
},
plugins:[
  // Webpack v4以下使用 extractTextPlugin
  new miniCssExtractPlugin({
      filename: '[name].[contenthash:7].css'
  })
}
```

# 编译提效：如何为 Webpack 编译阶段提速？

[统计项目构建过程中在编译阶段的耗时的插件](https://github.com/stephencookdev/speed-measure-webpack-plugin)
[准备基于产物内容的分析工具](https://www.npmjs.com/package/webpack-bundle-analyzer)

## 减少执行编译的模块

### IgnorePlugin

如 moment 只引入本国语言包

```
// 在构建模块时直接剔除那些需要被排除的模块
new webpack.IgnorePlugin({
  resourceRegExp: /^\.\/locale$/,
  contextRegExp: /moment$/,
})
```

### 按需引入类库模块

如 lodash 中只引入使用的方法

```
import {cloneDeep} from 'lodash-es'
// 或者babel-plugin-lodash 或 babel-plugin-import
// Tree Shaking（1.依赖包使用 ES6 模块化，如lodash-es，2.Tree Shaking 并不能减少模块编译阶段的构建时间。）
```

### babel-plugin-import 实现组件 CSS 按需加载

```
{
  "plugins": [
    // babel-plugin-import
    ["import", {
      "libraryName": "antd",
      "style": true // import js and css modularly (LESS/Sass source files)
      // "style": 'css' // import js and css modularly (css built files)
    }]
  ]
}

// 效果
import { Button } from 'antd';
ReactDOM.render(<Button>xxxx</Button>);

      ↓ ↓ ↓ ↓ ↓ ↓

var _button = require('antd/lib/button');
// 自动导入组件样式
require('antd/lib/button/style');
ReactDOM.render(<_button>xxxx</_button>);

// 原理（借助 ast） https://www.codingsky.com/doc/2020/7/31/937.html
1.  收集依赖：找到 importDeclaration，分析出包 a 和依赖 b,c,d....，假如 a 和 libraryName 一致，就将 b,c,d... 在内部收集起来
2.  判断是否使用：在多种情况下判断收集到的 b,c,d... 是否在代码中被使用，如果有使用的，就调用 importMethod 生成新的 import 语句
3.  生成引入代码：根据配置项生成代码和样式的 import 语句
```

### DllPlugin

将项目依赖的框架等模块单独构建打包，与普通构建流程区分开
利用 DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引用但是绝对不会修改(react、jquery)的 npm 包来进行预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。

```
// 如 jquery
DllPlugin 和 DllReferencePlugin
{
  output: {
    ...
    library: '_dll_[name]'
  },
  plugins: [
    // 使用插件 DllPlugin
    new DllPlugin({
      /*
        该插件的name属性值需要和 output.library保存一致，该字段值，也就是输出的 manifest.json文件中name字段的值。
        比如在jquery.manifest文件中有 name: '_dll_jquery'
      */
      name: '_dll_[name]',

      /* 生成manifest文件输出的位置和文件名称 */
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    }),
    // 告诉Webpack使用了哪些第三方库代码
    new DllReferencePlugin({
      // jquery 映射到json文件上去
      manifest: require('./dist/jquery.manifest.json')
    }),
  ]
}
```

### Externals

externals 和 DllPlugin 都是将依赖的框架等模块从构建过程中移除。
但有以下区别

1.  externals 更简单，而 DllPlugin 需要独立的配置文件
2.  DllPlugin 包含了依赖包的独立构建流程，而 externals 配置使用已传入 CDN 的依赖包
3.  在引用依赖包的子模块时，DllPlugin 无须更改，而 externals 则会将子模块打入项目包中

```
// CDN
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
externals: {
  jquery: 'jQuery'
}
// 使用时
import $ from 'jquery';
```

## 提升单个模块构建的速度。

### include/exclude

并行构建以提升总体效率。
include 只对符合条件的模块使用指定 Loader 进行转换处理。
exclude 不对特定条件的模块使用该 Loader。
如不使用 babel-loader 处理 node_modules 中的模块。

### noParse

module.noParse 则是在上述 include/exclude 的基础上，进一步省略了使用默认 js 模块编译器进行编译的时间

```
module: {
  noParse: /jquery|lodash/,
}
```

### Source Map

根据项目实际情况判断是否开启 Source Map。
在开启 Source Map 的情况下，优先选择与源文件分离的类型，例如 "source-map"。
有条件也可以配合错误监控系统，将 Source Map 的构建和使用在线下监控后台中进行，以提升普通构建部署流程的速度。

### TypeScript 编译优化

在使用 ts-loader 时，由于 ts-loader 默认在编译前进行类型检查，因此编译时间往往比较慢。
transpileOnly: true，可以在编译时忽略类型检查。
单独使用这一功能就丧失了 TS 中重要的类型检查功能，因此在许多脚手架中往往配合 ForkTsCheckerWebpackPlugin 一同使用

### Resolve

Webpack 中的 resolve 配置制定的是在构建时指定查找模块文件的规则。
resolve.modules：指定查找模块的目录范围。
resolve.extensions：指定查找模块的文件类型范围。
resolve.mainFields：指定查找模块的 package.json 中主文件的属性名。
resolve.symlinks：指定在查找模块时是否处理软连接。

## 并行构建以提升总体效率

HappyPack 与 thread-loader
这两种工具的本质作用相同，都作用于模块编译的 Loader 上，用于在特定 Loader 的编译过程中，以开启多进程的方式加速编译。
parallel-webpack

# 打包提效：如何为 Webpack 打包阶段提速？

## 以提升当前任务工作效率为目标的方案

### 面向 JS 的压缩工具

TerserWebpackPlugin、UglifyJSWebpackPlugin

```
// TerserWebpackPlugin
Cache 选项：使用缓存能够极大程度上提升再次构建时的工作效率
Parallel 选项：并发选项在大多数情况下能够提升该插件的工作效率
terserOptions 选项：即 Terser 工具中的 minify 选项集合。
```

### 面向 CSS 的压缩工具

OptimizeCSSAssetsPlugin（在 Create-React-App 中使用）、OptimizeCSSNanoPlugin（在 VUE-CLI 中使用），以及 CSSMinimizerWebpackPlugin（2020 年 Webpack 社区新发布的 CSS 压缩插件）

## 以提升后续环节工作效率为目标的方案

### Split Chunks

Split Chunks（分包）是指在 Chunk 生成之后，将原先以入口点来划分的 Chunks 根据一定的规则（例如异步引入或分离公共依赖等原则），分离出子 Chunk 的过程。
Split Chunks 有诸多优点，例如有利于缓存命中、有利于运行时的持久化文件缓存等。

```
// Webpack 4 中内置的 SplitChunksPlugin，该插件在 production 模式下默认启用
// chunks: 'async'，作用是分离动态引入的模块 (import('...'))，在处理动态引入的模块时能够自动分离其中的公共依赖。
// 设置为 chunks: 'all'，则能够将所有的依赖情况都进行分包处理，从而减少了重复引入相同模块代码的情况。
optimization: {
  ...
  splitChunks: {
    chunks: 'all'
  }
}
```

### Tree Shaking

Tree Shaking（摇树）是指在构建打包过程中，移除那些引入但未被使用的无效代码（Dead-code elimination）。
因为 ES6 模块的依赖关系是确定的，因此可以进行不依赖运行时的静态分析，而 CommonJS 类型的模块则不能。

Webpack 4 中 Tree Shaking 的触发条件有哪些？
引入的模块需要是 ES6 类型的，CommonJS 类型的则不支持。
引入方式不能使用 default。
引用第三方依赖包的情况下，对应的 package.json 需要设置 sideEffects:false 来表明无副作用。
使用 Babel 的情况下，需要注意不同版本 Babel 对于模块化的预设不同。

```
optimization: {
  // usedExports 模块仅导出被使用的成员 and 仅标记出 unused harmony
  usedExports: true,
  // 在压缩过程直接移除上面标记 unused harmony 代码
  minimize: true,
  // Scope Hoisting，也就是作用域提升，尽可能合并每一个模块到一个函数中
  concatenateModules: true,
  sideEffects: true
}
```

#### babel-loader 会导致 Tree-shaking 失效？

最新版本的 babel-loader（8.x） 并不会导致 Tree-shaking 失效，已经自动帮我们关闭了对 ES Modules 转换的插件（不会将其转换为 Common.js）

```
module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                // 关闭对ES Modules 的转换
                modules: false
                }
              ]
            ]
          }
        }
      }
    ]
  },
```

### sideEffects

Tree-shaking 只能移除没有用到的代码成员，而想要完整移除没有用到的模块，那就需要开启 sideEffects 特性了。
sideEffects 表明模块是否有副作用。
模块的副作用是指模块执行的时候除了导出成员是否还做了其他事情（如原型链中添加方法等）。

```
optimization: {
  // 开启 sideEffects 功能，在使用三方包是package.json 中的 sideEffects 用来标记该包代码是否有副作用
  sideEffects: true,
  // 还可以标记出有副作用的文件
  sideEffects: ['./src/extend.js', '*.css']
}
```

# 缓存优化：那些基于缓存的优化方案?

## 编译阶段的缓存优化

编译过程的耗时点主要在使用不同加载器（Loader）来编译模块的过程。下面我们来分别看下几个典型 Loader 中的缓存处理：

### Babel-loader

Babel-loader 是绝大部分项目中会使用到的 JS/JSX/TS 编译器。在 Babel-loader 中，与缓存相关的设置主要有：

```
cacheDirectory：默认为 false，即不开启缓存。当值为 true 时开启缓存并使用默认缓存目录（./node_modules/.cache/babel-loader/），也可以指定其他路径值作为缓存目录。
cacheIdentifier：用于计算缓存标识符。默认使用 Babel 相关依赖包的版本、babelrc 配置文件的内容，以及环境变量等与模块内容一起参与计算缓存标识符。如果上述内容发生变化，即使模块内容不变，也不能命中缓存。
cacheCompression：默认为 true，将缓存内容压缩为 gz 包以减小缓存目录的体积。在设为 false 的情况下将跳过压缩和解压的过程，从而提升这一阶段的速度。
```

### Cache-loader

需要将 cache-loader 添加到对构建效率影响较大的 Loader（如 babel-loader 等）之前，如下面的代码所示：

```
rules: [
  {
    test: /\.js$/,
    use: ['cache-loader', 'babel-loader'],
  },
],
```

## 优化打包阶段的缓存优化

### 生成 ChunkAsset 时的缓存优化

在 Webpack 4 中，生成 ChunkAsset 过程中的缓存优化是受限制的：只有在 watch 模式下，且配置中开启 cache 时（development 模式下自动开启）才能在这一阶段执行缓存的逻辑，Webpack 5 无此问题。

### 代码压缩时的缓存优化

对于 JS 的压缩，TerserWebpackPlugin 和 UglifyJSPlugin 都是支持缓存设置的。而对于 CSS 的压缩，目前最新发布的 CSSMinimizerWebpackPlugin 支持且默认开启缓存，其他的插件如 OptimizeCSSAssetsPlugin 和 OptimizeCSSNanoPlugin 目前还不支持使用缓存。

# 增量构建：Webpack 中的增量构建

## 增量构建的影响因素

### watch 配置

在使用 devServer 的情况下，该选项会默认开启增量构建，生产环境下只开启 watch 配置后的再次构建并不能实现增量构建。

### cache 配置

启用 watch 和 cache 配置

### 生产环境下使用增量构建的阻碍

基于内存的缓存数据注定无法运用到生产环境中。要想在生产环境下提升构建速度，首要条件是将缓存写入到文件系统中。只有将文件系统中的缓存数据持久化，才能脱离对保持进程的依赖，你只需要在每次构建时将缓存数据读取到内存中进行处理即可。
Webpack 4 中的 cache 配置只支持基于内存的缓存，并不支持文件系统的缓存，Webpack 5 中正式支持基于文件系统的持久化缓存（Persistent Cache）。

# Webpack 5：Webpack 5 中的优化细节

## Persistent Caching

// 不再像 Webpack 4 中的 cache 配置只支持基于内存的缓存

```
cache: {
  type: 'filesystem',
  cacheLocation: path.resolve(__dirname, '.appcache'),
  buildDependencies: {
    config: [__filename],
  },
},
// 参数说明
cache.type：缓存类型。值为 'memory'或‘filesystem’，分别代表基于内存的临时缓存，以及基于文件系统的持久化缓存。在选择 filesystem 的情况下，下面介绍的其他属性生效。
cache.cacheDirectory：缓存目录。默认目录为 node_modules/.cache/webpack。
cache.name：缓存名称。同时也是 cacheDirectory 中的子目录命名，默认值为 Webpack 的 ${config.name}-${config.mode}。
cache.cacheLocation：缓存真正的存放地址。默认使用的是上述两个属性的组合：path.resolve(cache.cacheDirectory, cache.name)。该属性在赋值情况下将忽略上面的 cacheDirectory 和 name 属性。
```

## Tree Shaking

### Nested Tree Shaking

Webpack 5 增加了对嵌套模块的导出跟踪功能，能够找到那些嵌套在最内层而未被使用的模块属性。

### Inner Module Tree Shaking

Webpack 5 中还增加了分析模块中导出项与导入项的依赖关系的功能。通过 optimization.innerGraph（生产环境下默认开启）选项，Webpack 5 可以分析特定类型导出项中对导入项的依赖关系，从而找到更多未被使用的导入模块并加以移除。

### CommonJS Tree Shaking

Webpack 5 中增加了对一些 CommonJS 风格模块代码的静态分析功功能：

```
支持 exports.xxx、this.exports.xxx、module.exports.xxx 语法的导出分析。
支持 object.defineProperty(exports, "xxxx", ...) 语法的导出分析。
支持 require('xxxx').xxx 语法的导入分析。
```

## Logs

Webpack 5 构建输出的日志要丰富完整得多。通过这些日志能够很好地反映构建各阶段的处理过程、耗费时间，以及缓存使用的情况。
它增加了许多内部处理过程的日志，可以通过 stats.logging 来访问。

# package.json

```
{
    "name" : "xxx",
    "version" : "0.0.0",
    // bin项用来指定各个内部命令对应的可执行文件的位置。
    // npm link (用于测试该模块link到全局)
    "bin": {
      "someTool": "./bin/someTool.js"
    },
    // config字段用于添加命令行的环境变量。
    "config" : { "port" : "8080" },
    // 读取
    // process.env.npm_package_config_port
    // main 字段指定了程序的主入口文件
    "main": "index.js",
    // scripts指定了运行脚本命令的npm命令行缩写
    "scripts": {
		"start": "node index.js"
	},
	// 兼容目标浏览器配置表
	"browserslist": [
	    "> 1%"
	],
	// 项目需要的node依赖版本
	"engines" : { "node" : ">=0.10.3 <0.12" },
	"dependencies": {
	},
	"devDependencies": {
	}
}
```

[package.json 文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)
