# 热更新原理
Webpack 监控文件状态，文件发生改变重新打包代码（通过 fs.watch 递归监控）<br>
Express 建立服务，并和客户端见一个 EventSource http链接，有打包更新通知客户端<br>
客户端，收到服务器有打包更新的请求，客户端通过 ajax 请求，请求打包结果并解析。<br>
```
// js热更新配置（保存js状态）
// module.hot.accept();
```
