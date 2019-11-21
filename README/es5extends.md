# ES6之前实现继承的6种方式
下文中说到的父类为 Super 子类为 Sub。<br>
一般原则：实例属性属于每个实例（各个实例不共享），原型属性是所有实例共享的。
##  原型链
实现原理：将子类的 prototype 属性赋值为父类的实例。
```
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;
```
// Sub 类可以拿到 Super 类中 this 上属性和方法以及原型上的属性和方法，但是如果在构造函数中为 this 对象上某个属性赋值，由于没有传对应实参所以会为 undefined。
缺点：父类包含引用类型值的原型，它会被所有实例共享。 
优点：可以继承到原型上的方法。
##  构造函数继承
实现原理：在子类的构造函数中绑定父类的 this 为子类并调用父构造函数。
```
function Sub(...args) {
  Super.call(this, ...args);
}
```
缺点：只能继承到父类 this 的属性和方法。
优点：子类不共享引用类型数据。
##  组合式继承
实现原理：前面两者结合。
```
function Sub(...args) {
  Super.call(this, ...args);
}
Sub.prototype = new Super();
Sub.prototype.constructor = Sub;
```
缺点：调用了两次父构造函数。
优点：即可以从父类那里继承实例属性优可以从父类那里继承原型属性。
##  原型式继承
实现原理：新建一个构造函数，该构造函数的原型赋值，并返回一个该构造函数的实例。
```
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
```
// 还可以使用es5中Object.create(proto, des)来实现。
缺点：子类共享原型链中继承的引用数据。
##  寄生式继承
实现原理：对原型式继承中返回对象进行扩展。
```
function parasitic(original){
    let clone = object(original)
    // 扩展对象
    clone.sayHello = function(){
        console.log("hello, World");
    };
    return clone
} 
```
##  寄生组合式继承(终极目标)
实现原理：通过借用构造函数来继承实例属性，通过原型链的混成形式来继承原型属性（不必调用父类构造函数）
```
function inheritPrototype(sonType,farType){ 
    let prototype = object(farType);  
    prototype.constructor = sonType;     
    sonType.prototype = prototype ;
}
function Sub(name,age){
    // 继承实例属性（子类不共享） 
    Super.call(this,name);
    this.age  = age;
}
// 继承原型属性
inheritPrototype(Sub, Super.prototype);
```
> 参考文档：
[整理ES5继承的几种方法](https://www.jianshu.com/p/c6f36b3a5408)























