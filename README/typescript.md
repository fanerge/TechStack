# 声明全局模块
1.  在项目根目录创建typings目录
2.  在typings中添加index.d.ts，在其中定义你要的类型
```
interface MyType {
  foo: string;
  bar: string[];
}
```
3. 修改tsconfig.json，添加如下行
```
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types/", "./typings"],
  }
}
```
4. 重新编编译ts

# 泛型
##  泛型函数
泛型（Generics）是指在定义函数、接口或者类的时候，不预先指定其类型，而是在使用是手动指定其类型的一种特性。
如：我们需要创建一个函数， 这个函数会返回任何它传入的值。
```
function identity<T>(arg: T): T {
  return arg;
}
identity<number>(3);
identity<string>(3);
```
##  泛型约束
在泛型函数内部使用类型变量时， 由于事先并不知道它是那种类型， 所以不能随意操作它的属性和方法：
```
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length); // 可能没有length属性报错
  return arg;
}
// 添加泛型约束
interface lengthWise {
  length: number
}

function loggingIdentity<T extends lengthWise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
loggingIdentity('str') // 3
loggingIdentity(6) // err  传入是参数中未能包含 length 属性
```
##  泛型类
```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```
