# 描述JS中基本概念
##  Execution context(EC)
执行上下文(简称-EC)是ECMA-262标准里的一个抽象概念<br>
代码运行前会创建一个唯一的全居执行上下文，执行函数时会创建一个函数执行上下文<br>
执行上下文分为三种：(全局执行上下文，函数执行上下文，eval()执行上下文)<br>
执行上下文的代码被分成两个基本的阶段来处理：进入执行上下文和执行代码（下面的理论基础）<br>
eval会使用全局变量对象或调用者的变量对象(eval的调用来源)。<br>
### Execution context的组成
EC由3部分组成：VO、this指针、Scope
变量对象（VO）：arguments、variables、functions 声明（function 表达式不参与VO）<br>
[[Scope]]属性：指向作用域链。<br>
this指针：指向一个环境对象，this的值只取决于进入上下文时的情况。<br>
```
// 如一个函数的执行上下文模拟表示
activeExecutionContext = {
    VO: {...}, // or AO
    this: thisValue,
    Scope: [ // Scope chain
      // 所有变量对象的列表
      // for identifiers lookup
    ]
};
```
### Execution context stack(ECS)
执行环境栈(执行上下文栈)<br>
堆栈底部永远都是全局上下文(global context)，而顶部就是当前(活动的)执行上下文，堆栈在EC类型进入和退出上下文的时候被修改（推入或弹出），当进入funtion函数代码(所有类型的funtions)的时候，ECStack被压入新元素，直到该函数return则当前EC被弹出。
一个抛出的异常如果没被截获的话也有可能从一个或多个执行上下文退出。<br>
```
// 模拟ECS（用栈来表示最好不过了）
// 最原始的
ECStack = [];
// 加载代码
ECStack = [globalContext];
// 进入函数 foo（嵌套函数、递归同样的方式压入栈和弹出栈）
ECStack = [<foo> functionContext, globalContext];
// 推出函数 foo
ECStack = [globalContext];
```
[深入理解JavaScript系列（11）：执行上下文（Execution Contexts）](https://www.cnblogs.com/TomXu/archive/2012/01/13/2308101.html)
##  VO对象（Variable Object）
VO分为全局上下文VO（全局对象，Global object)和函数上下文的AO。<br>
变量对象在每次进入上下文时创建，并填入初始值，值的更新出现在代码执行阶段。<br>
变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，只有到当进入一个执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object。<br>
VO和AO可以看作它们是同一个对象，只是处于执行环境的不同生命周期。<br>
函数表达式FE不影响VO。<br>
```
// 函数声明FD
function a() {}
// 函数表达式FE
var a = function() {}
```
[深入理解JavaScript系列（12）：变量对象（Variable Object）](https://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html)
## AO对象加载顺序（函数预编译 Activation Object）
活动对象是在进入函数上下文时刻被创建的，它通过函数的arguments属性初始化。<br>
1.  函数声明时创建一个AO对象，默认放入arguments对象和this对象（此时均为 undefined）
2.  将函数声明的形参和变量声明放入AO对象，其值为 undefined（参数相当于局部变量）
3.  将形参和实参进行统一
4.  将所有的函数声明放入AO对象，其值为函数体
5.  开始逐步执行函数，之前的arguments赋值为Arguments对象（后面说明）

PS：1-4步为进入执行上下文，第5步开始执行代码 
```
function parent(a, b){
	console.log(a);
	var c = 123;
	console.log(c);
	function a(){};
	console.log(b);
	var b = function c(){};
	console.log(b)
}
test(1, 3);
// 写出对应的输出值
// 根据AO对象加载顺序，分析AO对象变化
// 1
AO {arguments: undefined}
// 2
AO {arguments: undefined, a: undefined, b: undefined, c: undefined}
// 3
AO {arguments: undefined, a: 1, b: 3, c: undefined}
// 4
AO {arguments: undefined, a: function a, b: 3, c: function c, }
// 执行函数过程AO变化
// var c = 123;
AO {arguments: Arguments对象, a: function a, b: 3, c: 123, }
// var b = function c(){}
AO {arguments: Arguments对象, a: function a, b: function c, c: 123, }
// 输出结果
function a
123
3
function c
```
##  Arguments对象是活动对象的一个属性，它包括如下属性：
callee — 指向当前函数的引用
length — 真正传递的参数个数
properties-indexes (字符串类型的整数) 属性的值就是函数的参数值(按参数列表从左到右排列)。 properties-indexes内部元素的个数等于arguments.length。
properties-indexes 的值和实际传递进来的参数之间是共享的。
## GO对象加载顺序（预编译）
1.  创建一个GO对象
2.  变量声明放入GO对象，其值为 undefined
3.  将所有的函数声明放入AO对象，其值为函数体
4.  开始逐行执行（为变量赋值）

```
function a() {
  function b() {
    var bb = 234;
  }
  var aa = 123;
  b();
}
console.log(glob); // function glob
var glob = 100;
console.log(glob); // 100
function glob() {}
console.log(glob); // 100
a()

// 分析GO对象变化
// 1
GO {}
// 2
GO {glob:undefined}
// 3
GO {glob: function glob}
// 执行到第一个console.log(glob);
GO {glob: function glob}
// 执行到第二三个console.log(glob);
GO {glob: 100}
```
##  函数的[[Scope]]属性
[[scope]]在函数创建时被存储－－静态（不变的），永远永远，直至函数销毁。即：函数可以永不调用，但[[scope]]属性已经写入，并存储在函数对象中。<br>
EC.scope 和 函数的[[scope]]区别，EC.scope = VO|AO + 函数的[[scope]];<br>
函数的[[scope]] === 声明时所有能访问到的VO对象（父EC的VO到GO）；前面两者就形成了 Scope Chain。

##  Scope Chain
作用域链是内部上下文所有变量对象（包括父变量对象）的列表。<br>
注意：with和catch可以改变作用域链，将 with(obj)中的obj 或catch(error)中的error 放在作用域链最前面。<br>
```
var x = 10;
function foo() {
  var y = 20;
  function bar() {
    var z = 30;
    alert(x +  y + z);
  }
  bar();
}
foo(); // 60

// 全局上下文的变量对象
globalContext.VO === GO {
  x: 10,
  foo: <reference to function foo>
};
// 在foo创建时
foo.[[scope]] = [globalContext.VO];
// 当foo激活时（进入上下文）
fooContext.AO = {
  y: 20,
  bar: <reference to function bar>
};
// foo上下文的作用域链
fooContext.Scope = fooContext.AO + foo.[[Scope]];
fooContext.Scope = [fooContext.AO, globalContext.VO];

// bar创建时
bar.[[scope]]= [fooContext.AO, globalContext.VO];
// bar激活时（进入上下文）
barContext.AO = {
  z: 30
};
// bar上下文的作用域链
barContext.[[scope]] = barContext.AO + bar.[[scope]];
barContext.[[scope]] = [barContext.AO, fooContext.AO, globalContext.VO];
```

[javascript 执行环境，变量对象，作用域链](https://segmentfault.com/a/1190000000533094)
[JS 执行环境、作用域链、活动对象](https://segmentfault.com/a/1190000015782315)