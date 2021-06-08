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
如浏览器，打开浏览器会开启一个主进程，大多数情况下会为每个标签页开启一个进程。但是浏览器内部需要需要网络请求、响应用户交互等操作，这些行为不可以互相阻塞，必须同时进行，这样就设计成线程。
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
1.  使用overflow: 不为 visible 清除浮动
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
非捕获括号/分组
(?:x)：匹配 'x' 但是不记住匹配项，/(?:foo){1,2}/ 
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
    核心模块：核心模块的优先级仅次于缓存加载（http、fs、path）。
    路径形式的文件模块：在分析路径是会将其转换为绝对路径并将绝对路径作为索引，将编译执行后的结果存在缓存中。
    自定义模块：可能是一个文件或者包的形式，这类模块查找最费时间。
        当前文件目录下的node_modules目录。
        父目录下的node_modules目录。
        沿路径向上逐级递归，直到根目录下的node_modules目录。
2.  文件定位(区分文件和目录)
    Node require() 时没有制定文件后缀名时会按照.js、.json、.node的次序补足拓展名，依次尝试。
    通过分析文件拓展名之后可能没有得到一个文件，但是得到一个目录此时Node会将目录当作一个包处理。
    在package.json文件，取出main属性来对文件定位。如果main指向的文件没有，或者没有package.json文件,则依次查找index.js、index.json、index.node。
3.  编译执行
    每个文件模块都是一个Module对象（id、path、paths、filename等）
    每个模块都有require、exports、module 3个变量，在编译的过程中，Node对获取的Javascript文件的内容进行了包装__filename、__dirname这两个变量。
```

#   npm install 做了哪些事？
```
1.  如果 scripts 有 preinstall 需执行
2.  读取 npm 配置文件
    npm install --registry=origin
    项目根目录的 .npmrc
    用户主目录的 .npmrc
3.  确定首层依赖模块，即 dependencies 和 devDependencies 中的包
4.  递归获取模块，检查缓存，没有缓存就下载包到~/.npm（涉及到验证包的完整性 integrity、依赖扁平化处理）
5.  解压包文件到 node_modules
6.  如果 scripts 有 postinstall 需执行
```
#   Web Components
```
Web Components 是通过3种技术允许您创建可重用的定制元素，达到复用的效果。
Custom elements、Shadow DOM、HTML templates 等技术实现自定义元素。
// Custom elements
// 又分为Autonomous custom elements（自主的自定义元素都继承自HTMLElement）、Customized built-in elements（继承自内置元素的自定义元素）
Custom elements（自定义元素）：一组JavaScript API，允许您定义custom elements及其行为，然后可以在您的用户界面中按照需要使用它们。
// Shadow DOM
Shadow DOM（影子DOM）：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
HTML templates
HTML templates（HTML模板）： <template> 和 <slot> 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。
```
[Web Components](./webComponents.md)

#   IaaS、PaaS、SaaS
```
// 基础设施即服务 (IaaS ： Infrastructure as a Service)
把计算基础(服务器、网络技术、存储和数据中心空间)作为一项服务提供给客户。它也包括提供操作系统和虚拟化技术、来管理资源。消费者通过Internet可以从完善的计算机基础设施获得服务。
// 平台即服务(PaaS：Platform as a Service）
PaaS实际上是指将软件研发的平台作为一种服务，供应商提供超过基础设施的服务，一个作为软件开发和运行环境的整套解决方案，即以SaaS的模式提交给用户。因此，PaaS也是SaaS模式的一种应用。但是，PaaS的出现可以加快SaaS的发展，尤其是加快SaaS应用的开发速度。
// 软件即服务 (SaaS：Software as a Service)
是一种交付模式，其中应用作为一项服务托管，通过Internet提供给用户;帮助客户更好地管理它们的IT项目和服务、确保它们IT应用的质量和性能，监控它们的在线业务。
```
#   npm
```
// npm 命令简写
npm run-script test
npm run test
npm test
npm t
// 执行多个脚本
npm run lint && npm test // 依次执行
npm run lint＆npm test // 并行运行，windows 中会依次执行
// pre & post
如 hello 命令，执行顺序为 prehello hello posthello
// 控制输出日志登记
npm run <script> --silent // npm run <script> -s // 静默消息(如果想减少错误日志并非防止脚本抛出错误)
npm run <script> --if-present // 如果脚本名不存在时不想报错，可以使用 --if-present 
// 指定输出日志等级("silent", "error", "warn", "notice", "http", "timing", "info", "verbose", "silly".)
npm run <script> --loglevel <info>
// 传递参数和访问环境变量
npm run <script>---<argument>="value"
$npm_config_argument 和 $npm_package_argument 可读取

****npm 包本地调试技巧****
// 本地 npm 模块调试，如调试 npm-test 模块
// npm link 方式
cd 对应npm包地址
npm link // 项目对应的包链接到全局 node_modules
cd 项目地址
npm link npm-test
// yalc 方式
npm i yalc -g
cd 对应npm包地址
yalc publish // 在对应的 npm 包中发布
yalc link // 在对应的项目中 link 对应的包
// nodemon 自动监听更新文件
cd 项目地址
yalc link npm-test
npm run start
// 在 package.json 的 scripts 中，添加下列脚本，就可以更高npm包代码，自动发布
"async": "npm run build && yalc push",
"watch": "nodemon --ignore dist/ --ignore node_modules/ --watch src/ -C -e ts,tsx,scss --debug -x 'npm run async'", // 自动监听
// nodemon
nodemon 
    --ignore dist/ # 忽略目录
    --ignore node_modules/ 
    --watch src # 观察目录
    -C # 只在变更后执行，首次启动不执行命令
    -e ts,html,less,scss # 监控指定后缀名的文件
    --debug # 调试
    -x "npm run build && cd dist/hello && yalc push" # 自定义命令
```
#   图片懒加载
```
const io = new IntersectionObserver(ioes => {
    ioes.forEach(ioe => {
        let el = ioe.target;
        if(el && ioe.intersectionRatio > 0) {
            let realSrc = el.dataset.src // data-src
            el.src = realSrc;    
        }
        // unobserve()方法命令IntersectionObserver停止对一个元素的观察。
        el.onload = el.onerror = () => io.unobserve(el)
    }, {
        // TODO
    });
});
function init() {
    let imgs = document.querySelectorAll('.lazy-img');
    [...imgs].forEach((el) => {
        io.observe(el);
    });
}
init()
```
### 图片预加载
```
// 以 next.js 为例（轮播中预加载其他banner）
// fix，本应该使用 prefetch 更合理，但经过实验 prefetch 加载 img chrome 中未生效（forefox神效），所以使用 preload
import Head from 'next/head'
<Head>
  {lists.map(item => <link rel="preload" as="image" href={item.url} >)}
</Head>
```
#  正向代理与反向代理
```
// 正向代理
隐藏了真实的请求客户端，服务端不知道真实的客户端是谁，客户端请求的服务都由代理服务器代替来请求
如：虚拟专用网络(VPN)、翻墙等
// 反向代理
反向代理恰好跟正向代理相反，反向代理隐藏了真实的服务端。
如：负载均衡
总结：正向代理代理的对象是客户端，反向代理代理的对象是服务端。
``` 


