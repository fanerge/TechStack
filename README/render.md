# 浏览器工作原理流程图（webkit）
![webkitflow.png](../img/webkitflow.png)
##  CSS加载和解析对HTML的影响
1.  当浏览器介绍到HTML文件后，还是自上而下的解析，遇到CSS就并行下载（也就说不阻塞DOM生成DOMTree的过程）
2.  CSS下载完后开始解析CSS即生成CSSOMTree（这个过程也不会阻塞DOM生成DOMTree的过程）
3.  由于生成RenderTree需要DOMTree和CSSOMTree共同参与（所以2过程如果先完成会阻塞RenderTree产生的过程）

##  JS加载和解析对HTML的影响
![js加载执行与HTML解析关系](../img/js加载执行与HTML解析关系.jpeg)
[图片来源](https://www.cnblogs.com/bibiafa/p/9364986.html)
1.  默认JS下载和解析都会阻塞HTML的解析
2.  defer使JS下载变成异步，执行时机为Document的domcontentloaded事件出发（该过程HTML已经解析完毕，所以不存在阻塞HTML解析）
3.  async使JS下载变成异步，执行时机为下载后立即执行会阻塞HTML的解析
4.  对WebKit 而言，仅当脚本尝试访问的样式属性可能受尚未加载的样式表影响时，它才会禁止该脚本。

##  javascript对DOM树与CSSOM树创建的影响
### 情形一，页面只有HTML 和 CSS
CSS下载和解析都不阻塞DOM的解析<br>
CSSOM和DOM形成RenderTree需要前面两个过程都完成
### 情形二，页面只有HTML 和 JS（非外部）
DOM解析过程遇到JS会被阻塞（因为JS可能会操作当前已经生成的DOM）<br>
需要注意，如果JS操作还未生成的DOM节点（不生效）
### 情形三，页面只有HTML 和 CSS 和 JS（均非外部）
DOM解析时当遇到JS会被阻塞，JS执行之前需要等待CSSOM解析完成（因为JS可能会操作CSSOM）<br>
所以说CSSOM在JS存在的情况下会间接阻塞DOM解析
### 情形四，页面只有HTML 和 CSS 和 JS（均外部引入）
Webkit渲染引擎有一个优化，在接收到HTML文件时会开启一个预解析线程，该线程会提前下载脚本、层叠样式表和图片<br>
下载完后和情形三类似<br>

[渲染树怎么形成的你真的很懂吗？](https://mp.weixin.qq.com/s?__biz=MzU3NjczNDk2MA==&mid=2247484783&idx=1&sn=75ded5947976a317ec07f6e15c1c02d9&chksm=fd0e16f0ca799fe616f9b6d4361548edd74b77be29b5dc594195f40791a08e1f8da98cb232ff&mpshare=1&scene=23&srcid&sharer_sharetime=1574643206426&sharer_shareid=3daf126008b83bc321fb3eeb3e318508%23rd)

> 参考文档：
[浏览器的工作原理](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork)
[性能优化——CSS和JS的加载和执行](https://blog.csdn.net/qq_35534823/article/details/79356317)
[js和css的加载造成阻塞](https://www.cnblogs.com/bibiafa/p/9364986.html)
