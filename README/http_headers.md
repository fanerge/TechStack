# Authentication
WWW-Authenticate
Authorization
Proxy-Authenticate
Proxy-Authorization

# Caching
##  Age
Age: seconds // 使用代理缓存的时间，如果为 0 则从 origin server 拿取最新的。
##  Cache-Control
Pragma 为了解决 Cache-Control 的兼容性，为非标准
### Cache request directives
```
Cache-Control: max-age=<seconds> // 缓存生存周期
Cache-Control: no-cache // 必须先与服务器确认缓存是否新鲜，再决定是使用缓存还是重新拿取数据（易混淆）
Cache-Control: no-store // 所有内容都不会被缓存到缓存或 Internet 临时文件中
Cache-Control: no-transform // 禁止将网站转码（禁止搜索引擎转换网站给不同终端，如移动端和PC端）
// 和代理服务器相关
Cache-Control: max-stale[=<seconds>] // 表示 client 到代理服务器上拿缓存的时候，即使代理缓存过期了 seconds 内仍然可以使用
Cache-Control: min-fresh=<seconds> // 保证代理缓存的新鲜度到期前 5 秒之前的时间拿，否则拿不到（代理缓存失效）
Cache-Control: only-if-cached // 客户端只会接受代理缓存，而不会接受源服务器的响应
```
### Cache response directives
```
Cache-Control: must-revalidate // 如果缓存的内容失效，请求必须发送到服务器
Cache-Control: proxy-revalidate // 如果缓存的内容失效，请求必须发送到代理以进行重新验证
Cache-Control: public // 所有内容都将被缓存(客户端和代理服务器都可缓存)
Cache-Control: private // 内容只缓存到私有缓存中(仅客户端可以缓存，代理服务器不可缓存)
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: no-transform
Cache-Control: max-age=<seconds>
Cache-Control: s-maxage=<seconds> // 优先于 max-age 和 Expires，不适用于 Cache-Control: private
```
##  Clear-Site-Data
服务器可以清除 Client 数据(cookies, storage, cache) ，可以单个指令及多个指令以及通配符
```
Clear-Site-Data: "cache" // 清除 HTTP Cache
Clear-Site-Data: "cookies" // 清除当前域及所有子域的 cookies
Clear-Site-Data: "storage" // 清除所有的localStorage、sessionStorage、IndexedDB、Service worker、AppCache等
Clear-Site-Data: "executionContexts" // Server 期望 origin Server 重新加载上下文，类似于 location.reload()（兼容性堪忧）
Clear-Site-Data: "cache", "cookies" // 
// Wild card
Clear-Site-Data: "*" // Server 期望清除上面所有
```
应用：如用户退出登录，可以
```
Clear-Site-Data: "cache", "cookies", "storage", "executionContexts"
Clear-Site-Data: "*"
```
清除所有 cookies ，不在需要 Set-cookie 将期设置为过期时间

##  Expires
用来控制缓存的失效日期<br>
假如 Expires 和 Max-Age 均存在，那么 Max-Age 优先级更高。
```
Expires: <http-date> // 当为0时，代表过期
```

# Client hints

# Conditionals







> 参考文档
[MDN HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)