# ISO 七层模型
##  应用层
网络服务与最终用户的一个接口。
协议有：HTTP FTP TFTP SMTP SNMP DNS TELNET HTTPS POP3 DHCP
```
HTTP:Hyper Text Transfer Protocol（超文本传输协议），是用于从万维网（WWW:World Wide Web ）服务器传输超文本到本地浏览器的传送协议，默认端口80。
HTTPS:Hypertext Transfer Protocol Secure（超文本传输安全协议），默认端口443。
FTP:File Transfer Protocol（文件传输协议），默认20和21这两个端口，其中20用于传输数据，21用于传输控制信息。
TFTP:Trivial File Transfer Protocol（简单文件传输协议），默认端口号为69。
SMTP:Simple Mail Transfer Protocol（简单邮件传输协议），默认端口25。
SNMP:简单网络管理协议。
DNS:Domain Name System（域名系统），默认端口53。
TELNET:（远程终端协议），是Internet远程登录服务的标准协议和主要方式，一般使用加密的SSH(Secure Shell）。
SSH:Secure Shell（安全外壳协议），加密的远程登录服务，默认端口22。
```
##  表示层
数据的表示、安全、压缩。（在五层模型里面已经合并到了应用层）
格式有，JPEG、ASCll、DECOIC、加密格式等
##  会话层
建立、管理、终止会话。（在五层模型里面已经合并到了应用层）
对应主机进程，指本地主机与远程主机正在进行的会话
##  传输层
定义传输数据的协议端口号，以及流控和差错校验。
协议有：TCP UDP，数据包一旦离开网卡即进入网络传输层
```
TCP:Transmission Control Protocol（传输控制协议），是一种面向连接的、可靠的、基于字节流的传输层通信协议。
```
##  网络层
进行逻辑地址寻址，实现不同网络之间的路径选择。
协议有：ICMP IGMP IP（IPV4 IPV6）、ARP、RARP
```
IPv6:Internet Protocol Version 6（互联网协议第6版）。
ICMP:Internet Control Message Protocol（Internet控制报文协议），控制消息是指网络通不通、主机是否可达、路由是否可用等网络本身的消息。
IGMP:Internet Group Management Protocol（Internet 组管理协议），该协议运行在主机和组播路由器之间。
ARP:Address Resolution Protocol（地址解析协议），是根据IP地址获取物理地址的一个TCP/IP协议。
RARP:Reverse Address Resolution Protocol（反向地址转换协议），允许局域网的物理机器从网关服务器的 ARP 表或者缓存上请求其 IP 地址。
```
##  数据链路层
建立逻辑连接、进行硬件地址寻址、差错校验等功能。（由底层网络定义协议）
将比特组合成字节进而组合成帧，用MAC地址访问介质，错误发现但不能纠正。
##  物理层
建立、维护、断开物理连接。（由底层网络定义协议）

 #  网络模型
 ## OSI七层网络模型&&TCP/IP四层概念模型
 OSI七层网络模型 | TCP/IP四层概念模型 |  对应网络协议
-|-|-
应用层（Application） | 应用层 | HTTP、HFTP、FTP、NFS、WAIS、SMTP |
表示层（Presentation） |  | Telnet、Rlogin、SNMP、Gopher |
会话层（Session） |  | SMTP、DNS |
传输层（Transport） | 传输层 | TCP、UDP |
网络层（Network） | 网络成 | IP、ICMP、ARP、RARP、AKP、UUCP |
数据链路层（Data Link） | 数据链路层 | FDDI、Ethernet、Arpanet、PDN、SLIP |
物理层（Physical） |  | IEEE 802.1A IEEE 802.2到IEEE 802.11 |

# 其他
DHCP:Dynamic Host Configuration Protocol（动态主机配置协议），用于内部网或网络服务供应商自动分配IP地址；给用户用于内部网管理员作为对所有计算机作中央管理的手段。<br>
##  TCP
TCP的特点：慢启动、拥塞避免、快速重传、快速恢复
### TCP/三次握手建立连接
1.  客户端发送SYN（SEQ=x）报文给服务器端，进入SYN_SEND状态。
2.  服务器端收到SYN报文，回应一个SYN （SEQ=y）ACK（ack=x+1）报文，进入SYN_RECV状态。
3.  客户端收到服务器端的SYN报文，回应一个ACK（ack=y+1）报文，进入连接建立状态。

三次握手完成，TCP客户端和服务器端成功地建立连接，可以开始传输数据了。

### TCP/四次握手终止连接
（1） 客户机某个应用进程首先调用close，称该端执行“主动关闭”（active close）。该端的TCP于是发送一个FIN分节，表示数据发送完毕。
（2） 接收到这个FIN的对端执行 “被动关闭”（passive close），这个FIN由TCP确认，发送ACK。
（3） 一段时间后，接收到这个文件结束符的应用进程将调用close关闭它的套接字。这导致它的TCP也发送一个FIN。
（4） 接收这个最终FIN的原发送端TCP（即执行主动关闭的那一端）确认这个FIN，发送ACK。

既然每个方向都需要一个FIN和一个ACK，因此进行了4次握手。
```
SYN:同步序列编号（Synchronize Sequence Numbers）
ACK:确认字符 (Acknowledge character)
SEQ:序列号（sequance）
FIN:结束标志（Finally）
```
## HTTPS
Hypertext Transfer Protocol Secure，超文本传输安全协议，看作 HTTP + TLS
### SSL&&TLS
SSL(Secure Sockets Layer 安全套接层),及其继任者传输层安全（Transport Layer Security，TLS）是为网络通信提供安全及数据完整性的一种安全协议。TLS与SSL在传输层与应用层之间对网络连接进行加密。
#### 作用
1）认证用户和服务器，确保数据发送到正确的客户机和服务器（依靠证书）；
2）加密数据以防止数据中途被窃取；
3）维护数据的完整性，确保数据在传输过程中不被改变。
#### 证书
在证书中包含：公钥、证书的所有者、证书的发布机构、和证书的有效期。<br>
证书的作用：CA是网站担保人，担保这个公钥是这个网站的公钥，CA还会为下属CA担保。
#### 信息加密方式
#####  对称加密
对称加密采用了对称密码编码技术，它的特点是文件加密和解密使用相同的密钥加密。<br>
缺点：当用户过多时，管理密钥也是一种困难。如果A/B共用一个密钥，要想A/C通信且不让B知道，则需要新生成A/C密钥。
##### 非对称加密
非对称加密算法需要两个密钥，公开密钥与私有密钥是一对，如果用公开密钥对数据进行加密，只有用对应的私有密钥才能解密；如果用私有密钥对数据进行加密，那么只有用对应的公开密钥才能解密。因为加密和解密使用的是两个不同的密钥，所以这种算法叫作非对称加密算法。<br>
### HTTPS工作原理
1.  使用CA证书，担保这个公钥是这个网站的公钥，这时客户拿到了非对称加密的公钥。
2.  先使用非对称加密，用CA证书里的公钥来发送对称加密的密钥。
3.  服务器拿到了对称加密的密钥，可以双方开始安全通信了。

[从Https协议谈对称加密和非对称加密](https://blog.csdn.net/u013061497/article/details/81639134)

##  HTTP2
HTTP/2 （原名HTTP/2.0）即超文本传输协议 2.0。
主要是一些新特性。
1.  压缩HTTP头
2.  多路复用请求
3.  对请求划分优先级
4.  服务器推送流（即Server Push技术）
  




