微信小程序

# 小程序双线程模型

## 浏览器的线程

为什么 GUI 渲染线程与 JavaScript 引擎线程是互斥、阻塞的：JavaScript 代码有修改 DOM 的权限。
Web Worker，提供多线程执行 JavaScript 代码的能力，但是与其他编程语言不同的是，Worker 线程与主线程并不是扁平的，而是一种主从（ Master-Slave）多线程模型。
Web Worker 非常耗费资源，除去计算消耗以外，与主线程的通信过程对性能的损耗也非常严重。

## 安全高效的小程序双线程模型

小程序采用了 Hybrid-混合的架构模式：使用 Webview 渲染 UI、使用类似 Web Worker 的独立线程运行逻辑（并非主从线程模式）。
渲染线程使用 Webview 进行 UI 的渲染呈现。Webview 是一个完整的类浏览器运行环境，本身具备运行 JavaScript 的能力，但是小程序并不是将逻辑脚本放到 Webview 中运行，而是将逻辑层独立为一个与 Webview 平行的线程，使用客户端提供的 JavaScript 引擎运行代码，iOS 的 JavaScriptCore、安卓是腾讯 X5 内核提供的 JsCore 环境以及 IDE 工具的 nwjs 。
并且逻辑线程是一个只能够运行 JavaScript 的沙箱环境，不提供 DOM 操作相关的 API，所以不能直接操作 UI，只能够通过 setData 更新数据的方式异步更新 UI。
