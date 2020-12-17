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

# 自定义组件

微信小程序渲染自定义组件使用的是 Shadow DOM。
小程序自定义组件的 attached 和 detached 函数分别对应 Web Components 规范的 connectedCallback 和 disconnectedCallback，功能上是一致的。

```
// 创建自定义元素
class MyCustomParagraphElement extends HTMLParagraphElement {
   //...
}

// 注册自定义元素
customElements.define('custom-p', MyCustomParagraphElement);
```

## 组件间的通信流程

事件驱动模式：当组件 A 需要与组件 B 进行通信时，会抛出一个事件通知父组件 Page，父组件接收到事件之后提取事件携带的信息，然后通过 properties 传递给组件 B。
简单粗暴的方法（不推荐）：父组件通过 selectComponent 方法直接获取某个子组件的实例对象，然后就可以访问这个子组件的任何属性和方法了。

# 微信 IDE（Audits）

## 避免过大的 WXML 节点数目

WXML 是基于 HTML 的一种 DSL（Domain Specific Language，领域专属语言），除了原生组件（比如 Camera 相机组件）以外，常规组件最终会被小程序的渲染线程通过 WebView 渲染为 HTML ，所以从性能优化的角度上，HTML 的大部分性能优化方案均适用于 WXML，尽量减少节点数目就是方案之一。<br>
避免执行脚本的耗时过长的情况
避免首屏时间太长的情况
避免渲染界面的耗时过长的情况
对网络请求做必要的缓存以避免多余的请求
所有请求的耗时不应太久
避免 setData 的调用过于频繁
避免 setData 的数据过大
避免短时间内发起太多的图片请求
避免短时间内发起太多的请求
