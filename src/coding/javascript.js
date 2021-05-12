import '../algorithm/stack'
import '../algorithm/queue'
import '../algorithm/heap'
import '../algorithm/linkList'
import '../algorithm/trie'
import '../algorithm/sort'
import '../algorithm/binarySearch1'





// deepClone
// 1. 针对能够遍历对象的不可枚举属性以及 Symbol 类型，我们可以使用 Reflect.ownKeys 方法；
// 2. 当参数为 Date、RegExp 类型，则直接生成一个新的实例返回；
// 3. 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性，以及对应的特性，顺便结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链；
// 4. 利用 WeakMap 类型作为 Hash 表，因为 WeakMap 是弱引用类型，可以有效防止内存泄漏（你可以关注一下 Map 和 weakMap 的关键区别，这里要用 weakMap），作为检测循环引用很有帮助，如果存在循环，则引用直接返回 WeakMap 存储的值。

let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: '我是一个对象', id: 1 },
  arr: [0, 1, 2],
  func: function () { console.log('我是一个函数') },
  date: new Date(0),
  reg: new RegExp('/我是一个正则/ig'),
  [Symbol('1')]: 1,
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性'
}
);
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj))
obj.loop = obj    // 设置loop成循环引用的属性

function isComplexType(val) {
  return (typeof val === 'object' && val !== null) || (typeof val === 'function')
}
function deepClone(oldVal, hash = new WeakMap()) {
  // 基本类型
  if (!isComplexType(oldVal)) {
    return oldVal;
  }

  // 引用类型
  let constructor = oldVal.constructor
  // Date
  if (constructor === Date) {
    return new Date(oldVal)
  }
  // RegExp
  if (constructor === RegExp) {
    return new RegExp(oldVal)
  }
  // Function 
  if (constructor === Function) {
    // 闭包原理
    return new Function(`return ${oldVal.toString()}`)()
  }
  if (hash.has(oldVal)) {
    return hash.get(oldVal)
  }
  let newVal = new constructor()
  Object.setPrototypeOf(newVal, Object.getPrototypeOf(oldVal))
  hash.set(oldVal, newVal);

  // Object.getOwnPropertyNames\Object.getOwnPropertySymbols
  Reflect.ownKeys(oldVal).forEach(item => {
    if (isComplexType(oldVal[item])) {
      newVal[item] = deepClone(oldVal[item], hash)
    } else {
      Object.defineProperty(newVal, item, Object.getOwnPropertyDescriptor(oldVal, item))
    }
  });

  return newVal;
}

// 自定义call
export function myCall() {
  let [thisArg, ...args] = Array.from(arguments);
  if (!thisArg) {
    //context 为 null 或者是 undefined
    thisArg = typeof window === 'undefined' ? global : window;
  }
  // this 的指向的是当前函数 func (func.call)
  // 为thisArg对象添加func方法，func方法又指向myCall，所以在func中this指向thisArg
  thisArg.func = this;
  // 执行函数
  let result = thisArg.func(...args);
  // let result = eval('thisArg.func(...args)');
  // thisArg 上并没有 func 属性，因此需要移除
  delete thisArg.func;
  return result;
}

// bind
Function.prototype.myBind = function (ctx, ...args) {
  if (!ctx) {
    ctx = typeof window === "undefined" ? global : window;
  }

  let that = this;

  return function (...rest) {
    ctx.func = that;
    let result = ctx.func(...args, ...rest);
    delete ctx.func;
    return result;
  };
};

// 函数节流
function throttle(func, ms, immediate) {
  let last = null;

  return function inner(...args) {
    let now = Date.now();
    if (last === null && immediate) {
      func.apply(this, args);
      last = Date.now();
      return;
    }
    if (last === null) {
      last = Date.now();
      return;
    }
    if (now - last >= ms) {
      func.apply(this, args);
      last = Date.now();
      return;
    }
  };
}

// proxy throttle
function proxyThrottle(func, ms, immediate) {
  let last = null
  return new Proxy(func, {
    apply(target, thisArg, argumentsList) {
      let now = Date.now()
      if (last === null && immediate) {
        target.apply(thisArg, argumentsList)
        last = Date.now()
        return
      }
      if (last === null) {
        last = Date.now()
        return
      }
      if (now - last >= ms) {
        target.apply(thisArg, argumentsList)
        last = Date.now()
        return
      }
    }
  })
}

// AOP 面向切面编程：动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程。
Function.prototype.before = function (fn) {
  return (...args) => {
    // 执行原函数前，需要执行的函数 fn
    fn.apply(this, args)
    return this.apply(this, args)
  }
}
Function.prototype.after = function (fn) {
  return (...args) => {
    // 执行原函数后，需要执行的函数 fn
    const result = this.apply(this, args)
    fn.apply(this, args)
    return result
  }
}
const validate = function () {
  // 表单验证逻辑
}
const formSubmit = function () {
  // 表单提交逻辑
  ajax('http:// xxx.com/login', param)
}
// AOP 运用
const submitBtn = 'submitBtn'
// submitBtn.onclick = function () {
//   // 将会在提交之前验证表单
//   formSubmit.before(validate)
// }

// 函数防抖
function debounce(func, ms, immediate) {
  let timerId = null;
  // 用于占位 timerId
  let backId = 111;

  return function inner(...args) {
    if (timerId === null && immediate) {
      func.apply(this, args);
      timerId = backId;
      return;
    }
    if (timerId && timerId !== backId) {
      clearTimeout(timerId);
      // 必须要先 clear 再将 timerId = null
      timerId = backId;
    }
    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = backId;
    }, ms);
  };
}

// mock new
function mockNew(constructor, ...args) {
  if (typeof constructor !== 'function') {
    throw Error('constructor must be a function');
  }
  // 新建空对象
  let obj = {}; // new Object()
  // 继承原型链中的方法
  Object.setPrototypeOf(obj, constructor.prototype);
  let res = constructor.call(obj, ...args);
  if (typeof res === 'object' && res !== null || typeof res === 'function') {
    return res;
  }
  return obj;
}

// mock instanceof
// Symbol.hasInstance 可以为自定义的类自定义 instanceof 行为
function mockInstanceOf(left, right) {
  // obj instanceOf Cons
  if (typeof left !== 'object' || left === null) return false;
  if (typeof right !== 'function') {
    throw Error('right must be a function')
  }
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

// curry
// 理解为提前接收部分参数，延迟执行，不立即输出结果，而是返回一个接受剩余参数的函数。
function curry(func) {
  const ctx = this;

  return function inner(...args) {
    let needLen = func.length;
    return args.length >= needLen
      ? func.call(func, ...args)
      : (...rest) => inner.call(func, ...args, ...rest);
  };

  // (...rest) => inner.call(ctx, ...args, ...rest) 也可以使用 Function.prototype.bind 来预置参数
  // curry(func.bind(ctx,...args), len)
}

// 反 curry 化在于扩大函数的适用性，使本来作为特定对象所拥有的功能函数可以被任意对象使用(依赖于上下文环境)。
// const unCurry = fn => (...args) => fn.call(...args)
function unCurry(fn) {
  return function (...args) {
    const ctx = args.shift();
    return fn.apply(ctx, args);
  }
}
Function.prototype.unCurrying = function () {
  return (...args) => {
    return Function.prototype.call.apply(this, args);
  }
}
// 反curry 运用
// var toString = Object.prototype.toString.unCurry();
// toString('12') === '[object Number]'

// thunk 函数
// 它的基本思路都是接收一定的参数，会生产出定制化的函数，最后使用定制化的函数去完成想要实现的功能。
let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
}
let isString = isType('String');
let isNumber = isType('Number');
isString('str') // true


// compose right -> left
function compose(...funcs) {
  return function (args) {
    // fix
    if (!args) throw Error("args is Required");
    return funcs.reduceRight((acc, func, index) => {
      acc = func(acc);
      return acc;
    }, args);
  };
}

// pipe left -> right
function pipe(...funcs) {
  return function (args) {
    // fix
    if (!args) throw Error("args is Required");
    return funcs.reduce((acc, func, index) => {
      acc = func(acc);
      return acc;
    }, args);
  };
}

// JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个
// http://blog.mapplat.com/public/javascript/%E4%B8%80%E4%B8%AA%E5%85%B3%E4%BA%8Epromise%E7%9A%84%E9%97%AE%E9%A2%98/
class Scheduler {
  constructor(num) {
    this.size = num;
    this.awaitArr = [];
    this.curNum = 0;
  }

  // @measuerRunTime
  test() {
    let i = 0;
    while (i < 1000) {
      i++;
    }
    // console.log('end')
  }

  async add(promiseCreator) {
    if (this.curNum >= this.size) {
      await new Promise((resolve, reject) => {
        this.awaitArr.push(resolve);
      })
    }
    // 1
    this.curNum++;
    let res = await promiseCreator()
    this.curNum--;
    if (this.awaitArr.length > 0) {
      // resolve() 调用后，代码将从1开始继续执行
      this.awaitArr.shift()();
    }
    return res;
  }
}

const timeout = (time) => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler(2)
scheduler.test();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}

// addTask(1000, '1')
// addTask(500, '2')
// addTask(300, '3')
// addTask(400, '4')
// output: 2 3 1 4

// 限制并发，如上
function limitLoad(urls, handler, limit) {
  const sequence = [].concat(urls);
  let promises = [];
  promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      return index;
    });
  })

  // 前 limit 个开始执行
  let p = Promise.race(promises);
  for (let i = 0; i < sequence.length; i++) {
    p = p.then((res) => {
      promises[res] = handler(sequence[i]).then(() => {
        return res;
      })
      return Promise.race(promises)
      // 相当于
      // p.then().then() ...
    })
  }
}
const urls = [{
  info: '1111',
  time: 3000
},
{
  info: '222',
  time: 1000
}, {
  info: '333',
  time: 2000
}, {
  info: '4444',
  time: 1000
}, {
  info: '5555',
  time: 1000
}, {
  info: '666',
  time: 1000
}, {
  info: '777',
  time: 1000
}, {
  info: '888',
  time: 5000
}]
function loadImg(url) {
  return new Promise((resolve, reject) => {
    // console.log(url.info + '!!!start');
    setTimeout(() => {
      console.log(url.info + '!!!end');
      resolve()
      // reject()
    }, url.time);
  })
}
// limitLoad(urls, loadImg, 3)

// 实现xhrHook
class Xhrhook {
  constructor(beforehooks = {}, afterhooks = {}) {
    this.XHR = window.XMLHttpRequest;
    this.beforehooks = beforehooks;
    this.afterhooks = afterhooks;
    this.init();
  }

  init() {
    let _this = this;
    window.XMLHttpRequest = function () {
      this._xhr = new _this.XHR()
      this.overwrite(this);
    }
  }

  overwrite(proxyXHR) {
    for (let key in proxyXHR._xhr) {
      if (typeof proxyXHR._xhr[key] === 'function') {
        this.overwriteMethod(key, proxyXHR);
        continue;
      }
      this.overwriteAttributes(key, proxyXHR);
    }
  }

  overwriteMethod(key, proxyXHR) {
    let beforeHooks = this.beforehooks;
    let afterHooks = this.afterHooks;

    proxyXHR[key] = (...args) => {
      if (beforeHooks) {
        const res = beforeHooks[key].apply(proxyXHR, args)
        return res;
      }
      const res = proxyXHR._xhr[key].apply(proxyXHR._xhr, args)
      afterHooks[key] && afterHooks[key].call(proxyXHR._xhr, res)
      return res;
    }
  }

  overwriteAttributes(key, proxyXHR) {
    Object.defineProperty(proxyXHR, key, this.setPropertyDescriptor(key, proxyXHR))
  }

  setPropertyDescriptor(key, proxyXHR) {
    let obj = Object.create(null);
    let _this = this;
    obj.set = function (val) {
      if (key.startsWith('on')) {
        proxyXHR['__' + key] = val;
        return;
      }
      if (_this.beforehooks[key]) {
        this._xhr[key] = function (...args) {
          _this.beforehooks[key].call(proxyXHR);
          val.apply(proxyXHR, args)
        }
        return;
      }
      this._xhr[key] = val;
    }
    obj.get = function () {
      return proxyXHR['__' + key] || this._xhr[key];
    }

    return obj;
  }
}
// 使用hook
// new XhrHook({
//   open: function () {
//     console.log('open');
//   },
//   onload: function() {
//   }
// }, {
//   onerror: function() {
//   }
// })
// 使用var xhr = new XMLHttpRequest() 就已经添加了对应hook

// 实现一个基本的EventEmitter
class EventEmitter {
  constructor() {
    let map = new Map();
    this.map = map;
  }

  on(name, func) {
    const { map } = this;
    if (name === undefined) {
      throw Error('name 必填')
    }
    if (typeof func !== 'function') {
      throw Error('func 必须是一个函数')
    }
    let list = []
    if (map.has(name)) {
      list = map.get(name)
    }
    // 如果 func 已经存在，不需要重复添加
    if (list.includes(func)) return;
    list.push(func)
    map.set(name, list)
  }

  // on 和 off 方法组合
  once(name, func) {
    let self = this;
    if (name === undefined) {
      throw Error('name 必填')
    }
    if (typeof func !== 'function') {
      throw Error('func 必须是一个函数')
    }
    // **重点**
    // 改造 func 方法
    function tempFunc(...args) {
      func(...args);
      // 执行万后移除即可
      self.off(name, tempFunc)
    }
    this.on(name, tempFunc)
  }

  off(name, func) {
    const { map } = this;
    if (name === undefined) {
      throw Error('name 必填')
    }
    if (func === undefined) {
      // clear all
      map.delete(name);
    } else {
      let list = map.get(name) || []
      let index = list.findIndex(f => func === f);
      index >= 0 && list.splice(index, 1);
      if (list.length === 0) {
        map.delete(name);
      } else {
        map.set(name, list)
      }
    }
  }

  emit(name, ...args) {
    const { map } = this;
    if (name === undefined) {
      throw Error('name 必填')
    }
    let list = map.get(name) || []
    list.forEach(f => {
      f.apply(this, args)
    });
  }
}

// LRUCache
class LRUCache {
  constructor(size) {
    this.map = new Map();
    this.size = size;
  }

  set(key, val) {
    const { map, size } = this;
    if (map.has(key)) {
      map.delete(key)
      map.set(key, val)
    } else if (map.size < size) {
      map.set(key, val)
    } else {
      // 空间不够删掉第一个
      let firstKey = map.keys().next().value;
      map.delete(firstKey);
      map.set(key, val)
    }
  }

  get(key) {
    const { map } = this;
    let oldVal;
    if (map.has(key)) {
      oldVal = map.get(key)
      map.delete(key)
      map.set(key, oldVal)
    }
    return oldVal;
  }
}


// mock JSON.stringify
function jsonStringify(data, hash = new WeakSet()) {
  let type = typeof data;
  let funUndSym = ['function', 'undefined', 'symbol'];
  if (type !== 'object') {
    // basic
    if (type === 'bigint') {
      throw TypeError('Do not know how to serialize a BigInt')
    }
    if (Number.isNaN(data) || data === Infinity || data === -Infinity) {
      return 'null'
    } else if (funUndSym.includes(type)) {
      return undefined
    } else if (type === 'string') {
      return `"${data}"`;
    }
    return String(data)
  } else if (type === 'object') {
    if (data === null) {
      return 'null'
    }
    // 循环引用检测
    if (hash.has(data)) {
      throw TypeError('Converting circular structure to JSON');
    }
    hash.add(data)
    if (data.toJSON && typeof data.toJSON === 'function') {
      // Date
      return jsonStringify(data.toJSON(), hash);
    } else if (data instanceof Array) {
      let result = [];
      data.forEach((item, index) => {
        if (funUndSym.includes(typeof item)) {
          result[index] = 'null'
        } else {
          result[index] = jsonStringify(item, hash)
        }
      });

      // 隐式调用了数组的 toString 方法
      result = `[${result}]`
      return result.replace(/\'/g, '"')
    } else {
      // 处理普通对象
      let result = [];
      Object.keys(data).forEach((item, index) => {
        // 对象的 key 为 symbol 时直接忽略
        if (typeof item !== 'symbol') {
          if (!funUndSym.some(item1 => item1 === typeof data[item])) {
            result.push(`"${item}":${jsonStringify(data[item], hash)}`)
          }
        }
      })

      return `{${result}}`.replace(/'/g, '"')
    }
  }
}

// mock JSON.parse
function jsonParse(str) {
  return eval("(" + str + ")");
}

// 模拟加法
function bitSum(a, b) {
  if (a === 0) return b;
  if (b === 0) return a;

  return bitSum(a ^ b, (a & b) << 1);
}

// 大数相加
function bigNumSum(a, b) {
  a = String(a);
  b = String(b);
  let maxLen = Math.max(a.length, b.length);

  let aPad = a.padStart(maxLen, "0");
  let bPad = b.padStart(maxLen, "0");

  let flag = 0;
  let temp = [];
  for (let i = maxLen - 1; i >= 0; i--) {
    let cur = flag + +aPad[i] + +bPad[i];
    if (cur > 9) {
      flag = 1;
    } else {
      flag = 0;
    }
    temp.unshift(cur);
  }

  if (flag === 1) {
    temp.unshift(1);
  }

  return temp.join("");
}

// 两数之和
// 思路1：先进行排序O(nlogn) 在使用两个指针向中间靠拢
// 思路2：使用额外空间 map 记录每个数字的key和value一次循环，再一次循环
function twoNumSum(arr, sum) {
  let map = new Map();
  arr.forEach((item, index) => {
    map.set(item, index)
  });

  for (let i = 0; i < arr.length; i++) {
    let d = sum - arr[i];
    if (map.has(d)) {
      return [i, map.get(d)]
    }
  }

  return []
}
// console.log(twoNumSum([1, 2, 3, 4, 5 ,6, 7], 99))

// 朋友圈的个数
function findCircleNum(M) {
  // 标记某个同学是否访问过(0为未访问)
  let visited = Array.from({ length: M.length }).fill(0);
  let res = 0;
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] === 0) {
      visited[i] = 1;
      dfs(i);
      res++;
    }
  }

  function dfs(i) {
    for (let j = 0; j < M.length; j++) {
      if (i !== j && visited[j] === 0 && M[j][i] === 1) {
        visited[j] = 1;
        dfs(j)
      }
    }
  }

  return res;
}
// findCircleNum([[1,1,0], [1,1,0], [0,0,1]])


// 判断是否为一个有效的 url
function isRealUrl(str) {
  // const a = document.createElement('a');
  // a.href = str;
  const a = new URL(str);
  return [(/^(http|https):$/).test(a.protocol), a.host, a.pathname !== str, a.pathname !== `/${str}`].find(x => !x) === void 0;
}
// console.log(isRealUrl('http://www.pauct.com/groupbuy'))




// 循环有序列表的查找
function find(list, target) {
  let left = 0;
  let right = list.length - 1;
  while (left <= right) {
    // let mid = left + ((right-left) >> 1);
    let mid = left + Math.floor((right - left) / 2);
    if (list[mid] === target) return mid;

    // 至少有一个区段是升序
    if (list[left] <= list[mid]) {
      // [left, mid] 升序
      if (list[left] <= target && target <= list[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // [mid, right] 升序
      if (list[mid] <= target && target <= list[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return -1;
}
// var a = find([7, 7, 8, 9, 1, 2, 5, 6, 7, 7], 5);
// var b = find([7, 7, 8, 9, 1, 2, 5, 6, 7, 7], 4);
// var c = find([7, 7, 8, 9, 1, 2, 5, 6, 7, 7], 8);
// console.log(a, b, c);

// flatArray
// es flat
var ary = [1, 2, [3, [4, 5, [6, [7, 8]]]], 9, [10, [11, 12]]];
function flatArray(list, res = [], n) {
  list.forEach((item, index) => {
    if (Array.isArray(item) && n > 0) {
      let level = n - 1;
      flatArray(item, res, level);
    } else {
      res.push(item);
    }
  });

  return res;
}

// flatArray 迭代版（修改了原数组）
function flatArray1(arr) {
  // 可以深拷贝一下
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      let temp = arr[i];
      arr.splice(i, 1, ...temp);
    }
  }

  return arr;
}
function flatArray2(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      arr = arr.slice(0, i + 1).concat(arr[i], ...arr.slice(i + 1));
      arr.splice(i, 1);
    }
  }

  return arr;
}
// console.log(flatArray2(ary));
// console.log(ary);

// 数组交集
function arrayMethod1(arr1, arr2) {
  let ans = [];
  function array2Map(arr) {
    return arr.reduce((acc, item, index) => {
      if (!acc[item]) {
        acc[item] = 1;
      } else {
        acc[item]++;
      }
      return acc;
    }, {})
  }
  let map1 = array2Map(arr1)
  let map2 = array2Map(arr2)
  // [[key, val]]
  return Object.entries(map1).reduce((list, array) => {
    if (map2[array[0]] > 0) {
      let minCount = Math.min(array[1], map2[array[0]])
      let temp = Array.from({ length: minCount }, () => +array[0])
      list = list.concat(temp);
    }
    return list;
  }, [])

}
// console.log(arrayMethod1([1, 2, 3, 2, 2], [1, 2, 2, 2, 3]))

// 数组并集
function arrayMethod2(arr1, arr2) {
  function array2Map(arr) {
    return arr.reduce((acc, item, index) => {
      if (!acc[item]) {
        acc[item] = 1;
      } else {
        acc[item]++;
      }
      return acc;
    }, {})
  }
  let map = array2Map([...arr1, ...arr2])
  return Object.entries(map).reduce((acc, array, index) => {
    // array [key, val]
    let temp = Array.from({ length: array[1] }, () => +array[0])
    acc = acc.concat(temp)
    return acc;
  }, []);
}
// console.log(arrayMethod2([1, 2, 3, 2, 2], [1, 2, 2, 2, 3]))

// 子集（回塑）
function skuList(list) {
  let len = list.length;
  let res = [];
  for (let l = 1; l <= len; l++) {
    backTrack(list, [], l, res)
  }

  function backTrack(allList, selectedList, n, res) {
    if (selectedList.length === n) {
      let str = selectedList.slice(0).sort((a, b) => a - b).join("*")
      if (!res.includes(str)) {
        res.push(str)
      }
      return;
    }

    for (let i = 0; i < allList.length; i++) {
      if (!selectedList.includes(allList[i])) {
        selectedList.push(allList[i])
        backTrack(allList, selectedList, n, res)
        selectedList.pop()
      }
    }
  }

  res = res.map(str => str.split('*').map(item => +item))
  res.unshift([])
  return res;
}
// console.log(skuList([1, 2, 3]));

// lazyman
class LazyMan {
  constructor(name) {
    this.name = name;
    this.todoQueue = [];
    console.log(`Hi I am ${name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  next() {
    let fn = this.todoQueue.shift();
    fn && typeof fn === 'function' && fn();
  }
  sleep(s) {
    let fn = () => {
      setTimeout(() => {
        console.log(`睡${s}秒钟`);
        this.next();
      }, s * 1000)
    }
    this.todoQueue.push(fn)
    return this;
  }
  sleepFirst(s) {
    let fn = () => {
      setTimeout(() => {
        console.log(`睡${s}秒钟`);
        this.next();
      }, s * 1000)
    }
    this.todoQueue.unshift(fn)
    return this;
  }
  eat(food) {
    let fn = () => {
      console.log(`吃${food}`)
      this.next();
    }
    this.todoQueue.push(fn)

    return this;
  }
}
// var lazy = new LazyMan('yzf').sleep(1).eat('yu').sleep(2).eat('fan').sleepFirst(3)

// getUrlParams
function urlParams2Map(href) {
  let map = new Map();
  // http://lucifer.ren?a=1&b=2&a=3
  let queryIndex = href.indexOf("?");
  if (queryIndex === -1) {
    return map;
  }
  let queryStr = href.slice(queryIndex + 1);
  // http://lucifer.ren?
  if (queryStr.length === 0) {
    return map;
  }
  let queryList = queryStr.split("&");
  queryList.forEach((str, index) => {
    let [key, value] = str.split("=");
    let oldValue = map.get(key);
    if (Array.isArray(oldValue)) {
      map.set(key, [...oldValue, value]);
    } else {
      map.set(key, [value]);
    }
  });

  return map;
}


// 用 reduce 实现 map
function map(list, func, ctx = null) {
  return list.reduce((acc, item, index) => {
    acc[index] = func.call(ctx, item, index, list);
    return acc;
  }, []);
}

// stack 实现 queue
// stack first in last out
// first in first out
class Queue {
  constructor(nums = []) {
    // 1,2,3
    this.inStack = nums;
    this.outStack = [];
  }

  in(val) {
    this.inStack.push(val);
    return this.size;
  }

  out() {
    let len = this.inStack.length;
    for (let i = len - 1; i >= 0; i--) {
      this.outStack.push(this.inStack[i]);
    }
    let res = this.outStack.pop();
    this.inStack = [];
    let len1 = this.outStack.length;
    for (let i = len1 - 1; i >= 0; i--) {
      this.inStack.push(this.outStack[i]);
    }
    this.outStack = [];
    return res;
  }

  get size() {
    return this.inStack.length;
  }
}

// 时针和分针的夹角？
function calcAngle(h, m) {
  // 分别计算与0的夹角
  // 1小时 30 度，1分钟再走 0.5 度。
  let mAngle = m * (360 / 60);
  let hAngle = Math.abs(h % 12 + m / 60) * (360 / 12)

  return Math.abs(hAngle - mAngle)
}

// 判断是否是完全二叉树 fix
// 如何判断是不是完全二叉树
// leetcode 原题： https://leetcode.com/problems/check-completeness-of-a-binary-tree/
function isCompleteBinaryTree(root) {
  if (root === null) return true;
  let cur = root;
  const queue = [];

  while (cur !== null) {
    queue.push(cur.left);
    queue.push(cur.right);
    cur = queue.shift();
  }

  return queue.filter(Boolean).length === 0;
}

// 实现 lensProp
// 给定一个字符串， 比如lensProp(a, obj) 返回 'obj.a'的值
// 访问对象 a.b.c.d.f.g => obj.a.b.c.d.f.g
// 访问数组 children.0.name
function lensProp(path, obj = {}) {
  // fix obj.a.b.c..d.f....g
  path = replace(/\.+/g, ".");
  let propList = path.split("."); // [a, b, c, d]
  for (let i = 0; i < propList.length; i++) {
    // 非 object 即可返回阻止循环继续执行
    if (obj === null || obj === undefined) {
      return void 0;
    } else {
      obj = obj[propList[i]];
    }
  }

  return obj;
}
// var obj = {
//     name: 'yzf',
//     children: [{
//       name: 'yy',
//       age: 1,
//       children: []
//     },{
//       name: 'yy1',
//       age: 8,
//       children: []
//     }],
//     other: {
//         year: 29
//     }
// }

// 判断链表是否成环
function judgeLinkListIsLoop(link) {
  if (link === null || link.next === null) return false;
  let slow = link;
  let fast = link.next;

  while (fast && fast.next) {
    if (slow === fast) return true;
    slow = slow.next;
    fast = fast.next.next;
  }

  return false;
}

// dp 三要素：1.初始条件 dp[0][0] = 0,2.状态转移方程
// 最长公共子序列
function longestCommonSequence(s1, s2) {
  // dp
  let dp = [];
  for (let i = 0; i < s1.length + 1; i++) {
    dp[i] = Array(s2.length + 1).fill(0);
  }

  for (let i = 1; i < s1.length + 1; i++) {
    for (let j = 1; j < s2.length + 1; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[s1.length][s2.length];
}
// function expect(actual) {
//   return {
//     toBe(expected) {
//       console.log(actual === expected, actual);
//       return expected === actual;
//     }
//   };
// }
// ("fo", "fisssssssss")
// expect(longestCommonSequence("fosh", "fish")).toBe("fsh".length);
// expect(longestCommonSequence("fish", "hish")).toBe("ish".length);
// expect(longestCommonSequence("lucider", "lucifer")).toBe("lucier".length);
// expect(longestCommonSequence("hahaui", "hfui")).toBe("hui".length);
// expect(longestCommonSequence("sasa", "fgdfrsa")).toBe("sa".length);

// 最长公共子串
function longestCommonSubStr(s1, s2) {
  let dp = [];
  for (let i = 0; i < s1.length + 1; i++) {
    dp[i] = Array(s2.length + 1).fill(0);
  }

  let max = 0;

  for (let i = 1; i < s1.length + 1; i++) {
    for (let j = 1; j < s1.length + 1; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        max = Math.max(max, dp[i][j]);
      } else {
        dp[i][j] = 0;
      }
    }
  }

  return max;
}

// 实现千分位展示
function formatMoney(num) {
  let [int, dec] = String(num).split(".");
  // int = int.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
  int = int.replace(/(\d{1,3})(?=(\d{3})+$)/g, "$1,");
  // '0'
  dec = dec ? `.${dec}` : "";
  return `${int}${dec}`;
}
function formatMoney1(num) {
  let [int, dec] = String(num).split(".");
  let list = [...int];
  let len = list.length;
  int = list.reduceRight((acc, item, index) => {
    // reduceRight 的 index 也是正序的 index
    let num = len - index;
    if (num % 3 === 0) {
      acc += `,${item}`;
    }
    return acc;
  }, "");
  // '0'
  dec = dec ? `.${dec}` : "";
  return `${int}${dec}`;
}

// 如果改为¥1,231，转化为1231. 支持各种货币呢？
function reFormateMoney(str) {
  // return str.replace(/,/g, '').replace(/^[^\d]*/, '')
  return str.replace(/[^\d\.]/g, "");
}
// reFormateMoney("¥1,231");

// backTrack
// 无序不相等正数组中，选取 N 个数，使其和为 M
function findSumList(list, N, M) {
  let res = [];
  const sum = (ary) =>
    ary.reduce((acc, item) => {
      return acc + item;
    }, 0);
  function backTrack(selectList, usedList) {
    let selectN = selectList.length;
    let selectM = sum(selectList);

    if (selectN === N && selectM === M) {
      let temp = [...selectList].sort((a, b) => a - b);
      // 是否已经存在于 res 中
      let tempRes = res.map((item) => {
        return item.join("*");
      });
      if (!tempRes.includes(temp.join("*"))) {
        res.push(temp);
      }
      return;
    }

    for (let i = 0; i < list.length; i++) {
      if (![...selectList, ...usedList].includes(list[i])) {
        selectList.push(list[i]);
        backTrack(selectList, [...usedList, list[i]]);
        selectList.pop();
      }
    }
  }
  for (let i = 0; i < list.length; i++) {
    backTrack([list[i]], [list[i]]);
  }

  return res;
}
// findSumList([1, 3, 6, 4, 2, 7, 5], 3, 8);

// 实现简化的 promise
function MyPromise(func) {
  this.fullfilled = false;
  this.rejected = false;
  this.pending = true;
  this.handlers = [];
  this.errorHandlers = [];
  function resolve(...args) {
    this.handlers.forEach((handler) => handler(...args));
  }
  function reject(...args) {
    this.errorHandlers.forEach((handler) => handler(...args));
  }
  func.call(this, resolve.bind(this), reject.bind(this));
}

MyPromise.prototype.then = function (func) {
  this.handlers.push(func);
  return this;
};
MyPromise.prototype.catch = function (func) {
  this.errorHandlers.push(func);
  return this;
};

MyPromise.race = (promises) =>
  new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve, reject);
    });
  });

MyPromise.all = (promises) =>
  new Promise((resolve, reject) => {
    let len = promises.length;
    let res = [];
    promises.forEach((p, i) => {
      p.then((r) => {
        if (len === 1) {
          resolve(res);
        } else {
          res[i] = r;
        }
        len--;
      }, reject);
    });
  });

// test
// const p1 = new Promise(resolve =>
//   setTimeout(resolve.bind(null, "resolved"), 3000)
// );
// p1.then(console.log).then((...args) => console.log("second", ...args));

// const p2 = new Promise((resolve, reject) =>
//   setTimeout(reject.bind(null, "rejected"), 3000)
// );
// p2.then(console.log).catch((...args) => console.log("fail", ...args));

// Promise.prototype.finally
// Promise.prototype.finally = function (callback) {
//   // Promise
//   const P = this.constructor;
//   return this.then((value) => {
//     return P.resolve(callback()).then(() => {
//       return value;
//     })
//   }, (reason) => {
//     return P.resolve(callback()).then(() => {
//       throw reason;
//     })
//   })
// }

// quickSort
// 找一个基准点，比基准点小的放一个数组，比基准点大的放另一个数组。
// [1, 3, 2, 9, 6, 5, 1, 0, -2, 10]
function quickSortHelper(ary) {
  const { floor, random } = Math;
  if (ary.length <= 1) return ary;
  // 随机找一个基准点
  let pointIndex = floor(random() * ary.length);
  let pointValue = ary[pointIndex];
  let bigger = [];
  let smaller = [];
  ary.forEach((item, index) => {
    // 这里容易出错
    if (index !== pointIndex) {
      if (item <= pointValue) {
        smaller.push(item);
      } else {
        bigger.push(item);
      }
    }
  });

  return [...quickSortHelper(smaller), pointValue, ...quickSortHelper(bigger)];
}
function quickSort(ary) {
  return quickSortHelper(ary);
}

// mergeSort
// 将数组一分为2逐个比较
// [1, 3, 2, 9, 6, 5, 1, 0, -2, 10]
function mergeSortHelper(left, right) {
  let res = [];
  while (left.length && right.length) {
    let left0 = left[0];
    let right0 = right[0];
    if (left0 <= right0) {
      res.push(left.shift());
    } else {
      res.push(right.shift());
    }
  }

  return res.concat(left).concat(right);
}
function mergeSort(ary) {
  if (ary.length <= 1) return ary;
  let mid = Math.floor(ary.length / 2);
  return mergeSortHelper(
    mergeSort(ary.slice(0, mid)),
    mergeSort(ary.slice(mid))
  );
}

// heapSort
// 大根堆
function heapSort(arr) {
  let len = arr.length;
  // 交互
  function swap(i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  // 调整堆
  function maxHeapify(start, end) {
    let dad = start;
    // 左孩子为 start * 2 + 1；右孩子为 start * 2 + 2；
    let son = start * 2 + 1;
    // 做孩子不能越界
    if (son >= end) return;
    // 右孩子也不能越界且左孩子小于右孩子
    if (son + 1 < end && arr[son] < arr[son + 1]) {
      son++;
    }
    // 若有孩子大于父节点则交换且调整堆
    if (arr[dad] <= arr[son]) {
      swap(dad, son);
      maxHeapify(son, end);
    }
  }
  // 处理父节点的顺序
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    maxHeapify(i, len);
  }
  // 根据父节点和叶子节点的大小对比，进行堆的调整
  for (let j = len - 1; j > 0; j--) {
    swap(0, j);
    maxHeapify(0, j);
  }
  return arr;
}
var heapList = [1, 3, 6, 3, 23, 76, 1, 34, 222, 6, 456, 221];
// console.log(heapSort(heapList));

// 0.1+0.2 !== 0.3 IEEE756 64bit 表示数字
/**
 * 符号位：决定正负，0为正，1为负(1位符号位)
 * 阶码：指数位则为阶码-1023，决定了数值的大小(11位指数位)
 * 尾数：有效数字，决定了精度(52位尾数位)
 * 科学计数法：(-1^(符号位0/1)) 1.xxxxx(尾数位) 2^(指数位)
 * 1.进制转换和对阶运算会发生精度丢失
 * why进制转换？计算机硬件决定，只能进行2进制运算
 * why对阶运算？两个进行运算的浮点数必须阶码对齐（指数位数相同），才能进行尾数加减运算
 */

// 随机生成一个长度为10的数组，将数组转化为对应的二维数组
// 生成两个整数之前的整数包含两端
function randomNum(min = 0, max = 30) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function genArray(len) {
  let temp = new Array(len).fill(0).map(item => randomNum(0, 30))
  return temp;
}
function toSolutionArray(ary) {
  const num = 10;
  ary.sort((a, b) => a - b);
  let map = new Map();
  ary.forEach(item => {
    let key = +parseInt(item / num)
    if (!map.has(key)) map.set(key, [])
    let oldVals = map.get(key);
    oldVals.push(item)
    // map.set(key, [...oldVals, item])
  })
  return [...map.values()];
}
// console.log(toSolutionArray(genArray(10)))

// 大小写反转
function reverseCase(str) {
  return [...str].reduce((acc, item, index) => {
    let upperCase = item.toUpperCase()
    item = item === upperCase ? item.toLowerCase() : upperCase;
    return `${acc}${item}`
  }, '');
}

// 字符串 S 中是否存在字符串 T 并返回最开始相同的 index
function findSubStrIndex(str, subStr) {
  // dp[i][j] 表示连续相等的字符个数
  let strLen = str.length;
  let subStrLen = subStr.length;
  let dp = new Array(strLen + 1)
  for (let i = 0; i < strLen + 1; i++) {
    dp[i] = new Array(subStrLen + 1).fill(0);
  }

  for (let i = 1; i < strLen + 1; i++) {
    for (let j = 1; j < subStrLen + 1; j++) {
      if (str[i - 1] === subStr[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = 0;
      }
      if (dp[i][j] === subStrLen) {
        return i - subStrLen;
      }
    }
  }

  return -1;
}
function findSubStrIndex2(str, subStr) {
  let strLen = str.length;
  let subStrLen = subStr.length;
  if (strLen < subStrLen) return -1;

  for (let i = 0; i < strLen - subStrLen + 1; i++) {
    let temp = str.slice(i, i + subStrLen);
    if (temp === subStr) {
      console.log(i)
      return i;
    }
  }
  console.log(-1)
  return -1;
}
// findSubStrIndex2('12312344', '1234')

// 旋转数组
function rotateArray(ary, k) {
  let len = ary.length
  let items = k % len;
  if (items === 0) {
    console.log(ary)
    return ary
  }
  // 原地操作
  // for(let i=0; i<items; i++) {
  //   let last = ary.pop();
  //   ary.unshift(last);
  // }
  // 需要额外空间
  ary = ary.slice(-items).concat(ary.slice(0, len - items))
  console.log(ary)
  return ary;
}
// rotateArray([1, 2, 3, 4], 8)

// 生成一个索引数组的方法
// [...new Array(100).keys()]

// 找出1000以内的对称数
function findConNum(num) {
  const temp = [...new Array(num).keys()].filter(item => {
    const str = item.toString();
    return str.length >= 1 && str === str.split('').reverse().join('')
  });
  console.log(temp);
  return temp;
}
// findConNum(1000)

function moveZero(ary) {
  // 额外空间
  let len = ary.length;
  let gt0Ary = ary.filter(item => item !== 0);
  let temp = [...gt0Ary].concat(new Array(len - gt0Ary.length).fill(0))
  console.log(temp);
  return temp;
}
function moveZero1(ary) {
  // 不需要额外空间
  let len = ary.length;
  let rmCount = 0;
  for (let i = 0; i < len; i++) {
    if (ary[i] === 0 && i < len - rmCount) {
      let rm = ary.splice(i, 1)
      ary.push(...rm);
      ++rmCount;
      --i;
    }
  }
  console.log(ary);
  return ary;
}
// moveZero1([1, 2, 3, 4, 0, 5, 6, 0, 0, 9])

// 装饰器的使用 TODO
// 测量某个方法执行的时间
export function measuerRunTime(target, name, descriptor) {
  const oldValue = descriptor.value;
  descriptor.value = async function () {
    console.time(name)
    const ret = await oldValue.apply(this, arguments)
    console.timeEnd(name)
    return ret;
  }
}

// 检查浏览器是否支持 webp
function checkWebp1() {
  return document.createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
}

async function checkWebp2() {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = function () {
      resolve(true)
    }
    img.onerror = function () {
      resolve(false)
    }
    img.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  })
}

function repeat(func, times, ms, immediate) {
  let count = 0;
  const ctx = null;
  function inner(...args) {
    count++;
    if (count === 1 && immediate) {
      inner.call(ctx, ...args);
      func.call(ctx, ...args);
      return;
    }
    if (count > times) {
      return;
    }
    return setTimeout(() => {
      inner.call(ctx, ...args);
      func.call(ctx, ...args);
    }, ms);
  }
  return inner;
}
// const repeatFunc = repeat(console.log, 4, 3000);
// repeatFunc("hello world"); //会打印4次 helloworld，每次间隔3秒

const repeatFunc = repeat(console.log, 4, 3000, true);
// repeatFunc("hello world"); //先立即打印一个hellworld，然后每个三秒打印三个hello world

// 周期执行某个函数 n 次
function repeat1(func, times, ms, immediate) {
  let count = 0;
  let timerId = null;
  return function repeatInner(...args) {
    if (times >= 1 && immediate) {
      func.apply(this, args);
      ++count;
    }
    timerId = setInterval(() => {
      if (count >= times) {
        clearInterval(timerId);
        return;
      }
      ++count;
      func.apply(this, args);
    }, ms);
  };
}

function repeat2(func, times, ms, immediate) {
  let count = 0;

  return function repeatInner(...args) {
    let that = this;
    if (immediate && times >= 1 && count === 0) {
      ++count;
      func.apply(that, args);
    }
    if (times > count) {
      setTimeout(function () {
        ++count;
        func.apply(that, args);
        repeatInner(...args);
      }, ms);
    }
  };
}
// const repeatFunc = repeat(console.log, 4, 3000);
// repeatFunc("hellworld"); //会打印4次 helloworld，每次间隔3秒
// const repeatFunc = repeat(console.log, 4, 3000, true);
// repeatFunc("hellworld"); //先立即打印一个hellworld，然后每个三秒打印三个hellworld

// 字符串反转
function strReverse1(str) {
  let newStr = [...str];
  // newStr.reverse();
  // return newStr.join('');
  return newStr.reduce((acc, item, index) => {
    return (item += acc);
  }, "");
}
function strReverse2(str) {
  if (str.length <= 1) return str;
  return `${strReverse(str.slice(1))}${str[0]}`;
}

// 要求不用数学库，求 sqrt(2)精确到小数点后 10 位
function sqrt(num, smallNum = 10) {
  if (num < 0) return NaN;
  if (num === 0) return 0;
  // const diff = Math.pow(0.1, smallNum);
  let diff = 0;
  if (smallNum >= 1) {
    diff = +`0.${"0".repeat(smallNum - 1)}1`;
  }
  let left = 0;
  let right = num;
  let mid = num >> 1;

  while (Math.abs(+(num - mid * mid).toFixed(smallNum)) > diff) {
    if (num > mid * mid) {
      left = mid;
    } else {
      right = mid;
    }
    mid = left + (right - left) / 2.0;
  }

  return +mid.toFixed(smallNum);
}

// 判断一个字符串是否另一个字符串的子串
function isSubStr(subStr, str) {
  // return str.includes(subStr); // indexOf
  let subLen = subStr.length;
  let i = 0;
  while (i < str.length) {
    let start = i;
    let j = 0;
    while (j < subLen && str[start] === subStr[j]) {
      j++;
      start++;
    }
    if (j === subLen) {
      return true;
    }
    i++;
  }

  return false;
}

// 判断subStr是否是str的子序列
function isSequence(subStr, str) {
  let i = 0;
  let j = 0;
  while (i < subStr.length && j < str.length) {
    if (subStr[i] === str[j]) i++;
    j++;
  }

  return i === subStr.length;
}

// 实现一个极简的模板引擎
function render(str, obj = {}) {
  return str.replace(/\{\{[a-zA-Z\s]+?\}\}/g, function (match) {
    // console.log(match.slice(2, -2).trim())
    return obj[match.slice(2, -2).trim()];
  });
}
render(`<p style="color: red;"><b>我是{{name }}</b>，年龄{{age}}</p>`, {
  name: "fanerge",
  age: 17,
});

// 实现一个极简的数据响应式
// 有一个全局变量 a，实现一个方法bindData，执行后，a中任何属性值修改都会触发console
var a = {
  b: 1,
};

function bindData(oldObj) {
  return new Proxy(oldObj, {
    set(target, key, val, receiver) {
      console.log(`对象的${key}属性发生变化`);
      // target[key] = val;
      Reflect.set(target, key, val);
      // 实际应该触发对应相应的组件更新
    },
  });
}
// var proxy = bindData(a);
// 此时输出 a的值发生改变
// proxy.b = 2;

// 金额转大写（中文）
function currencyFormatChinese(currencyDigits) {
  // Constants:
  var MAXIMUM_NUMBER = 99999999999.99;
  // Predefine the radix characters and currency symbols for output:
  var CN_ZERO = "零";
  var CN_ONE = "壹";
  var CN_TWO = "贰";
  var CN_THREE = "叁";
  var CN_FOUR = "肆";
  var CN_FIVE = "伍";
  var CN_SIX = "陆";
  var CN_SEVEN = "柒";
  var CN_EIGHT = "捌";
  var CN_NINE = "玖";
  var CN_TEN = "拾";
  var CN_HUNDRED = "佰";
  var CN_THOUSAND = "仟";
  var CN_TEN_THOUSAND = "万";
  var CN_HUNDRED_MILLION = "亿";
  var CN_SYMBOL = "";
  var CN_DOLLAR = "元";
  var CN_TEN_CENT = "角";
  var CN_CENT = "分";
  var CN_INTEGER = "整";

  // Variables:
  var integral; // Represent integral part of digit number.
  var decimal; // Represent decimal part of digit number.
  var outputCharacters; // The output result.
  var parts;
  var digits, radices, bigRadices, decimals;
  var zeroCount;
  var i, p, d;
  var quotient, modulus;

  // Validate input string:
  currencyDigits = currencyDigits.toString();
  if (currencyDigits == "") {
    return "";
  }
  if (currencyDigits.match(/[^,.\d]/) != null) {
    return "";
  }
  if (
    currencyDigits.match(
      /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/
    ) == null
  ) {
    return "";
  }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
  currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
    return "";
  }

  // Process the coversion from currency digits to characters:
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split(".");
  if (parts.length > 1) {
    integral = parts[0];
    decimal = parts[1];
    // Cut down redundant decimal digits that are after the second.
    decimal = decimal.substr(0, 2);
  } else {
    integral = parts[0];
    decimal = "";
  }
  // Prepare the characters corresponding to the digits:
  digits = new Array(
    CN_ZERO,
    CN_ONE,
    CN_TWO,
    CN_THREE,
    CN_FOUR,
    CN_FIVE,
    CN_SIX,
    CN_SEVEN,
    CN_EIGHT,
    CN_NINE
  );
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
  decimals = new Array(CN_TEN_CENT, CN_CENT);
  // Start processing:
  outputCharacters = "";
  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
    zeroCount = 0;
    for (i = 0; i < integral.length; i++) {
      p = integral.length - i - 1;
      d = integral.substr(i, 1);
      quotient = p / 4;
      modulus = p % 4;
      if (d == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          outputCharacters += digits[0];
        }
        zeroCount = 0;
        outputCharacters += digits[Number(d)] + radices[modulus];
      }
      if (modulus == 0 && zeroCount < 4) {
        outputCharacters += bigRadices[quotient];
        zeroCount = 0;
      }
    }
    outputCharacters += CN_DOLLAR;
  }
  // Process decimal part if there is:
  if (decimal != "") {
    for (i = 0; i < decimal.length; i++) {
      d = decimal.substr(i, 1);
      if (d != "0") {
        outputCharacters += digits[Number(d)] + decimals[i];
      }
    }
  }
  // Confirm and return the final output string:
  if (outputCharacters == "") {
    outputCharacters = CN_ZERO + CN_DOLLAR;
  }
  if (decimal == "") {
    outputCharacters += CN_INTEGER;
  }
  outputCharacters = CN_SYMBOL + outputCharacters;
  return outputCharacters;
}


// 将数组转化为树
function array2Tree(ary) {
  let map = new Map()
  // 转化为以 id 为key item 为 value 的对象
  /**
   * {
   *  0: {id: 0, pid: -1},
   *  1: {id: 1, pid: 0},
   *  2: {id: 2, pid: 0}
   * }
   */
  ary.forEach(item => map.set(item.id, item));

  let tree = null;
  ary.forEach((item) => {
    if (map.has(item.pid)) {
      let parentNode = map.get(item.pid);
      if (!Array.isArray(parentNode.children)) {
        parentNode.children = []
      }
      if (!parentNode.children.some(o => o.id === item.id)) {
        parentNode.children.push(map.get(item.id));
      }
    } else {
      // root
      tree = item;
    }
  });

  return tree;
}
// var ssss = [{id: 0, pid: -1}, {id: 1, pid: 0}, {id: 2, pid: 0}, {id: 3, pid: 1}, {id: 4, pid: 2}, {id: 5, pid: 4}];
// console.log(array2Tree(ssss))

// 从树中找出父路径
function findParentId(tree) {
  let map = new Map();
  return (id) => {
    if (map.has(id)) return map.get(id)
    function dfs(node, map, ary = []) {
      console.log('dfs')
      if (!node) {
        return;
      }
      if (!map.has(node.id)) {
        map.set(node.id, ary)
      }
      let list = map.get(node.id);
      list.push(node.id)
      if (Array.isArray(node.children)) {
        node.children.forEach(item => {
          dfs(item, map, list.slice(0))
        })
      }
    }
    dfs(tree, map, [])
    return map.get(id);
  }
}
var testObj = {
  "id": 0,
  "pid": -1,
  "children": [
    {
      "id": 1,
      "pid": 0,
      "children": [
        {
          "id": 3,
          "pid": 1
        }
      ]
    },
    {
      "id": 2,
      "pid": 0,
      "children": [
        {
          "id": 4,
          "pid": 2,
          "children": [
            {
              "id": 5,
              "pid": 4
            }
          ]
        }
      ]
    }
  ]
}
// var tree2Map = findParentId(testObj)
// window.tree2Map = tree2Map;
// console.log(tree2Map(4))

// 递归实现数字翻转
function reverseNum(num) {
  function rec(n) {
    const str = n.toString()
    if (str.length === 1) {
      return n;
    }
    return `${str.slice(-1)}${+rec(str.slice(0, -1))}`
  }

  return rec(num)
}
// console.log(reverseNum(123456))

// 实现XPath
// 实现一个函数，生成某个DOM元素的xpath，主要包含两部分：标签层级和兄弟元素中的顺序。
// body>div[0]>main[0]>header[0]>div[0]
function getXPath(dom) {
  return findParent(dom, '')
}

function findParent(dom, path = '') {
  if (dom === document.body) {
    return path === '' ? 'body' : `body>${path}`
  }
  let parentNode = dom.parentNode;
  let tagName = dom.tagName.toLowerCase();
  let index = [...parentNode.children].findIndex(item => item === dom)
  if (path !== '') {
    path = `>${path}`
  }
  path = `${tagName}[${index}]${path}`
  return findParent(parentNode, path)
}

// 获取页面所有的 tagname
// [...new Set([...document.querySelectorAll('*')].map(item => item.tagName.toLowerCase()))]
