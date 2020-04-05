# Authentication

WWW-Authenticate
Authorization
Proxy-Authenticate
Proxy-Authorization

# Caching

## Age

Age: seconds // 使用代理缓存的时间，如果为 0 则从 origin server 拿取最新的。

## Cache-Control

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

## Clear-Site-Data

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

## Expires

用来控制缓存的失效日期<br>
假如 Expires 和 Max-Age 均存在，那么 Max-Age 优先级更高。

```
Expires: <http-date> // 当为0时，代表过期
```

# Client hints

# Conditionals

## If-Modified-Since（request）

If-Modified-Since 只可以用在 GET 或 HEAD 请求中<br>
当与 If-None-Match 一同出现时，它（If-Modified-Since）会被忽略掉，除非服务器不支持 If-None-Match

## If-Unmodified-Since（request）

只有当资源在指定的时间之后没有进行过修改的情况下，服务器才会返回请求的资源，或是接受 POST 或其他 non-safe 方法的请求。
如果所请求的资源在指定的时间之后发生了修改，那么会返回 412 (Precondition Failed) 错误。

## If-None-Match（request）

是一个条件式请求首部。对于 GETGET 和 HEAD 请求方法来说，当且仅当服务器上没有任何资源的 ETag 属性值与这个首部中列出的相匹配的时候，服务器端会才返回所请求的资源，响应码为 200 。对于其他方法来说，当且仅当最终确认没有已存在的资源的 ETag 属性值与这个首部中所列出的相匹配的时候，才会对请求进行相应的处理。

## If-Match

在请求方法为 GET 和 HEAD 的情况下，服务器仅在请求的资源满足此首部列出的 ETag 值时才会返回资源。而对于 PUT 或其他非安全方法来说，只有在满足条件的情况下才可以将资源上传。

## Last-Modified（response）

作用向源头服务器确认资源最后修改时间（来确定 Client 资源的新鲜性，精确度为秒）<br>
由于精确度比 ETag 要低，所以这是一个备用机制<br>
If-Modified-Since 或 If-Unmodified-Since 首部的条件请求会使用这个字段

## ETag（response）

作用：对 Client 发送请求获取资源的指纹，指纹与 Client 端相同则证明资源新鲜。如果内容发生了变化，使用 ETag 有助于防止资源的同时更新相互覆盖（“空中碰撞”），此时返回 412 前提条件失败错误。

### 避免“空中碰撞”

在 ETag 和 If-Match 头部的帮助下，您可以检测到"空中碰撞"的编辑冲突。

### 缓存未更改的资源（If-None-Match/Etag）

使用的请求头 If-None-Match，响应头 Etag（请求资源时服务端返回）<br>
Client 非首次访问给定的 URL（设有 ETag 字段），显示资源过期了且不可用，客户端就发送值为 ETag 的 If-None-Match header 字段，服务器将客户端的 ETag 与其当前版本的资源的 ETag 进行比较，如果两个值匹配（即资源未更改），服务器将返回不带任何内容的 304 未修改状态，告诉客户端缓存版本可用（新鲜）。<br>
nginx，Etag 值是有最后修改的时间戳 和 Content-length 经过算法生成。

## Vary（response）

是一个 HTTP 响应头部信息，告诉客服端服务端会根据 Vary 中设置的 Header 来协商返回不同的内容（HTTP 内容协商）。<br>
HTTP 内容协商：同一个 URL 可以提供多份不同的文档，这就要求服务端和客户端之间有一个选择最合适版本的机制，这就是内容协商。<br>
HTTP 内容协商分为服务端驱动型内容协商机制，[代理驱动型内容协商机制（不建议使用）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Content_negotiation)
作用内容协商专用字段（Accept 字段）、其他字段（如 User-Agent, Cookie），这样对于开发来说，我们适配移动端和 PC 端可以使用同一个 URL，一般根据不同的 User-Agent, Cookie 字段做出区分。<br>
为了使缓存服务器恰当地工作，这个首部是必要的。缓存服务器为了能够与服务端驱动型内容协商机制协同工作，需要知道服务器选择传送内容的决策依据。
[HTTP 协议中 Vary 的一些研究](https://imququ.com/post/vary-header-in-http.html)

# Connection management

在 HTTP/2 协议中， Connection 和 Keep-Alive 是被忽略，会采用其他机制来进行连接管理。

## Connection

Connection 决定当前的事务完成后，是否会关闭网络连接。

```
Connection: close // 表明客户端或服务器想要关闭该网络连接，这是HTTP/1.0请求的默认值
Connection: keep-alive // 表面网络连接就是持久的，不会关闭，使得对同一个服务器的请求可以继续在该连接上完成。
```

## Keep-Alive

需要配合 Connection: Keep-Alive 使用，用于设置该连接的 timeout 超时时间 和 max 最大连接数

```
Keep-Alive: timeout=5, max=1000
```

是一个通用消息头，允许消息发送者暗示连接的状态，还可以用来设置超时时长和最大请求数。

# Content negotiation（内容协商）

```
Accept // 请求头用来告知（服务器）客户端可以处理的内容类型，这种内容类型用MIME类型来表示。
Accept-Charset // 请求头用来告知（服务器）客户端可以处理的字符集类型。
Accept-Encoding // 将客户端能够理解的内容编码方式——通常是某种压缩算法通知给服务端。
Accept-Language // 请求头允许客户端声明它可以理解的自然语言，以及优先选择的区域方言。
```

# Cookies

## Set-Cookie（response）

作用服务器端向客户端发送 cookie（并写入到客户端，以便后面访问继续携带）<br>
每次只能写入一个 cookie，需要写入多个 cookie，则需要多次使用 Set-Cookie

```
<cookie-name>=<cookie-value>
// cookie 生命周期（会话期 cookie为Expires，Max-Age都不设置）
Expires=<date>  // cookie 的最长有效时间，形式为符合 HTTP-date 规范的时间戳
Max-Age=<non-zero-digit> // cookie 多少秒后失效。秒数为 0 或 -1 将会使 cookie 直接过期
// cookie 作用域
Domain=<domain-value>  // 假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。假如指定了域名，那么相当于各个子域名也包含在内了。
Path=<path-value> // 指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部。
// cookie安全方面
Secure // 一个带有安全属性的 cookie 只有在请求使用SSL和HTTPS协议的时候才会被发送到服务器。
HttpOnly // 设置了 HttpOnly 属性的 cookie 不能使用 JavaScript 经由  Document.cookie 属性、XMLHttpRequest 和  Request APIs 进行访问，以防范跨站脚本攻击（XSS）。
SameSite=Lax // 允许服务器设定 cookie 是否随着第三方网站请求一起发送，这样可以在一定程度上防范跨站请求伪造攻击（CSRF）。
// 设置SameSite=None ，同时也需要设置 Secure属性
```

## Cookie（request）

有先前由服务器通过 Set-Cookie 首部投放并存储到客户端的 HTTP cookies。

```
// PS：如果需要自定义Cookie Header，最后一个不能带“;”，否则服务端不能接收到
Cookie: name=value; name2=value2; name3=value3
```

## CORS

```
Access-Control-Allow-Origin
Access-Control-Allow-Credentials // cookies, authorization headers，需要客户端配置xhr.withCredentials = true;
Access-Control-Allow-Headers // 用于 preflight request （预检请求）中，列出了将会在正式请求的 Access-Control-Request-Headers 字段中出现的首部信息。
Access-Control-Allow-Methods // 对 preflight request.（预检请求）的应答中明确了客户端所要访问的资源允许使用的方法或方法列表。
Access-Control-Expose-Headers // 列出了哪些首部可以作为响应的一部分暴露给外部。
Access-Control-Max-Age // 表示 preflight request  （预检请求）的返回结果（即 Access-Control-Allow-Methods 和Access-Control-Allow-Headers 提供的信息） 可以被缓存多久。
Access-Control-Request-Headers // 出现于 preflight request （预检请求）中，用于通知服务器在真正的请求中会采用哪些请求头。
Access-Control-Request-Method
Origin // 指示了请求来自于哪个站点
Timing-Allow-Origin // 指定特定站点，以允许其访问Resource Timing API提供的相关信息，否则这些信息会由于跨源限制将被报告为零
```

# Do Not Track

## DNT

请求首部 DNT (Do Not Track) 表明了用户对于网站追踪的偏好。它允许用户指定自己是否更注重个人隐私还是定制化内容。

```
DNT: 0 // 表示用户愿意目标站点追踪用户个人信息。
DNT: 1 // 表示用户不愿意目标站点追踪用户个人信息。
// 用户对 DNT 的设置还可以使用 navigator.doNotTrack 属性进行读取
```

## TK

Tk 响应首部显示了对相应请求的跟踪情况。

# Downloads

## Content-Disposition（response）

表示返回的内容该以何种形式展示，是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地。

```
Content-Disposition: inline // 网页的一部分
Content-Disposition: attachment // 下载到本地
Content-Disposition: attachment; filename="filename.jpg" // 下载到本地，并重命名为filename
```

# Message body information

```
Content-Length // 用来指明发送给接收方的消息主体的大小，即用十进制数字表示的八位元组的数目。
Content-Type // 指示资源的MIME类型
Content-Encoding // 表示资源的压缩方式
Content-Language //
Content-Location // 返回的数据的地址选项。最主要的用途是用来指定要访问的资源经过内容协商后的结果的URL。
```

# Proxies

```
Forwarded // 包含了代理服务器的客户端的信息，即由于代理服务器在请求路径中的介入而被修改或丢失的信息。
X-Forwarded-For // 在客户端访问服务器的过程中如果需要经过HTTP代理或者负载均衡服务器，可以被用来获取最初发起请求的客户端的IP地址，这个消息首部成为事实上的标准。
X-Forwarded-Host // 用来确定客户端发起的请求中使用  Host  指定的初始域名。
X-Forwarded-Proto // 用来确定客户端与代理服务器或者负载均衡服务器之间的连接所采用的传输协议（HTTP 或 HTTPS）。
Via // 是由代理服务器添加的，适用于正向和反向代理，在请求和响应首部中均可出现。(防止循环请求)
```

# Redirects

## Location

将页面重新定向至的地址。一般在响应码为 3xx 的响应中才会有意义。

```
// 301和302 规范规定不会转变初始请求中的方法，但并不是所有的用户代理都会遵循这一点
// 推荐只在请求方式为 GET 或 HEAD 使用301和302 其余使用 308 和 307
301 // Permanent Redirect
302 // Moved Temporarily
303 // See Other 会转变初始请求中的方法为GET
// 307和308（不会转变初始请求中的方法）
307 // Temporary Redirect 原始请求中的请求方法和消息主体会在重定向请求中被重用
308 // Permanent Redirect 说明请求的资源已经被永久的移动到了由 Location 首部指定的 URL 上。
// 状态码 307 与 302 之间的唯一区别在于，当发送重定向请求的时候，307 状态码可以确保请求方法和消息主体不会发生变化。
// 当响应状态码为 302 的时候，一些旧有的用户代理会错误地将请求方法转换为 GET。
```

# Request context

## From

From 中包含一个电子邮箱地址，这个电子邮箱地址属于发送请求的用户代理的实际掌控者的用户。

## Host

指明了服务器的域名，以及（可选的）服务器监听的 TCP 端口号。<br>
HTTP/1.1 的所有请求报文中必须包含一个 Host 头字段。<br>
如果一个 HTTP/1.1 请求缺少 Host 头字段或者设置了超过一个的 Host 头字段，一个 400（Bad Request）状态码会被返回。

## Referer

请求头包含了当前请求页面的来源页面的地址，即表示当前页面是通过此来源页面里的链接进入的。<br>
服务端一般使用 Referer 请求头识别访问来源，可能会以此进行统计分析、日志记录以及缓存优化等。<br>

## Referrer-Policy

用来监管哪些访问来源信息——会在 Referer 中发送——应该被包含在生成的请求当中。

```
Referrer-Policy: no-referrer // 整个 Referer  首部会被移除。
Referrer-Policy: no-referrer-when-downgrade // HTTPS 发送，HTTP 不发送
Referrer-Policy: origin
Referrer-Policy: origin-when-cross-origin
Referrer-Policy: same-origin
Referrer-Policy: strict-origin
Referrer-Policy: strict-origin-when-cross-origin
Referrer-Policy: unsafe-url
```

## User-Agent

用来记录用户代理软件的应用类型、操作系统、软件开发商以及版本号的一个字符串。

# Response context

## Allow

用于枚举资源所支持的 HTTP 方法的集合。<br>
若服务器返回状态码 405 Method Not Allowed，则该首部字段亦需要同时返回给客户端。

## Server

首部包含了处理请求的源头服务器所用到的软件相关信息。<br>
应该避免使用过长或者过于详细的描述作为 Server 的值，因为这有可能泄露服务器的内部实现细节，有利于攻击者找到或者探测已知的安全漏洞。

# Range requests

## Accept-Ranges

表明服务器表示自身支持范围请求(partial requests)。<br>
字段的具体值用于定义范围请求的单位。<br>
当浏览器发现 Accept-Ranges 头时，可以尝试继续中断了的下载，而不是重新开始。

## Range

告知服务器返回文件的哪一部分。在一个 Range 首部中，可以一次性请求多个部分，服务器会以 multipart 文件的形式将其返回。

```
206 Partial Content 状态码
416 Range Not Satisfiable 状态码（请求的范围不合法）
```

## If-Range

用来使得 Range 头字段在一定条件下起作用：当字段值中的条件得到满足时，Range 头字段才会起作用，同时服务器回复 206 部分内容状态码，以及 Range 头字段请求的相应部分。<br>
If-Range 头字段通常用于断点续传的下载过程中，用来自从上次中断后，确保下载的资源没有发生改变。

## Content-Range

显示的是一个数据片段在整个文件中的位置。

> 参考文档
> [MDN HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
