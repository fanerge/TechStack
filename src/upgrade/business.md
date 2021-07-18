#   业务：定制化平台开发 PAAS/SAAS

```
以子域名区分租户 *.bb.com 做数据隔离
cjt.bb.com
ld.bb.com
zj.bb.com
我们自己搭建了一套完成系统（采购商、供应商、运营等角色）
门户：平台各功能介绍、数据展示、功能入口（招采询价及招投标及团购、商城、金服银行产品及支付、基建云）
商城：正常的商城系统
后台（核心）：可以进行配置功能开关、菜单、核心功能
// 会员系统打通各个业务
// 用户需要充值升级为会员（会员有不同等级，不同等级的会员可以使用相应的功能）
1.  不同等级会员可使用不同功能（各自租户独立设置）
2.  会员配置（名称、登记、会费、首次优惠、续费优化、有效期、临期提醒设置、支付方式配置）
3.  会员权益配置（会员可以使用那些功能：招标、供应商推荐、询价通、合同管理、订单管理、收获管理、金服支付、银行保理、商城采购、OCR发票识别等功能）
4.  会员使用该功能时（如果级别不够引导会员升级页面，并默认选中最低支持该功能的级别）
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








