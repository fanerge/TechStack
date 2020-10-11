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


