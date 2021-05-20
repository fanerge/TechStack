# 一次跨域CORS服务端配置排坑
```
// 简单跨域
Access-Control-Allow-Origin = '*' // 也可以指定一个域名
// 允许 client 使用什么方法
Access-Control-Allow-Methods //  method
// 允许 client 携带那些 header
Access-Control-Allow-Headers: <header-name>[, <header-name>]* // 已逗号分割
// 允许 client 解析那些 header（不然 client 读取对应header 为 null）
Access-Control-Expose-Headers: Content-Length, X-Kuma-Revision
// 携带cookie等
Access-Control-Allow-Origin = '指定域名（只能设置一个域名）'
Access-Control-Allow-Credentials = true // 是否允许发送 Cookie
客户端还需要设置withCredentials
如fetch，credentials='include'
如xhr，withCredentials=true
// 非简单请求（需要发预检请求 options）
// Content-type="application/json" 为非简单请求
// 预检请求的有效期，单位为s，不然对同一个资源都还会再打到后端去做preflight
Access-Control-Max-Age = 300
```
# 一次前端项目内存泄漏排坑
```
// nuxt 内存泄露问题 & 优化
// 商品详情页有推荐其他商品的列表，在推荐列表中点击商品，进入该推荐商品的详情页，如此多几点几次内存增加了一倍
// 查看 Performance 一下三个指标增加较多
// JS heap size
// DOM Nodes(一些DOM的事件监听没有解绑，导致游离节点一直没有释放)
// JS event listenters(没有取消订阅)
// 排查过程：进行两次内存快照，选择 comparison ，比较两次快照的差异
// 过滤 detached
// delta 列表示两个快照净差值 
// 导致内存泄漏代码
// 1.dom 移除时，没有把对应事件给移除
V.directive('report', {
  bind(el) {
    if (option.onload) {
      el.addEventListener('load', option.onload);
    }
    if (option.onerror) {
      el.addEventListener('error', option.onerror);
    }
  },

  // dom 移除时，没有把对应事件给移除
  unbind(el) {
    if (option.onload) {
      el.removeEventListener('load', option.onload);
    }
    if (option.onerror) {
      el.removeEventListener('error', option.onerror);
    }
  }
});

// 2.组件销毁时，没有移除对应取消订阅
mounted() {
  eventBus.$on('***', this.updateList);
  // 组件销毁时，没有移除对应取消订阅
  this.$once('hook:beforeDestroy', () => {
    eventBus.$off('***', this.updateList);
	})
}

// 3.三方库使用完毕忘记调用其销毁方法，如复制分享链接的功能，使用了clipboard.js
mounted() {
  this.clipboard = new Clipboard('#copyLinkBtn');
  clipboard.on('success', () => {
    // do something
  });
  // 组件销毁时，没有销毁三方组件
  this.$once('hook:beforeDestory', () => {
    this.clipboard.destroy();
    this.clipboard = null;
  })
}

// 其他可能造成内存泄漏的原因
1.  全局变量，未声明变量
2.  DOM脱离文档流仍被引用
3.  被正确的闭包的使用
4.  被遗忘的定时器
5.  Node.js 内存泄漏排查，heapdump 库产出快照，然后导入到 chrome devtool 中分析
// https://juejin.cn/post/6926501702216450062
```

# 浏览器缓存历史
```
//  强缓存
Expires(HTTP1.0): Exprires的值为服务端返回的数据到期时间（可能存在client、server时间不一致情况）。
Pragma(HTTP1.0)：HTTP1.0时的遗留字段，它用来向后兼容只支持 HTTP/1.0 协议的缓存服务器，那时候 HTTP/1.1 协议中的 Cache-Control 还没有出来。
Pragma: no-cache; // 与 Cache-Control: no-cache 效果一致。强制要求缓存服务器在返回缓存的版本之前将请求提交到源头服务器进行验证。
Cache-Control(HTTP1.1)
private：客户端可以缓存
public：客户端和代理服务器都可以缓存
max-age=t：缓存内容将在t秒后失效
no-cache：需要使用协商缓存来验证缓存数据
no-store：所有内容都不会缓存
// 协商缓存
Last-Modified：服务器在响应请求时，会告诉浏览器资源的最后修改时间。
if-Modified-Since：浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得的最后修改时间。
Etag：服务器响应请求时，通过此字段告诉浏览器当前资源在服务器生成的唯一标识（生成规则由服务器决定）
If-None-Match： 再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。
```
# 私服部署自定义 hooks，使用遇到依赖多版本 React 问题
// peerDependencies字段，就是用来供插件指定其所需要的主工具的版本，npm 3.0版开始，peerDependencies不再会默认安装。
```
// 报错：You might have more than one copy of React in the same app
// 刚开始自定义 hooks package.json 中 
"dependencies": {
  "react": "^16.13.1",
  "react-dom": "^16.13.1"
},
// 项目中的 package.json
"dependencies": {
  "react": "^16.18.0",
  "react-dom": "^16.18.0"
}
// 解决方法 在 hooks 的 package.json 中使用 peerDependencies 来管理依赖
"peerDependencies": {
    "react": ">=16.8",
    "react-dom": ">=16.8",
},
```
