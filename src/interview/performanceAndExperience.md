# performance
##  缩短首屏渲染
```
1.  SSR
2.  首屏 SSR（估算最大值如7000px的网页，最高屏幕分辨率 1080）+ 剩余部分使用 CSR，需要SEO的话，需要适当调整部分模块 SSR
3.  chrome devtools 瀑布流分析 Request sent、TTFB（waiting）、Content Download
4.  合理使用缓存
```
##  其他性能优化
```
// 减少重排重绘的影响范围
chrome devtools > more tools > layers 可以查看到合成器产生的原因及内存开销
产生合成器的原因：document、transform 3D、fixed or sticky position、scollable overflow element、will-change 等等
创建合成器后，合成器和周边元素的重排重绘不会相互影响
原理：javascript 》style》layout》paint》composite，合成器之后 javascript 》style》composite

// dns-prefetch
<link rel="dns-prefetch" href="//bdimg.share.baidu.com" />
// prefetch && preload
// script 合理使用 async && defer
// css 解析规则 从右向左 ，尽量选择器不要超过4级
// throttle、debounce 减少高频函数执行频率
// 图片懒加载 IntersectionObserver 来实现是否在视口可见来动态加载
// WebSocket 代替轮询
// Web Workers 技术做一些复杂计算，通过 postMessage 来发送数据
// 图片使用试探性 webp，先判断浏览器是否支持 webp，如css中使用，需动态添加 class 来应用webp图片作为背景
// 使用事件委托，vue中绑定事件没有使用事件委托如果太多子项目都绑定事件需委托处理
// 服务端支持，http2 协议升级 新特性 hpack、多路复用、push cache
// 服务端支持，gzip 等压缩文件
```
# experience
```
// 对于轮播，使用图片预加载，来避免切换再加载图片闪烁
// 表单提交时，某个表单验证不通过，自动滚动到视口  el.scrollIntoView（VUE 自定义 directive 实现）
// 体验一致性，如 dialog 中确认按钮和取消按钮的位置以及色系
// 文本省略设置 title 属性或者自定义 tips
```
