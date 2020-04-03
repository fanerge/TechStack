# hooks来模拟类组件生命周期的功能
useEffect 会在每次 render 之后执行，不会阻塞浏览器
```
useEffect(() => {
    // componentDidMount
    console.log("componentDidMount");
    return () => {
      // componentWillUnmount
      console.log("componentWillUnmount");
    };
  }, []);

  let renderCounter = useRef(0);
  renderCounter.current++;
  useEffect(() => {
    if (renderCounter.current > 1) {
      // componentDidUpdate
      console.log("componentDidUpdate");
    }
  });
```

# hooks和class component 映射
##  hooks和class component 映射
```
useState： setState
useReducer： 更高级setState
useRef: ref
useImperativeHandle: ref
useContext: context
useCallback: 对事件句柄进行缓存
useMemo: useCallback的变形
useLayoutEffect: 类似componentDidMount/Update, componentWillUnmount
useEffect: 类似于setState(state, cb)中的cb，总是在整个更新周期的最后才执行
```
触发顺序：useLayoutEffect > requestAnimationFrame > useEffect
##  useImperativeHandle
作用：在子组件中自定义的 ref 的方法可以暴露给父组件
```
// 子组件
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef}  />;
}
FancyInput = forwardRef(FancyInput);

// 父组件
// 父组件中 fancyInputRef.current.focus() // 可以使子组件的input获得焦点
<div>
  <FancyInput ref={fancyInputRef}>
</div>
```
# useLayoutEffect
触发顺序：useLayoutEffect > requestAnimationFrame > useEffect<br>
useLayoutEffect和平常写的ClassComponent的'componentDidMount'和'componentDidUpdate'同时执行<br>
useEffect 会在每次浏览器绘制完毕执行，useLayoutEffect 则会在绘制之前执行<br>
99%都使用 useEffect 来处理副作用，当跟 DOM 操作相关使用 useLayoutEffect

# 自定义hook
```
function usePlayerState(lengthOfClip) {
  const [volume, setVolume] = useState(80);
  const [position, setPosition] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
 
  const stop = () => {
    setPlaying(false);
    setPosition(0);
  }
 
  const start = () => {
    setPlaying(true);
  }
 
  return {
    volume,
    position,
    isPlaying,
    setVolume,
    setPosition,
    start,
    stop
  };
}
```

# other
React.memo 等效于 PureComponent，但它只对 props 浅比较




> 参考文档：
  [React Hooks 原理](https://github.com/brickspert/blog/issues/26)
  [React Hooks 你真的用对了吗？](https://zhuanlan.zhihu.com/p/85969406)
  [useEffect与useLayoutEffect](https://zhuanlan.zhihu.com/p/53077376)
  [hooks使用的一些注意点](https://www.cnblogs.com/vicky24k/p/11371771.html)
  [Umi Hooks](https://hooks.umijs.org/)