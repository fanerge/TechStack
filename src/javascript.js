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

// 发布-订阅
// https://zhuanlan.zhihu.com/p/77876876
// TODO 大的 maxCapacity
export class MyEventEmitter{
  constructor() {
    this.eventMap = {};
  }

  on(type, handler) {
    const {eventMap} = this;
    if(!type || !handler) {
      throw Error('type, handler 为必填参数');
    }
    if(typeof handler !== 'function') {
      throw Error('handler 参数必须为 function');
    }
    if(!Array.isArray(eventMap[type])) {
      eventMap[type] = [];
    }
    // 是否已经存在
    if(eventMap[type].includes(handler)) {
      return 
    }
    eventMap[type].push(handler);
  }

  // once方法是on方法和off方法的结合
  once(type, handler) {
    const self = this;
    if(!type || !handler) {
      throw Error('type, handler 为必填参数');
    }
    if(typeof handler !== 'function') {
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
    if(!type) {
      throw Error('type 为必填参数');
    }
    const {eventMap} = this;
    const list = eventMap[type];
    list.forEach(func => {
      func.apply(null, params);
    });
  }

  off(type, handler) {
    const {eventMap} = this;
    if(!type) {
      throw Error('type 为必填参数');
    }
    const list = eventMap[type]
    if(type && handler) {
      let index = list.indexOf(handler);
      if(index > -1) {
        list.splice(index, 1)
      }
    }else{
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