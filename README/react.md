# 为啥 constructor(){ this.target = this.func.bind(this); },JSX 里 onChange={this.target}的写法要比要比非 bind 的 func = () => {}的写法效率高？

1.  bind 之后锁定了上下文，不用向上查找（免去了向上查找执行上下文的过程，不一定正确，待验证查明）。

# setState 什么时候是同步的，什么时候是异步（批量处理）的？

异步：生命周期钩子函数和合成事件方法（比如通过 onClick、onCaptureClick）。<br>
同步：除此之外的 setState 调用会同步执行 this.state（componentDidUpdate 生命周期、绕开 React 的事件处理如 addEventListener 直接添加的事件处理函数还有通过 setTimeout/setInterval 产生的异步调用）。<br>

```
// 批量更新 state 的流程
1.  React的 setState 函数实现中，有一个 isBatchingUpdates 变量用来确定是否批量更新。
2.  isBatchingUpdates 默认是 false。
3.  有一个函数 batchedUpdates 会将 isBatchingUpdates 修改为 true。
4.  如果组件在事务流会先调用 batchedUpdates 函数，然后将要更新的state存入_pendingStateQueue，将要更新的组件存入 dirtyComponent。
5.  当上一次更新机制执行完毕，最顶层组件 didmount 后会将批处理标志设置为 false。这时将取出 dirtyComponent中的组件以及 _pendingStateQueue中的 state进行更新。
```

[setState](https://juejin.im/post/5c92f499f265da612647b754#3)
[setState 的执行机制](https://mp.weixin.qq.com/s?__biz=Mzg2NDAzMjE5NQ==&mid=2247483989&idx=1&sn=d78f889c6e1d7d57058c9c232b1a620e&chksm=ce6ec6f9f9194fef681c79ee869bf58d5413132c73496710b2eb32c859a2249a895c2ce8a7cd&scene=21#wechat_redirect)
[深入 setState 机制](https://github.com/sisterAn/blog/issues/26)

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
