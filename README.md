#   工具函数
- [x] checkType 类型检查包含String、Boolean、Number、Undefined、Null、Symbol、BigInt、Map、HTMLBodyElement、HTML*Element等
- [x] deepClone 深拷贝（包含循环引用、递归注意栈溢出）
- [x] curry 柯里化函数
- [x] throttle(前置触发、后置触发)、debounce
- [x] 千分位 regExp、Number.prototype.toLocaleString、Intl.NumberFormat().format(number)、reduce版本

[工具函数集合](./src/modules/utils.ts)

#   JS原生api模拟
- [x] myCall、myApply、myBind 自定义call、apply、bind函数
- [x] instance_of(L, A) 模拟 L instanceof A
- [x] objectFactory 模拟 new 运算
- [x] objectCreate 模拟 Object.create(proto, PropertyDescriptorMap)

[theory.ts](./src/modules/theory.ts)

# JavaScript 核心概念
- [x] 执行上下文EC、执行上下文堆栈ECS
- [x] 全局对象GO、变量对象VO、活动对象AO等
- [x] 函数的[[scope]]属性 
- [x] 作用域链 Scope chain

[jsCore.md](./src/README/jsCore.md)

# JavaScript引擎探索（主要V8）
- [x] V8工作原理
- [x] V8如何优化对象存取（Hideen Class && Inline Cache） 
- [x] V8如何优化数组（动态使用不同存储模式：Fast Elements、Fast Holey Elements、Dictionary Elements ） 

[V8.md](./README/v8.md)

# JSBridge封装
[JSBridge](./README/JSBridge.md)

# 工程化（Webapck）
- [x] 热更新原理

[webpack](./README/webpack.md)

# Node.js
- [x] 高并发解决方案（负载均衡）

# WEB安全
- [x] XSS（Cascading Style Sheets）攻击全称跨站脚本攻击
- [x] CSRF（Cross-site request forgery）跨站请求伪造
- [x] 点击穿透
- [x] click jacking点击劫持
- [x] 控制台注入代码
- [x] 目录遍历漏洞（Directory traversal），也称之为路径遍历漏洞（Path traversal）[Web 安全漏洞之目录遍历](https://mp.weixin.qq.com/s/crceZP9TKOIwkjmlCEeIAw)
- [x] SQL注入
- [x] DDoS（Distributed Denial of Service）分布式拒绝服务攻击
- [x] [HTTP Security Headers](./README/HTTPSecurityHeaders.md)
- [x] [JWT/深度理解token](https://segmentfault.com/a/1190000020143933)

# 数据结构
在JavaScript中讨论数据结构。<br>
顺序数据结构：数组（列表）、栈、队列和链表。<br>
非顺序数据结构：散列表、字典、树、图。<br>
存储唯一值的数据结构：集合、字典、散列表<br>
[详细](./README/dataStructure.md)







