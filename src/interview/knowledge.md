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
早期的 OS 设计中没有线程，3 种资源都分配给进程，多个进程通过分时技术交替执行（单核），进程之间通过管道技术、消息队列、共享内存等进行通信。
进程（Process），正在执行的应用程序，是软件的执行副本，分配计算资源（CPU）、内存资源和文件资源。
线程，轻量级进程，只分配计算资源（CPU），线程运行的本质其实就是函数的执行。
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

# VUE、keep-alive

