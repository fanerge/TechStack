const R = require('ramda');
// Functor
// 函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
// 它首先是一种范畴，也就是说，是一个容器，包含了值和变形关系。比较特殊的是，它的变形关系可以依次作用于每一个值，将当前容器变形成另一个容器。
export class Functor {
  constructor (val) {
    this.__val = val;
  }

  map (f) {
    // return new Function(f(this.__val));
    return Functor.of(f(this.__val));
  }
}
Functor.of = function(val) {
  return new Functor(val);
};

// Maybe Functor（作用空值检查）
export class Maybe extends Functor {
  map(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__val));
  }

  isNothing() {
    return (this.__val === null || this.__val === undefined);
  }
}

// Either 函子内部有两个值：左值（Left）和右值（Right）(作用设置默认值)。
export class Either extends Functor {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  map(f) {
    return this.right ? 
      Either.of(this.left, f(this.right)) :
      Either.of(f(this.left), this.right);
  }
}
Either.of = function (left, right) {
  return new Either(left, right);
};

// ap 是 applicative（应用）的缩写。凡是部署了ap方法的函子，就是 ap 函子。
class Ap extends Functor {
  ap(F) {
    return Ap.of(this.val(F.val));
  }
}

// Monad 函子的作用是，总是返回一个单层的函子。它有一个flatMap方法，与map方法作用相同，唯一的区别是如果生成了一个嵌套函子，它会取出后者内部的值，保证返回的永远是一个单层的容器，不会出现嵌套的情况。
// monad 是可以变扁（flatten）的 pointed functor。
class Monad extends Maybe {
  join() {
    return this.val;
  }
  flatMap(f) {
    return this.map(f).join();
  }
}

// IO 把非纯执行动作（impure action）捕获到包裹函数里，目的是延迟执行这个非纯动作。
export class IO {
  constructor(f) {
    this.__val = f;
  }

  map(f) {
    return new IO(R.compose(f, this.__val));
  }
}
IO.of = function (f) {
  return new IO(function() {
      return f;
    });
};






