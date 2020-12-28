/**class 实现私有属性 */
// 类似如下效果
// class ClassA {
//   #a;
//   constructor(a, b) {
//     this.#a = a;
//     this.b = b;
//   }

//   getA() {
//     console.log(this.#a);
//     return this.#a;
//   }
// }
// 约定命名(下划线为私有属性)

// 闭包+Symbol
let ClassA = (function () {
  let privateProp = Symbol('private');
  class ClassA {
    constructor(x) {
      this[privateProp] = x;
    }
    getX() {
      console.log(this[privateProp])
      return this[privateProp];
    }
  }
  return ClassA;
})()
// 小问题，可以通过Object.getOwnPropertySymbols(aa) 拿到 symbol
// test
// let aa = new ClassA('aa');
// console.log(aa[Object.getOwnPropertySymbols(aa)[0]]);

// 闭包+WeakMap

let ClassB = (function () {
  let map = new WeakMap();
  class ClassB {
    constructor(x) {
      map.set(this, x)
    }
    getX() {
      console.log(map.get(this));
      return map.get(this);
    }
  }
  return ClassB;
})()

// 小问题，只能添加一个私有属性
// let bb = new ClassB('bbb');
// console.log(bb.getX());


// 时针和分针的夹角？
export function calcAngle(h, m) {
  if (h < 24 && m < 60) {
    // 分别计算与0的夹角
    // 1小时 30 度，1分钟再走 0.5 度。
    const hAngle = h % 12 * 30 + m * 0.5;
    const mAngle = m * 6;
    const res = Math.abs(hAngle - mAngle);
    return res;
  }
}
// calcAngle(12, 1)


// LRU 算法
/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

export class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key) {
    const cache = this.cache;
    if (cache.has(key)) {
      let oldVal = cache.get(key);
      cache.delete(key);
      cache.set(key, oldVal);
      return oldVal;
    }
    return null;
  }

  put(key, value) {
    const { cache, capacity } = this;
    const size = cache.size;
    // key已存在了
    if (this.cache.has(key)) {
      cache.delete(key);
      cache.set(key, value);
    } else {
      if (size < capacity) {
        cache.set(key, value);
      } else {
        // rm first and put
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
        cache.set(key, value);
      }
    }
  }
}
// 发布-订阅
// https://zhuanlan.zhihu.com/p/77876876
// TODO 大的 maxCapacity
export class MyEventEmitter {
  constructor() {
    this.eventMap = {};
  }

  on(type, handler) {
    const { eventMap } = this;
    if (!type || !handler) {
      throw Error('type, handler 为必填参数');
    }
    if (typeof handler !== 'function') {
      throw Error('handler 参数必须为 function');
    }
    if (!Array.isArray(eventMap[type])) {
      eventMap[type] = [];
    }
    // 是否已经存在
    if (eventMap[type].includes(handler)) {
      return
    }
    eventMap[type].push(handler);
  }

  // once方法是on方法和off方法的结合
  once(type, handler) {
    const self = this;
    if (!type || !handler) {
      throw Error('type, handler 为必填参数');
    }
    if (typeof handler !== 'function') {
      throw Error('handler 参数必须为 function');
    }

    // 重点
    function tempHandler() {
      var args = Array.prototype.slice.call(arguments);
      handler.apply(null, args);
      self.off(type, tempHandler);
    }
    this.on(type, tempHandler);
  }

  emit(type, ...params) {
    if (!type) {
      throw Error('type 为必填参数');
    }
    const { eventMap } = this;
    const list = eventMap[type];
    list.forEach(func => {
      func.apply(null, params);
    });
  }

  off(type, handler) {
    const { eventMap } = this;
    if (!type) {
      throw Error('type 为必填参数');
    }
    const list = eventMap[type]
    if (type && handler) {
      let index = list.indexOf(handler);
      if (index > -1) {
        list.splice(index, 1)
      }
    } else {
      eventMap[type] = [];
    }
  }
}

// test
// let eventEmitter = new MyEventEmitter();
// eventEmitter.once('eat', (a) => {
//   console.log('eat', a)
// })

// eventEmitter.emit('eat', 'sd')
// console.log(eventEmitter)

// 递归的函数如何非递归表达？改写斐波那契数列第 N 项目
function fib(n) {
  if(n === 0 || n === 1) {
    return n;
  }
  return fib(n-1) + fib(n-2);
}

function fib2(n){
  const Down = 1;
  const Up = 2;
  // stack
  // stack中每一项是一个Record {num, phase}
  // num 代表当前 n，phase 代表当前递归方向（down=1代表向下，up=2代表向上）
  let stack = [];

  stack.push({
    num: n,
    phase: Down
  });

  // 循环进不去呀？？
  while(stack.length > 1) {
    let {num, phase} = stack.pop();
    if(phase === Down) {
      if(n === 1 || n === 2) {
        // 不需要循环了
        stack.push({
          num: 1, 
          phase: ''
        });
        continue;
      }
      stack.push({
        num: num - 1,
        phase: Down,
      });
      stack.push({
        num: num - 1,
        phase: Up,
      });
    }else {
      const last1 = stack.pop();
      const last2 = stack.pop();
      stack.push({
        num: last1.num + last2.num,
        phase: Up,
      });
    }
  }

  return stack.pop()['num']
}

console.log('fib', fib(2))
console.log('fib2', fib2(5))
