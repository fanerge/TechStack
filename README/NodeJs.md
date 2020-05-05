# nodejs 清除 require 缓存

通过 require 加载的文件只有首次加载才会执行，并缓存到 require.cache 对象上，此时我们需要清除对应缓存再重新加载一遍即可。

```
// 如更改配置希望不手动重启生效
// require.resolve 为把相对路径转化成绝对路径
delete require.cache[require.resolve('./server.js')]; // 清除对应模块缓存，key为文件路径
app = require('./server.js'); // 重新加载即可
```

# 高并发

## 垂直扩展

提升单机配置（CPU、内存、网卡、硬盘）<br>
存在问题：摩尔定律，单机扩展性能提高是有限的，且成本越来越高（垂直扩展的收益逐渐变少）。

## 水平扩展（最优的方案）

理论上，在系统能支持水平扩展的前提下，增加服务器的数量，部署更多机器集群，能够带来无限的性能提升。<br>

### Nginx（峰值 10W）

解决网络请求如何分布给多个机器去处理？最大支持 10W 并发，更多并发时需要 Nginx 集群。<br>
具体负载均衡的方式：

```
默认轮询 // 轮询分配服务器
least_conn // 优先使用最少连接的服务器
ip_hash // 相同ip分配同一台服务器，保存会话session
weight // 服务器分配权重
backup // 预留的备份机器
fair //按后端服务器的响应时间来分配请求，响应时间短的优先分配
url_hash // 按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器
```

### LVS（负载均衡器， 峰值 50W）

Linux Virtual Server<br>
原理：原本是请求 LVS 的服务器的数据包，被 LVS 软件篡改了数据包的目的地，将流量转移到了 Nginx 所在的机器 IP，从而实现负载均衡，LVS 基于网络七层协议中的传输层 TCP 服务器处理该层的性能优于处理 HTTP 层来优化性能。<br>
LVS 比 Nginx 快的原因？<br>
LVS 使用网络层的第四层 TCP，TCP 内容相对于 HTTP 内容更简单，解析和组装所消耗的 CPU、内存等资源比 Nginx 要低。

### F5（软硬件结合，峰值 1000W）

### DNS（无限水平扩展，无峰值）

DNS 分发给 F5，F5 继续处理

# 性能保障

## HTTP 服务性能测试

### 压力测试工具

```
apache bench / apache
webbench
```

### 找到性能瓶颈

top // 查看 cpu 和内存
iostat // 磁盘

### node 自带的性能分析

```
node --prof index.js // 产生日志文件
node --prof-process 日志文件.log > profile.txt // 格式化日志文件到profile.txt
node --inspect-brk index.js // chrome 调试node
```

### 代码优化

```
node.js C++插件 // 将计算量转移到C++进行
node-gyp // 用来编译原生C++模块
cluster // 多进程、进程守卫
```

# Other

## RPC

RPC 是远程过程调用（Remote Procedure Call）的缩写形式。SAP 系统 RPC 调用的原理其实很简单，有一些类似于三层构架的 C/S 系统，第三方的客户程序通过接口调用 SAP 内部的标准或自定义函数，获得函数返回的数据进行处理后显示或打印。
