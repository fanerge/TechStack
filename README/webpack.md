#  入口(entry)
入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。
#  出口(output)
output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。
#  loader
loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。<br>
loader 的本质其实就是一个方法，接收到的字符串，对字符串进行操作后输出字符串。<br>
同类型的文件（后缀名区分）通过 use 配置的 loader 处理<span style="color: red">顺序为从后向前</span>。<br>
```
// loader的大体结构，其实就是对特殊文件的一个预处理函数
module.exports = function (code) {
    // code 代表对应文件的代码及字符串
    // 对字符串进行处理后
    const result = doSometing(code);
    // 输出处理后的值
    return result;
    
    // loader自带的返回函数
    this.callback(err, result, SourceMap);
    
    // 同步loader
    return someSyncOperation(code);
    
    // 异步loader
    someAsyncOperation(code, (err, result, sourceMaps, ast) => {
       this.callback(err, result, SourceMap); 
    });
    
}
```
#  插件(plugins)
插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。<br>
plugin 扩展 webpack 的功能来满足自己的需要，换句话说，loader不能满足的时候，就需要plugin了。<br>
webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。
```
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            console.log("webpack 构建过程开始！");
        });
    }
}
```
#  模式
通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化。

#  package.json
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
[package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)

# 热更新原理
Webpack 监控文件状态，文件发生改变重新打包代码（通过 fs.watch 递归监控）<br>
Express 建立服务，并和客户端见一个 EventSource http链接，有打包更新通知客户端<br>
客户端，收到服务器有打包更新的请求，客户端通过 ajax 请求，请求打包结果并解析。<br>
[Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
```
// js热更新配置（保存js状态）
// module.hot.accept();
```

#   plugins
##  按需加载
[babel-plugin-import](https://github.com/ant-design/babel-plugin-import)
// 支持基于 ES modules 的 tree shaking

#   webpack理论
##  有哪些常见的Loader？他们是解决什么问题的？
file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去
source-map-loader：加载额外的 Source Map 文件，以方便断点调试
image-loader：加载并且压缩图片文件
babel-loader：把 ES6 转换成 ES5
css-loader：加载 CSS，支持模块化、压缩、文件导入等特性
style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS
eslint-loader：通过 ESLint 检查 JavaScript 代码
##  有哪些常见的Plugin？他们是解决什么问题的？
define-plugin：定义环境变量
commons-chunk-plugin：提取公共代码 //webpack4移除了，用optimization.splitChunks和optimization.runtimeChunk来代替
uglifyjs-webpack-plugin：通过UglifyES压缩ES6代码
clean-webpack-plugin：删除打包文件
happypack：实现多线程加速编译
html-webpack-plugin 为html文件中引入的外部资源，可以生成创建html入口文件
##  Loader和Plugin的不同？
### 不同的作用
Loader直译为"加载器"。Webpack将一切文件视为模块，但是webpack原生是只能解析js文件，如果想将其他文件也打包的话，就会用到loader。 所以Loader的作用是让webpack拥有了加载和解析非JavaScript文件的能力。
Plugin直译为"插件"。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
### 不同的用法
Loader在module.rules中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个Object，里面描述了对于什么类型的文件（test），使用什么加载(loader)和使用的参数（options）
Plugin在plugins中单独配置。 类型为数组，每一项是一个plugin的实例，参数都通过构造函数传入。
##  webpack的构建流程是什么?
Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
确定入口：根据配置中的 entry 找出所有的入口文件；
编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。
在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。
##  描述一下编写loader或plugin的思路？
Loader像一个"翻译官"把读到的源文件内容转义成新的文件内容，并且每个Loader通过链式操作，将源文件一步步翻译成想要的样子。
编写Loader时要遵循单一原则，每个Loader只做一种"转义"工作。 每个Loader的拿到的是源文件内容（source），可以通过返回值的方式将处理后的内容输出，也可以调用this.callback()方法，将内容返回给webpack。 还可以通过 this.async()生成一个callback函数，再用这个callback将处理后的内容输出出去。 此外webpack还为开发者准备了开发loader的工具函数集——loader-utils。
相对于Loader而言，Plugin的编写就灵活了许多。 webpack在运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
##  如何利用webpack来优化前端性能？
压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的UglifyJsPlugin来压缩JS文件， 利用cssnano（css-loader?minimize）来压缩css
利用CDN加速。在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于output参数和各loader的publicPath参数来修改资源路径
Tree Shaking，使用ESModule 来实现按需加载。
##  如何提高webpack的构建速度？
多入口情况下，使用CommonsChunkPlugin来提取公共代码
通过externals配置来提取常用库
利用DllPlugin和DllReferencePlugin预编译资源模块 通过DllPlugin来对那些我们引用但是绝对不会修改的npm包来进行预编译，再通过DllReferencePlugin将预编译的模块加载进来。
使用Happypack 实现多线程加速编译
使用webpack-uglify-parallel来提升uglifyPlugin的压缩速度。 原理上webpack-uglify-parallel采用了多核并行压缩来提升压缩速度
使用Tree-shaking和Scope Hoisting来剔除多余代码
##  怎么配置单页应用？怎么配置多页应用？
单页应用可以理解为webpack的标准模式，直接在entry中指定单页应用的入口即可。
多页应用的话，可以使用webpack的 AutoWebPlugin来完成简单自动化的构建，但是前提是项目的目录结构必须遵守他预设的规范。 多页应用中要注意的是：


