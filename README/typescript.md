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

##  declare
declare可以定义全局变量，全局函数，全局命名空间，class等等
```
declare var foo:number;
declare class Greeter {
  constructor(greeting: string);

  greeting: string;
  showGreeting(): void;
}
// 为Window增加csrf的定义
declare global {
  interface Window {
    csrf: string;
  }
}
//
declare global {
  interface String {
    padZero(length : number) : string;
  }
}
String.prototype.padZero = function () :string {}
```

# 泛型
##  泛型函数
泛型（Generics）是指在定义函数、接口或者类的时候，不预先指定其类型，而是在使用是手动指定其类型的一种特性。
如：我们需要创建一个函数， 这个函数会返回任何它传入的值。
```
function identity<T>(arg: T): T {
  return arg;
}
identity<number>(3);
identity<string>('3');
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

# typs 和 interface
##  相同点
都可以描述一个对象或者函数
```
interface User {
  name: string
  age: number
}
type User = {
  name: string
  age: number
};
```
##   不同点
拓展方式不同
```
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

type Name = { 
  name: string; 
}
type User = Name & { age: number  }; // 交叉类型（Intersection Types）
```
type 可以声明基本类型别名，联合类型，元组等类型
```
// 基本类型别名
type Name = string

// 联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}

type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]
```
type 语句中还可以使用 typeof 获取实例的 类型进行赋值
```
// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div
```
interface 可以而 type 不行
```
interface User {
  name: string
  age: number
}

interface User {
  sex: string
}

User 接口为 {
  name: string
  age: number
  sex: string 
}
```
