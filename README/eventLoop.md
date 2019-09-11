# 浏览器环境
栈中放主代码，事件队列中放任务（宏任务和为任务）
##  概述
JS 分为同步任务和异步任务<br>
同步任务都在JS引擎线程上执行，形成一个执行栈<br>
事件触发线程管理一个任务队列，异步任务触发条件达成（比如setTimeout达到设定的时间），将回调事件放到任务队列中<br>
执行栈中所有同步任务执行完毕，此时JS引擎线程空闲，系统会读取任务队列，将可运行的异步任务回调事件添加到执行栈中，开始执行<br>
##  具体流程（以下必须在16.7ms完成，否则就会丢帧、卡顿）
1.  执行一个宏任务（栈中没有就从事件队列中获取）
2.  执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3.  宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
4.  当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
5.  渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

   
Macrotask：主代码块（同步代码）、setTimeout、setInterval、setImmediate
Microtask：Promise.then、MutaionObserver（监听DOM变动的构造函数）、process.nextTick、Object.observe（已废弃）
[Event Loop](https://juejin.im/post/5d5b4c2df265da03dd3d73e5#heading-10)
# Node.js
在一个 I/O 循环内：setImmediate 总是优先于 setTimeout(callback ,0)<br>
主模块：setImmediate 和 setTimeout(callback ,0) 顺序就不一定了。
##  事件循环的6个阶段
```
// 每个事件循环都有6个阶段，每个阶段都会维持一个先进先出的可执行回调函数队列。
// 然后执行这个阶段队列中的回调函数直到队列为空，或者回调函数调用次数达到上限，事件循环会进入下一个阶段。
// 在事件循环的每次运行之间，Node.js检查它是否在等待任何异步I/O或定时器，如果没有，则彻底关闭。
1.  timers 此阶段执行由setTimeout()和setInterval()调度的回调。
2.  pending callbacks 执行延迟到下一个循环迭代的I/O回调。
3.  idle，prepare（libuv内部使用）
4.  poll 检索新的I/O事件；执行与I/O相关的回调（几乎所有，除了close callbacks、由定时器调度的一些和setImmediate()）；node将在适当的时候在这里阻塞。
5.  check 由setImmediate()设置的回调函数。
6.  close callbacks 一些关闭回调，例如socket.on('close', ...)。
```
[Node.js 指南（Node.js事件循环、定时器和process.nextTick()）](https://segmentfault.com/a/1190000017017364)
##  process.nextTick() vs setImmediate()
process.nextTick()在同一个阶段执行<br>
setImmediate()在事件循环的下一个阶段或者'tick'中执行<br>
process.nextTick 总是在剩余代码执行之后事件循环继续之前执行回调函数<br>

同一次事件循环执行顺序<br>
promise.then > process.nextTick<br>
process.nextTick 总是在剩余代码执行之后事件循环继续之前执行回调函数<br>
##  异步任务分两种
本轮循环：promise.nextTick、promise的回调函数<br>
次轮循环：setTimeout、setInteval、setImmediate的回调函数<br>

[Node.js中的事件循环](https://www.jianshu.com/p/8cab6821bab7)




