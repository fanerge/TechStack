#   Preload，Prefetch，Preconnect和Prerendering
##  Preload（加载必需的资源，默认不会加载完立即执行）
允许在 head 元素内部书写一些声明式的资源获取请求，可以指明哪些资源是在页面加载完成后即刻需要的。
```
// 预加载样式1
<link rel="preload" href="style.css" as="style" type="text/css">
<link rel="style" href="style.css">
// 预加载样式2，并加载完立即使用
<link rel="preload" href="style.css" onload="this.rel=stylesheet" type="text/css">
// 预加载script
<link rel="preload" href="script.js" as="script" type="..">
<script async src="cript.js"></script>
```
一个有趣的情况是，如果你需要获取的是字体文件，那么即使是非跨域的情况下，也需要应用这一属性。crossorigin="anonymous"<br>
需要 type 属性，因为浏览器将使用 type 属性来判断它是否支持这一资源，如果浏览器支持这一类型资源的预加载，下载将会开始，否则便对其加以忽略。
##  Prefetch（加载非必需的资源）
Prefetch 是一个低优先级的资源提示，允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。
```
// 下个页面需要的资源
<link rel="prefetch" href="/uploads/images/pic.png">
```
### DNS Prefetching
DNS prefetching 允许浏览器在用户浏览页面时在后台运行 DNS 的解析。
```
<link rel="dns-prefetch" href="//www.google-analytics.com"> 
```
### Prerendering
Prerendering 和 prefetching 非常相似，它们都优化了可能导航到的下一页上的资源的加载，区别是 prerendering 在后台渲染了整个页面，整个页面所有的资源。<br>
要小心的使用 prerender，因为它将会加载很多资源并且可能造成带宽的浪费，尤其是在移动设备上。<br>
```
<link rel="prerender" href="https://www.keycdn.com">
```
可以通过 chrome://net-internals/#prerender 查看是否有页面prerender<br>
或者这个网址也可以http://prerender-test.appspot.com/<br>

##  总结
preload 当前页面需要的资源（关键的脚本，字体，主要图片等）。
prefetch 加载非当前页面的资源。
在切换页面是 preload 会终止，而 prefetch 不会终止。
prefetch 请求在未指定的网络堆栈缓存中至少保存 5 分钟。
preload 比 prefetch 优先级高。
preload 不会阻塞 window 的 onload 事件。
preload 的 as 可选值：script、style、image、font、document等
### 如何防止二次获取？
不要用 prefetch 作为 preload 的后备方案 ，它们适用于不同的场景，而且这样会发生二次获取。
preload 带 as 和 crossorigin 属性，否则可能将二次下载。
### preload 比 HTTP/2 PUSH 的优势？
使用 preload 可以使资源的开始下载时间更接近初始请求。
推送不能用于第三方资源的内容。
## Preconnect
preconnect 允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析，TLS 协商，TCP 握手，这消除了往返延迟并为用户节省了时间。<br>
```
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

参考文档：
[Web 性能优化：Preload, Prefetch 的使用及在 Chrome 中的优先级](https://juejin.im/post/5cec8b3af265da1bb31c188a)
[资源提示 —— 什么是 Preload，Prefetch 和 Preconnect？](https://juejin.im/post/5b5984b851882561da216311)