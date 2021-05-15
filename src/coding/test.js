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
  let newVal;
  if (constructor === Date) {
    newVal = new Date(val);
  } else if (constructor === RegExp) {
    newVal = new RegExp(val);
  } else if (constructor === Function) {
    newVal = new Function(`return ${val.toString()}`);
  } else {
    newVal = new constructor();
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
// test
let obj1 = { name: '我是一个对象', id: 1 };
Object.setPrototypeOf(obj1, {
  getVal: function (val) {
    console.log(this);
  }
});
let obj = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: obj1,
  obj2: obj1,
  arr: [0, 1, 2],
  [Symbol('1')]: 1,
  date: new Date(),
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
// console.log(cloneDeep(obj));
//#endregion

// myCall
//#region 
Function.prototype.myCall = function (ctx, ...args) {
  // if (ctx === undefined) {
  //   ctx = typeof window === 'undefined' ? global : window;
  // }
  ctx = ctx || globalThis;
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
  // if (ctx === undefined) {
  //   ctx = typeof window === 'undefined' ? global : window;
  // }
  ctx = ctx || globalThis;
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
  if (ctx === undefined) {
    ctx = typeof window === 'undefined' ? global : window;
  }
  if (typeof ctx !== 'object' || ctx === null) {
    ctx = Object(ctx);
  }
  // ctx = ctx || globalThis;
  let func = this;

  return function (...args2) {
    let key = Symbol('func');
    ctx[key] = func;
    let res = ctx[key](...args1, ...args2);
    delete ctx[key];
    return res;
  }
}
// test
// window.name = 'fanerge'
// myCallTest.myBind()(12, 'wanyuan')
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
    if (last === null && !immediate) {
      last = Date.now();
      return;
    }

    if (now - last >= ms) {
      fn.apply(this, args);
      last = Date.now();
    }
  }
}
// test
// $0.addEventListener('click', throttle(function () { console.log(this) }, 200))
//#endregion

// debounce
//#region
function debounce(fn, ms, immediate) {
  let timerId = null;
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (timerId === null && immediate) {
      fn.apply(this, args);
      // 产生一个无用的id
      timerId = setTimeout(() => { }, ms);
      return;
    }

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  }
}
// test
// $0.addEventListener('mousemove', debounce(function () { console.log(this) }, 2000))
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
//#endregion

// lensProp
// formatMoney
// mergeSort
// quickSort
// renderTemplate




// Promise
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
