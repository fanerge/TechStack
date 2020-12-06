# HTML 头部标签

```
// 自动刷新/跳转
<meta http-equiv="Refresh" content="5; URL=page2.html">
// 域名预解析 dns-prefetch
<link rel="dns-prefetch" href="//g.alicdn.com">
// preconnect。让浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析、TLS 协商、TCP 握手，通过消除往返延迟来为用户节省时间。
// prefetch/preload。两个值都是让浏览器预先下载并缓存某个资源，但不同的是，prefetch 可能会在浏览器忙时被忽略，而 preload 则是一定会被预先下载。
// prerender。浏览器不仅会加载资源，还会解析执行页面，进行预渲染。
// 对于同一个页面会有多个网址，指定 url 一个为权威的，避免爬虫爬虫爬取其他 url 而降低排名。
<link href="https://lagou.com/a.html" rel="canonical">
// OGP（Open Graph Protocal，开放图表协议 ）
// OGP 是 Facebook 公司在 2010 年提出的，目的是通过增加文档信息来提升社交网页在被分享时的预览效果。
// OGP 规范 https://ogp.me/
```
