# ISO 七层模型

## 应用层

网络服务与最终用户的一个接口。
协议有：HTTP FTP TFTP SMTP SNMP DNS TELNET HTTPS POP3 DHCP

```
HTTP:Hyper Text Transfer Protocol（超文本传输协议），是用于从万维网（WWW:World Wide Web ）服务器传输超文本到本地浏览器的传送协议，默认端口80。
HTTPS:Hypertext Transfer Protocol Secure（超文本传输安全协议），默认端口443。
FTP:File Transfer Protocol（文件传输协议），默认20和21这两个端口，其中20用于传输数据，21用于传输控制信息。
TFTP:Trivial File Transfer Protocol（简单文件传输协议），默认端口号为69。
SMTP:Simple Mail Transfer Protocol（简单邮件传输协议），默认端口25。
SNMP:简单网络管理协议。
DNS:Domain Name System（域名系统），默认端口53，大多数情况使用 UDP协议。
TELNET:（远程终端协议），是Internet远程登录服务的标准协议和主要方式，一般使用加密的SSH(Secure Shell）。
SSH:Secure Shell（安全外壳协议），加密的远程登录服务，默认端口22。
ICMP:ICMP协议是一种面向无连接的协议，用于传输出错报告控制信息。ping 使用的是ICMP协议。
IGMP:Internet 组管理协议，该协议运行在主机和组播路由器之间。
NAT:Network Address Translation，网络地址转换，当在专用网内部的一些主机本来已经分配到了本地IP地址（即仅在本专用网内使用的专用地址），但现在又想和因特网上的主机通信（并不需要加密）时，可使用NAT方法。
```

## 表示层

数据的表示、安全、压缩。（在五层模型里面已经合并到了应用层）
格式有，JPEG、ASCll、DECOIC、加密格式等

## 会话层

建立、管理、终止会话。（在五层模型里面已经合并到了应用层）
对应主机进程，指本地主机与远程主机正在进行的会话

## 传输层

定义传输数据的协议端口号，以及流控和差错校验。
协议有：TCP UDP，数据包一旦离开网卡即进入网络传输层

```
TCP:Transmission Control Protocol（传输控制协议），是一种面向连接的、可靠的、基于字节流的传输层通信协议。
```

## 网络层

进行逻辑地址寻址，实现不同网络之间的路径选择。
协议有：ICMP IGMP IP（IPV4 IPV6）、ARP、RARP

```
IPv6:Internet Protocol Version 6（互联网协议第6版）。
ICMP:Internet Control Message Protocol（Internet控制报文协议），控制消息是指网络通不通、主机是否可达、路由是否可用等网络本身的消息。
IGMP:Internet Group Management Protocol（Internet 组管理协议），该协议运行在主机和组播路由器之间。
ARP:Address Resolution Protocol（地址解析协议），是根据IP地址获取物理地址的一个TCP/IP协议。
RARP:Reverse Address Resolution Protocol（反向地址转换协议），允许局域网的物理机器从网关服务器的 ARP 表或者缓存上请求其 IP 地址。
```

## 数据链路层

建立逻辑连接、进行硬件地址寻址、差错校验等功能。（由底层网络定义协议）
将比特组合成字节进而组合成帧，用 MAC 地址访问介质，错误发现但不能纠正。

## 物理层

建立、维护、断开物理连接。（由底层网络定义协议）

# 网络模型

## OSI 七层网络模型&&TCP/IP 四层概念模型

| OSI 七层网络模型        | TCP/IP 四层概念模型 | 对应网络协议                          |
| ----------------------- | ------------------- | ------------------------------------- |
| 应用层（Application）   | 应用层              | HTTP、HFTP、FTP、NFS、WAIS、SMTP      |
| 表示层（Presentation）  |                     | Telnet、Rlogin、SNMP、Gopher          |
| 会话层（Session）       |                     | SMTP、DNS                             |
| 传输层（Transport）     | 传输层              | TCP、UDP                              |
| 网络层（Network）       | 网络成              | IP、ICMP、ARP、RARP、AKP、UUCP        |
| 数据链路层（Data Link） | 数据链路层          | FDDI、Ethernet、Arpanet、PDN、SLIP    |
| 物理层（Physical）      |                     | IEEE 802.1A IEEE 802.2 到 IEEE 802.11 |

# 其他

DHCP:Dynamic Host Configuration Protocol（动态主机配置协议），用于内部网或网络服务供应商自动分配 IP 地址；给用户用于内部网管理员作为对所有计算机作中央管理的手段。<br>
BGP：Border Gateway Protocol 边界网关协议（BGP）是运行于 TCP 上的一种自治系统的路由协议，默认端口 179。

## TCP

TCP 的拥塞控制手段：慢启动、拥塞避免、快速重传、快速恢复<br>
拥塞控制判断依据：之前为以丢包作为依据，后面以探测带宽作为依据

### RTT

round-trip time<br>
表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后便立即发送确认），总共经历的时延。

### RTO

Retransmission TimeOut<br>
重传超时时间。<br>
RTO 应略大于 RTT

### TCP/三次握手建立连接

1.  客户端发送 SYN（SEQ=x）报文给服务器端，进入 SYN_SEND 状态。
2.  服务器端收到 SYN 报文，回应一个 SYN （SEQ=y）ACK（ack=x+1）报文，进入 SYN_RECV 状态。
3.  客户端收到服务器端的 SYN 报文，回应一个 ACK（ack=y+1）报文，进入连接建立状态。

三次握手完成，TCP 客户端和服务器端成功地建立连接，可以开始传输数据了。<br>
三次挥手 CLient 和 Server 状态（20200416 更新）

| Client      | Server       | 说明                                 |
| ----------- | ------------ | ------------------------------------ |
| closed      | closed       | 握手前都为 closed                    |
| syn-sent    | listen       | client 发送 syn 后                   |
|             | syn-received | server 接收 syn，并发送 syn 和 ack   |
| established |              | client 接收到 syn 和 ack，并发送 ack |
|             | established  | server 接收到 ack                    |

### TCP/四次握手终止连接

（1） 客户机某个应用进程首先调用 close，称该端执行“主动关闭”（active close）。该端的 TCP 于是发送一个 FIN 分节，表示数据发送完毕。
（2） 接收到这个 FIN 的对端执行 “被动关闭”（passive close），这个 FIN 由 TCP 确认，发送 ACK。
（3） 一段时间后，接收到这个文件结束符的应用进程将调用 close 关闭它的套接字。这导致它的 TCP 也发送一个 FIN。
（4） 接收这个最终 FIN 的原发送端 TCP（即执行主动关闭的那一端）确认这个 FIN，发送 ACK。

既然每个方向都需要一个 FIN 和一个 ACK，因此进行了 4 次握手。

```
SYN:同步序列编号（Synchronize Sequence Numbers）
ACK:确认字符 (Acknowledge character)
SEQ:序列号（sequance）
FIN:结束标志（Finally）
```

四次挥手 CLient 和 Server 状态（20200416 更新）

| Client            | Server      | 说明                         |
| ----------------- | ----------- | ---------------------------- |
| established       | established | 分手前都为 established       |
| fin-wait-1        |             | client 发送 fin 后           |
|                   | close-wait  | server 接收 fin ，并发送 ack |
| fin-wait-2        |             | client 接收到 ack            |
|                   | last-ack    | server 发送 fin              |
| time-wait（2MSL） | closed      | server 接收 ack              |
| closed            |             |                              |

### TCP 第四次挥手为什么要等待 2 倍的 MSL

客户端在发送最后一个 ACK 之后会立即启动时间等待计时器，MSL：最长报文段寿命。

1.  为了保证客户端发送的最后一个 ACK 报文段能够到达服务器（因为 ACK 页可能丢包，需要重传）。
2.  等待最大的 2msl 可以让本次连接的所有的网络包在链路上消失，以防造成不必要的干扰。

## HTTPS

Hypertext Transfer Protocol Secure，超文本传输安全协议，看作 HTTP + TLS

### SSL&&TLS

SSL(Secure Sockets Layer 安全套接层),及其继任者传输层安全（Transport Layer Security，TLS）是为网络通信提供安全及数据完整性的一种安全协议。TLS 与 SSL 在传输层与应用层之间对网络连接进行加密。

#### 作用

1）认证用户和服务器，确保数据发送到正确的客户机和服务器（依靠证书）；
2）加密数据以防止数据中途被窃取；
3）维护数据的完整性，确保数据在传输过程中不被改变。

#### 证书

在证书中包含：公钥、证书的所有者、证书的发布机构、和证书的有效期。<br>
证书的作用：CA 是网站担保人，担保这个公钥是这个网站的公钥，CA 还会为下属 CA 担保。

#### 信息加密方式

##### 对称加密

对称加密算法的特点是算法公开、计算量小、加密速度快、加密效率高。<br>
对称加密采用了对称密码编码技术，它的特点是文件加密和解密使用相同的密钥加密。<br>
缺点：1.交易双方都使用同样钥匙，安全性得不到保证。2.每对用户每次使用对称加密算法时，都需要使用其他人不知道的惟一钥匙，这会使得发收信双方所拥有的钥匙数量呈几何级数增长，密钥管理成为用户的负担。<br>
DES（DES 算法把 64 位的明文输入块变为数据长度为 64 位的密文输出块，其中 8 位为奇偶校验位，另外 56 位作为密码的长度。）、3DES、IDEA、AES

###### 对称加密原理（20200415 更新）

关键字：密钥、分组、填充

1.  将明文分组（使每组的长度和密钥的长度相等）
2.  明文和密钥进行异或运算 XOR
3.  如果上面的分组中最后一组长度不够时可以采用填充方法（位填充、字节填充等）

##### 非对称加密（有签名功能）

非对称密码体制的特点：算法强度复杂、安全性依赖于算法与密钥但是由于其算法复杂，而使得加密解密速度没有对称加密解密的速度快。<br>
非对称加密算法需要两个密钥，公开密钥与私有密钥是一对，如果用公开密钥对数据进行加密，只有用对应的私有密钥才能解密；如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。<br>

###### RSA 工作原理

### HTTPS 工作原理

1.  使用 CA 证书，担保这个公钥是这个网站的公钥，这时客户拿到了非对称加密的公钥。
2.  先使用非对称加密，用 CA 证书里的公钥来发送对称加密的密钥。
3.  服务器拿到了对称加密的密钥，可以双方开始安全通信了。

[从 Https 协议谈对称加密和非对称加密](https://blog.csdn.net/u013061497/article/details/81639134)

## HTTP2（SPDY）

HTTP/2 （原名 HTTP/2.0）即超文本传输协议 2.0。

1.  二进制传输（之前是纯文本形式）
2.  Header 压缩（HPACK 算法）哈夫曼编码来压缩
3.  多路复用（解决头部阻塞--乱序传递，但不能解决丢包重传)
4.  流的优先级（权重和继承或者依赖，20200415 更新）
5.  Server Push（服务器推送）
6.  提高安全性（TLS，之前是明文）
7.  添加二进制帧

[解读 HTTP/2 与 HTTP/3 的新特性](https://mp.weixin.qq.com/s/n8HBG9LuzQjOT__M4pxKwA)

## HTTP3

HTTP3 是基于 UDP 协议的“QUIC”协议。<br>
0RTT 恢复会话握手<br>
HTTP3 的连接迁移（允许客户端更换 IP、Port 后，仍然可以服用之前的连接，大概使通过 ConnectionID 来复用，后面再深究）<br>
解决 HTTP2 的缺点：
TCP 以及 TCP+TLS 建立连接的延时（握手过程，三次握手变为一次握手）
TCP 的队头阻塞并没有彻底解决（多个请求是跑在一个 TCP 管道，丢包会重传会阻塞所有请求）

### 队头阻塞问题（20200415 更新）

产生原因：一个 TCP 管道中可以有多个流，多个流在传输的时候可以没有顺序，但到达的时候必须和发送的时候顺序保持一致，如果其中一个流的某个包丢失了，其它流都需要等待丢失的包重发成功后才能继续。<br>
本质原因：TCP 必须要保证资源的有序到达而导致的。

![](https://mmbiz.qpic.cn/mmbiz_png/zewrLkrYfsPJcceCMInZpsVErpdiaXm87wR2CP66VEj2naiaeTG1glYCJIa7S74tWhjkzAL65FiaYeJHeC9vggkNw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
