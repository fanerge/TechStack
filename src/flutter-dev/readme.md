#   开发调试
// 添加启动参数，如 ENV=st 使用不同 host 地址
[launch.json]launch.json)
```
依赖管理：pubspec.yaml
1.  更新 pubspec.yaml
flutter clean
flutter pub upgrade
flutter pub get
flutter get package
flutter pub add package // 添加依赖
flutter packages get // 更新依赖

```


# 项目架构/flutter 开发 app
```
state：公共状态管理及分发（Provide 类似于 context）
router：路由配置及路由跳转（router 配置，switchTab、navigator ）
http：与服务端交互请求方法封装及 request 和 response 拦截（统一异常处理 401、403、500等）
auth：鉴权，是否登录，从 response 中提取 set-cookie 中和权限有关的 cookie 在 request 再次发送
App下载以及唤起用系统web页面进行App下载（android 唤起系统浏览器下载，ios 在app store 打开 appid 对应页面）
版本检测及更新（强制更新及普通更新）
第三方App以及浏览器唤起Tabe App（通过 uni_links 唤起 App，Deep Links (Android) and Universal Links(iOS)）
App崩溃监控及错误上报（Sentry）
Flutter与WebView之间的通讯机制（在 onWebViewCreated 注入对应方法，h5侧直接调用方法 原理 JSBridge）
测试版本分发（蒲公英平台）
```



参考资源：
[flutter实战-电子书](https://book.flutterchina.club/)
[老孟-flutter](http://laomengit.com/)


