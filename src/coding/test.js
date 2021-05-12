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

  const tempFunc = function (...args2) {
    let key = Symbol('func');
    ctx[key] = func;
    let res = ctx[key](...args1, ...args2);
    delete ctx[key];
    return res;
  }
  // 支持 new 调用方式
  tempFunc.prototype = Object.create(fn.prototype);

  return tempFunc;
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
// pipe
// Scheduler
// EventEmitter
// LRUCache
// flatArray
// lensProp
// formatMoney
// mergeSort
// quickSort
// renderTemplate
