# 编码时优化
```
dns-prefetch 域名预解析
preload 进行内容预加载，指明哪些资源是在页面加载完成后即刻需要的。
prefetch 用户未来的浏览有可能需要加载目标资源
避免重绘（Repaint）和回流（Reflow），will-change、translateZ等会产生信息合成层
事件委托
防抖（debounce）/节流（throttle）
```
# 长列表性能优化
虚拟列表只渲染用户可见部分的数据，复用DOM。[具体实现](https://zhuanlan.zhihu.com/p/34585166)
# 路由懒加载
```
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```
# 组件按需加载
babel-plugin-import
import { Button } from 'antd'

# 图片相关的优化
1.  未出现在可视区域内的图片先不做加载， 等到滚动到可视区域后再去加载。 vue-lazyload IntersectionObserver 来实现
2.  chrome 推出的 loading="lazy"，原生支持
3.  使用压缩算法更好且不损失图片质量的图片 webp等
document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0

# 服务端配合
开启gzip压缩
浏览器缓存（强缓存和协商缓存）
CDN 的使用
服务端渲染（SSR）和预渲染（Prerender）
启用 HTTP/2
1.  二进制传输（之前是纯文本形式）
2.  Header 压缩（HPACK 算法）哈夫曼编码来压缩
3.  多路复用（解决头部阻塞--乱序传递，但不能解决丢包重传)
4.  流的优先级（权重和继承或者依赖，20200415 更新）
5.  Server Push（服务器推送）
6.  提高安全性（TLS，之前是明文）

# Webpack的优化
```
1.  基于 ES modules 的 tree shaking
2.  Webpack 对图片优化，url-loader 将图片转化为 base64 格式，image-webpack-loader 来压缩其余图片。
3.  提取公共代码 CommonsChunkPlugin，v4后 optimization.splitChunks和optimization.runtimeChunk来代替。
  splitChunks是用来设置代码如何打包和分割的。
  runtimeChunk作用是为了线上更新版本时，充分利用浏览器缓存，提升用户体验（使部分旧的文件hash后缀保持不变，缓存继续有效，runtime.xxx.js变化）。

```

