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
  ctx.func = this;
  let res = ctx.func(...args);
  delete ctx.func;
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
  ctx.func = this;
  let res = ctx.func(...args);
  delete ctx.func;
  return res;
}
// test
// myCallTest.myApply(mycallObj, [12, 'sichuan']);
//#endregion

// myBind
//#region 
Function.prototype.myBind = function (ctx, ...args1) {
  ctx = ctx || globalThis;
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
// myCallTest.myBind(mycallObj)(12, 'wanyuan')
//#endregion

// throttle
// debounce
// mockNew
// mockInstanceOf
// curry
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
