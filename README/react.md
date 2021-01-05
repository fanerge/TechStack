# 部分生命周期的理解

## componentWillReceiveProps

触发时机：componentWillReceiveProps 并不是由 props 的变化触发的，而是由父组件的更新触发的。

## getDerivedStateFromProps

为静态方法 static，不能访问到 this。
触发时机：初始化/更新时调用（new props、setState、forceUpdate）

```
// 参数： props 和 state，它们分别代表当前组件接收到的来自父组件的 props 和当前组件自身的 state。
// 返回值：必须为 Object 或 null。它会和现有的 state 进行合并
static getDerivedStateFromProps(props, state) {
    return {
      fatherText: props.text
    }
  }
```

## getSnapshotBeforeUpdate

触发时机：组件更新时调用（mountd）
getSnapshotBeforeUpdate 要想发挥作用，离不开 componentDidUpdate 的配合。
getSnapshotBeforeUpdate 的返回值会作为第三个参数给到 componentDidUpdate。

```
// 组件更新时调用
getSnapshotBeforeUpdate(prevProps, prevState) {
  // valueFromSnapshot
  return "haha";
}
// 组件更新后调用
componentDidUpdate(prevProps, prevState, valueFromSnapshot) {
  console.log("从 getSnapshotBeforeUpdate 获取到的值是", valueFromSnapshot);
  // 根据 valueFromSnapshot 做一些处理。
}
```

# 老的 context 问题

如果组件提供的一个 Context 发生了变化，而中间父组件的 shouldComponentUpdate 返回 false，那么使用到该值的后代组件不会进行更新。使用了 Context 的组件则完全失控，所以基本上没有办法能够可靠的更新 Context。

# 函数组件 和 类组件最大的区别

函数组件会捕获 render 内部的状态，这是两类组件最大的不同。
[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

# virtual DOM 的优势

提升研发体验/研发效率
解决跨平台的问题，虚拟 DOM 是对真实渲染内容的一层抽象，它描述的东西可以是真实 DOM，也可以是 iOS 界面、安卓界面、小程序。
更好做 diff 和 patch

# React 如何防止 XSS 攻击

1.  自动转义，React 在渲染 HTML 内容和渲染 DOM 属性，将特殊字符转义，转换为实体字符。
2.  JSX 语法，ReactElement 有一个 $$typeof: Symbol('react.element')，否则为非法的 ReactElement，JSON 序列化时会丢失值为 Symbol 的属性。

# React15 栈调和（Stack Reconciler）

## 调和/Reconciliation？

调和器的工作，包括组件的挂载、卸载、更新等过程，其中更新过程涉及对 Diff 算法的调用。
通过如 ReactDOM 等类库使虚拟 DOM 与“真实的” DOM 同步，这一过程叫作协调（调和）。

## Diff 算法

Diff 算法属于调和阶段性的一个过程。

### 如何将复杂度降低为 O(n)

前提：

1.  若两个组件属于同一个类型，那么它们将拥有相同的 DOM 树形结构；
2.  处于同一层级的一组子节点，可用通过设置 key 作为唯一标识，从而维持各个节点在不同渲染过程中的稳定性。
3.  DOM 节点之间的跨层级操作并不多，同层级操作是主流（也就是说跨层级操作直接不 diff）。

具体算法：

1.  Diff 算法性能突破的关键点在于“分层对比”（决定时间复杂度的核心，当然还是递归）；
2.  类型一致的节点才有继续 Diff 的必要性（同类型的组件）；
3.  key 属性的设置，可以帮我们尽可能重用同一层级内的节点（所以必须保证唯一性）。

# React16 Fiber 调和

# setState 什么时候是同步的，什么时候是异步（批量处理）的？

## 为什么要异步（批量更新）？

一般情况，触发 setState 导致如下流程，性能开销太大，所以才有批量更新的操作。
setState -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate

## 结论

异步（批量）：生命周期钩子函数和合成事件方法（比如通过 onClick 等）。<br>
同步：原生绑定事件方式 addEventListener 和 setTimeout/setInterval 中调用 setState）。

## setState 工作流程（原理）

setState -> enqueueSetState -> enqueueUpdate -> isBatchingUpdates
如果 isBatchingUpdates 为 true 时，该组件进入 dirtyComponents 队列，否则就循环更新 dirtyComponents 里面的组件。<br>
React 的生命周期函数以及合成事件执行前，已经被 React 将 isBatchingUpdates 修改为了 true，这时我们所做的 setState 操作自然不会立即生效。当函数执行完毕后，再把 isBatchingUpdates 重置为 false。<br>

### 流程解释

```
// enqueueSetState 做了两件事：
将新的 state 放进组件的状态队列里；
用 enqueueUpdate 来处理将要更新的实例对象。
// enqueueUpdate
引入了一个关键的对象——batchingStrategy（全局对象，相当于全局锁，又一个 isBatchingUpdates 属性）
isBatchingUpdates 属性决定直接走更新流程，还是应该排队等待。
```

### 合成事件中 setState 原理

```
increment = () => {
  // 进来先锁上
  isBatchingUpdates = true
  console.log('increment setState前的count', this.state.count)
  this.setState({
    count: this.state.count + 1
  });
  console.log('increment setState后的count', this.state.count)
  // 执行完函数再放开
  isBatchingUpdates = false
}
```

### setTimeout setState 原理

```
reduce = () => {
  // 进来先锁上
  isBatchingUpdates = true
  setTimeout(() => {
    console.log('reduce setState前的count', this.state.count)
    // PS：由于setTimeout是异步的，当其回掉函数真正执行时，isBatchingUpdates 已经重置为 false了，所以不会触发批量更新
    this.setState({
      count: this.state.count - 1
    });
    console.log('reduce setState后的count', this.state.count)
  },0);
  // 执行完函数再放开
  isBatchingUpdates = false
}
```

[setState](https://juejin.im/post/5c92f499f265da612647b754#3)
[setState 的执行机制](https://mp.weixin.qq.com/s?__biz=Mzg2NDAzMjE5NQ==&mid=2247483989&idx=1&sn=d78f889c6e1d7d57058c9c232b1a620e&chksm=ce6ec6f9f9194fef681c79ee869bf58d5413132c73496710b2eb32c859a2249a895c2ce8a7cd&scene=21#wechat_redirect)
[深入 setState 机制](https://github.com/sisterAn/blog/issues/26)

# ReactDOM.render

分为初始化、render 和 commit 等过程。

## 三种模式

```
legacy 模式：
ReactDOM.render(<App />, rootNode)
blocking 模式：
ReactDOM.createBlockingRoot(rootNode).render(<App />)
concurrent 模式：
ReactDOM.createRoot(rootNode).render(<App />)
```

## 初始化

## render

performSyncWorkOnRoot 标志着 render 阶段的开始。（lane === SyncLane）
finishSyncRender 标志着 render 阶段的结束。

## commit

commitRoot 方法开启的则是真实 DOM 的渲染过程（commit 阶段）

# 为什么 current 树 与 workInProgress 两棵树？

两棵树：current 节点（即 rootFiber）、workInProgress 节点（current 的副本），主要现实“双缓冲”模式。
当 current 树呈现在用户眼前时，所有的更新都会由 workInProgress 树来承接。workInProgress 树将会在用户看不到的地方（内存里）悄悄地完成所有改变，直到 current 指针指向它的时候，此时就意味着 commit 阶段已经执行完毕，workInProgress 树变成了那棵呈现在界面上的 current 树。
同步渲染：performSyncWorkOnRoot 标志着 render 阶段的开始。（SyncLane）
异步渲染：performConcurrentWorkOnRoot 标志着 render 阶段的开始。（lane）

## 优先级调度？

Scheduler 导出的一个核心方法，它将结合任务的优先级信息为其执行不同的调度逻辑。
timerQueue(未过期任务)：一个以 startTime 为排序依据的小顶堆，它存储的是 startTime 大于当前时间（也就是待执行）的任务。
taskQueue(过期任务)：一个以 expirationTime 为排序依据的小顶堆，它存储的是 startTime 小于当前时间（也就是已过期）的任务。
expirationTime 这是一个和优先级相关的值，expirationTime 越小，任务的优先级就越高。

```
// 任务优先级
IMMEDIATE_PRIORITY_TIMEOUT
USER_BLOCKING_PRIORITY_TIMEOUT
IDLE_PRIORITY_TIMEOUT
LOW_PRIORITY_TIMEOUT
NORMAL_PRIORITY_TIMEOUT
```

流程：
[流程](../img/react-concurrent.png)

# Redux

## Flux 架构

View（视图层）：用户界面。该用户界面可以是以任何形式实现出来的，React 组件是一种形式，Vue、Angular 也完全 OK。Flux 架构与 React 之间并不存在耦合关系。
Action（动作）：也可以理解为视图层发出的“消息”，它会触发应用状态的改变。
Dispatcher（派发器）：它负责对 action 进行分发。
Store（数据层）：它是存储应用状态的“仓库”，此外还会定义修改状态的逻辑。store 的变化最终会映射到 view 层上去。

## 核心概念

严格的单向数据流（状态的变化是可预测的）
Store：它是一个单一的数据源，而且是只读的。
Action 人如其名，是“动作”的意思，它是对变化的描述。
Reducer 是一个函数，它负责对变化进行分发和处理，最终将新的数据返回给 Store。

## api

```
applyMiddleware 是中间件模块
bindActionCreators（用于将传入的 actionCreator 与 dispatch 方法相结合，揉成一个新的方法）
combineReducers（用于将多个  reducer 合并起来）
compose（用于把接收到的函数从右向左进行组合）这三个方法均为工具性质的方法
createStore 整个流程的入口
常使用方法：
getState
subscribe
dispatch
```

# React Other

## Portal

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```
ReactDOM.createPortal(child, container)
```

## 代码分割

React.lazy 函数能让你像渲染常规组件一样处理动态引入（的组件）。
Suspense 组件在 React.lazy 还没有被加载完成，我们可以使用加载指示器为此组件做优雅降级。

## 异常捕获边界

使用 static getDerivedStateFromError() 渲染备用 UI ，使用 componentDidCatch() 打印错误信息。

## Fragment

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

# React 事件机制

包括事件注册（给 document 添加事件并将处理函数放入一个叫 listenerBank 的对象中）、事件的合成（SyntheticEvent）、事件冒泡（document）、事件派发等（dispatchEvent）。
SyntheticEvent 采用了事件池，大大节省内存，而不会频繁的创建和销毁事件对象。

## 事件处理

大部分事件通过冒泡到 document，然后通过 dispatchEvent 去派发事件（通过 dom 唯一标识 id），小部分事件如 Input 的 oninvalid 绑定到 Input 元素上（猜测，document 有的事件会冒泡，没有对应的事件则绑定到本身）。

## 原生事件会阻止合成事件吗？

原生事件是在目标阶段触发，合成事件是在冒泡阶段触发。

## 合成事件中如何获取原生事件对象？

e.nativeEvent

## 原生事件和合成事件？

原生事件（目标阶段）阻止冒泡后会破坏合成事件（冒泡阶段）。

## React 的 onchange 事件和原生 onchange 事件的区别？

原生的 onchange 事件需要在失去焦点的时候才能触发这个事件。

## 事件都冒泡到了 document，触发事件时如何匹配对应节点。

事件触发的时候去根据当前的 事件类型 和 组件 id 查找到对应的事件 fn。<br>
listenerBank 对象的结构大致如下：

```
{
    // key为事件类型
    onClick: {
        // key 组件id（根据两个key就能找到是触发什么组件的什么事件的处理函数）
        .1 : fn1,
        .2 : fn2
    }
}
```

// 每个 ReactDomComponent 的结构

```
{
   ...
   // 组件id
   __rootNodeID: 3
}
```

[一文吃透 react 事件机制原理](https://juejin.im/post/5d7678b06fb9a06b2b47a03c)

# React 中循环 keys

Keys 可以在 DOM 中的某些元素被增加或删除的时候帮助 React 识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。

```
react根据key来决定是销毁重新创建组件还是更新组件，原则是：
key相同，组件有所变化，react会只更新组件对应变化的属性。
key不同，组件会销毁之前的组件，将整个组件重新渲染。
```

何时使用 index 作为 key 比较好？<br>
分页渲染一个列表使用 index ，每次点击翻页会重新渲染而不是销毁重新创建。

# React 如何防止 XSS

document.createTextNode 或 textContent。<br>
React 的 elements 有一个 $$typeof 属性，它是一个 Symbol类型的变量，这个变量可以防止 XSS。（不支持 Symbol 则用字符串'0xeac7'）<br>
如果你的服务器有一个漏洞，允许用户存储任意JSON对象，因为你不能只把Symbol放在JSON中。因此，即使服务器具有安全漏洞并返回JSON而不是文本，该JSON也不能包含Symbol.for('react.element')。React将检查element.$$typeof，如果元素丢失或无效，将拒绝处理该元素。<br>

```
ReactElement.isValidElement = function (object) {
    return typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE;
};
```

React 渲染时会把没有 \$\$typeof 标识，以及规则校验不通过的组件过滤掉。

# 虚拟 Dom 的优势？

VitrualDom 的优势在于 React 的 Diff 算法和批处理策略

# Fiber 架构

## React 工作原理

Fiber 核心是实现了一个基于优先级和 requestIdleCallback 的循环任务调度算法。<br>
React 实现可以粗划为两部分：reconciliation（diff 阶段）和 commit(操作 DOM 阶段)。<br>
reconciliation：包含的主要工作是对 current tree 和 new tree 做 diff 计算，找出变化部分。进行遍历、对比等是可以中断，歇一会儿接着再来。<br>
首先获取到下一个任务的执行优先级，调用一个 performUnitOfWork 函数进入 reconcilation 阶段的工作, 分为 beginWork 和 completeWork<br>
beginWork:beginWork 中只是处理节点的不同 tag 属性对应不同的更新方法。如 updateClassComponent 方法对应的是 tag 类型是 React 组件实例。<br>
completeWork:主要是通过新老节点的 prop 或 tag 等，收集节点的 effect-list。然后向上一层一层循环，merge 每个节点的 effect-list，当到达根节点#hostRoot 时，节点上包含所有的 effect-list。并把 effect-list 传给 pendingcommit，进入 commit 阶段。<br>
commit：是对上一阶段获取到的变化部分应用到真实的 DOM 树中，是一系列的 DOM 操作。<br>
[React16 框架 - Fiber](https://www.cnblogs.com/zhuanzhuanfe/p/9567081.html)

## 16 之前的问题

如果这是一个很大，层级很深的组件，react 渲染它需要几十甚至几百毫秒，在这期间，react 会一直占用浏览器主线程，任何其他的操作（包括用户的点击，鼠标移动等操作）都无法执行。

## 新架构

React 现在将整体的数据结构从树改为了链表结构。
react 的组件渲染机制，新的架构使原来同步渲染的组件现在可以异步化，可中途中断渲染，执行更高优先级的任务。释放浏览器主线程。

## 加入 fiber 的 react 将组件更新分为两个时期

两个时期以 render 为分界。

1.  第一阶段可打断，React 在 workingProgressTree 上复用 current 上的 Fiber 数据结构来一步地（通过 requestIdleCallback）来构建新的 tree，标记处需要更新的节点，放入队列中。
2.  第二阶段不可打断，React 将其所有的变更一次性更新到 DOM 上。

## Fiber 节点的数据结构

```
{
    tag: TypeOfWork, // fiber的类型，函数式组件、class组件、Portal、HostRoot（ReactDOM.render时的根节点）等
    alternate: Fiber|null, // 在fiber更新时克隆出的镜像fiber，对fiber的修改会标记在这个fiber上
    return: Fiber|null, // 指向fiber树中的父节点
    child: Fiber|null, // 指向第一个子节点
    sibling: Fiber|null, // 指向兄弟节点
    effectTag: TypeOfSideEffect, // side effect类型，下文会介绍
    nextEffect: Fiber | null, // 单链表结构，方便遍历fiber树上有副作用的节点
    pendingWorkPriority: PriorityLevel, // 标记子树上待更新任务的优先级
}
```

## Fiber 任务优先级

```
{
    NoWork: 0, // No work is pending.
    SynchronousPriority: 1, // 文本输入框
    TaskPriority: 2, // 当前调度正执行的任务
    AnimationPriority: 3, // 动画过渡
    HighPriority: 4, // 用户交互反馈
    LowPriority: 5, // 数据的更新
    OffscreenPriority: 6, // 预估未来需要显示的任务
}
```

# React diff （协调）

1.  比对不同类型的元素（当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树。a -> img）
2.  比对同一类型的元素（当比对两个相同类型的 React 元素时，React 会保留 DOM 节点，仅比对及更新有改变的属性。）
3.  比对同类型的组件元素（当一个组件更新时，组件实例保持不变，这样 state 在跨越不同的渲染时保持一致。）
4.  对子节点进行递归（在默认条件下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。）

# React Hooks

## hooks 为什么顺序很重要？执行时机？

useState 一定要写在函数初始的位置不能在循环或判断语句等里面调用，这样是为了让我们的 Hooks 在每次渲染的时候都会按照 相同的顺序 调用，因为这里有一个关键的问题，那就是 useState 需要依赖参照第一次渲染的调用顺序来匹配对于的 state，否则 useState 会无法正确返回它对于的 state。

# React 17 新特性

## 重构 JSX 转换逻辑

React 17 则允许我们在不引入 React 的情况下直接使用 JSX。这是因为在 React 17 中，编译器会自动帮我们引入 JSX 的解析器。

```
import {jsx as _jsx} from 'react/jsx-runtime';
function MyComponent() {
  return _jsx('p', { children: '这是我的组件' });
}
```

## 事件系统重构

### 放弃利用 document 来做事件的中心化管控

issue：想阻止 Input 的 click 时间冒泡到 document，却不能实现。
解决方案：事件的中心化管控不会再全部依赖 document，管控相关的逻辑被转移到了每个 React 组件自己的容器 DOM 节点中。

```
function ElInput() {
  function handleClick(e) {
    e.stopPropagation();
  }

  return <>
  <input onClick="handleCLick">
  </input>
}
```

### 放弃事件池

在 React 17 之前，合成事件对象会被放进一个叫作“事件池”的地方统一管理。这样做的目的是能够实现事件对象的复用，进而提高性能。
每当事件处理函数执行完毕后，其对应的合成事件对象内部的所有属性都会被置空，意在为下一次被复用做准备。
解决方案：放弃事件池，为每一个合成事件创建新的对象。

```
function handleChange(e) {
  // This won't work because the event object gets reused.
  // 迫使该 event 对象不被事件池回收利用
  e.persist()
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```

## Lane 模型的引入

React 16 中处理优先级采用的是 expirationTime 模型。
expirationTime 模型使用 expirationTime（一个时间长度） 来描述任务的优先级；而 Lane 模型则使用二进制数来表示任务的优先级：
lane 模型通过将不同优先级赋值给一个位，通过 31 位的位运算来操作优先级。
Lane 模型提供了一个新的优先级排序的思路，相对于 expirationTime 来说，它对优先级的处理会更细腻，能够覆盖更多的边界条件。

## useState

作用：该钩子用于创建一个新的状态，参数为一个固定的值或者一个有返回值的方法。<br>
用法：

```
import React, { useState } from 'react';

export default function (props) {
    const [count, setCount] = useState(0);
    // 获取 state --- count
    // 修改 state
    setUser(newCount);
    // 可以获得之前的state
    setUser(count => {
        return newCount
    })
}
```

## useEffect

作用：需要模拟类组件声明周期函数或者需要使用为 state 更改后 callback（即 setState 的第二个参数）<br>
用法：该钩子接受两个参数，第一个参数为副作用需要执行的回调，生成的回调方法可以返回一个函数（将在组件卸载时运行）；第二个为该副作用监听的状态数组，当对应状态发生变动时会执行副作用，如果第二个参数为空，那么在每一个 State 变化时都会执行该副作用。

```
import React, { useEffect } from 'react';

// componentDidMount 会触发（只触发一次）
useEffect(() => {
  message.info(`count发生变动，最新值为${count}`);
}, [])
// 将在 count 变化调用（需要多个state更改时执行，直接添加到数组即可）
useEffect(() => {
  message.info(`count发生变动，最新值为${count}`);
}, [count])
// componentDidUpdate 触发（即每个 state 变化都会调用）
useEffect(() => {
  message.info(`count发生变动，最新值为${count}`);
})
// componentWillUnmout 会触发
useEffect(() => {
  message.info(`我只在页组件挂载时打印`);
  return () => {
      message.info('我只在组件卸载时打印');
  }
})
// componentDidMount 和 componentWillUnmout 触发一次
useEffect(() => {
  message.info(`我只在页组件挂载时打印`);
  return () => {
      message.info('我只在组件卸载时打印');
  }
}, [])
```

PS：componentDidMount 中多个 setState 会批量处理，但 useEffect 所有的变量都维持在副作用执行时的状态

## useContext

作用：接收一个 context 对象，当父级组件提供的 context 更新时该 Hook 会触发重渲染。
用法：

```
import React, { useContext } from 'react';

// 第一步：创建需要共享的context
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 第二步：使用 Provider 提供 ThemeContext 的值，Provider所包含的子树都可以直接访问ThemeContext的值
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
// Toolbar 组件并不需要透传 ThemeContext
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton(props) {
  // 第三步：使用共享 Context
  const theme = useContext(ThemeContext);
  render() {
    return <Button theme={theme} />;
  }
}
```

## useReducer

作用：state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 。

```
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  // useReducer第二个参数可以制定初始化 state
  // 惰性初始化
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>

        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}

```

[React Hooks](https://juejin.im/post/5d754dbde51d4561cd2466bf)

# redux

## 三大原则

1.  单一数据源
2.  State 是只读
3.  使用纯函数来执行修改

## redux 数据流

1.  action 定义对应的操作
2.  reducer (state, action) => newState
3.  dispatch(action)

异步 action redux-thunk
