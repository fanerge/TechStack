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
- [x] 逃逸分析(Escape Analysis）
- [x] V8如何优化对象（Hideen Class && Inline Cache） 
- [x] V8如何优化数组（动态使用不同存储模式：Fast Elements、Fast Holey Elements、Dictionary Elements ） 
- [x] V8如何优化数字（SMI、HeapNumber、MutableHeapNumber）
- [x] V8如何优化字符串（v8中字符串5种表达模式）
- [x] JIT和AOT
- [x] 垃圾回收（新生代和老生代内存回收方式）

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
线性结构：线性表，栈，队列，双队列，串。<br>
非线性结构：二维数组，多维数组，广义表，树(二叉树等)，堆。<br>
存储唯一值的数据结构：集合、字典、散列表<br>
##  🌲相关的结构
### 完美二叉树/满二叉树（Full Binary Tree）
一个二叉树，如果每一个层的结点数都达到最大值，则这个二叉树就是满二叉树。也就是说，如果一个二叉树的层数为K，且结点总数是(2^k) -1 ，则它就是满二叉树。
### 完全二叉树（Complete Binary Tree）
对于深度为K的，有n个结点的二叉树，当且仅当其每一个结点都与深度为K的满二叉树中编号从1至n的结点一一对应时称之为完全二叉树。
### 二叉搜索树
二叉排序树（Binary Sort Tree），又称二叉查找树（Binary Search Tree），亦称二叉搜索树。<br>
二叉排序树或者是一棵空树，或者是具有下列性质的二叉树：
（1）若左子树不空，则左子树上所有节点的值均小于它的根节点的值；
（2）若右子树不空，则右子树上所有节点的值均大于它的根节点的值；
（3）左、右子树也分别为二叉排序树；
（4）没有键值相等的节点。
### 平衡树（Balanced Binary Tree）
它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。
### 哈夫曼树（Huffman Tree）
给定N个权值作为N个叶子结点，构造一棵二叉树，若该树的带权路径长度达到最小，称这样的二叉树为最优二叉树，也称为哈夫曼树(Huffman Tree)。哈夫曼树是带权路径长度 WPL 最短的树，权值较大的结点离根较近。
### 哈夫曼编码(Huffman Coding)
哈夫曼编码(Huffman Coding)，又称霍夫曼编码，是一种编码方式，可变字长编码(VLC)的一种。Huffman于1952年提出一种编码方法，该方法完全依据字符出现概率来构造异字头的平均长度最短的码字，有时称之为最佳编码，一般就叫做Huffman编码（有时也称为霍夫曼编码）。
### 堆（Heap）
堆通常是一个可以被看做一棵完全二叉树的数组对象。<br>
将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆。
##  图
### 最小生成树
Prim算法适用于稠密图 Kruskal适用于稀疏图。
[详细](./README/dataStructure.md)







