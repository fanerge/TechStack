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
    console.log(res);
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
