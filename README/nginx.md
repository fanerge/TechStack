#   常见需求
##  代理&&端口转发
### 反向代理
服务器根据客户端的请求，从其关联的一组或多组后端服务器（如Web服务器）上获取资源，然后再将这些资源返回给客户端，客户端只会得知反向代理的IP地址，而不知道在代理服务器后面的服务器簇的存在（如：负载均衡）。<br>
### 正向代理
一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。客户端才能使用正向代理（如翻墙）。
###  端口转发
```
// 默认nginx使用80端口，将80端口转发到8080端口
location / {
    proxy_pass: 127.0.0.1:8080;
}
```
##  nginx负载均衡的实现方式？
```
#4种方式配置一组被代理的服务器地址
upstream的参数：
    down（暂时不参与负载均衡）
    backup（预留的备份机器）
    weight（权重，越大优先级越高）
    ip_hash（保持会话，保证同一客户端始终访问一台服务器）
    least_conn（优先分配最少连接数的服务器）
    fair（按后端服务器的响应时间来分配请求，响应时间短的优先分配）
    url_hash（按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器）
    max_fails（允许请求失败的次）
    fail_timeout（在经历了max_fails次失败后，暂停服务的时间）
#热备方式
upstream mysvr { 
  server 127.0.0.1:7878; 
  server 192.168.10.121:3333 backup;  #热备     
}

#轮询
upstream mysvr { 
  server 127.0.0.1:7878;
  server 192.168.10.121:3333;       
}

#加权轮询
upstream mysvr { 
  server 127.0.0.1:7878 weight=1;
  server 192.168.10.121:3333 weight=2;
}

#ip_hash
upstream mysvr { 
  server 127.0.0.1:7878; 
  server 192.168.10.121:3333;
  ip_hash;
}

#应用代理服务器
server {
    ....
    location  ~*^.+$ {         
        proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表         
    }
}
```
Ip hash算法，对客户端请求的ip进行hash操作，然后根据hash结果将同一个客户端ip的请求分发给同一台服务器进行处理，可以解决session不共享的问题。<br>
负载均衡只是反向代理的一个运用。

##  nginx配置特殊文件下载
```
location ~* .*.(txt|doc|pdf|rar|gz|zip|docx|exe|xlsx|csv) {
    add_header  Content-Type    "application/octet-stream";
    if ( $args ~ ^filename=(.*) ) {
        add_header  Content-Disposition "attachment; filename=$1";
    }
    root 项目路径;
}
```

##  网站基础认证
一般用于后台系统基础认证，更安全的认证方式[nginx-auth-ldap](https://github.com/kvspb/nginx-auth-ldap)。
[ngx_http_auth_basic_module](http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
```
location / {
    auth_basic  "closed site";
    auth_basic_user_file conf/htpasswd;
}
```

##  实现ip访问限制
经常会遇到希望网站让某些特定用户的群体（公司内网），其实用了 ngx_http_access_module 的方法。<br>
ngx_http_geo_module 更好的管理ip地址列表。
```
location / {
    #类似于黑名单
    deny  192.168.1.100;
    #类似于白名单
    allow 192.168.1.101;
    #允许192.168.1.10-200 ip段内的访问
    allow 192.168.1.10/200;
}
```
[Nginx与前端开发](https://juejin.im/post/5bacbd395188255c8d0fd4b2)

##  实现前端跨域
```
#请求跨域，这里约定代理请求url path是以/apis/开头
location ^~/apis/ {
    # 这里重写了请求，将正则匹配中的第一个()中$1的path，拼接到真正的请求后面，并用break停止后续匹配
    rewrite ^/apis/(.*)$ /$1 break;
    proxy_pass https://www.dm.com/;
}  
localhost/apis/userlist --> https://www.dm.com/apis/userlist
```
[Nginx与前端开发](https://juejin.im/post/5bacbd395188255c8d0fd4b2)

##  实现接口CORS
```
location ^~/apis/ {
    if ($http_origin ~ <允许的域（正则匹配）>) {
        add_header 'Access-Control-Allow-Origin' "$http_origin";
        add_header 'Access-Control-Allow-Credentials' "true";
        if ($request_method = "OPTIONS") {
            add_header 'Access-Control-Max-Age' 86400;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE';
            add_header 'Access-Control-Allow-Headers' 'reqid, nid, host, x-real-ip, x-forwarded-ip, event-type, event-id, accept, content-type';
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain, charset=utf-8';
            return 204;
        }
    }
    #正常的nginx配置
}
```

##  适配PC与移动环境
```
#$http_user_agent 在nginx中可以获取到userAgent
location / {
    # 移动、pc设备适配
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
        set $mobile_request '1';
    }
    if ($mobile_request = '1') {
        rewrite ^.+ http:www.h5.dm.com;
    }
}
```

##  合并请求
前端性能优化中重要一点就是尽量减少http资源请求的数量。
[nginx-http-concat](https://github.com/alibaba/nginx-http-concat)
```
# js资源http-concat
# nginx-http-concat模块将资源合并等
location /static/js/ {
    concat on; # 是否打开资源合并开关
    concat_types application/javascript; # 允许合并的资源类型
    concat_unique off; # 是否允许合并不同类型的资源
    concat_max_files 5; # 允许合并的最大资源数目
}
http://dm.com/static/js/??a.js,b.js,c.js --> 会将js，a.js和b.js和c.js文件合并后返还给前端
```

##  图片处理
[ngx_http_image_filter_module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html)
```
# 图片缩放处理
# 这里约定的图片处理url格式：以 www.dm.com/img/路径访问
location ~* /img/(.+)$ {
    alias /Users/dm/Desktop/server/static/image/$1; #图片服务端储存地址
    set $width -; #图片宽度默认值
    set $height -; #图片高度默认值
    if ($arg_width != "") {
        set $width $arg_width;
    }
    if ($arg_height != "") {
        set $height $arg_height;
    }
    image_filter resize $width $height; #设置图片宽高
    image_filter_buffer 10M;   #设置Nginx读取图片的最大buffer。
    image_filter_interlace on; #是否开启图片图像隔行扫描
    error_page 415 = 415.png; #图片处理错误提示图，例如缩放参数不是数字
}
www.dm.com/img/test.png?width=200&height=200 --> 裁剪图片
```

##  静态资源缓存时间及实现防盗链
```
location ~ .*\.(gif|jpg|png|jpeg|bmp|ico|css)$ {
    root   /usr/share/nginx/html;
    expires 2d;
}

location ~*\.(jpg|png|gif|jpeg)$ {
    #图片路径
   root  /usr/share/nginx/html;  
   #可以访问图片的白名单
   valid_referers none blocked  *.dm.cn  *h5.dm.cn;  
   if ($invalid_referer) {  
        #非白名单域名，处理
    }

}
```

##  页面内容修改
可以实现向指定页面插入内容（js、css等），可用于开发环境增加一些调试模块
[nginx-http-footer-filter](https://github.com/alibaba/nginx-http-footer-filter)
[ngx_http_addition_module](http://nginx.org/en/docs/http/ngx_http_addition_module.html)
```
#footer中插入服务器时间
location / {
    ## Using the $date_gmt variable from the SSI module (prints a
    ## UNIX timestamp).
    footer "<!-- $date_gmt -->";
    index index.html;
}
footer中插入样式
location ^~ /assets/css {
    ## Add CSS to the MIME types to be added a footer.
    footer_types text/css; 

    footer "/* host: $server_name - $date_local */";
}

```

#   nginx目录
nginx配置目录：/usr/local/etc/nginx<br>
nginx安装目录：/usr/local/cellar/nginx<br>
配置检查：nginx -t<br>
启动命令：nginx/nginx -c [配置文件的路径]<br>
重启命令：nginx -s reload<br>
停止命令：nginx -s quit（保存信息）/nginx -s stop（不保存信息）<br>
打开日志：nginx -s reopen<br>
其中-s（signal）意思是向主进程发送信号<br>

#   nginx路径正则
```

location  = / {
  # 精确匹配 / ，主机名后面不能带任何字符串
  [ configuration A ] 
}
 
location  / {
  # 因为所有的地址都以 / 开头，所以这条规则将匹配到所有请求
  # 但是正则和最长字符串会优先匹配
  [ configuration B ] 
}
 
location /documents/ {
  # 匹配任何以 /documents/ 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration C ] 
}
 
location ~ /documents/Abc {
  # 匹配任何以 /documents/ 开头的地址，匹配符合以后，还要继续往下搜索
  # 只有后面的正则表达式没有匹配到时，这一条才会采用这一条
  [ configuration CC ] 
}
 
location ^~ /images/ {
  # 匹配任何以 /images/ 开头的地址，匹配符合以后，停止往下搜索正则，采用这一条。
  [ configuration D ] 
}
 
location ~* \.(gif|jpg|jpeg)$ {
  # 匹配所有以 gif,jpg或jpeg 结尾的请求
  # 然而，所有请求 /images/ 下的图片会被 config D 处理，因为 ^~ 到达不了这一条正则
  [ configuration E ] 
}
 
location /images/ {
  # 字符匹配到 /images/，继续往下，会发现 ^~ 存在
  [ configuration F ] 
}
 
location /images/abc {
  # 最长字符匹配到 /images/abc，继续往下，会发现 ^~ 存在
  # F与G的放置顺序是没有关系的
  [ configuration G ] 
}
 
location ~ /images/abc/ {
  # 只有去掉 config D 才有效：先最长匹配 config G 开头的地址，继续往下搜索，匹配到这一条正则，采用
    [ configuration H ] 
}
 
location ~* /js/.*/\.js
总结：
= 开头表示精确匹配
^~ 开头表示uri以某个常规字符串开头，不是正则匹配
~ 开头表示区分大小写的正则匹配;
~* 开头表示不区分大小写的正则匹配
/ 通用匹配, 如果没有其它匹配,任何请求都会匹配到
```
location优先级：(location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~* 正则顺序) > (location 部分起始路径) > (/)
#   基本配置
配置文件为nginx.conf
```
#全局模
#设置用户
user nobody;

#工作进程数
worker_processes  1;

#设置错误日志文件存放路径（不同错误类型可以存放不同地址）
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#设置pid存放路径
#pid logs/nginx.pid

#工作模式及连接数上限
#events块
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}

#http相关
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志
    #设定日志格式
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址
        # 定义错误提示页面
        error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        }
 
        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            
            #过期30天，静态文件不怎么更新，过期可以设大一点，
            #如果频繁更新，则可以设置得小一点。
            expires 30d;
        }
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```

>   参考文档：<br>
    [nginx官网](http://nginx.org/en/)
    [nginx负载均衡基于iphash的session黏贴](https://blog.csdn.net/suncaishen/article/details/7261219)<br>
    [Nginx代理功能与负载均衡详解](https://www.cnblogs.com/knowledgesea/p/5199046.html)<br>
    [Nginx与前端开发](https://juejin.im/post/5bacbd395188255c8d0fd4b2)<br>
    [nginx从入门到实践](https://juejin.im/post/5a2600bdf265da432b4aaaba)<br>
    [nginx location正则匹配规则](https://blog.csdn.net/dmw412724/article/details/79770159)