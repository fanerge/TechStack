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
```
// js热更新配置（保存js状态）
// module.hot.accept();
```

