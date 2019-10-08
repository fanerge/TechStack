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
ARP:Address Resolution Protocol（地址解析协议），是根据IP地址获取物理地址的一个TCP/IP协议。
RARP:Reverse Address Resolution Protocol（反向地址转换协议），允许局域网的物理机器从网关服务器的 ARP 表或者缓存上请求其 IP 地址。
```
##  数据链路层
建立逻辑连接、进行硬件地址寻址、差错校验等功能。（由底层网络定义协议）
将比特组合成字节进而组合成帧，用MAC地址访问介质，错误发现但不能纠正。
##  物理层
建立、维护、断开物理连接。（由底层网络定义协议）

# TCP/IP协议
##  应用层（会话层、表示层、应用层）
##  传输层
##  网络层
##  链路层（物理层、数据链路层）
