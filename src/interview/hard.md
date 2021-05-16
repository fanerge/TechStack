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
https://mp.weixin.qq.com/s/ZfhKh7BkfzCXA7C6D3Waaw
```
// TODO
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
