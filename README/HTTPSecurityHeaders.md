# 安全相关的header
##  Content-Security-Policy
CSP 通过指定允许加载哪些资源来防止跨站点脚本。
```
# 默认只允许来自当前站点的内容
# 允许来自当前网站和 imgur.com 的图片
# 不允许使用 Flash 和 Java 等对象
# 只允许来自当前站点的脚本
# 仅允许当前站点的样式
# 只允许当前站点的 frame
# 将 <base> 标记中的 URL 限制为当前站点
# 允许表单仅提交到当前站点
Content-Security-Policy: default-src 'self'; img-src 'self' https://i.imgur.com; object-src 'none'; script-src 'self'; style-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self';

```
##  Strict-Transport-Security
这个 Header 告诉浏览器，该网站应仅允许 HTTPS 访问（包括子域名）。
```
Strict-Transport-Security: max-age=3600; includeSubDomains
```
##  X-Content-Type-Options
确保浏览器遵守应用程序设置的 MIME 类型。这有助于防止某些类型的跨站点脚本绕过。
```
X-Content-Type-Options: nosniff
```
##  X-Frame-Options
这个 Header 指是否应该允许站点在 iFrame 中显示，非标准可以使用CSP frame-ancestrs 指令取代。
##  Access-Control-Allow-Origin
##  Set-Cookie
需要添加Secure，HttpOnly，samesite
##  X-XSS-Protection
这个 Header 指示浏览器停止检测到的跨站点脚本攻击的执行。它通常是低风险设置，但仍应在投入生产前进行测试。
# 缓存相关的header
##  Cache-Control
针对不同的内容类型使用不同的缓存策略，任何具有敏感数据的页面，例如用户页面或客户结帐页面，都应该设置为无缓存。
##  Expires
这将设置当前请求缓存到期的时间。
## Etag && If-None-Match
Etag 与 If-None-Match 是对应的，前者是响应头，后者是请求头。服务器要判断请求内容计算得到的 etag 是否与请求头 If-None-Match 是否一致，如果一致就表示没有更新，返回 304 就可，否则按正常请求处理。
##  If-Modified-Since && Last-Modified
Last-Modified 与 If-Modified-Since 对应的，前者是响应头，后者是请求头。服务器要处理 If-Modified-Since 请求头与 Last-Modified 对比看是否有更新，如果没有更新就返回 304 响应，否则按正常请求处理。如果要在动态内容中使用它们，那就要程序来处理了。

> 参考文档
[HTTP Security Headers 完整指南](https://juejin.im/post/5d648e766fb9a06b122f4ab4)
[Last-Modify、ETag、Expires和Cache-Control](https://www.cnblogs.com/coolmanlee/archive/2012/12/06/2805030.html)
