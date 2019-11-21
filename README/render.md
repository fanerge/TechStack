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

> 参考文档：
[浏览器的工作原理](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork)
[性能优化——CSS和JS的加载和执行](https://blog.csdn.net/qq_35534823/article/details/79356317)
[js和css的加载造成阻塞](https://www.cnblogs.com/bibiafa/p/9364986.html)