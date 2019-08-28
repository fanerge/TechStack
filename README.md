# 数据结构
在JavaScript中讨论数据结构。<br>
顺序数据结构：数组（列表）、栈、队列和链表。<br>
非顺序数据结构：散列表、字典、树、图。<br>
存储唯一值的数据结构：集合、字典、散列表<br>
[详细](./README/dataStructure.md)
#   工具函数
- [x] checkType 类型检查包含String、Boolean、Number、Undefined、Null、Symbol、BigInt、Map、HTMLBodyElement、HTML*Element等
- [x] deepClone 深拷贝（包含重复引用）
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
# JavaScript引擎探索（主要V8）
- [x] 执行上下文EC、执行上下文堆栈ECS
- [x] 全局对象GO、变量对象VO、活动对象AO等
- [x] 函数的[[scope]]属性 
- [x] 作用域链 Scope chain
- [x] V8工作原理
- [x] V8如何优化对象存取（Hideen Class && Inline Cache） 
- [x] V8如何优化数组（动态使用不同存储模式：Fast Elements、Fast Holey Elements、Dictionary Elements ） 

[V8.md](./README/v8.md)
#   JSBridge封装
[JSBridge](./README/JSBridge.md)










