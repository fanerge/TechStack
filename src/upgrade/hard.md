# 一次前端项目内存泄漏排坑（更合适点）
```
// nuxt 内存泄露问题 & 优化
// 商品详情页有推荐其他商品的列表，在推荐列表中点击商品，进入该推荐商品的详情页，如此多几点几次内存增加了几倍
// 查看 Performance 一下三个指标增加较多
// JS heap size
// DOM Nodes(一些DOM的事件监听没有解绑，导致游离节点一直没有释放)
// JS event listenters(没有取消订阅)
// 排查过程：进行两次内存快照，选择 comparison ，比较两次快照的差异
// 过滤 detached
// delta 列表示两个快照净差值 
// 导致内存泄漏代码
// 1.dom 移除时，没有把对应事件给移除
Vue.directive('report', {
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
3.  未正确的使用闭包
4.  被遗忘的定时器
5.  Node.js 内存泄漏排查，heapdump 库产出快照，然后导入到 chrome devtool 中分析
// https://juejin.cn/post/6926501702216450062
```
# CJK 输入的问题

在中文输入是会频繁触发 input 事件，我们应该在待确认文本选择时才触发对应事件
对应事件先后顺序
compositionstart > compositionupdate > input > compositionend

```
// 解决思路
let iscomposing = false;
$('input').on('compositionstart', function(e){
  // 这里就阻止 input 在中文没选择时就执行
  iscomposing = true;
})
$('input').on('input', function(e){
  if(!iscomposing) {
    // todo
    inputDoing()
  }
})
$('input').on('compositionend', function(e){
  // 如果输入非CJK文字，则不存在该问题，需重置为 false
  iscomposing = false;
  // CJK被阻止了，所以这里要执行一次
  inputDoing()
})
```
# Unicode
```
String.prototype.length;
该属性返回字符串中字符编码单元的数量。JavaScript 使用 UTF-16 编码，该编码使用一个 16 比特的编码单元来表示大部分常见的字符，使用两个代码单元表示不常用的字符。因此 length 返回值可能与字符串中实际的字符数量不相同。
```
# IEEE754
```
// 0.1+0.2 !== 0.3 IEEE754 64bit 表示数字
//#region 
/**
 * 符号位：决定正负，0为正，1为负(1位符号位)
 * 阶码：指数位则为阶码-1023，决定了数值的大小(11位指数位)
 * 尾数：有效数字，决定了精度(52位尾数位)
 * v = (-1^(符号位0/1 s)) * 1.xxxxx(尾数位 f) * 2^(指数位 e)
 * v: 浮点数具体值
 * s: 符号位，即正负号，0 为正，1 为负（共1位）
 * m: 有效数，也叫尾数，可以类比科学计数法前面的有效数字（共53位，52 + 1不用存储，固定），另外还有一个小数位 f, m = 1 + f
 * e: 指数位，即 2 的多少次方（共11位），指数位则为阶码-1023
 * 1.进制转换和对阶运算会发生精度丢失
 * why进制转换？计算机硬件决定，只能进行2进制运算
 * why对阶运算？两个进行运算的浮点数必须阶码对齐（指数位数相同），才能进行尾数加减运算
 */
//#endregion
```
# 前端获取图片的信息
```
// 如何区分图片的类型()
new Uint16Array(buffer)
// 如何获取图片的尺寸（读取二进制数据的内容）
https://github.com/image-size/image-size
```
# 一次跨域CORS服务端配置排坑
```
// 简单跨域
Access-Control-Allow-Origin = '*' // 也可以指定一个域名
// 允许 client 使用什么方法
Access-Control-Allow-Methods //  method
// 允许 client 携带那些 header
Access-Control-Allow-Headers: <header-name>[, <header-name>]* // 已逗号分割
// 允许 client 解析那些 header（不然 client 读取对应 header 为 null）
Access-Control-Expose-Headers: Content-Length, X-Kuma-Revision
// 携带cookie等
Access-Control-Allow-Origin = '指定域名（只能设置一个域名）'
Access-Control-Allow-Credentials = true // 是否允许发送 Cookie
客户端还需要设置withCredentials
如fetch，credentials='include'
如xhr，withCredentials=true
// 非简单请求（需要发预检请求 options）
// preflight 会发送 header
Access-Control-Request-Method
Access-Control-Request-Headers
// Content-type="application/json" 为非简单请求
// 预检请求的有效期，单位为s，不然对同一个资源都还会再打到后端去做preflight
Access-Control-Max-Age = 300
```
# 浏览器缓存机制
##  缓存位置（划分）
[](https://mp.weixin.qq.com/s/A93VNkEKTVb982knhVN4eQ)
[](https://mp.weixin.qq.com/s/CyfDErD8u2CNZwkV7NdxIw)
如果以下四种缓存都没有命中的话，那么只能发起请求来获取资源了。
// 在 size 列中现实具体的获取缓存的位置 
缓存命中的优先级：Memory Cache > Service Worker > Disk Cache（HTTP Cache）> Push Cache
```
// from memory cache
// from ServiceWorker
// from prefetch cache // 如果没有对 preload 或 prefetch 的请求设置 Http Cache Header 缓存则会使用 memory cache，设置了 Http Cache Header 则使用 disk cache
// from disk cache
```
### Memory Cache
```
// from memory cache
Memory Cache 也就是内存中的缓存，主要包含的是当前中页面中已经抓取到的资源,例如页面上已经下载的样式、脚本、图片等。
优缺点：读取内存中的数据肯定比磁盘快，可是缓存持续性很短，会随着进程的释放而释放。
内存缓存在缓存资源时并不关心返回资源的 HTTP 缓存头 Cache-Control
```
### Service Worker
```
// from ServiceWorker
Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。
使用 Service Worker ，传输协议必须为 HTTPS，涉及到请求拦截（安全）。
Service workers 本质上充当客户端与服务端之间的代理服务器。这个 API 创建了有效的离线体验，它会拦截网络请求并根据网络是否可用采取来适当的动作、更新来自服务器的的资源。
解决痛点：建立有效的离线体验。
Service Worker 生命周期：
1.  下载
  用户首次访问，下载 Service Worker 代码
2.  安装
  然后监听到 install 事件以后就可以缓存需要的文件
3.  激活
  在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据
```
### Disk Cache（HTTP Cache）
```
// from disk cache
Disk Cache 也就是存储在硬盘中的缓存
优缺点：读取磁盘中的数据肯定比内存慢，但是缓存持续性很长，容量比内存较大（使用最广泛的）。
Disk Cache 会 HTTP Header 中的字段判断哪些资源需要缓存。
```
####  HTTP Herder 缓存相关
优先级：Etag > last-modified > cache-control:s-maxage > cache-control:max-age > Expires
```
//  强缓存
Expires = <http-date>
Expires(HTTP1.0): Exprires的值为服务端返回的数据到期时间（可能存在client、server时间不一致情况）。
Expires = <http-date> // 时间戳，无效的日期，比如 0, 代表着过去的日期，即该资源已经过期
Cache-Control(HTTP1.1)
private：客户端可以缓存
public：客户端和代理服务器都可以缓存
max-age=t 缓存内容将在t秒后失效（单位为 s）
s-maxage=t 代理服务器缓存在t秒后消失（单位为 s）
no-cache：需要使用协商缓存来验证缓存数据
no-store：所有内容都不会缓存
// 协商缓存
Last-Modified= <http-date>
Last-Modified：服务器在响应请求时，会告诉浏览器资源的最后修改时间，精确到秒。
if-Modified-Since：浏览器再次请求服务器的时候，请求头会包含此字段，后面跟着在缓存中获得的最后修改时间。
Etag= W/"<etag_value>"
Etag：服务器响应请求时，通过此字段告诉浏览器当前资源在服务器生成的唯一标识
Etag 一般生成规则，内容的散列、最后修改时间戳的哈希值、简单地使用版本号等 nginx （content-length + last-modified 的哈希值）
Etag：'W/'(大小写敏感) 表示使用弱验证器。 弱验证器很容易生成，但不利于比较。 强验证器很容易比较，但很难有效地生成。 相同资源的两个弱Etag值可能语义等同，但不是每个字节都相同。
强验证类型（Strong validation）应用于需要逐个字节相对应的情况，例如需要进行断点续传的时候
弱验证类型（Weak validation）应用于用户代理只需要确认资源内容相同即可。即便是有细微差别也可以接受，比如显示的广告不同，或者是页脚的时间不同
If-None-Match： 再次请求服务器时，浏览器的请求报文头部会包含此字段，后面的值为在缓存中获取的标识。
// 其他
Vary 响应头
Vary HTTP 响应头决定了对于后续的请求头，如何判断是请求一个新的资源还是使用缓存的文件。
Vary = * // 所有的请求都被视为唯一并且非缓存的，类似 Cache-Control: no-store。
Vary 当缓存服务器收到一个请求，只有当前的请求和原始（缓存）的请求头跟缓存的响应头里的Vary都匹配，才能使用缓存的响应。
意思就是说：url 和之前请求的url匹配 且 请求头包含之前 Vary 返回的请求头且值相等，才会使用缓存，否则将重新获取资源。
Vary 使用场景，对于User-Agent 头部信息，例如你提供给移动端的内容是不同的，可用防止你客户端误使用了用于桌面端的缓存（内容协商策略）。
Pragma(HTTP1.0)：HTTP1.0时的遗留字段，它用来向后兼容只支持 HTTP/1.0 协议的缓存服务器，那时候 HTTP/1.1 协议中的 Cache-Control 还没有出来。
Pragma: no-cache; // 与 Cache-Control: no-cache 效果一致。强制要求缓存服务器在返回缓存的版本之前将请求提交到源头服务器进行验证。
```
#### 浏览器会如何内存使用硬盘呢？（目前没有规范明确指明）
```
// 以下两个观点比较靠得住
对于大文件来说，大概率是不存储在内存中的，反之优先
当前系统内存使用率高的话，文件优先存储进硬盘
```
### Push Cache
```
Push Cache（推送缓存）是 HTTP/2 中的内容
它只在会话（Session）中存在，一旦会话（连接断开）结束就被释放，并且缓存时间也很短暂，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。
Nginx 设置 HTTP push
http2_push_preload on;
add_header Link "<URL>; rel=preload; as=TYPE; [crossorigin]";
// 预加载 和 HTTP/2 push 很类似，预加载总是比 HTTP/2 push 慢一点
<link
  rel="preload"
  href="https://fonts.example.com/font.woff2"
  as="font"
  crossorigin
  type="font/woff2"
/>
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
# Form 实现 scrollFirstError

element-ui 的 Form 组件不支持 scrollFirstError
VUE 自定义 directive，在钩子函数中有个叫 vnode 的属性，vnode.componentInstance 可以拿到组件的实例
通过重写 componentInstance 的 validate 方法

```
const form = vnode.componentInstance
let oldValidate = from.validate;
from.validate = (callback) => {
  let promise = new Promise((resolve, reject) => {
    oldValidate().then(valid => {
      resolve(valid)
    }).catch(error => {
      let errorList = form.fields.filter(d => d.validateState === 'error')
      // 即可实现
      errorList[0].$el.scrollIntoView();
    })
  })
  return promise;
}
```
# CommonJS和ESModule区别
##  require/exports(module.exports) 是运行时动态加载，import/export 是静态编译
CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成
##  require/exports 输出的是一个值的拷贝，import/export 模块输出的是值的引用
require/exports 输出的是值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
import/export 模块输出的是值的引用。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。
等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
PS：若文件引用的模块值改变，require 引入的模块值不会改变，而 import 引入的模块值会改变。
##  exports 是对 module.exports 的引用
相当于 exports = module.exports = {};
// 在不改变 exports 指向的情况下，使用 exports 和 module.exports 没有区别
##  ES6 模块可以在 import 引用语句前使用模块，CommonJS 则需要先引用后使用
##  import/export 只能在模块顶层使用，不能在函数、判断语句等代码块之中引用；require/exports 可以


  
