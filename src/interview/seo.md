# SEO的作用
越靠前搜索结果关注度越高
提高网站的自然排名
增加网页的收录

#   标签香港优化
##  title
```
<title>{网页title}</title>
```
建议：50～60字符（25～30 个中文字）
##  description
```
<meta name="description" content="应用相关的描述"/>
```
建议：150～160字符（75～80 个中文字），目前已经不太重要了，各页面间不要重复！
##  keyword
```
<meta name="keywords" content="**,***,***,***"/>
```
建议：3-5个为宜，英文“,”号做分隔符，目前已经不太重要了。

##  meta:robots
```
<meta name="robots" content="index,follow,archive">
INDEX	允许抓取当前页面
NOINDEX	不许抓取当前页面
FOLLOW	允许从当前页面的链接向下爬行
NOFOLLOW	不许从当前页面的链接向下爬行
ARCHIVE	允许生成快照
NOARCHIVE	不许生成快照
```
##  canonical
当站内存在多个内容相同或相似的页面时，可以使用该标签来指向其中一个作为规范页面。
如多语言时指定某个语言为主站，PC 站点和 Mobile 站点，一般 PC 内容相对丰富
不只是主路由不同，即便是 http 协议不同（http/https）、查询字符串的微小差异，搜索引擎都会视为完全不同的页面/链接，导致页面权重分散。
```
www.***.com/goods/xxxx
www.***.com/goods/xxxx?…
www.***.com/goods/xxxx?…
<link rel="canonical" href="www.***.com/goods/xxxx" />
```
##  alternate
```
// 在pc页面中放置
<link rel="alternate" media="only screen and (max-width：640px)" href="一般为PC页面对应的移动端URL" >
// 在mobile页面中放置
<link rel="alternate" href="PC站点URL" >
```
##  H1/H2
```
1.  h1和h2标签各至多只有一个
2.  h1标签为文本节点，不要包含其他标签
3.  必要时可以和网页title保持一致
```
## img标签
尽量为img标签添加alt属性（对可访问性）
装饰性图片可不添加

##  标签伪元素
如 before、after 使用CSS content 属性的文本不能被爬取
#   sitemap
方便搜索引擎爬虫更好的爬取页面<br>
每个文件上限url 50000<br>

#   SEO 结构化数据
```
// 描述一个人
<div itemscope itemtype="**/Person">
  我的名字是<span itemprop="name">yzf</span>
  大家都叫我<span itemprop="nickname">fanerge</span>
  我的主页<a href="https://fanerge.github.io" itemprop="url">fanerge.github.io</a>
  我是一名<span itemprop="title">前端工程师</span>
</div>
// itemscope 表示一个项目（一个人、物、地点等）
// itemtype 表示项的类型
// itemprop 对每个属性的表示
```
[针对SEO优化的网页摘要和结构化数据方法(微数据)](https://www.it610.com/article/1294320874521960448.htm)
[官网指南](https://schema.org/)
[google测试地址](https://search.google.com/structured-data/testing-tool/u/0/)

#  other 

img标签的 alt，可以指定格式。即使是用于修饰的图片也要添加空的alt。
##  Robots.txt
```
存放于网站根目录
Robots 协议是蜘蛛访问网站的开关，决定蜘蛛可以抓取哪些内容，不可以抓取哪些内容。
因为一些系统中的URL是大小写敏感的，所以robots.txt的文件名应统一为小写。
更好地做定向SEO优化，重点曝光有价值的链接给爬虫
将敏感文件保护起来，避免爬虫爬取收录
如：
# first group
User-agent: Baiduspider
Disallow: /api/ api接口
Disallow: /preview/ 商家预览
Allow: link
...
# second group
User-agent: *
Disallow: /

Sitemap: 网站地图 告诉爬虫这个页面是网站地图
```
##  编码方式
1.  语义化标签HTML代码，重要的HTML放前面（爬去顺序自上而下）
2.  少使用 ifrmae ，搜索引擎不会抓取iframe中的内容
3.  优化网站速度，网站速度是搜索引擎排序的一个重要指标
4.  友情链接和外链，友情链-好的友情链接可以快速的提高你的网站权重，外链-高质量的外链，会给你的网站提高源源不断的权重提升


##  JavaScript应用的SEO
### prerender（将JavaScript应用转成HTML）
```
<meta name="fragment" content="!">
// 如果你的站点采用锚点路有技术(#)，将它们改为(#!);
<meta name="fragment" content="#!">
```
### 我们给爬虫返数据
通过 User-Agent 判断为爬虫，再通过 nginx 代理到 node + puppeteer 来实现爬虫服务器（注意需要增加扒页面的接收延时，保证异步渲染的接口数据返回）然后再将HTML返给爬虫。

### 更好的方案
SSR

# 隐藏页(Cloaking)，又称障眼法、伪装技术
为搜索引擎爬虫和用户浏览器分别提供不同版本的内容，这主要根据HTTP请求头的IP和User-Agent信息来区分。

[爬虫 User-Agents 名单](https://www.baidu.com/robots.txt)
[PhantomJS](https://phantomjs.org/)
[各语言Prerender](https://prerender.io/)
