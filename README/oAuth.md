# 介绍

oAuth 是 Open Authorization 的简写。<br>
OAuth 协议为用户资源的授权提供了一个安全的、开放而又简易的标准。<br>
OAuth 有三个角色：我们开发的 APP（client）、授权服务器（Auth server 如 QQ、github、google 等）、授权服务器的用户（User，也就是共享给我们 APP 的用户）。<br>

# OAuth 认证和授权的过程

1、用户访问第三方网站网站，想对用户存放在服务商的某些资源进行操作。

2、第三方网站向服务商请求一个临时令牌。

3、服务商验证第三方网站的身份后，授予一个临时令牌。

4、第三方网站获得临时令牌后，将用户导向至服务商的授权页面请求用户授权，然后这个过程中将临时令牌和第三方网站的返回地址发送给服务商。

5、用户在服务商的授权页面上输入自己的用户名和密码，授权第三方网站访问所相应的资源。

6、授权成功后，服务商将用户导向第三方网站的返回地址。

7、第三方网站根据临时令牌从服务商那里获取访问令牌。

8、服务商根据令牌和用户的授权情况授予第三方网站访问令牌。

9、第三方网站使用获取到的访问令牌访问存放在服务商的对应的用户资源。

[OAuth2.0 认证和授权原理](https://www.tuicool.com/articles/qqeuE3)

# 开发流程

以 QQ 登录 OAuth2.0 为例

## 申请 appid 和 appkey

appid 为应用的唯一标识，在 OAuth2.0 中为 oauth_consumer_key 的值。<br>
appkey 为对应 appid 的密钥，访问用户资源时用来验证应用的合法性。在 OAuth2.0 中 appkey 的值即为 oauth_consumer_secret 的值。<br>

### 申请流程

1.  开发者资质审核
2.  申请 appid（oauth_consumer_key/client_id）和 appkey（auth_consumer_secret/client_secret）
    [申请地址](https://connect.qq.com/manage.html#/)

## 在应用中放置登录按钮（本文 QQ 登录）

放置对应按钮和对应处理事件。

## 使用 Authorization_Code 获取 Access_Token

通过用户验证登录和授权，获取 Access Token，为下一步获取用户的 OpenID 做准备。

## 获取用户 OpenID

OpenID 是此网站上或应用中唯一对应用户身份的标识。

## OpenAPI 调用

获取到 Access Token 和 OpenID 后，可通过调用 OpenAPI 来获取或修改用户个人信息。
