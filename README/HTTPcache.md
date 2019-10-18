# 强缓存
##  Cache-Control（请求头和响应头）
通过它提供的不同的值来定义缓存策略。
```
# 缓存过期机制（多少秒后过期）
Cache-Control: max-age=<seconds>
Cache-Control: s-maxage=<seconds>
覆盖max-age或者Expires头，但是仅适用于共享缓存(比如各个代理)，私有缓存会忽略它。
# 禁止进行缓存
Cache-Control: no-store
# 强制确认缓存
Cache-Control: no-cache
# 缓存验证确认
Cache-Control: must-revalidate
# public
表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存
# private
表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）
```
##  Expires（响应头）
响应头包含日期/时间， 即在此时候之后，响应过期。<br>
如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age" 指令，那么 Expires 头会被忽略。<br>
```
# 设置资源的到期时间
Expires: <http-date> // 一个 HTTP-日期 时间戳
```
# 协商缓存（验证资源的新鲜度）
##  If-None-Match/ETag
ETag响应头，资源的特定版本的标识符
If-None-Match 一个条件式请求首部。
```
# 资源请求后响应的etag
ETag: W/"<etag_value>"
ETag: "<etag_value>"
// 'W/'(大小写敏感) 表示使用弱验证器。
```
在下次请求该资源时，If-None-Match携带上次接收到的 etag 值，服务器拿到这个 etag 值和服务器上的该资源的 etag 进行验证。
##  If-Modified-Since/Last-Modified
Last-Modified  是一个响应首部，其中包含源头服务器认定的资源做出修改的日期及时间。
If-Modified-Since 或 If-Unmodified-Since 首部的条件请求会使用这个字段。<br>
服务器只在所请求的资源在给定的日期时间之后对内容进行过修改的情况下才会将资源返回，状态码为 200。如果请求的资源从那时起未经修改，那么返回一个不带有消息主体的  304  响应，而在 Last-Modified 首部中会带有上次修改时间。

# Service Worker
Service workers 本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。
