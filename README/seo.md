#   meta标签相关的SEO
##  title
```
<title>{网页title}</title>
```
建议：50～60字符（25～30 个中文字）
##  description
```
<meta name="description" content="应用相关的描述"/>
```
建议：150～160字符（75～80 个中文字），目前已经不太重要了。
##  keyword
```
<meta name="description" content="应用相关的描述"/>
```
建议：3-5个为宜，英文“,”号做分隔符，目前已经不太重要了。
##  H1/H2
1.  h1和h2标签各至多只有一个
2.  h1标签为文本节点，不要包含其他标签
3.  必要时可以和网页title保持一致

##  canonical
canonical标签就是告诉搜索引擎哪个页面是权威页面。
```
<link rel="canonical" href="对应页面的权威地址（一般为PC页面）" />
```
##  alternate
```
<link rel="alternate" media="only screen and (max-width：640px)" href="一般为PC页面对应的移动端页面" >
```

#   sitemap
方便搜索引擎爬虫更好的爬取页面<br>
每个文件上限url 50000<br>

#   微数据结构化
```
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Store",
  "name": "Middle of Nowhere Foods",
  "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 09:00-14:00",
  "openingHoursSpecification":
  [
    {
      "@type": "OpeningHoursSpecification",
      "validFrom": "2013-12-24",
      "validThrough": "2013-12-25",
      "opens": "09:00",
      "closes": "11:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "validFrom": "2014-01-01",
      "validThrough": "2014-01-01",
      "opens": "12:00:00",
      "closes": "14:00:00"
    }
  ]
}
</script>
```
[官网指南](https://schema.org/)
[google测试地址](https://search.google.com/structured-data/testing-tool/u/0/)

#  other 

img标签的 alt，可以指定格式。即使是用于修饰的图片也要添加空的alt。
##  Robots.txt
Robots 协议是蜘蛛访问网站的开关，决定蜘蛛可以抓取哪些内容，不可以抓取哪些内容。
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