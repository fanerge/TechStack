1.  回答问题效率（不要太多废话，太啰嗦了，直接回答问题，免得让人觉得需要沟通成本）
2.  放慢语速，不要紧张（当成一般的技术交流来对待）
3.  短时间需要把亮点展示处理（比如自我介绍的时候，“我对 JS 有比较深的理解”，面试官就会着重考察你这方面的知识）
4.  大厂都需要刷题（1 年期限刷题/2020-01-01）
5.  作为前端，工作中处理过什么复杂的需求，如何解决的?
6.  面试技巧：技术成体系，逻辑清晰，等面试官说完先停顿两秒认真思考后再回答。
7.  如何促进业务落地
8.  难点/亮点（实践 HTTP2 HPACK 等）
9.  STAR 法则情境(situation)、目标（target）、行动(action)、结果(result)
10. owner 意识，凡事有交代。

# 介绍
我叫***，14年开始接触WEB前端，中途也做过一些php开发，扩展了自己的后端能力，使自己能够以全栈的纬度去思考并解决问题。
始终保持着持续学习，来扩展自己的技术广度（操作系统、网络协议、docker、flutter、electron等搭建技术体系）以及深挖前端技术深度。
为公司搭建多个项目以及新技术的调研和落地，有多端开发经验，目前已接触 PC、移动端、微信（公众号及小程序）、flutter、electron 等多端技术。
除此之外对网络协议及WEB性能、体验、安全、SEO有较丰富的实践经验，也经常对这些领域做相关分享。

# why
我这边是找朋友帮忙内推的，关注了**招聘情况，我刚好看见**想做这种企业费控类SaaS平台（如果是0到1就更好），感觉很有前景也是我想要做的，也希望自己能够抓住这次机会。

# web安全
Cross-site Script，跨站脚本
SQL 注入
Cross Site Request Forgery，跨站请求伪造，也叫 XSRF
Server-Side Request Forgery，服务端请求伪造
反序列化漏洞
文件上传漏洞
文件包含漏洞（File Inclusion）
越权漏洞（over permission）
点击劫持 X-Frame-Options

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








