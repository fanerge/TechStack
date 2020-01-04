SSO：（Single Sign On）在多个应用系统中，只需要登录一次，就可以访问其他相互信任的应用系统。
#   多个系统在一个域名下（在同一个父域名下）
这种情况比较简单，前端可以将作用认证的sessionId的cookie存在父域名下，然后子域名也能访问到该cookie。
```
父域名： pingan.com
子1域名：tech.pingan.com
子2域名：ut.pingan.com
```
#   多个系统不再在一个域名
这种情况比较复杂，有一下几种方案。
##  多个系统域名+1个登录域名
假设www.aaa.com，检测没有登录，重定向到www.sso.com进行登录，登录成功，在登录成功的页面嵌入子个隐藏的iframe，
```
// 这里的作用是将登录信息同步到各个子系统中，也可以在下面几个get请求中，服务端设置setCookie头，将认证标示存在对应域名下。
<iframe width="0" height="0" src="https://www.aaa.com/sso.php?sessid=xxxxxxxxxxxx&sfkey=xxxxxxxxxxx">
<iframe width="0" height="0" src="https://www.bbb.com/sso.php?sessid=xxxxxxxxxxxx&sfkey=xxxxxxxxxxx">
<iframe width="0" height="0" src="https://www.ccc.com/sso.php?sessid=xxxxxxxxxxxx&sfkey=xxxxxxxxxxx">
```
```
用于所有系统认证：www.sso.com

子系统域名1：www.aaa.com
子系统域名2：www.bbb.com
子系统域名3：www.ccc.com
```
登录流程<br>
![登录流程](../img/sso_login.png)
登出流程<br>
![登出流程](../img/sso_logout.png)<br>
[sso简单原理及实现](https://www.cnblogs.com/zh94/p/8352943.html)<br>

[多域名同步登录,单点登录SSO](https://blog.csdn.net/webnoties/article/details/77651669)
[分布式多系统SSO单点登录](https://blog.csdn.net/weixin_38312502/article/details/81180260)
##  前段跨域实现cookie“共享”
访问任意子系统时，通过iframe内嵌其他子系统，再通过 postMessage 将cookie发送给其他窗口，来实现认证。
```
子系统域名1：www.aaa.com
子系统域名2：www.bbb.com
子系统域名3：www.ccc.com
```
[前端单点登录（SSO）实现方法（二级域名与主域名）](https://www.cnblogs.com/Easty/p/7338940.html)




