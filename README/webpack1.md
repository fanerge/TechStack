# Webpack 的基本工作流程（webpack4）


# 编译提效：如何为 Webpack 编译阶段提速？
[统计项目构建过程中在编译阶段的耗时的插件](https://github.com/stephencookdev/speed-measure-webpack-plugin)
[准备基于产物内容的分析工具](https://www.npmjs.com/package/webpack-bundle-analyzer)
##  减少执行编译的模块
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
将项目依赖的框架等模块(react、jquery)单独构建打包，与普通构建流程区分开
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
##  提升单个模块构建的速度。
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
##  并行构建以提升总体效率
HappyPack 与 thread-loader
这两种工具的本质作用相同，都作用于模块编译的 Loader 上，用于在特定 Loader 的编译过程中，以开启多进程的方式加速编译。
parallel-webpack

#  打包提效：如何为 Webpack 打包阶段提速？
##  以提升当前任务工作效率为目标的方案
### 面向 JS 的压缩工具
TerserWebpackPlugin、UglifyJSWebpackPlugin
```
// TerserWebpackPlugin 
Cache 选项：使用缓存能够极大程度上提升再次构建时的工作效率
Parallel 选项：并发选项在大多数情况下能够提升该插件的工作效率
terserOptions 选项：即 Terser 工具中的 minify 选项集合。
```
### 面向 CSS 的压缩工具
OptimizeCSSAssetsPlugin（在 Create-React-App 中使用）、OptimizeCSSNanoPlugin（在 VUE-CLI 中使用），以及CSSMinimizerWebpackPlugin（2020 年 Webpack 社区新发布的 CSS 压缩插件）
##  以提升后续环节工作效率为目标的方案
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
##  编译阶段的缓存优化
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
##  增量构建的影响因素
### watch 配置
在使用 devServer 的情况下，该选项会默认开启增量构建，生产环境下只开启 watch 配置后的再次构建并不能实现增量构建。
### cache 配置
启用 watch 和 cache 配置
### 生产环境下使用增量构建的阻碍
基于内存的缓存数据注定无法运用到生产环境中。要想在生产环境下提升构建速度，首要条件是将缓存写入到文件系统中。只有将文件系统中的缓存数据持久化，才能脱离对保持进程的依赖，你只需要在每次构建时将缓存数据读取到内存中进行处理即可。
Webpack 4 中的 cache 配置只支持基于内存的缓存，并不支持文件系统的缓存，Webpack 5 中正式支持基于文件系统的持久化缓存（Persistent Cache）。

# Webpack 5：Webpack 5 中的优化细节
##  Persistent Caching
// 不再像Webpack 4 中的 cache 配置只支持基于内存的缓存
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
##  Tree Shaking
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
##  Logs
Webpack 5 构建输出的日志要丰富完整得多。通过这些日志能够很好地反映构建各阶段的处理过程、耗费时间，以及缓存使用的情况。
它增加了许多内部处理过程的日志，可以通过 stats.logging 来访问。

