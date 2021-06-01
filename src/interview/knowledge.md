#   对象的阻止扩展、密封、冻结
```
// 一个对象变的不可扩展(不能添加新属性)
Object.preventExtensions(obj)
// 是否可扩展
Object.isExtensible(obj) 
// 封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置即(不可删除)
Object.seal(obj)
// 否被密封
Object.isSealed(obj)
// 冻结一个对象，不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值
Object.freeze(obj) 
// 对象是否被冻结
Object.isFrozen(obj)
```

#   进程和线程的区别
```
进程（Process），正在执行的应用程序，是软件的执行副本，分配计算资源（CPU）、内存资源和文件资源。
线程，轻量级进程，只分配计算资源（CPU），线程运行的本质其实就是函数的执行。
早期的 OS 设计中没有线程，3 种资源都分配给进程，多个进程通过分时技术交替执行（单核），进程之间通过管道技术、消息队列、共享内存等进行通信。
如浏览器，运行时看作一个进程。但是浏览器内部需要图形渲染、需要网络、需要响应用户操作，这些行为不可以互相阻塞，必须同时进行，这样就设计成线程。
现代操作系统都是直接调度线程，不会调度进程。
```
#   块格式化上下文（Block Formatting Context，BFC）
```
// 定义
CSS布局中的一个概念，BFC 是一个独立的布局环境，可以理解为一个容器，在这个容器中块元素会在垂直方向上一个接一个的放置，容器内的样式并且不会影响其它环境中的元素。
// BFC的创建
1.  根元素（<html>）
2.  浮动元素（元素的 float 不是 none）
3.  绝对定位元素（元素的 position 为 absolute 或 fixed）
4.  行内块元素（元素的 display 为 inline-block）
5.  表格单元格（元素的 display 为 table-cell，HTML表格单元格默认为该值）
6.  overflow 计算值(Computed)不为 visible 的块元素
// BFC的应用
1.  使用overflow: auto清楚浮动
2.  margin合并
```
#   包含块(containing block)
```
// 定义
一个元素的尺寸和位置经常受其包含块(containing block)的影响。大多数情况下，包含块就是这个元素最近的祖先块元素的内容区 content-box，但也不是总是这样。
// 确定包含块
1.  大多数情况下，包含块就是这个元素最近的祖先块元素的内容区 content-box
2.  确定一个元素的包含块的过程完全依赖于这个元素的 position 属性
    如果 position 属性为 static 、 relative 或 sticky，包含块可能由它的最近的祖先块元素
    如果 position 属性为 absolute ，包含块就是由它的最近的 position 的值不是 static 的祖先元素的内边距区的边缘组成
    如果 position 属性是 fixed，其包含块是 viewport 
    如果 position 属性是 absolute 或 fixed，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的
        transform 或 perspective 的值不是 none
        will-change 的值是 transform 或 perspective
        filter 的值不是 none
    根元素(<html>)所在的包含块是一个被称为初始包含块的矩形
// 包含块的应用
根据包含块计算百分值
1.  计算 height top 及 bottom 中的百分值，是通过包含块的 height 的值。
2.  要计算 width, left, right, padding, margin 这些属性由包含块的 width 属性的值来计算它的百分值。
```

#   HTTP 的 keep-alive 和 TCP 的 keep-alive
```
// 使用 keep-alive 复用链接，并设置复用的阈值超时时长和最大请求数。
// HTTP1.0 需要Connection: Keep-Alive，HTTP1.1 默认开启，需要 Connection: close 关闭
// HTTP2 Connection 和 Keep-Alive  是被忽略的；因为通过为每个域名只会建立一个链接并采用多路复用创建多个流，每个流来实现具体的某个请求及响应。
Connection: Keep-Alive
Keep-Alive: timeout=5, max=1000
// TCP
TCP keep-alive是一种检测TCP连接状况的保鲜机制。
net.ipv4.tcp_keepalive_intvl = 15 // 尝试获取 ack 的时间间隔
net.ipv4.tcp_keepalive_probes = 5 // 没有收到 ack 最大尝试次数
net.ipv4.tcp_keepalive_time = 1800 // 检查链接状态的超时时间，HTTP 中 Keep-Alive: timeout=5 受此影响，如果HTTP timeout 大于 TCP timeout，其会被忽略
```

#   正则/环视
```
环视只进行子表达式的匹配，不占有字符，匹配到的内容不保存到最终的匹配结果，是零宽度的。
向前向后可以理解为最终匹配的部分。
// 向前肯定断言
x(?=y)：x 被 y 跟随时匹配 x。例如，对于/Jack(?=Sprat)/，“Jack”在跟有“Sprat”的情况下才会得到匹配，但匹配结果不包含 Sprat。
// 向前否定断言
x(?!y)：x 没有被 y 跟随时匹配 x。例如，对于/\d+(?!\.)/，数字后没有跟随小数点的情况下才会得到匹配。
// 向后肯定断言
(?<=y)x：x 跟随 y 的情况下匹配 x。例如，对于/(?<=Jack)Sprat/，“Sprat”紧随“Jack”时才会得到匹配。
// 向后否定断言
(?<!y)x：x 不跟随 y 时匹配 x。例如，对于/(?<!-)\d+/，数字不紧随-符号的情况下才会得到匹配。
```

#   transform 后图片模糊
```
.preview-img:hover {
    transform: scale(10); // 图片模糊
    transform:translateZ(0) scale(10); // fix 图片模糊
    filter: blur(0px);
}
```

#   node.js模块引入机制
```
1.  路径分析
    在Node中模块分为两类：一类是Node提供的模块，称为核心模块；另一类是用户编写的，称为文件模块。
    不论是核心模块还是文件模块，require()方法对相同模块的二次加载一律采用缓存优先的策略，是第一优先级的。
    不同之处在于核心模块的缓存检查要先于文件模块的缓存检查。
    核心模块：核心模块的优先级仅次于缓存加载（http、fs、path）。
    路径形式的文件模块：在分析路径是会将其转换为绝对路径并将绝对路径作为索引，将编译执行后的结果存在缓存中。
    自定义模块：可能是一个文件或者包的形式，这类模块查找最费时间。
        当前文件目录下的node_modules目录。
        父目录下的node_modules目录。
        沿路径向上逐级递归，直到根目录下的node_modules目录。
2.  文件定位
    Node require() 时没有指定文件后缀名时会按照.js、.json、.node的次序补足拓展名，依次尝试。
    通过分析文件拓展名之后可能没有得到一个文件，但是得到一个目录此时Node会将目录当作一个包处理。
    在package.json文件，取出main属性来对文件定位。如果main指向的文件没有，或者没有package.json文件,则依次查找index.js、index.json、index.node。
3.  编译执行
    每个文件模块都是一个Module对象（id、path、paths、filename等）
    每个模块都有require、exports、module 3个变量，在编译的过程中，Node对获取的Javascript文件的内容进行了包装__filename、__dirname这两个变量。
```


