# Webpack 的基本工作流程（webpack4）

# 添加配置智能提示

```
// 在对应的 webpack.config.js中添加
/** @type {import('webpack').Configuration} */
```

## 原理

1.  VSCode 中的类型系统都是基于 TypeScript 的，所以可以直接按照这种方式使用。
2.  @type 类型注释的方式是基于  JSDoc  实现的

# webpack 的构建流程是什么?

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
确定入口：根据配置中的 entry 找出所有的入口文件；
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

# Loaders

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。<br>
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
postcss-loader：把 CSS 代码解析成抽象语法树结构（AST），再交由插件来进行处理（PostCSS如添加浏览器前缀、CSS模块解决命名冲突、stylelin检查css中语法）
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
plugin 扩展 webpack 的功能来满足自己的需要，换句话说，loader 不能满足的时候，就需要 plugin 了。<br>
webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

## 常用 Plugins 作用

```
clean-webpack-plugin：实现自动在打包之前清除上次的打包结果
html-webpack-plugin：用于生成 HTML 的插件（自动注入 Webpack 打包生成的 bundle）
// 该插件的 template 属性还可以制定 html template，模板中动态的内容，可以使用 Lodash 模板语法，<%= htmlWebpackPlugin.options.title %>
// 该插件还可以实现多页面应用，多个 HTML 文件（一个页面实例化一次 html-webpack-plugin 类 + Webpack 多入口打包）
copy-webpack-plugin：用于复制文件的插件（不参与构建的静态文件）
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
编写 Loader 时要遵循单一原则，每个 Loader 只做一种"转义"工作。 每个 Loader 的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用 this.callback()方法，将内容返回给 webpack。 还可以通过 this.async()生成一个 callback 函数，再用这个 callback 将处理后的内容输出出去。 此外 webpack 还为开发者准备了开发 loader 的工具函数集——loader-utils。
相对于 Loader 而言，Plugin 的编写就灵活了许多。 webpack 在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

## 不同的作用

Loader 直译为"加载器"。Webpack 将一切文件视为模块，但是 webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力。
Plugin 直译为"插件"。Plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

## 不同的用法

Loader 在 module.rules 中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个 Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）
Plugin 在 plugins 中单独配置。 类型为数组，每一项是一个 plugin 的实例，参数都通过构造函数传入。

# 热更新原理

Webpack 监控文件状态，文件发生改变重新打包代码（通过 fs.watch 递归监控）<br>
Express 建立服务，并和客户端见一个 EventSource http 链接，有打包更新通知客户端<br>
客户端，收到服务器有打包更新的请求，客户端通过 ajax 请求，请求打包结果并解析。<br>
[Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

```
// js热更新配置（保存js状态）
// module.hot.accept();
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
import {cloneDeep} from 'lodash'
// 或者babel-plugin-lodash 或 babel-plugin-import
// Tree Shaking（1.依赖包使用 ES6 模块化，如lodash-es，2.Tree Shaking 并不能减少模块编译阶段的构建时间。）
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
    // 告诉webpack使用了哪些第三方库代码
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
