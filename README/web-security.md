# 常用的渗透测试工具

```
Burp Suite：集成化的 Web 应用测试工具 // Chrome 上的插件“Proxy SwitchyOmega”来快速切换代理
Acunetix WVS（Web Vulnerability Scanner）
Xray：Web 漏洞扫描器
Goby：基于网络空间测绘的漏洞扫描器
SQLMap：SQL 注入检测与利用
Nmap：网络扫描与主机检测
Postman：模拟发包工具
HackBar：安全测试插件
NC（NetCat）：网络瑞士军刀
Metasploit：渗透测试平台
```

# 信息收集实践

## 子域名与 IP 收集

bounty-targets-data\OneForAll、subDomainsBrute、subfinder、ESD、Amass、DNSDumpster 和 Subdomain Finder。

## 端口服务探测

Nmap -A lagou.com

## 网站指纹识别

Wappalyzer

## 旁站与 C 段查询

旁站即同一服务器上的其他域名网站，如果你能攻下该旁站，就有机会间接拿到目标网站的权限。
//
https://www.webscan.cc/
// ip 查询
https://chapangzhan.com/

## WAF 探测

当网站开启 WAF（Web 防火墙）时，很多测试请求都会被拦截，导致无法正常扫描。
SQLMap\TScan

## 敏感信息收集

Recon-NG 是一款被动信息收集工具，它可以通过搜索获取 IP 地址、地理位置、用户、邮件地址、密码泄露或者其他敏感信息，最终生成一份完整报告。

# 靶场

```
sqli-labs 靶场
sqli-labs 是一款用于学习 SQL 注入的靶场平台，覆盖了各种类型的 SQL 注入，题目共 75 道
DVWA 靶场
DVWA（Damn Vulnerable Web Application）是一款比较著名的漏洞靶场，很多 Web 安全的初学者都会拿它来练习
Pikachu 靶场
Pikachu 也是一款 Web 漏洞靶场，涵盖各种 Web 漏洞类型的练习，也是基于 PHP+MySQL 搭建的平台，是由国人开发的。
CTF 赛题练习
CTF（Capture The Flag）夺旗赛，在网络安全领域中指的是网络安全技术人员之间进行技术竞技的一种比赛形式。
XCTF 攻防世界
https://adworld.xctf.org.cn
SQL 注入挑战平台
http://redtiger.labs.overthewire.org
韩国 Web 安全挑战平台
https://webhacking.kr/
Websec CTF 练习平台
http://www.websec.fr/
网络信息安全攻防学习平台
http://hackinglab.cn/index.php
国外的 XSS 挑战平台
http://prompt.ml/
VulHub 真实漏洞靶场
https://github.com/vulhub/vulhub
```

# 跨站脚本（Cross Site Scripting，XSS）

一般我们把 XSS 分为反射型、存储型、DOM 型 3 种类型。
反射型 XSS 也叫非持久型 XSS，是指攻击者将恶意代码拼写在 URL 中提交给服务端，服务端返回的内容，也带上了这段 XSS 代码，最后导致浏览器执行了这段恶意代码。
DOM 型 XSS 可以看作一种特殊的反射型 XSS，它也是一种非持久型 XSS，不过相对于反射型 XSS 而言它不需要经过服务端。

## 原理

它主要是指攻击者可以在页面中插入恶意脚本代码，当受害者访问这些页面时，浏览器会解析并执行这些恶意代码，从而达到窃取用户身份/钓鱼/传播恶意代码等行为。

## XSS 防御手段

输入检查（转实体字符&白名单&黑名单）、输出检查、
参数校验。对于 HTTP 请求的 URL 参数和请求体 payload 的数据进行校验。
字符转义。对于一些特殊符号，比如“<”“>”“&”“"”“'”“/”，我们需要对其进行转义，后端接收这些代码时候的转义存储，前端在显示的时候，再把它们转成原来的字符串进行显示。
对于用户输入的字符串内容，不要使用 eval、new Function 等动态执行字符串的方法，注意 innerHTML、outerHTML、document.write、img 的 src、a 的 href、setAttribute、background-image 等方式直接使用用户产生的数据来填充。
cookie，比如保存用户凭证的 session，将其设置为 http only，避免前端访问 cookie。
Content Security Policy 告诉浏览器可以加载和执行哪些外部资源，这样就能防止被一些第三方恶意脚本注入执行。

```
// 通过 HTTP 头信息的 Content-Security-Policy 的字段
Content-Security-Policy: script-src 'self'; object-src 'none';style-src cdn.example.org third-party.org; child-src https:
// 通过网页的<meta>标签设置
<meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'none'; style-src cdn.example.org third-party.org; child-src https:">
```

# 跨站请求伪造（Cross-site Request Forgery，CSRF/XSRF）

## 原理

由于未校验请求来源，导致攻击者可在第三方站点发起 HTTP 请求，并以受害者的目标网站登录态（cookie、session 等）请求，从而执行一些敏感的业务功能操作，比如更改密码、修改个人资料、关注好友。
CSRF 攻击对象是用户，SSRF 攻击对象是服务器。

## CSRF 防御手段

1.  服务器可以判断 Referer 来拒绝不受信任的源发出的请求(不推荐且容易被绕过，通过 javascript:// 伪协议和移动 App 的请求会是 referer 为空)。
2.  让请求参数不可预测，所以常用的方法就是在敏感操作请求上使用 POST 代替 GET，然后添加验证码或 token 进行验证。
3.  验证码，在重要的敏感操作上设置验证码（短信、图片等等）
4.  token 验证无疑是最常用的方法，它对用户是无感知的，体验上比验证码好

```
// token 验证前端实现
在提交的表单中，添加一个隐藏的 token，其值必须是由服务器生成且保证不可预测的随机数，否则没有防御效果。
<input type = "hidden" value="afcsjkl82389dsafcjfsaf352daa34df" name="token" >
提交表单后，会连同此 token 一并提交，由服务器再做比对校验。
生成 csrf token 的算法，常常会取登录后 cookie 中的某值作为输入，然后采用一些加密/哈希算法生成，这也是为了方便后台校验和区分用户。
除了 cookie token，还可以使用伪随机值的 session token，即服务端生成一个伪随机数，存储到 $_SESSION 中，然后返回给用户的页面中隐藏此 token；等用户提交后，再拿它与存储在$_SESSION 的 token 值比较。这是当前比较常用的 token 生成与校验方式。
```

# 点击劫持（C lickJacking ）

## 原理

攻击者创建一个网页利用 iframe 包含目标网站，然后通过设置透明度等方式隐藏目标网站，使用户无法察觉目标网站的存在，并且把它遮罩在网页上。

## ClickJacking 防御

ClickJacking 的攻击原理主要是利用了 iframe，所以可以通过设置响应头部字段 X-Frame-Options HTTP 来告诉浏览器允许哪些域名引用当前页面。
HTTP 响应头 Content-Security-Policy 允许站点管理者控制用户代理能够为指定的页面加载哪些资源。

DENY：表示页面不允许在 iframe 中引用，即便是在相同域名的页面中嵌套也不允许，GitHub 首页响应头部使用的就是这个值。

SAMEORIGIN：表示该页面可以在相同域名页面的 iframe 中引用，知乎网站首页响应头部使用的就是这个值。

ALLOW-FROM [URL]：表示该页面可以在指定来源的 iframe 中引用。

# Downgrade attack

降级攻击（Downgrade attack）是一种对计算机系统或通讯协议的攻击。在降级攻击中，攻击者故意使系统放弃新式、安全性高的工作方式（如加密连接），反而使用为向下兼容而准备的老式、安全性差的工作方式（如明文通讯）。

# SQL 注入

开发时未对用户的输入数据（可能是 GET 或 POST 参数，也可能是 Cookie、HTTP 头等）进行有效过滤，直接带入 SQL 语句解析，使得原本应为参数数据的内容，却被用来拼接 SQL 语句做解析。
防御：不要直接使用用户输入的内容来拼接 SQL 语句，要对各个参数严格过滤。

```
// 万能密码
SELECT username, password FROM users WHERE username=''or'1'='1' and password=''or'1'='1' LIMIT 0,1
```

## 防御 SQL 注入

```
1.  白名单：如果请求参数有特定值的约束，比如参数是固定整数值，那么就只允许接收整数；还有就是常量值限制，比如特定的字符串、整数值等。
2.  参数化查询：参数化查询是预编译 SQL 语句的一种处理方式，所以也叫预编译查询，它可以将输入数据插入到 SQL 语句中的“参数”（即变量）中，防止数据被当作 SQL 语句执行，从而防止 SQL 注入漏洞的产生。
3.  WAF（Web 防火墙）：能够抵挡住大部分的攻击，几乎是当前各网站必备的安全产品。但它也不是无懈可击的，难免会被绕过。不过安全本身就是为了不断提高攻击成本而设立的，并不是为了完全、绝对地解决入侵问题。
4.  RASP（Runtime Application Self-Protection）是一项运行时应用程序自我保护的安全技术，通过搜集和分析应用运行时的相关信息来检测和阻止针对应用本身的攻击，利用 RASP 对 WAF 进行有效的补充，可以构建更加完善的安全防御体系。
```
