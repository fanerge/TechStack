# HTTP 报文结构
起始行 + 头部 + 空行 + 实体<br>
空行的作用区分开头部和实体。
##  请求起始行
```
GET /home HTTP/1.1
```
##  响应起始行
```
HTTP/1.1 200 OK
```

# HTTP的八大方法
```
GET: 通常用来获取资源
HEAD: 获取资源的元信息（应用，下载大文件时先获取分拣大小）
POST: 新增数据
PUT: 修改数据
DELETE: 删除资源
CONNECT: 建立连接隧道，用于代理服务器
OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
TRACE: 实现沿通向目标资源的路径的消息环回（loop-back）测试 ，提供了一种实用的 debug 机制
```

# URI && URL && URN
```
URI:Uniform Resource Identifier 万维网中的统一资源描述符
URL:Uniform Resource Locators 不仅标识了Web 资源，还指定了操作或者获取方式，同时指出了主要访问机制和网络位置。
URN:Uniform Resource Names 用特定命名空间的名字标识资源。使用URN可以在不知道其网络位置及访问方式的情况下讨论资源。
```

# 头部字端
##  Content && Accept 系列
Content系列字端描述发送端：数据格式、压缩方式、支持语言和字符集。
Accept系列字段描述接收端: 数据格式、压缩方式、支持语言和字符集。
数据格式 && 字符集
```
Content-Type: text/html; charset=utf-8
Accept-Charset: charset=utf-8
```
压缩方式
```
Content-Encoding: gzip
Accept-Encoding: gizp
```
支持语言
```
Content-Language: zh-CN, zh, en
Accept-Language: zh-CN, zh, en
```

# 对于定长和不定长的数据，HTTP 是怎么传输
```
定长包体需要 Content-Length, 来指明包体的长度。
不定长包体需要 Transfer-Encoding: chunked（基于长连接持续推送动态内容）
```

# HTTP 如何处理大文件的传输
HTTP 针对这一场景，采取了范围请求的解决方案，允许客户端仅仅请求一个资源的一部分
```
// 检查是否服务器是否支持范围请求，并告知客户端这边是支持范围请求
Accept-Ranges: none ｜ bytes
// 表示一个数据片段在整个文件中的位置
Content-Range
// 单段数据
Content-Range: bytes 0-9/100
// 多段数据
Content-Type: multipart/byteranges;boundary=00000010101
```

# HTTP 中如何处理表单数据的提交
```
application/x-www-form-urlencoded
multipart/form-data
```

# HTTP1.1 如何解决 HTTP 的队头阻塞问题
产生原因：HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，里面的任务被放在一个任务队列中串行执行，一旦队首的请求处理太慢，就会阻塞后面请求的处理。这就是著名的HTTP队头阻塞问题。<br>
处理方式：并发连接（每个域并发6个）、域名分片（子域名）

# Cookie
响应头
```
Set-Cookie: a=xxx expire...
```
请求头
```
Cookie: a=xxx;b=xxx
```
作用域
```
Domain和path
```
安全相关
```
Secure，说明只能通过 HTTPS 传输 cookie
HttpOnly，不能通过 JS 访问（预防XSS）
SameSite，浏览器对第三方请求携带Cookie处理
```
生存周期
```
Expires即过期时间
Max-Age用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算
```

# 获取IP
```
Via，记录请求中的代理服务器
X-Forwarded-For，请求方的IP
X-Real-IP，获取用户真实 IP 的字段（X-Forwarded-Host和X-Forwarded-Proto）
客户端的缓存控制
max-stale: 5 // 表示客户端到代理服务器上拿缓存的时候，即使代理缓存过期了也不要紧，只要过期时间在5秒之内，还是可以从代理中获取的
min-fresh: 5 // 保证代理缓存的新鲜度到期前 5 秒之前的时间拿，否则拿不到
only-if-cached // 客户端只会接受代理缓存，而不会接受源服务器的响应
```

# HTTP 缓存及缓存代理
```
强缓存和协商缓存
Cache-Control
Expires

代理缓存
Cache-Control
设置为private禁止代理服务器缓存，设置为public为允许
proxy-revalidate
proxy-revalidate则表示代理服务器的缓存过期后到源服务器获取
must-revalidate的意思是客户端缓存过期就去源服务器获取
s-maxage
限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的max-age并不冲突
```

# CORS
```
// 简单跨域
Access-Control-Allow-Origin = '指定域名（只能设置一个域名）'
Access-Control-Allow-Origin = '*' 
// 允许 client 使用什么方法
Access-Control-Allow-Methods //  method
// 允许 client 携带那些 header
Access-Control-Allow-Headers = 'x-token-id'
// 允许 client 解析那些 header（不然 client 读取对应header 为 null）
Access-Control-Expose-Headers
// 非简单请求（需要发预检请求 options）
// Content-type="application/json" 为非简单请求
// 携带cookie等
Access-Control-Allow-Origin = '必须要指定域名，*不再可用'
Access-Control-Allow-Credentials = true // 是否允许发送 Cookie
客户端还需要设置withCredentials
如fetch，credentials='include'
如xhr，withCredentials=true
// 预检请求的有效期，单位为s，不然对同一个资源都还会再打到后端去做preflight
Access-Control-Max-Age = 300
```

# HTTP/2的特性
##  头部压缩（HPACK 算法）
首先是在服务器和客户端之间建立哈希表，将用到的字段存放在这张表中，那么在传输的时候对于之前出现过的值，只需要把索引(比如0，1，2，...)传给对方即可，对方拿到索引查表就行了。<br>
其次是对于整数和字符串进行哈夫曼编码，哈夫曼编码的原理就是先将所有出现的字符建立一张索引表，然后让出现次数多的字符对应的索引尽可能短，传输的时候也是传输这样的索引序列，可以达到非常高的压缩率。
##  多路复用
HTTP2通过二进制分帧，原来Headers + Body的报文格式如今被拆分成了一个个二进制的帧，Headers帧存放头部字段，Data帧存放请求体数据，这些二进制帧不存在先后关系，因此也就不会排队等待，也就没有了 HTTP 的队头阻塞问题。<br>
乱序，指的是不同 ID 的 Stream 是乱序的，但同一个 Stream ID 的帧一定是按顺序传输的。二进制帧到达后对方会将 Stream ID 相同的二进制帧组装成完整的请求报文和响应报文。
##  设置请求优先级
todo
##  服务器推送
Server Push，当 TCP 连接建立之后，服务端可以主动发送数据
```
// 如请求了 index.html 后服务器自动推送 style.css 等资源的 nginx 配置
location / {
  index  index.html index.htm;
  http2_push /style.css;
  http2_push /example.png;
}
// 前端可以使用 rel=preload; as=style; 来是服务端
```
> 参考文章
  [HTTP灵魂之问，巩固你的 HTTP 知识体系](https://juejin.im/post/5e76bd516fb9a07cce750746)