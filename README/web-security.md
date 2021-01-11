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
##  子域名与 IP 收集
bounty-targets-data\OneForAll、subDomainsBrute、subfinder、ESD、Amass、DNSDumpster 和 Subdomain Finder。
##  端口服务探测
Nmap -A lagou.com
##  网站指纹识别
Wappalyzer 
##  旁站与 C 段查询
旁站即同一服务器上的其他域名网站，如果你能攻下该旁站，就有机会间接拿到目标网站的权限。
// 
https://www.webscan.cc/
// ip查询
https://chapangzhan.com/
##  WAF 探测
当网站开启 WAF（Web 防火墙）时，很多测试请求都会被拦截，导致无法正常扫描。
SQLMap\TScan
##  敏感信息收集
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

CSRF 攻击就是在受害者毫不知情的情况下以受害者名义伪造请求发送给受攻击站点，从而在并未授权的情况下执行在权限保护之下的操作。

## CSRF 防御手段

服务器可以判断 Referer 来拒绝不受信任的源发出的请求。
由于攻击者在大多数情况下利用 cookie 来通过验证，所以可以在请求地址中添加其他头部字段，比如 token，服务端只有接收到正确的 token 后才响应正确的内容。
攻击者是在不知情的情况下，自动发起恶意的请求，那么可以通过用户确认来防御攻击，比如加入图形或短信验证码让用户输入，确认该操作是用户本人发起的（往往在比较重要的场景中使用）。

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

