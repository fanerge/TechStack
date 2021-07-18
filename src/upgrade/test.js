// [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code/tree/master/snippets)

// cloneDeep
//#region 
export function isComplexType(type) {
  return typeof type === 'object' && type !== null || typeof type === 'function';
};
export function cloneDeep(val, hash = new WeakMap()) {
  if (!isComplexType(val)) {
    return val;
  }
  // loop ref
  if (hash.has(val)) {
    return hash.get(val);
  }
  // date\regexp\function 需要特殊处理
  let constructor = val.constructor;
  let newVal = new constructor();
  if (constructor === Date) {
    newVal = new Date(val);
  }
  if (constructor === RegExp) {
    newVal = new RegExp(val.source, val.flags);
  }
  if (constructor === Set) {
    newVal = new Set(val.values());
  }
  if (constructor === Map) {
    newVal = new Map(val.entries());
  }
  // 设置原型（新对象可以使用其原型上的方法）
  Object.setPrototypeOf(newVal, Object.getPrototypeOf(val))
  hash.set(val, newVal);
  // Object.getOwnPropertyNames\Object.getOwnPropertySymbols
  Reflect.ownKeys(val).forEach((key) => {
    if (isComplexType(val[key])) {
      newVal[key] = cloneDeep(val[key], hash);
    } else {
      // newVal[key] = val[key];
      Object.defineProperty(newVal, key, Object.getOwnPropertyDescriptor(val, key));
    }
  });

  return newVal;
}
function cloneDeep2(data) {
  return new Promise((resolve, reject) => {
    // 不能有function
    let { port1, port2 } = new MessageChannel();
    port1.postMessage(data);
    port2.onmessage = function (e) {
      resolve(e.data);
    }
  });
}
// test
let obj1 = { name: '我是一个对象', id: 1 };
Object.setPrototypeOf(obj1, {
  getVal: function (val) {
    console.log(this);
  }
});
let obj = {
  num1: new Number(1),
  num: 0,
  str: '',
  set: new Set([12, 3]),
  map: new Map([[1, 2], [3, 4]]),
  boolean: true,
  unf: undefined,
  nul: null,
  obj: obj1,
  obj2: obj1,
  arr: [0, 1, 2],
  [Symbol('1')]: 1,
  date: new Date('Thu May 27 2020 21:33:24 GMT+0800'),
  regExp: /\d+/img,
  func: function ss(a, b, c) {
    console.log(a + b + c)
  },
  func1: () => { }
};
Object.defineProperty(obj, 'innumerable', {
  enumerable: false, value: '不可枚举属性'
}
);
obj.loop = obj    // 设置loop成循环引用的属性
window.cloneDeep2 = cloneDeep2;
window.obj = obj;
var regx2 = cloneDeep(obj)
// console.log(cloneDeep(regx2));
//#endregion

// myCall
//#region 
Function.prototype.myCall = function (ctx, ...args) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let key = Symbol('func');
  ctx[key] = this;
  let res = ctx[key](...args);
  delete ctx[key];
  return res;
}

// test
let mycallObj = {
  name: 'yzf'
};
function myCallTest(age, address) {
  console.log(this.name + age + address)
}
// myCallTest.myCall(mycallObj, 12)
//#endregion

// myApply
//#region 
Function.prototype.myApply = function (ctx, args) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let key = Symbol('func');
  ctx[key] = this;
  let res = ctx[key](...args);
  delete ctx[key];
  return res;
}
// test
// myCallTest.myApply(mycallObj, [12, 'sichuan']);
//#endregion

// myBind
//#region 
Function.prototype.myBind = function (ctx, ...args1) {
  let lists = [null, undefined];
  if (lists.includes(ctx)) {
    ctx = globalThis;
  }
  ctx = Object(ctx);
  let that = this;
  function tempFn(...args2) {
    let key = Symbol('key');
    // new.target
    if (this instanceof tempFn) {
      this[key] = that;
      let res = this[key](...args1, ...args2);
      delete this[key];
      return res;
      // return that.call(this, ...args1, ...args2);
    } else {
      ctx[key] = that;
      let res = ctx[key](...args1, ...args2);
      delete ctx[key];
      return res;
      // return that.call(ctx, ...args1, ...args2);
    }
  }

  // new 调用
  tempFn.prototype = this.prototype;
  return tempFn;
}
// test
// window.name = 'fanerge'
// var obj11 = { name: 'inner' }
// myCallTest.myBind()(12, 'wanyuan')
// myCallTest.bind(null)(12, 'wanyuan')

// new 测试
// var p1 = Person.myBind()
// var p11 = new p1(1, 2);
// var p2 = Person.bind()
// var p22 = new p2(1, 2)
// console.log(p11 instanceof Person)
// console.log(p22 instanceof Person)
//#endregion

// this 指向优先级
//#region
// 1.new 调用优先级最高
// 2.bind（硬绑定）和显示绑定
// 3.隐式绑定如，对象上的方法
// 4.默认绑定
//#endregion

// throttle
//#region 
function throttle(fn, ms, immediate) {
  let last = null;
  return function (...args) {
    let now = Date.now();
    // first
    if (last === null && immediate) {
      fn.apply(this, args);
      last = Date.now();
      return;
    }
    if (last === null) {
      last = Date.now();
      return;
    }

    if (now - last >= ms) {
      fn.apply(this, args);
      last = Date.now();
    }
  }
}
// TODO test, this
function proxyThrottle(fn, ms, immediate) {
  let last = null;
  let tempFn = new Proxy(fn, {
    apply(target, thisArg, args) {
      let now = Date.now();
      if (last === null && immediate) {
        target.apply(thisArg, args)
        last = Date.now();
        return;
      }
      if (last === null) {
        last = Date.now();
        return;
      }
      if (now - last >= ms) {
        target.apply(thisArg, args)
        last = Date.now();
      }
    }
  })
  return tempFn;
}
window.proxyThrottle = proxyThrottle;
// test
// $0.addEventListener('click', proxyThrottle(function () { console.log(this) }, 2000))
//#endregion

// debounce
//#region
function debounce(fn, ms, immediate) {
  let timerId = null;
  let tempFn = function (...args) {
    if (timerId === null && immediate) {
      fn.apply(this, args);
      // 产生一个无用的id
      timerId = setTimeout(() => { }, ms);
      return;
    }
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  }
  return tempFn;
}
function proxyDebounce(fn, ms, immediate) {
  let timerId = null;
  let tempFn = new Proxy(fn, {
    apply(target, thisArg, args) {
      if (timerId === null && immediate) {
        target.apply(thisArg, args);
        timerId = setTimeout(() => { })
        return;
      }
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        target.apply(thisArg, args);
      }, ms);
    }
  })

  return tempFn;
}
window.debounce = debounce
window.proxyDebounce = proxyDebounce
// test
// $0.addEventListener('mousemove', proxyDebounce(function () { console.log(this) }, 2000))
// var fn = debounce(function (e) { console.log(e) }, 2000)
// $0.addEventListener('click', fn)
//#endregion

// mockNew
//#region 
function mockNew(fn, ...args) {
  let obj = Object.create(fn.prototype)
  let res = fn.apply(obj, args);
  if (typeof res === 'object' && res !== null || typeof res === 'function') {
    return res;
  }
  return obj;
}
// test
function Person(name, age, sex) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name);
}
let mockN = mockNew(Person, 'yzf', '29')
// console.log(mockN.sayName());
//#endregion

// mockInstanceOf
//#region
function mockInstanceOf(left, right) {
  if (typeof left !== 'object' || left === null) {
    throw new Error('left 必须为对象');
  }
  if (typeof right !== 'function') {
    throw new Error('right 必须为函数');
  }

  let leftProto = Object.getPrototypeOf(left);
  while (leftProto) {
    if (leftProto === right.prototype) {
      return true;
    }
    leftProto = Object.getPrototypeOf(leftProto)
  }
  return false;
}
// console.log(mockInstanceOf(Object.create(null), Object));
//#endregion

// curry
//#region 
function curry(fn) {
  return function inner(...args1) {
    return fn.length <= args1.length ?
      fn.call(null, ...args1) :
      (...args2) => inner.call(null, ...args1, ...args2);
  }
}
function curryAdd(a, b, c) {
  return a + b + c;
}
// console.log(curry(curryAdd)(1)(2)(3));
//#endregion

// compose
//#region 
function compose(...fns) {
  return function (arg) {
    if (arg === undefined || arg === null) return
    if (fns.length > 0 && fns.every(fn => typeof fn === 'function')) {
      return fns.reduceRight((pre, fn) => {
        return fn(pre)
      }, arg);
    }
  }
}
var funs = compose((a) => a + 11, (b) => b * 2, (c) => c + 5)
// console.log(funs(10));
//#endregion

// pipe
//#region 
function pipe(...fns) {
  return function (arg) {
    return fns.reduce((res, fn) => {
      return fn(res);
    }, arg);
  }
}
var funs = pipe((a) => a + 11, (b) => b * 2, (c) => c + 5);
// console.log(funs(2));
//#endregion

// Scheduler
//#region 
class Scheduler {
  constructor(size) {
    this.size = size;
    this.queue = [];
    this.num = 0;
  }

  async add(genPromise) {
    if (this.num >= this.size) {
      // 到达阈值了
      await new Promise((resolve, reject) => {
        this.queue.push(resolve);
      })
    }
    this.num += 1;
    let res = await genPromise();
    this.num -= 1;
    if (this.queue.length > 0) {
      // resolve
      this.queue.shift()();
    }
    return res;
  }
}
// genPromiseTask
let scheduler = new Scheduler(2);
const timeout = (time) => new Promise((resolve, reject) => {
  setTimeout(resolve, time)
})
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}
// addTask(1000, '1')
// addTask(500, '2')
// addTask(300, '3')
// addTask(400, '4')
// addTask(100, '5')
// 2,3,4,1,5
//#endregion

//#region 
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
//#endregion

// EventEmitter
//#region 
class EventEmitter {
  constructor(limit = 10) {
    this.limit = limit;
    this.map = new Map();
  }
  on(type, fn) {
    const { limit, map } = this;
    let list = [];
    if (map.has(type)) {
      list = map.get(type);
    } else {
      map.set(type, list)
    }
    if (list.length >= limit) {
      return
    }
    list.push(fn)
  }

  once(type, fn) {
    const { limit, map } = this;
    let self = this;
    let tempFun = function (...args) {
      fn.apply(this, args)
      self.off(type, tempFun);
    }
    this.on(type, tempFun);
  }

  emit(type, ...args) {
    const { limit, map } = this;
    let list = map.get(type) || [];
    list.forEach(function (fn) {
      fn.apply(this, args);
    });
  }
  off(type, fn) {
    const { map } = this;
    if (!map.has(type)) {
      return;
    }
    if (fn) {
      let list = map.get(type);
      list = list.filter(item => item !== fn);
      map.set(type, list);
    } else {
      map.delete(type)
    }
  }


}
//#endregion

// LRUCache
//#region 
class LRUCache {
  constructor(limit = 10) {
    this.limit = limit;
    this.cache = new Map();
  }
  set(key, value) {
    const { limit, cache } = this;
    if (cache.has(key)) {
      cache.delete(key);
    }
    if (cache.size >= limit) {
      // rm first
      let firstKey = cache.keys().next().value
      cache.delete(firstKey);
    }
    cache.set(key, value);
  }
  get(key) {
    const { cache } = this;
    if (!cache.has(key)) {
      return null;
    }
    let res = cache.get(key);
    // 保证添加顺序在最后面
    cache.delete(key);
    cache.set(key, res);
    return res;
  }
}
var lru = new LRUCache(3);
// console.log(lru.cache)
//#endregion

// flatArray
//#region
function flatArray(ary, res = [], n = 1) {
  ary.forEach(item => {
    if (Array.isArray(item) && n > 0) {
      flatArray(item, res, n - 1);
    } else {
      res.push(item);
    }
  });

  return res;
}
function flatArray1(ary) {
  for (let i = 0; i < ary.length; i++) {
    if (Array.isArray(ary[i])) {
      ary.splice(i, 1, ...ary[i]);
      i--;
    }
  }
  return ary;
}
var ary = [1, 2, [3, [4, 5, [6, [7, 8]]]], 9, [10, [11, 12]], [[[13]]]];
// console.log(flatArray(ary, [], 4));
// console.log(flatArray1(ary, [], 4));
//#endregion

//#region 
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
//#endregion

//#region 
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
//#endregion

// lensProp
//#region 
function lensProp(obj = {}, path = '') {
  if (typeof obj !== 'object' || obj === null) {
    obj = {}
  }
  let props = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  for (let i = 0; i < props.length; i++) {
    if (typeof obj[props[i]] === 'undefined') {
      return void 0;
    } else {
      // debugger
      if (typeof obj[props[i]] === 'object' && obj !== null) {
        obj = obj[props[i]]
      } else {
        return i === props.length - 1 ? obj[props[i]] : void 0;
      }
    }
  }

  return obj;
}
var obj6 = {
  name: 'yzf',
  children: [{
    name: 'yy',
    age: 1,
    children: [
      {
        name: 'yyy',
        age: 1,
        children: []
      }
    ]
  }, {
    name: 'yy1',
    age: 8,
    children: []
  }],
  other: {
    year: 29
  }
}
// console.log(lensProp(obj6, 'children.0.name'));
// console.log(lensProp(obj6, 'children[0].children[0].name[0]'));
//#endregion

// formatMoney
//#region 
function formatMoney(num) {
  let str = num.toString();
  // front 12345678 -> 1,235,678
  // len = 8
  // TODO Object.is(Number('12s'), NaN )
  let [front, end] = str.split('.')
  let frontLen = front.length;
  let frontStr = [...front].reduceRight((acc, item, index) => {
    let curIndx = frontLen - index;
    if (curIndx % 3 === 0 && index !== 0) {
      acc = `,${item}` + acc;
    } else {
      acc = `${item}` + acc;
    }
    return acc;
  }, '')

  return `${frontStr}${end ? `.${end}` : ''}`
}
// console.log(formatMoney('13234242343453245345.123123'));
function formatMoney1(num) {
  let str = num.toString();
  let [front, end] = str.split('.')
  let frontStr = '';
  let len = front.length;
  [...front].reverse().forEach((item, index) => {
    let indexAdd1 = index + 1;
    if (indexAdd1 % 3 === 0 && indexAdd1 !== len) {
      frontStr = `,${item}` + `${frontStr}`;
    } else {
      frontStr = `${item}` + `${frontStr}`;
    }
  });
  return `${frontStr}${end ? `.${end}` : ''}`
}
// console.log(formatMoney1('323453245345.123123'));
//#endregion

// mergeSort
//#region 
function mergeSort(ary) {
  if (ary.length <= 1) {
    return ary;
  }
  let mid = Math.floor(ary.length / 2);
  let left = ary.slice(0, mid);
  let right = ary.slice(mid)

  return mergeSortHelper(mergeSort(left), mergeSort(right));
}
function mergeSortHelper(left, right) {
  let res = [];
  while (left.length > 0 && right.length > 0) {
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
var list = [1, 3, 2, 9, 6, 5, 1, 0, -2, 10]
// console.log(mergeSort(list))
//#endregion

// quickSort
//#region 
function quickSort(ary) {
  if (ary.length <= 1) {
    return ary;
  }
  // 取均分点可以随机一点
  let midIndex = Math.floor(ary.length / 2);
  let midVal = ary[midIndex];
  let left = [];
  let right = [];
  ary.forEach((item, index) => {
    if (index === midIndex) return;
    if (item <= midVal) {
      left.push(item);
    } else {
      right.push(item);
    }
  });

  return [...quickSort(left), midVal, ...quickSort(right)]
}
// console.log(quickSort(list))
//#endregion

// renderTemplate
//#region
function renderTemplate(template, obj = {}) {
  return template.replace(/{{[A-Z|a-z|\d\s]+}}/g, function (match) {
    return obj[match.slice(2).slice(0, -2).trim()]
  })
}
let str = renderTemplate(`<p style="color: red;"><b>我是{{name }}</b>，年龄{{age}}</p>`, {
  name: "fanerge",
  age: 17,
});
// console.log(str)
//#endregion

// Promise
//#region 
let pending = 'pending';
let resolved = 'resolved';
let rejected = 'rejected';
function MyPromise(constructor) {
  let that = this;
  this.status = pending;
  this.value = undefined;
  this.reason = undefined;
  // 支持异步
  this.onFulfilled = [];//成功的回调
  this.onRejected = []; //失败的回调

  function resolve(value) {
    if (that.status === pending) {
      that.value = value;
      that.status = resolved;
      that.onFulfilled.forEach(fn => {
        fn(that.value)
      })
    }
  }
  function reject(reason) {
    if (that.status === pending) {
      that.reason = reason;
      that.status = rejected;
      that.onRejected.forEach(fn => {
        fn(that.reason)
      })
    }
  }
  // 捕获构造异常
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
MyPromise.prototype.then = function (onResolved, onRejected) {
  if (this.status === resolved) {
    onResolved(this.value)
    return;
  }
  if (this.status === rejected) {
    onRejected(this.reason)
    return;
  }
  // 异步
  if (this.status === pending) {
    if (typeof onResolved === 'function') {
      this.onFulfilled.push(onResolved)
    }
    if (typeof onResolved === 'function') {
      this.onRejected.push(onRejected)
    }
  }
}

new MyPromise((resolve, reject) => {
  // resolve(1);
  setTimeout(() => {
    // reject(1)
  }, 1000);
}).then(res => console.log(res), (e) => { console.error(e) });
function genPromiseTask(num, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num);
    }, ms)
  });
}
// 异步串行1
function runPromiseByQueue(...funs) {
  funs.reduce((pre, cur, index) => {
    return pre.then((res) => {
      return cur(index);
    });
  }, Promise.resolve());
}
// runPromiseByQueue(genPromiseTask, genPromiseTask, genPromiseTask)
// 异步串行2
async function runPromiseByQueue1(...funs) {
  for (let i = 0; i < funs.length; i++) {
    await funs[i](i);
  }
}
// runPromiseByQueue1(genPromiseTask, genPromiseTask, genPromiseTask)

/**
 * Promise.all
 * 所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。
 * Promise.allSettled
 * allSettled 在所有给定的promise已被解析或被拒绝后解析，并且每个对象都描述每个promise的结果。
 * Promise.race
 * race 一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
 * Promise.any
 * any 只要其中的一个 promise 成功，就返回那个已经成功的 promise 。如果可迭代对象中没有一个 promise 成功（即所有的 promises 都失败/拒绝），就返回一个失败的 promise 和AggregateError类型的实例
 * Promise.prototype.finally
 */
//#endregion

// Promise.prototype.finally
//#region 
Promise.prototype.finally1 = function (callback) {
  return this.then((value) => {
    // resolved
    callback()
    return value;
  }, (reason) => {
    // rejected
    callback();
    throw reason
  });
}
// new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1000)
//   }, 1000);
// }).then(() => {
//   return '1111'
// }).finally1(() => {
//   // console.log('finally1');
//   setTimeout(() => {
//     console.log('finally1');
//   }, 500);
// }).then(() => {
//   console.log('done')
// })
//#endregion

// mySetInterVal
//#region 
class MySetInterVal {
  constructor(fn, a, b) {
    this.a = a;
    this.b = b;
    this.times = 0;
    this.timerId = null;
    this.fn = fn;
  }

  start() {
    const { a, b, times, fn } = this;
    this.timerId = setTimeout(() => {
      fn()
      console.log(a + times * b);
      this.times++;
      this.start();
    }, a + times * b);
  }
  stop() {
    const { timerId } = this;
    if (timerId) {
      clearTimeout(timerId);
      this.times = 0;
      this.timerId = null;
    }
  }
}
var setT = new MySetInterVal(() => { console.log('fn') }, 500, 1000)
// setT.start()
// setTimeout(() => {
//   setT.stop()
// }, 5000);
//#endregion

// 合并二维有序数组成一维有序数组，归并排序的思路
//#region
function mergeList(left, right) {
  let list = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      list.push(left.shift());
    } else {
      list.push(right.shift());
    }
  }
  return list.concat(left).concat(right);
}
function mergeArray(arr) {
  if (arr.length === 0) {
    return arr;
  }
  while (arr.length > 1) {
    let arr1 = arr.shift();
    let arr2 = arr.shift();
    let list = mergeList(arr1, arr2)
    arr.push(list)
  }

  return arr[0];
}
var arr1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 2, 3], [4, 5, 6]];
var arr2 = [[1, 4, 6], [7, 8, 10], [2, 6, 9], [3, 7, 13], [1, 5, 12]];
// console.log(mergeArray(arr2))
//#endregion

// 斐波那契数列
//#region 
//0, 1, 1, 2, 3, 5, 8, 13, 
function fib(n, cache = []) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  if (cache[n]) {
    return cache[n]
  } else {
    cache[n] = fib(n - 1, cache) + fib(n - 2, cache)
  }
  return cache[n];
}
function fibdp(n) {
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n]
}
// TODO 单个变量
// console.log(fib(5), fibdp(5));
//#endregion

// 手写数组转树
//#region 
var input = [
  {
    id: 1,
    val: "学校",
    parentId: null,
  },
  {
    id: 2,
    val: "班级1",
    parentId: 1,
  },
  {
    id: 3,
    val: "班级2",
    parentId: 1,
  },
  {
    id: 4,
    val: "学生1",
    parentId: 2,
  },
  {
    id: 5,
    val: "学生2",
    parentId: 3,
  },
  {
    id: 6,
    val: "学生3",
    parentId: 3,
  },
];
function array2Tree(arr) {
  let obj = arr.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  let root;
  arr.forEach(item => {
    if (item.parentId === null) {
      root = item;
      return;
    }
    let parentItem = obj[item.parentId];
    if (!Array.isArray(parentItem.children)) {
      parentItem.children = []
    }
    parentItem.children.push(item)
  });

  return root;
}
var test = array2Tree(input)
// console.log(test);
//#endregion

// 手写用 ES6proxy 如何实现 arr[-1] 的访问
//#region 
function proxyArray(arr) {
  return new Proxy(arr, {
    get(target, index) {
      index = +index
      let len = target.length;
      if (index < 0) {
        index = len + index;
      }
      return target[index]
    }
  });
}
var list = [0, 1, 2];
// console.log(proxyArray(list)[-1])
//#endregion

// 实现一个函数，接受函数数组参数，并执行，如果有一个函数返回结果是 string，数组剩余函数不执行，否则一直执行，
// 如果执行结果没有异步的函数，那么整个函数就是同步的。
//#region 
// const validator = combineValidators([
//   () => undefined,
//   () =>
//     new Promise(resolve => {
//       setTimeout(() => {
//         resolve('');
//       });
//     }),
//   () => 'eeeee',
// ])
// error = await validator('aaa', {});

function combineValidators(funs) {
  let num = 0;
  let len = funs.length;
  return function inner(value, allValue) {
    if (num >= len - 1) {
      return;
    }

    let curFn = funs[num++];
    let res = curFn(value, allValue);
    if (typeof res === 'string') {
      return res;
    }
    // TODO promise instanceof
    if (res && typeof res.then === 'function') {
      res.then(val => {
        res = val;
        inner(value, allValue);
      });
    } else {
      inner(value, allValue);
    }
  }
}
// var validator = combineValidators([
//   () => undefined,
//   () =>
//     new Promise(resolve => {
//       setTimeout(() => {
//         resolve('');
//       });
//     }),
//   () => 'eeeee',
// ])
// var error = validator('aaa', {});
// console.log(error)
//#endregion

// 反转链表
//#region 
var reverseList = function (head) {
  // 哨兵节点
  let sentry = new ListNode();

  while (head) {
    // 保留下一个节点的引用
    let rest = head.next;
    // 保留sentry 上已有的节点
    let old = sentry.next;
    // sentry 的首个节点的next指针指向当前节点
    sentry.next = head;
    // 当前节点的next指针需要指向原来sentry上已有的节点
    head.next = old;
    // 继续下一个节点处理
    head = rest;
  }
  return sentry.next;
};
//#endregion

// K 个一组翻转链表
//#region 
var reverseKGroup = function (head, k) {
  if (head === null) return head;
  let a = head;
  let b = head;
  for (let i = 0; i < k; i++) {
    if (b === null) {
      return a;
    }
    b = b.next;
  }

  let newHead = reverse(a, b);
  a.next = reverseKGroup(b, k)
  return newHead;
}
function reverse(a, b) {
  let sentry = new ListNode();
  while (a !== b) {
    let next = a.next;
    let old = sentry.next;
    sentry.next = a;
    a.next = old;
    a = next;
  }
  return sentry.next;
}
//#endregion



// 两个有序链表合并
//#region
var mergeTwoLists = function (l1, l2) {
  let sentry = new ListNode();
  let head = sentry;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      head.next = l1;
      l1 = l1.next;
    } else {
      head.next = l2;
      l2 = l2.next;
    }
    head = head.next;
  }
  if (l1) {
    head.next = l1;
  }
  if (l2) {
    head.next = l2;
  }

  return sentry.next;
};
//#endregion

// 两个链表的第一和公共节点
//#region 
var getIntersectionNode = function (headA, headB) {
  if (!headA && !headB) return null;
  let heada = headA;
  let headb = headB;
  while (heada !== headb) {
    heada = heada !== null ? heada.next : headB;
    headb = headb !== null ? headb.next : headA;
  }
  return heada;
};
//#endregion

// 链表是否有环
//#region 
var hasCycle = function (head) {
  if (head === null || head.next === null) return false;
  let slow = head;
  let fast = head.next;
  while (slow !== fast) {
    if (!fast || !fast.next) {
      return false;
    }
    slow = slow.next;
    fast = fast.next.next;
  }
  return true;
};
//#endregion

// 回文链表
//#region 
var isPalindrome = function (head) {
  let str = '';
  while (head !== null) {
    str += head.val;
    head = head.next;
  }
  let len = str.length;
  let i = 0;
  let j = len - 1;
  while (i < j) {
    if (str[i] !== str[j]) {
      return false;
    }
    i++;
    j--;
  }
  return true;
};
//#endregion

// JSONP 解决远程调用本地回调函数跨域的问题
//#region 
// Server端
// var express=require('express');
// var app=express();

// app.get('/jsonp',function(req = {},res,err){
//   if(err) {
//     throw new Error('***');
//   }
//   if(!req?.query?.jsoncallback) {
//     throw new Error('***');
//   }
//     const jsoncallback = req.query.jsoncallback
//     var data=[{"name":'yzf'}];
//     var result = `${jsoncallback}(${JSON.stringify(data)})`  
//     res.end(result);
// })
// app.listen('8001',(e) => {console.log(e)})

// Client端:
// <script type="text/javascript" src="https:/***/jsonp?jsoncallback=callbackFunction"></script>
// function callbackFunction(result){
//     // todo
//     console.log(result)
// }
// $.getJSON("http://10.232.36.110:10011?callback=?",{success: function(e) {console.log(e)}})
function getJSON(url) {
  var script = document.createElement('script');
  script.crossOrigin
  //  Access-Control-Allow-Origin script.crossOrigin 允许通过 window.onerror 去捕获错误
  script.setAttribute('src', url);
  document.head.appendChild(script);
  // 在 callbackFunction 执行完后应该移除 script
}
//#endregion

// ajax/promise
//#region 
function ajax(options = {}) {
  let {
    url,
    method = 'get',
    data = null,
    timeout = 10000,
    withCredentials = false,
    asyncM = true
  } = options;
  method = method.toUpperCase();
  if (!url) {
    throw new Error('url');
  }

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, asyncM);
    xhr.onreadystatechange = () => {
      const { readyState, status, responseText } = xhr;
      if (readyState === 4) {
        if (status >= 200 && status < 300) {
          resolve(responseText);
        } else if (status >= 400) {
          reject(xhr);
        }
      }
    }
    // 设置 RequestHeader
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // 设置超时时间
    // xhr.timeout = timeout
    // 用来指定跨域 Access-Control 请求是否应当带有授权信息，如 cookie 或授权 header 头
    // xhr.withCredentials = withCredentials;
    // xhr.abort() 如果请求已被发出，则立刻中止请求
    // 获取 ResponseHeader
    // xhr.getResponseHeader()、xhr.getAllResponseHeaders()
    // 支持的事件：onabort、onerror、onload、ontimeout、loadend(onabort、onerror、onload)
    xhr.send(data);
  });
}
//#endregion

// 两数之和
//#region 
var twoSum = function (nums, target) {
  // 空间换时间
  let map = new Map();
  for (let index = 0; index < nums.length; index++) {
    let item = nums[index];
    if (index === 0) {
      map.set(item, 0)
    } else {
      let diff = target - item;
      if (map.has(diff)) {
        return [map.get(diff), index]
      } else {
        map.set(item, index);
      }
    }
  }

  return [];
}
//#endregion

// 三数之和
//#region 
var threeSum = function (nums) {
  let list = quickSort(nums);
  let res = [];
  // i、j、k分别代表其下标
  for (let i = 0; i < list.length; i++) {
    // 需要和上次枚举的数不相同
    if (i > 0 && list[i] === list[i - 1]) {
      continue;
    }
    let k = list.length - 1;
    for (let j = i + 1; j < list.length; j++) {
      if (j > i + 1 && list[j] === list[j - 1]) {
        continue;
      }
      // 注意 j < k 不然会导致结果重复
      while (j < k && list[i] + list[j] + list[k] > 0) {
        k--;
      }
      if (j === k) {
        break;
      }
      if (list[i] + list[j] + list[k] === 0) {
        res.push([list[i], list[j], list[k]])
      }
    }
  }

  // 需要去重
  return res;
};
// console.log(threeSum([-1, 0, 1, 2, -1, -4]))
//#endregion

// N数之和
// TODO
// 从乱序且不重复数组中找出 N 个数的和为 M。
var arr =[1, 2, 3, 4, 5, 6, 7, 8]
function getSum(arr, N, M) {

  function backTrack(selectedArr) {
    // 
  }
}

// 找到所有出现两次的元素。 其中1 ≤ a[i] ≤ n （n为数组长度）
//#region 
var findDuplicates = function (nums) {
  let res = [];
  nums.forEach((item, index) => {
    let tempIndex = Math.abs(item) - 1;
    if (nums[tempIndex] < 0) {
      res.push(Math.abs(item));
    }
    if (nums[tempIndex] > 0) {
      nums[tempIndex] = - nums[tempIndex]
    }
  });

  return res;
};
// console.log(findDuplicates([4, 3, 2, 7, 8, 2, 3, 1]))
//#endregion

// 树的遍历
// 先序遍历
//#region 
function preTree(tree, res = []) {
  // 根左右
  if (tree === null) return;
  res.push(tree.val);
  preTree(tree.left, res);
  preTree(tree.right, res)
}
//#endregion

// canvas
//#region 
// var c = document.getElementById("myCanvas");
// var cxt = c.getContext("2d");
// ctx.fillStyle = 'red';
// ctx.rect(0, 0, 100, 50);    //仅仅是画出一个区域
// ctx.fillRect(x, y, width, height); // 完成并填充区域
// ctx.strokeRect(x, y, width, height); // 完成并对区域描边
// ctx.arc(100, 75, 50, 0, 2 * Math.PI);
// ctx.stroke();
//#endregion


// 字符串
// 最长回文子串
//#region 
// TODO
//#endregion

// 最长公共前缀
//#region 
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return '';
  if (strs.length === 1) return strs[0];
  let prefixStr = strs[0];
  for (let i = 1; i < strs.length; i++) {
    prefixStr = common(prefixStr, strs[i]);
    if (prefixStr === '') {
      break;
    }
  }

  return prefixStr;
};

function common(left, right) {
  let str = '';
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      str += `${left[i]}`
      i++;
      j++;
    } else {
      break;
    }
  }
  return str;
}
var strs = ["flower", "flow", "flight"]
// console.log(longestCommonPrefix(strs));
//#endregion

// 无重复字符的最长子串【双指针】
//#region 
var lengthOfLongestSubstring = function (s) {
  if (s === null) return null;
  if (s.length === 0) return '';
  let maxStr = '';
  let curStr = s[0];
  [...s.slice(1)].forEach(item => {
    // debugger
    let index = curStr.indexOf(item);
    if (index === -1) {
      curStr = `${curStr}${item}`;
    } else {
      curStr = `${curStr.slice(index + 1)}${item}`
    }

    if (curStr.length > maxStr.length) {
      maxStr = curStr;
    }
  });
  return Math.max(maxStr.length, curStr.length);
};
var s = "abcabcbb"
// console.log(lengthOfLongestSubstring(s));
//#endregion


// 数组问题
// 俄罗斯套娃信封问题【排序+最长上升子序列】
//#region 
// TODO
//#endregion

// 最长连续递增序列【快慢指针】
//#region
var findLengthOfLCIS = function (nums) {
  if (nums === null || nums.length === 0) return 0;
  let maxLen = 0;
  let curLen = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] < nums[i]) {
      curLen++;
    } else if (nums[i - 1] >= nums[i]) {
      // 以nums[i] 为第一个的递增序列
      curLen = 1;
    }
    maxLen = Math.max(maxLen, curLen)
  }

  return Math.max(maxLen, curLen);
};
// console.log(findLengthOfLCIS([1,3,5,4,7]))
//#endregion

// 最长连续序列
//#region 
var longestConsecutive = function (nums) {
  if (nums === null || nums.length === 0) return 0;
  let set = new Set(nums);
  let maxLen = 0;

  for (let num of set) {
    let curLen = 1;
    let curVal = num;
    if (!set.has(num - 1)) {
      while (set.has(curVal + 1)) {
        curLen++;
        curVal++;
      }
    }
    maxLen = Math.max(maxLen, curLen);
  }

  return maxLen;
};
// console.log(longestConsecutive([100, 4, 200, 1, 3, 2]));
//#endregion

// 【面试真题】盛最多水的容器【哈希表】
//#region 
var maxArea = function (height) {
  if (height === null || height.length < 2) return 0;
  let i = 0;
  let len = height.length;
  let j = len - 1;
  let max = 0;
  while (i < j) {
    let curHeight = Math.min(height[i], height[j]);
    let area = curHeight * (j - i)
    max = Math.max(max, area)
    // 移动短边才有可能获得更大面积
    if (height[i] < height[j]) {
      i++;
    } else {
      j--;
    }
  }

  return max;
};
// console.log(maxArea([1, 3, 2, 5, 25, 24, 5]));
//#endregion

// 寻找两个正序数组的中位数【双指针】
//#region 
var findMedianSortedArrays = function (nums1, nums2) {
  let mergeList = [];
  let i = 0;
  let j = 0;
  let m = nums1.length;
  let n = nums2.length;
  while (i < m && j < n) {
    // debugger;
    if (nums1[i] <= nums2[j]) {
      mergeList.push(nums1[i++]);
    } else {
      mergeList.push(nums2[j++]);
    }
  }

  mergeList = mergeList.concat(nums1.slice(i)).concat(nums2.slice(j))
  let len = mergeList.length;
  if (len === 0) return 0;
  if (len === 1) return mergeList[0];
  if (len % 2 === 0) {
    return (mergeList[Math.floor(len / 2) - 1] + mergeList[Math.floor(len / 2)]) / 2;
  } else {
    return mergeList[Math.floor(len / 2)]
  }
};
// console.log(findMedianSortedArrays([1, 3], [2]));
//#endregion

// 删除有序数组中的重复项
//#region
var removeDuplicates = function (nums) {
  if (nums === null || nums.length === 0) return 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i - 1] === nums[i]) {
      nums.splice(i--, 1);
    }
  }
  return nums.length;
};
// console.log(removeDuplicates([1, 1, 2]))
//#endregion

// 和为K的子数组
//#region 
var subarraySum = function (nums, k) {
  let res = 0;
  if (nums === null || nums.length === 0) return res;
  let pre = 0;
  let map = new Map([[0, 1]]);
  for (let num of nums) {
    pre += num;
    if (map.has(pre - k)) {
      res += map.get(pre - k)
    }
    if (map.has(pre)) {
      map.set(pre, map.get(pre) + 1);
    } else {
      map.set(pre, 1);
    }
  }

  return res;
};

// console.log(subarraySum([1, -1, 0], 0));
//#endregion


// 跳跃游戏【贪心算法
//#region 
var canJump = function (nums) {
  if (nums === null || nums.length === 0) return true;
  let to = 0; // 只能到达的最远距离
  for (let i = 0; i < nums.length; i++) {
    if (i > to) {
      return false;
    }
    to = Math.max(to, i + nums[i]);
  }
  return true;
};
var nums = [2, 3, 1, 1, 4];
// console.log(canJump(nums));
//#endregion

// 二叉树
// 二叉树的最近公共祖先
//#region 
var lowestCommonAncestor = function (root, p, q) {
  let res;
  // dfs 返回 boolean，表示p或q是否在该子树上
  const dfs = (node, p, q) => {
    if (node === null) return false;

    let lson = dfs(node.left, p, q);
    let rson = dfs(node.right, p, q);
    // 两种情况下公共祖先节点都为 node
    // 1. lson && rson 一个是lson的子节点一个是rson的子节点
    // 2. (node.val === p.val || node.val === q.val) && (lson || rson)，node节点是pq其中节点，另一个p或q是在lsonherson的子节点
    if (lson && rson || (node.val === p.val || node.val === q.val) && (lson || rson)) {
      res = node;
    }
    return lson || rson || node.val === p.val || node.val === q.val;
  }
  dfs(root, p, q);

  return res;
};
// console.log(lowestCommonAncestor([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1));
//#endregion

// 二叉搜索树中的搜索
//#region
var searchBST = function (root, val) {
  let res = null;
  function preTrace(node) {
    // roo left right
    if (node === null) return;
    // 利用二叉树的性质，leftVal < nodeVal && rightVal > nodeVal
    if (node.val === val) {
      res = node;
    } else if (node.val > val) {
      preTrace(node.left);
    } else if (node.val < val) {
      preTrace(node.right);
    }
  }
  preTrace(root);
  return res;
};
//#endregion

// 删除二叉搜索树中的节点
//#region 
var deleteNode = function (root, key) {
  if (!root) return null;
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    // 找到要删除的节点
    // 如果被删除节点是 leaf, 直接删除
    if (!root.left && !root.right) {
      return null;
    }
    // 如果被删除节点 只有一个child, 使用仅有的 child 代替原节点
    if (root.left && !root.right) {
      return root.left;
    }
    if (root.right && !root.left) {
      return root.right;
    }
    // 如果被删除节点 有两个children, 则在 right subtree中 寻找 successor, 将原节点值替换为 successor 的值, 并递归删除 successor, 将问题转化为 情况1 或 情况2.
    if (root.left && root.right) {
      // TODO 思考？
      let ancestor = root;
      let successor = root.right;
      while (successor.left) {
        ancestor = successor;
        successor = successor.left;
      }
      root.val = successor.val;
      if (successor == ancestor.right) {
        ancestor.right = deleteNode(successor, successor.val);
      } else {
        ancestor.left = deleteNode(successor, successor.val);
      }
    }
  }

  return root;
};
//#endregion

// 编程题
//#region 
var list = [['热', '冷', '冰'], ['大', '中', '小'], ['重辣', '微辣'], ['重麻', '微麻']];
function genCate(list) {
  let res = [];
  // 方法1 暴力枚举常规方式
  // list[0].forEach(item0 => {
  //   list[1].forEach(item1 => {
  //     list[2].forEach(item2 => {
  //       list[3].forEach(item3 => {
  //         res.push(`${item0}+${item1}+${item2}+${item3}`);
  //       })
  //     })
  //   })
  // });
  // 方法2 递归
  repeat(list, res, [])
  function repeat(list, res, vals) {
    list[0].forEach(item => {
      let allVals = vals.concat(item);
      if (list.length === 1) {
        res.push(allVals.join('+'));
      } else {
        repeat(list.slice(1), res, allVals);
      }
    })
  }
  // console.log(res);
  // 方法3 循环
  // var res = list.reduce((result, property) => {
  //   // 循环属性的每一个值
  //   return property.reduce((acc, value) => {
  //     return acc.concat(result.map(ele => [].concat(ele, value)));
  //   }, []);
  // });
  // return res.map(arr => arr.join('+'))
}
//console.log(genCate(list));
//#endregion

// 求区间问题，给定一有序数组，求其中某重复元素的区间（也即求区间的左右边界位置）。
//#region 
var list = [1, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6]
function leftIndex(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    if (ary[mid] < target) {
      left = mid + 1;
    } else if (ary[mid] > target) {
      right = mid - 1;
    } else if (ary[mid] === target) {
      right = mid - 1;
    }
  }
  if (ary[left] === target) {
    return left;
  }
  if (ary[left + 1] === target) {
    return left + 1;
  }
  return -1;
}
function rightIndex(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    if (ary[mid] < target) {
      left = mid + 1;
    } else if (ary[mid] > target) {
      right = mid - 1;
    } else if (ary[mid] === target) {
      left = mid + 1;
    }
  }
  if (ary[left] === target) {
    return left;
  }
  if (ary[left - 1] === target) {
    return left - 1;
  }
  return -1;
}
function solution(ary, target) {
  let left = leftIndex(ary, target);
  if (left === -1) {
    return [-1, -1]
  }
  let right = rightIndex(ary, target);
  return [left, right]
}
// console.log(solution(list, 4));
//#endregion

// 抽奖
// 请实现抽奖函数rand，保证随机性，输入为表示对象数组，对象有属性n表示人名，w表示权重，随机返回一个中奖人名，中奖概率和w成正比
//#region 
let peoples = [
  { n: "p1", w: 100 },
  { n: "p2", w: 200 },
  { n: "p3", w: 1 },
];

function rand1(peoples) {
  let count = peoples.reduce((acc, item) => {
    acc += item.w;
    return acc;
  }, 0)
  let wp = 1 / count;
  let num = Math.random(); // [0,1)
  let init = 0;
  let ps = peoples.map((item, index) => {
    let temp = item.w * wp + init;
    console.log(`第${index + 1}个用户随机数区间：${init}-${temp}`);
    init = temp;
    return temp
  })
  console.log(ps)
  let index = ps.findIndex((item, index) => num < item);
  return peoples[index]
}
// console.log(rand1(peoples))
//#endregion


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

// 控制动画间隔
let start = null;
function animate(interval = 1000) {
  requestAnimationFrame(function demo(t) {
    if(!start) {
      start = t;
    }
    if(t-start >= interval) {
      console.log('1s');
      start = t;
    }
    requestAnimationFrame(demo)
  });
}

function Animate() {
  this.lastTime = null;
  this.timerId = null;
}
Animate.prototype.start = function(fn, interval = 1000) {
  let {lastTime} = this;
  this.timerId = requestAnimationFrame(function demo(t) {
    if(!lastTime) {
      lastTime = t;
    }
    if(t-lastTime >= interval) {
      fn();
      lastTime = t;
    }
    requestAnimationFrame(demo)
  });
} 
Animate.prototype.stop = function() {
  cancelAnimationFrame(this.timerId)
} 
