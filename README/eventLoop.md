# 浏览器环境
1.  同步代执行
2.  遇到微任务和宏任务则分别放在queue中
3.  执行完同步代码开始看微任务queue中是否有任务执行，否则看宏任务queue是否有任务执行
4.  在执行中遇到新的微任务或宏任务，则继续放入对应的queue中（微任务中放微任务1，微任务1会比先进的红任务先执行）如此形成了时间循环。
   
Macrotask：setTimeout、setInterval、setImmediate
Microtask：Promise.then、MutaionObserver（监听DOM变动的构造函数）、process.nextTick

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




