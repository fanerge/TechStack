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

# 自动化测试

## 小程序自定义组件测试工具集

miniprogram-simulate

## 自动化测试的工具

miniprogram-automator

# 数据监控（善用数据驱动产品迭代）

埋点、性能 Trace 工具

# CI/CD

持续集成（Continuous integration，CI）和持续交付（Continuous Delivery，CD）

## 源码管理平台

Github 、Gitlab 以及国内的码云

## 制定触发 Webhooks 的规范

可以触发 Webhook 的事件类型有很多，Push、Tag、Merge……

## 搭建 CI 服务器和相关工具

用于监听 Webhooks 事件和发起自动化任务，目前比较流行的平台有 Gitlab CI、Jenkins

#  订阅消息
订阅消息都能帮小程序提高用户的留存率
##    配置消息模板
小程序管理后台中的“功能”-“订阅消息”
小程序的订阅消息分为：一次性订阅消息和长期订阅消息
## 获取用户授权
小程序SDK提供了一个用来获取用户授权的API：wx.requestSubscribeMessage。
## 发送消息
```
// 传统
服务端需要调用微信提供的subscribeMessage.send接口向用户发送订阅消息
// 云调用方式（优势，开发者不需要鉴权，微信帮我们做了）
云函数里调用微信 SDK 提供的openapi.subscribeMessage.sendAPI
```
#  数据预取
## 小程序提供的两种数据预加载能力：周期性更新和数据预拉取
周期性更新是指： 在用户未打开小程序的情况下，微信客户端从服务器拉取数据，并且缓存到小程序本地，用户下次打开小程序时就已经有了预加载数据，进而能够快速地将页面展示给用户。
数据预拉取的执行时机与周期性更新不同，是在小程序冷启动阶段执行数据的预加载（小程序另外的启动情况是热启动）。
冷启动是指： 用户首次打开，或小程序销毁后被用户再次打开时，小程序需要重新加载启动的情况。
热启动是指： 用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时小程序并未被销毁，只是从后台状态进入前台状态的情况。
## 小程序周期性更新的配置流程
###   配置预加载数据的请求地址
配置地址：“开发”-“开发设置”=“数据周期性更新”
###   在第一次启动小程序时，将自定义登录态同步给微信客户端，请注意是微信客户端而不是微信服务器
把小程序的自定义登录态同步给微信客户端同步的方法是使用小程序 SDK 提供的wx.setBackgroundFetchToken API
###   在用户再次启动小程序时，直接读取预加载的数据
当用户再次打开小程序时，就能获取这些缓存数据，获取的方法是借助小程序 SDK提供的wx.getBackgroundFetchDataAPI
## 冷启动的数据预拉取
###   配置预加载数据的请求地址
同上
###   在第一次启动小程序时，将自定义登录态同步给微信客户端
同上
###   在用户再次启动小程序时，直接读取预加载的数据
同上

#  小程序的更新策略
小程序的资源是托管在微信服务器上的，跟网站不同，微信不会在用户每次打开小程序时，从服务器拉取最新的小程序资源，而是尽可能地发挥缓存的优势。
## 怎么保证用户尽可能快地更新为新版本呢？
小程序的端侧资源更新机制，多久能覆盖所有用户，官方说明最晚24小时。
###   触发拉取新版本资源的时机
未启动时： 指的是小程序处于非活跃状态时（比如处于后台），但是请注意，这种状态是用户已经用过小程序后才会产生的，如果用户从来都没有用过你的小程序，就不存在状态的概念了，因为对于这个用户来说，你的小程序是无状态的。
冷启动时： 小程序被销毁重新打开后会进入冷启动状态。
###   具体操作
通过小程序的UpdateManager对象，在代码里主动检查并应用更新信息。
```
const axios = require('axios')
const updateManager = wx.getUpdateManager()
updateManager.onCheckForUpdate(function (res) {
  // 将是否有新版本信息挂载到全局对象上
  this.globalData.hasUpdate = res.hasUpdate
})

updateManager.onUpdateReady(function () {
  if(!this.globalData.hasUpdate){
    return
  }
  const { miniProgram } = wx.getAccountInfoSync()
  // 获取当前小程序的版本号
  const currVersion = miniProgram.version
  // 从你的开发者服务器接口中获取是否有紧急版本需要更新
  axios.get(`${<your-url?}?currVersion=${currVersion}`).then(res=>{
    if(res.needUpdate){
      // 紧急版本立即重启小程序应用更新
      updateManager.applyUpdate()
    }
  })
})
```
