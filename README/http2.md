HTTP/2 协议

# 协议升级 HTTP2.0

## 和服务器协商升级

// 客户端发起协商请求 Connection、Upgrade 为必须首部字段

```
Connection: Upgrade, HTTP2-Settings
Upgrade: h2c
// h2c为http2明文，h2为基于TLS的http2
// HTTP2-Settings标头字段是一个特定于连接的标头字段，包含 Settings Frame相关的设置
HTTP2-Settings标头字段的内容是SETTINGS帧的有效载荷（6.5节），编码为base64url字符串（即[RFC4648]的第5节中描述的URL和文件名安全的Base64编码）尾部’=’字符省略）。
```

// 不支持 HTTP/2 的服务端会忽略 Upgrade 首部字段
// 支持 HTTP/2 的服务端返回 101(Switching Protocols)响应
// 服务端发送的第一个 HTTP/2 帧必须是由一个 SETTINGS 帧( 6.5 节 )组成的服务端连接前奏( 3.5 节 )。客户端一收到 101 响应，也必须发送一个包含 SETTINGS 帧的连接前奏( 3.5 节 )。
连接前奏的作用：在 HTTP/2 中，每个端点都需要发送一个连接前言作为正在使用的协议的最终确认，并确定 HTTP/2 连接的初始设置。

# Frame（帧）

Frame 是 HTTP2 的最小传输单位
所有的帧都以固定的 (24+8+8+1+31)/8=9 字节的首部开始，后面接可变长度的有效载荷。

```
 +-----------------------------------------------+
 |                 Length (24)                   |
 +---------------+---------------+---------------+
 |   Type (8)    |   Flags (8)   |
 +-+-------------+---------------+-------------------------------+
 |R|                 Stream Identifier (31)                      |
 +=+=============================================================+
 |                   Frame Payload (0...)                      ...
 +---------------------------------------------------------------+
                            图 1：帧格式
```

Length: 帧有效载荷的长度，以 24 位无符号整数表示。除非接收端通过 SETTINGS_MAX_FRAME_SIZE 设置了更大的值，否则不能发送 Length 值大于 2^14 (16,384)的帧。
帧首部的 9 字节长度不计入该值。
Type: 8bit 的帧类型。帧类型决定了帧的格式和语义。必须忽略和丢弃任何未知的帧类型。
Flags: 为帧类型保留的 8bit 布尔标识字段。
针对确定的帧类型赋予标识特定的语义。与确定的帧类型语义不相符的标识必须被忽略，并且在发送时必须是未设置的(0x0)。
R: 1bit 的保留字段。未定义该 bit 的语义。当发送时，该 bit 必须是未设置的(0x0)；当接收时，必须忽略该 bit。
Stream Identifier: 流标识符(参见 5.1.1 节 )是一个 31bit 的无符号整数。值 0x0 是保留的，表明帧是与整体的连接相关的，而不是和单独的流相关。
通过 SETTINGS_MAX_FRAME_SIZE 设置 frame 的大小不能大于 2^24-1 (16,777,215)

# Stream（流）

客户端发起的流必须使用奇数流标识符;那些由服务器发起的必须使用偶数流标识符。
连接控制消息使用零（0x0）的流标识符;零流标识符不能用于建立新的流。
被升级到 HTTP / 2 的 HTTP / 1.1 请求（请参阅第 3.2 节）以一个流标识符（0x1）响应。
长时间连接会导致端点耗尽流标识符的可用范围，无法建立新流标识符的客户端可以为新流建立新连接。

## Stream 的特征

单个 HTTP / 2 连接可以包含多个并发打开的流，其中任一端点都可以交错多个流中的帧。
流可以单方面建立和使用，也可以由客户端或服务器共享。
可以通过任一端点关闭流。
在流上发送帧的顺序很重要。收件人按接收顺序处理帧。特别地，HEADERS 和 DATA 帧的顺序在语义上很重要。
流由整数标识。通过端点启动流，将流标识符分配给流。

Stream 是 HTTP/2 连接中客户端和服务器之间交换的独立的双向帧序列。
流的生命周期

```
                             +--------+
                     send PP |        | recv PP
                    ,--------|  idle  |--------.
                   /         |        |         \
                  v          +--------+          v
           +----------+          |           +----------+
           |          |          | send H /  |          |
    ,------| reserved |          | recv H    | reserved |------.
    |      | (local)  |          |           | (remote) |      |
    |      +----------+          v           +----------+      |
    |          |             +--------+             |          |
    |          |     recv ES |        | send ES     |          |
    |   send H |     ,-------|  open  |-------.     | recv H   |
    |          |    /        |        |        \    |          |
    |          v   v         +--------+         v   v          |
    |      +----------+          |           +----------+      |
    |      |   half   |          |           |   half   |      |
    |      |  closed  |          | send R /  |  closed  |      |
    |      | (remote) |          | recv R    | (local)  |      |
    |      +----------+          |           +----------+      |
    |           |                |                 |           |
    |           | send ES /      |       recv ES / |           |
    |           | send R /       v        send R / |           |
    |           | recv R     +--------+   recv R   |           |
    | send R /  `----------->|        |<-----------'  send R / |
    | recv R                 | closed |               recv R   |
    `----------------------->|        |<----------------------'
                             +--------+
send：端点发送此帧
recv：端点接收此帧

H：HEADERS帧（具有隐含的CONTINUATION）
PP：PUSH_PROMISE帧（具有隐含的CONTINUATION）
ES：END_STREAM标志（半关闭）
R：RST_STREAM帧（已关闭）
```

## Stream Identifiers（标识符）

客户端发起的流必须使用奇数；
由服务器启动的那些务必使用偶数。
为 0 则表示用于连接控制消息。
Stream Identifiers 用光后，只能重新建立连接（服务器可以发送 GOAWAY 帧，以便客户端被迫为新流打开新连接）。
对端可以使用 SETTINGS Frame 内的 SETTINGS_MAX_CONCURRENT_STREAMS 参数来限制并发活动流的数量。

## Stream Concurrency（并发）

SETTINGS_MAX_CONCURRENT_STREAMS 参数（请参阅第 6.5.2 节）来限制并发活动流的数量
客户端指定服务器可以启动的并发流的最大数量，服务器指定客户端可以启动的并发流的最大数量。

## Flow Control（流浪控制）

DATA Frame 才有流量控制。
将流用于多路复用会引起对使用 TCP 连接的争用，从而导致流被阻塞。
流量控制机制确保同一连接上的流不会相互干扰。
流量控制用于单个流和整个连接。
HTTP/2 通过使用 WINDOW_UPDATE 帧提供流量控制（第 6.9 节）。
最大大小的流控制窗口（2^31 -1）。

## Stream Priority（流优先级）

作用：管理并发流时希望其对不同流的分配资源的相对比例。
权重为 1 到 256（含）之间的整数权重。
使用 Priority Frame 控制流的优先级。

## 错误处理

GOAWAY Frame 包含一个错误代码，指明连接终止的原因（连接错误）。
RST_STREAM 检测到流错误的端点发送 RST_STREAM 帧（第 6.4 节），该帧包含发生错误的流的流标识符（流错误）。

# Frame（帧）

## DATA 帧

DATA 帧(type=0x0)用于传送某一个流的任意的、可变长度的字节序列。比如：用一个或多个 DATA 帧来携带 HTTP 请求或响应的载荷。
DATA 帧包含：

```
填充长度(Pad Length)：一个 8bit 的域，包含帧填充数据的字节长度。该域是可选的(正如框图中的"?"所示)，只有当设置了 PADDED 标识时，才会有该域。
数据(Data)：应用数据。数据量等于帧载荷减去其它域的长度。
填充数据(Padding)：不包含应用语义值的填充字节。当发送的时候，必须将填充数设置为 0。接收方不必非得校验填充数据，但是可能会把非零的填充数当做 PROTOCOL_ERROR 类型的连接错误( 5.4.1 节 )。

```

## HEADERS 帧

HEADERS 帧(type=0x1)用来打开一个流( 5.1 节 )，再额外地携带一个 首部块片段(Header Block Fragment)。HEADERS 帧可以在一个流处于 空闲(idle)、保留(本地)(reserved (local))、打开(open)、或者 半关闭(远端)(half-closed (remote)) 状态时被发送。
HEADERS 帧包含：

```
填充长度(Pad Length)：一个8bit的域，包含帧填充数据的字节长度。只有当设置了PADDED标识时，才会有该域。
E标识：1bit标识，表示流依赖是否是专用的(参见 5.3节 )。只有当设置了PRIORITY标识，才会有该域。
流依赖(Stream Dependency)：该流所依赖的流(参见 5.3节 )的31bit标识符。只有当设置了PRIORITY标识，才会有该域。
权重(Weight)：一个8bit的无符号整数，表示该流的优先级权重(参见 5.3节 )。范围是1到255。只有当设置了PRIORITY标识，才会有该域。
首部块片段(Header Block Fragment)：一个首部块片段(参见 4.3节 )。
填充数据(Padding)：填充字节。
```

## PRIORITY 帧

PRIORITY 帧(type=0x2)指定了发送者建议的流优先级( 5.3 节 )。可以在任何流状态下发送 PRIORITY 帧，包括空闲(idle)的 和 关闭(closed) 的流。
PRIORITY 帧包含：

```
E标识(E): 1bit标识，指明流依赖(Stream Dependency)是否是专用的(参见 5.3节 )。
流依赖(Stream Dependency): 该流所依赖的流(参见 5.3节 )的31bit标识符。
权重(Weight): 一个8bit的无符号整数，表示该流的优先级权重(参见 5.3节 )。范围是1到255。
```

## RST_STREAM 帧

RST_STREAM 帧(type=0x3)可以立即终结一个流。RST_STREAM 用来请求取消一个流，或者表示发生了一个错误。
RST_STREAM 帧包含：

```
一个32bit的无符号整数表示的错误码( 第7章 )。错误码指明了流为什么被终结。
```

## SETTINGS 帧

SETTINGS 帧(type=0x4)用来传送影响两端通信的配置参数，比如：对对端行为的偏好与约束等。SETTINGS 帧也用于通知对端自己收到了这些参数。特别地，SETTIGNS 参数也可以被称做 设置参数(setting)。
SETTIGNS 帧总是作用于连接，而不是一个流。
已定义的 SETTINGS 帧参数：

```
SETTINGS_HEADER_TABLE_SIZE (0x1): 允许发送方通知远端用于解码首部块的首部压缩表的最大字节值。通过使用特定于首部块( 参见 [COMPRESSION] )内部的首部压缩格式的信令，编码器可以选择任何小于等于该值的大小。其初始值是4096字节。
SETTINGS_ENABLE_PUSH (0x2): 该设置用于关闭服务端推送( 8.2节 )。如果一端收到了该参数值为0，该端点不能发送 PUSH_PROMISE 帧。
SETTINGS_MAX_CONCURRENT_STREAMS (0x3): 指明发送端允许的最大并发流数。该值是有方向性的：它适用于发送端允许接收端创建的流数目。
SETTINGS_INITIAL_WINDOW_SIZE (0x4): 指明发送端流级别的流量控制窗口的初始字节大小。该初始值是2^16 - 1 (65,535)字节。
SETTINGS_MAX_FRAME_SIZE (0x5): 指明发送端希望接收的最大帧负载的字节值。初始值是2^14 (16,384)字节。
SETTINGS_MAX_HEADER_LIST_SIZE (0x6): 该建议设置通知对端发送端准备接收的首部列表大小的最大字节值。
```

SETTINGS 帧里的大部分值都受益于或者要求理解对端什么时候收到并且应用了已改变的参数值。为了提供这样的同步时间点，接收方必须一收到没有设置 ACK 标识的 SETTINGS 帧就尽快应用更新后的参数值。

## PUSH_PROMISE 帧

PUSH_PROMISE 帧（type = 0x5）用于在发送者打算启动的流之前通知对端。
在发送端准备初始化流之前，要发送 PUSH_PROMISE(type=0x5)帧来通知对端。PUSH_PROMISE 帧包含 31 位的无符号流标识符，该流标识符和为流提供额外的上下文的首部集一起由端点创建的。
PUSH_PROMISE 帧包含：

```
Pad Length: 一个8bit的域，包含帧填充数据的字节长度。只有当设置了PADDED标识时，该域才会出现。
R: 保留的1bit位。
Promised Stream ID: 31bit的无符号整数，标记PUSH_PROMISE帧保留的流。对于发送端来说，该标识符必须是可用于下一个流的有效值(参见 5.1.1节 的创建流标识符)。
Header Block Fragment: 包含请求首部域的首部块片段( 4.3节 )。
Padding: 填充字节。
```

## PING 帧

除了判断一个空闲的连接是否仍然可用之外，PING 帧(type=0x6)还是发送端测量最小往返时间(RTT)的一种机制。任何端点都可以发送 PING 帧。
PING 帧的响应应该被赋予最高优先级。
PING 帧包含：

```
ACK (0x1): 当设置了该标识符，第0位表示该PING帧是一个PING帧的响应。端点必须在PING帧的响应里设置该标识符。端点不能响应包含该标识符的PING帧。
```

## GOAWAY 帧

GOAWAY 帧(type=0x7)用于发起关闭连接，或者警示严重错误。GOAWAY 帧能让端点优雅地停止接受新流，同时仍然能处理完先前建立的流。这使类似于服务端维护的管理行为成为可能。

## WINDOW_UPDATE 帧

WINDOW_UPDATE 帧(type=0x8)用于执行流量控制功能；参见 5.2 节 的概述。
流量控制操作有两个层次：在每一个单独的流上和在整个连接上。
WINDOW_UPDATE 帧的流标识符 0 表示整个连接都受 WINDOW_UPDATE 帧的影响。
只有 DATA 帧 受流量控制影响。
流量控制窗口，窗口值衡量了接收端的缓存能力。

## CONTINUATION 帧

CONTINUATION 帧(type=0x9)用于继续传送首部块片段序列( 4.3 节 )。只要前面的帧在同一个流上，而且是一个没有设置 END_HEADERS 标志的 HEADERS 帧，PUSH_PROMISE 帧，或者 CONTINUATION 帧，就可以发送任意数量的 CONTINUATION 帧。
CONTINUATION 帧包含：

```
END_HEADERS (0x4): 当设置了该标志，第2个bit位表示该帧是一个首部块的结束( 4.3节 )。
```

# Error codes

错误码是 RST_STREAM 帧和 GOAWAY 帧中 32-bit 位的域，用于表达流或连接错误的原因。

```
NO_ERROR (0x0): 相关情况不是错误。例如，GOAWAY 帧可以包含该码，表示优雅地关闭连接。
PROTOCOL_ERROR (0x1): 端点检测到一个不确定的协议错误。当没有更加具体的错误码可用时，可以使用该错误码。
INTERNAL_ERROR (0x2): 端点遭遇到未知的内部错误。
FLOW_CONTROL_ERROR (0x3): 端点检测到其对端违反了流量控制协议。
SETTINGS_TIMEOUT (0x4): 端点发送了一个 SETTIGNS 帧，但是没有及时收到响应。参见 6.5.3节 ("同步设置")。
STREAM_CLOSED (0x5): 流半关闭以后，端点收到一个帧。
FRAME_SIZE_ERROR (0x6): 端点收到了一个大小无效的帧。
REFUSED_STREAM (0x7): 在执行任何处理之前，端点拒绝了流(细节参见 8.4.1节 )。
CANCEL (0x8): 被端点用于表示不再需要该流了。
COMPRESSION_ERROR (0x9): 端点不能为连接维持首部压缩上下文。
CONNECT_ERROR (0xa): 响应CONNECT请求( 8.3节 )而建立的连接被重置，或者被非正常关闭。
ENHANCE_YOUR_CALM (0xb): 端点检测到对端正在展现出可能会产生极大负荷的行为。
INADEQUATE_SECURITY (0xc): 下层的传输层具有不满足最低安全要求( 9.2节 )的属性。
HTTP_1_1_REQUIRED (0xd): 端点要求使用HTTP/1.1代替HTTP/2。
```

# HTTP Message Exchanges / HTTP 消息交换

## Request Pseudo-Header Fields

```
:method 伪首部字段包含HTTP方法( [RFC7231]，第4章 )。
:scheme 伪首部字段包含目标URI( [RFC3986]，3.1节 )的方案部分。
:authority伪首部字段包含目标URI( [RFC3986]，3.2节 )的authority部分。authority不能包含http或https URIs方案废弃的用户信息的子组件。
:path伪首部字段包含目标URI的path和query部分(绝对路径部分和一个后跟query部分的可选的'?'字符(参见 [RFC3986] 的 3.3节 和 3.4节 ))。星号形式的请求包含:path伪首部字段的'*'值。
```

## Response Pseudo-Header Fields

只定义了一个:status 伪首部字段，其携带了 HTTP 状态码(参见 [RFC7231]，第 6 章 )。

## Server Push / 服务端推送

HTTP/2 允许服务端抢先向客户端发送(或『推送』)响应，这些响应跟先前客户端发起的请求有关。
客户端可以要求关闭服务端推送功能，但这是每一跳独立协商地。SETTINGS_ENABLE_PUSH 设置为 0
服务端采可以发送 PUSH_PROMISE 帧推送资源。
PUSH_PROMISE 帧和任何随后的 CONTINUATION 帧里的首部字段必须是完整有效的一套请求首部字段( 8.1.2.3 节 )。
服务端必须在:method 伪首部字段里包含一个安全的可缓存的方法。
如果服务端收到了一个对文档的请求，该文档包含内嵌的指向多个图片文件的链接，且服务端选择向客户端推送那些额外的图片，那么在发送包含图片链接的 DATA 帧之前发送 PUSH_PROMISE 帧可以确保客户端在发现内嵌的链接之前，能够知道有一个资源将要被推送过来。

## CONNECT 方法

在 HTTP/1.x 里，CONNECT( [RFC7231], 4.3.6 节 ) 伪方法用于将和远端主机的 HTTP 连接转换为隧道。CONNECT 主要用于 HTTP 代理和源服务器建立 TLS 会话，其目的是和 https 资源交互。
在 HTTP/2 中, CONNECT 方法用于在一个到远端主机的单独的 HTTP/2 流之上建立隧道。

# Additional HTTP Requirements/Considerations / 额外的 HTTP 要求或考虑

## Connection Management / 连接管理

HTTP/2 连接是持久连接。为了获得最佳性能，人们期望客户端不要关闭连接，直到确定不需要再继续和服务端进行通信(例如，当用户离开一个特定的 web 页面时)，或者直到服务端关闭连接。
当任何一端选择关闭传输层 TCP 连接时，主动关闭的一端应该先发送一个 GOAWAY 帧( 6.8 节 )，这样两端都可以确定地知道先前发送的帧是否已被处理，并且优雅地完成或者终结任何剩下的必要任务。

## HTTP/2 中请求可靠机制

HTTP/2 提供了两种机制来为客户端提供一个请求尚未处理的保证：
GOAWAY 帧指示可能已经处理的最高流号码。因此，数量较多的流上的请求可以保证可以安全地重试。
REFUSED_STREAM 错误代码可以包含在 RST_STREAM 帧中，以指示在发生任何处理之前流正在关闭。可以安全地重试在重置流上发送的任何请求。

> 参考文档：
> [规范](https://httpwg.org/specs/rfc7540.html)
> [规范](https://quafoo.gitbooks.io/http2-rfc7540-zh-cn-en) > [TTP/2 协议规范](https://blog.csdn.net/u010129119/article/details/79361949)
