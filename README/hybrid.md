# h5唤起APP
调起APP在不同平台用不同的方式，主要就分3个 * URI Scheme * universal Link * Android App Links。
##  URI Scheme
URI Scheme 是iOS，Android平台都支持，只需要原生APP开发时注册 scheme ， 用户点击到此类链接时，会自动唤醒APP，借助于 URL Router 机制，则还可以跳转至指定页面。<br>
```
格式为：
<scheme name> : <hierarchical part> [ ? <query> ] [ # <fragment> ]
```
##  universal Link
iOS9 后推出的一项功能，通用链接，对于前端即访问一个https的url,如果这个url带有你提交给开发平台的配置文件中匹配规则的内容，iOS系统会去尝试打开你的app，如果打不开，系统就会在浏览器中转向你要访问的链接。<br>
```
universal Link 工作方式如下:
1.  访问web link(https)
2.  iOS访问 https://xxxxxxx/apple-app-site-association 并解析，获取文件中的信息(App的Team ID和Bundle ID)
3.  通过Bundle ID 检查本地是否存在对应app，和检查PATH信息等，如果有app打开app，如果没有则跳转对应web link(可通过代码实现跳去app Stroe)
```
##  Android App Links
在2015年的Google I/O大会上，Android M宣布了一个新特性：App Links让用户在点击一个普通web链接的时候可以打开指定APP的指定页面，前提是这个APP已经安装并且经过了验证，否则会显示一个打开确认选项的弹出框，只支持Android M以上系统。

[从前端的角度出发 - web调起APP的](https://github.com/bsxz0604/RemarkForFE/blob/master/%E4%BB%8E%E5%89%8D%E7%AB%AF%E7%9A%84%E8%A7%92%E5%BA%A6%E5%87%BA%E5%8F%91%20-%20web%E8%B0%83%E8%B5%B7APP%E7%9A%84.md)
# JSbridge
native 和 wap 通信
## web >> native（H5调用Native的本质就是请求拦截）
###  使用带有src属性标签发送请求，如iframe...
```
const iframe = document.createElement('iframe')
iframe.src = "xxx"
```
这种方式也是各大Hybrid框架常用的方式，重复大量发送也不需要担心消息的丢失问题
###  使用location.href发送请求
```
location.href = "xxx"
```
这种方式比较适用于一些一次性调用的场景，例如H5中某个操作需要跳转至App的某一个页面，通过这种方式重复发送大量请求会造成请求消息的丢失，只接受最后一次。
###  使用Ajax的方式来发送请求
```
const url = 'xxx'
fetch(url, { ... })
  .then()
  .catch()
```
###  给 native 带参数
#### query的形式的参数拼接
```
execIframe.src = 'gap://ready?p1=v1&p2=v2&p3=v3…'
```
这种方式会有长度限制
#### 全局中放个数组，native 自己取
```
// h5 需要做的
// 将给 native 中的数据放入全局数组中
const messageQueue = [];
window.messageQueue = messageQueue;
// 给 native 的数据 push 数组中 
messageQueue.push(JSON.stringify({
  message: '购物',
  params: {
    goodId: '123',
    other: '****'
  }
}));
// 发一个请求，native 拦截处理，自己去 window.messageQueue 读取参数
execIframe.src = 'gap://ready'
```
当 H5 发起请求，native 拦截请求，进入到 WebView ，拿到 window.messageQueue 数据，并清空数组（方便下次传参）。<br>
```
// native 需要做的
const messageQueue = eval('window.messageQueue')
const messages = JSON.parse(messageQueue)
for (const message in messages) {
     doSomeThingWithMessage(message)
     …
}
eval('window.messageQueue = []')
```
## native >> web
h5只需要准备一个全局的回掉函数，并放
```
// h5需要做的
// 声明全局函数
window.localBuySuccess = function (){};
// 放入到消息队列中，等待 native 执行
messageQueue.push(JSON.stringify({
	message: 'xxx',
	params: 'xxx',
	callBackName: 'localBuySuccess',
}))

// native 需要做的
const messageQueue = eval('window.messageQueue')
const messages = JSON.parse(messageQueue)
for (const message in messages) {
     const result = doSomeThingWithMessage(message)
     // native 将参数传入，执行web方法
     eval(`window[${message.callbackName}](${result})`)
     …
}
eval('window.messageQueue = []')
```
为了代码更规范，保证H5不胡乱的创建callBackName，Native并不是直接执行window上的callbackName方法。<br>
handleMessageFromNative 方法规范 native 的行为
```
// h5 需要做的
function handleMessageFromNative (message) {
	if (typeof message.callbackName === 'function') {
		window[callbackName](message.result)
		delete window[callbackName]
	}
}

window.handleMessageFromNative = handleMessageFromNative

// native 需要做的（现在 native 在WebView 中调 handleMessageFromNative 即可）
const messageQueue = eval('window.messageQueue')
const messages = JSON.parse(messageQueue)

for (const message in messages) {
     const result = doSomeThingWithMessage(message)
     
     const messageFromNative = JSON.stringify({
        result,
        callbackName: message.callbackName
     })
     
     eval(`window.handleMessageFromNative(${messageFromNative})`)
     …
}
eval('window.messageQueue = []')
```
[ios-JSBridge](https://github.com/marcuswestin/WebViewJavascriptBridge/blob/master/WebViewJavascriptBridge/WebViewJavascriptBridge_JS.m#L118)

## 封装JSBridge
```
// H5与Native同时增加如下两个接口供对方使用：
// ≈ function addEventListener(eventName, callback)
function registerHandler (handlerName: string, block: any) {
  window.handlers[handlerName] = block
  // …
}

// Web或Native调用对方接口的方式
// ≈ dispatchEvent(eventName, data, callback)
function callHandler (handlerName: string, message: any, callback: any) {
  window.handlers[handlerName](message)
  // …
}

// 例如：扫描二维码
// Native（注册了一个扫描二维码的方法）
registerHanlder('scanQRCode', () => {

  // Camera.open().scanQRCode()
});
// H5（调用扫描二维码的方法）
callHanlder('scanQRCode', { type: 'qrcode' }, result => {
  console.log('扫码结果：', result)
})
// H5（该为Promise）
export async function scanQRCode () {
  return new Promise((resolve, reject) => {
      callHanlder('scanQRCode', { type: 'qrcode' }, result => {
          console.log('扫码结果：', result)
          resolve(result)
      })
  })
}

/******** 更好的方案 ********/
// Native中有另一个神奇的API，我们暂且称它为defineFunc函数吧。
// 它可以直接将Native的代码注入到H5的载体WebView中，并挂在WebView的window上。
// native 需要做的
function defineFunc (funcName: string, func: Function) {
  // 通过一些Native的API拿到WebView的window
  const window = webView.window;
  // 将native的方法直接挂在h5的window上
  window[funcName] = func; 
}

// Native
defineFunc('callSomeNativeFunction', () => {
  // 这些是由Native的代码翻译成javascript的伪代码
  const file = io.readFile('/path/to/file')
  // 做一些H5做不到的事情
  file.write('/path/to/file', 'content')
});

// h5 中执行 native的方法，就可以使用native功能了
callSomeNativeFunction();
```

[【前端基础】Web与Native交互之The JSBridge FAQ](https://juejin.im/post/5d425a16f265da03f564c1c3)