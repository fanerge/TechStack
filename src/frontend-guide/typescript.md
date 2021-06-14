# 项目的基础配置
```
Command + Shift + P // 输入 code 配置
code 应用路径 // 即可实现 vscode 打开应用
// 当前应用目录下 TypeScript
.VS Code/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
// 查看 ts 报错
Command + Shift + M
// 初始化 tsconfig.json
tsc --init
```
# 基础知识
```
// 数组类型（Array）和元组类型（Tuple）
let arrayOfNumber: number[] = [1, 2, 3];
// 使用 Array 泛型定义数组类型
let arrayOfNumber: Array<number> = [1, 2, 3];
// 元组类型（Tuple）
元组最重要的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。
const [count, setCount] = useState(0);
// 特殊类型
any // any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式。
unknown // unknown 它主要用来描述类型并不确定的变量。
unknown 类型的值只能赋值给 unknown 或 any
void // 它仅适用于表示没有返回值的函数。
undefined // 
null // 主要体现在接口制定上，它表明对象或属性可能是空值。
never // 函数因为永远不会有返回值，所以它的返回值类型就是 never。
function ThrowError(msg: string): never {
  throw Error(msg);
}
object // 非原始类型的类型
//类型断言 
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
const greaterThan2: number = <number>arrayNumber.find(num => num > 2);
// 常量断言
let str = 'str' as const;
const readOnlyArr = [0, 1] as const;
// 非空断言
即在值（变量、属性）的后边添加 '!' 断言操作符，它可以用来排除值为 null、undefined 的情况
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString();
// 类型守卫
let mayNullOrUndefinedOrString: null | undefined | string;
if (typeof mayNullOrUndefinedOrString === 'string') {
  mayNullOrUndefinedOrString.toString(); // ok
}
```
# 字面量类型、类型推断、类型拓宽、类型缩小
```
let num: number = 1;
let num = 1; // 类型推断
let a = null; // 类型拓宽为 any
let b = undefined; // 类型拓宽为 any
interface Config {
  size: 'small' | 'big'; // 字符串字面量类型
  bool: true | false; // 布尔字面量类型
  num: 0 | 2 | 4; // 数字字面量类型
}
```
# 函数类型
```
// 可选参数
function fn1(x?: string):void {}
// 默认参数(自动推断类型)
function fn1(x:number = 12):void {}
// rest 参数
function fn1(...nums: (number | string)[]):void {}
// this
function say(this: Window, name: string) {
  return this.name
}
window.say = say;
// 函数重载
function convert(x: string): number;
function convert(x: number): string;
function convert(x: null): -1;
// 类型谓词（is）相当于缩小参数 s 的类型，类型缩小
unction isString(s): s is string { 
  return typeof s === 'string';
}
```
# 类类型
```
class Dog {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
​
  bark() {
    console.log('Woof! Woof!');
  }
}
// 公共、私有与受保护的修饰符
public 修饰的是在任何地方可见、公有的属性或方法
private 修饰的是仅在同一类中可见、私有的属性或方法
protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法
readonly 只读修饰符声明类的属性
static 静态属性和方法
abstract 抽象类，它是一种不能被实例化仅能被子类继承的特殊类 
implements 使用接口与使用抽象类相比，区别在于接口只能定义类成员的类型
```
# 接口类型和类型别名
```
// interface 接口类型
// 通过接口类型，我们可以清晰地定义模块内、跨模块、跨项目代码的通信规则。
“鸭子类型”（duck typing）或者“结构化类型（structural subtyping）”的准则，即只要两个对象的结构一致，属性和方法的类型一致，则它们的类型就是一致的。
// 定义接口
interface ProgramLanguage {
  // 只读属性
  readonly name: string;
  // 可缺省属性
  age?: () => number;
  // 索引签名，分为 string 和 number 两种
  [rank: number]: string;
}
// 继承与实现（可继承多个）
interface DynamicLanguage extends ProgramLanguage, TypeSafeLanguage {
  rank: number; // 定义新属性
}
// Type 类型别名
/** 联合类型 */
// 表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合。
type MixedType = string | number;
/** 交叉类型，可以理解为求并集 */
// 把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性。
type IntersectionType = { id: number; name: string; } 
  & { age: number; name: string };
/** 提取接口属性类型 */
type AgeType = ProgramLanguage['age'];  
// Interface 与 Type 的区别
在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。
重复定义的接口类型，它的属性会叠加，这个特性使得我们可以方便地对全局变量、第三方库的类型做扩展，而 type 就会报错。
interface Language {
  id: number;
}
interface Language {
  name: string;
}
let lang: Language = {
  id: 1, // ok
  name: 'name' // ok
}
// 合并联合类型，即求联合类型的交集，如果没有交集则为 never
type UnionA = 'px' | 'em' | 'rem' | '%';
type UnionB = 'vh' | 'em' | 'rem' | 'pt';
type IntersectionUnion = UnionA & UnionB; // 'em' | 'rem'
// 联合、交叉组合
 |、& 操作符的优先级类似 JavaScript 的逻辑或 ||、逻辑与 &&
// 类型缩减
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留（IDE提示显示注解的字符串字面量）
```
# 枚举类型
```
// 数字类型
enum Day {
  SUNDAY = 1, // 默认开始为 0
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}
// 字符串类型  
enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  ...
}
// 异构枚举（Heterogeneous enums），异构枚举也被认为是很“鸡肋”的类型
 enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 2,
  ...
}
// 常量成员和计算（值）成员
enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 计算成员
  G = "123".length,
}
// 常量枚举（const enums）
我们可以通过添加 const 修饰符定义常量枚举，常量枚举定义转译为 JavaScript 之后会被移除，并在使用常量枚举成员的地方被替换为相应的内联值。
  const enum Day {
    SUNDAY,
    MONDAY
  }
  const work = (d: Day) => {
    switch (d) {
      case Day.SUNDAY: // 0
        return 'take a rest';
      case Day.MONDAY: // 1
        return 'work hard';
    }
  }
}
// 外部枚举（Ambient enums）
在 TypeScript 中，我们可以通过 declare 描述一个在其他地方已经定义过的变量
declare let $: any;
$('#id').addClass('show'); // ok
```
# 泛型
```
// 定义(用于函数和类)
泛型指的是类型参数化，即将原来某种具体的类型进行参数化。和定义函数参数一样，我们可以给泛型定义若干个类型参数，并在调用时给泛型传入明确的类型参数。
// 泛型类型参数
泛型最常用的场景是用来约束函数参数的类型，我们可以给函数定义若干个被调用时才会传入明确类型的参数。
通过尖括号 <> 语法给函数定义一个泛型参数 P，并指定 param 参数的类型为 P 
function reflect<P>(param: P):P {
  return param;
}
泛型不仅可以约束函数整个参数的类型，还可以约束参数属性、成员的类型
function reflectArray<P>(param: P[]) {
  return param;
}
const reflectArr = reflectArray([1, '1']); // reflectArr 是 (string | number)[]
给函数定义任何个数的泛型入参
function reflectExtraParams<P, Q>(p1: P, p2: Q): [P, Q] {
  return [p1, p2];
}
// 泛型类
class Memory<S> {
  store: S;
  constructor(store: S) {
    this.store = store;
  }
  set(store: S) {
    this.store = store;
  }
  get() {
    return this.store;
  }
}
const numMemory = new Memory<number>(1); // <number> 可缺省
const getNumMemory = numMemory.get(); // 类型是 number
// 泛型约束
function reflectSpecified<P extends number | string | boolean>(param: P):P {
  return param;
}
reflectSpecified('string'); // ok
reflectSpecified(null); // ts(2345) 'null' 不能赋予类型 'number | string | boolean'
```
# 类型守卫
```
// 类型守卫的作用在于触发类型缩小。实际上，它还可以用来区分类型集合中的不同成员。
常用的类型守卫包括switch、字面量恒等、typeof、instanceof、in 和自定义类型守卫这几种。
const convertToUpperCase = (strOrArray) => {
  // 类型守卫
  if (typeof strOrArray === 'string') {
    return strOrArray.toUpperCase();
  } else if (Array.isArray(strOrArray)) {
    return strOrArray.map(item => item.toUpperCase());
  }
}
```
# 类型兼容
```
// 判断一个类型是否可以赋值给其他类型？
// 子类型，所有的子类型与它的父类型都兼容
const one = 1;
let mixedNum: 1 | 2 | 3 = one; // ok
// 结构类型，类型兼容性的另一准则是结构类型，即如果两个类型的结构一致，则它们是互相兼容的。
interface I1 {
  name: string;
}
interface I2 {
  name: string;
}
let O1: I1;
let O2: I2;
O1 = O2; // ok
// 可继承和可实现，决定了接口类型和类是否可以通过 extends 继承另外一个接口类型或者类，以及类是否可以通过 implements 实现接口。
interface I1 {
  name: number;
}
interface I2 extends I1 { // ts(2430)
  name: string; // error，name 不能重置为 string
}
class C3 implements I1 {
  name = ''; // error，name 不能重置为 string
}
// 泛型，泛型类型、泛型类的兼容性实际指的是将它们实例化为一个确切的类型后的兼容性。
let fun1 = <T>(p1: T): 1 => 1;
let fun2 = <T>(p2: T): number => 2;
fun2 = fun1; // ok
// 变型，TypeScript 中的变型指的是根据类型之间的子类型关系推断基于它们构造的更复杂类型之间的子类型关系。
比如根据 Dog 类型是 Animal 类型子类型这样的关系，我们可以推断数组类型 Dog[] 和 Animal[] 、函数类型 () => Dog 和 () => Animal 之间的子类型关系。
// 变型-协变，协变也就是说如果 Dog 是 Animal 的子类型，则 F(Dog) 是 F(Animal) 的子类型，这意味着在构造的复杂类型中保持了一致的子类型关系
type isChild<Child, Par> = Child extends Par ? true : false;
interface Animal {
  name: string;
}
interface Dog extends Animal {
  woof: () => void;
}
type Covariance<T> = T;
type isCovariant = isChild<Covariance<Dog>, Covariance<Animal>>; // true
// 变型-逆变，逆变也就是说如果 Dog 是 Animal 的子类型，则 F(Dog) 是 F(Animal) 的父类型，这与协变正好反过来。
type Contravariance<T> = (param: T) => void;
type isNotContravariance = isChild<Contravariance<Dog>, Contravariance<Animal>>; // false;
type isContravariance = isChild<Contravariance<Animal>, Contravariance<Dog>>; // true;
// 变型-双向协变，双向协变也就是说如果 Dog 是 Animal 的子类型，则 F(Dog) 是 F(Animal) 的子类型，也是父类型，既是协变也是逆变。

// 变型-不变，不变即只要是不完全一样的类型，它们一定是不兼容的。也就是说即便 Dog 是 Animal 的子类型，如果 F(Dog) 不是 F(Animal) 的子类型，那么 F(Animal) 也不是 F(Dog) 的子类型。
interface Cat extends Animal {
  miao: () => void; 
}
const cat: Cat = {
  name: 'Cat',
  miao: () => void 0,
};
const dog: Dog = {
  name: 'Dog',
  woof: () => void 0,
};
let dogs: Dog[] = [dog];
animals = dogs; // ok
animals.push(cat); // ok
// 函数类型兼容性
返回值，返回值类型是协变的，所以在参数类型兼容的情况下，函数的子类型关系与返回值子类型关系一致。
参数类型，参数类型是逆变的，所以在参数个数相同、返回值类型兼容的情况下，函数子类型关系与参数子类型关系是反过来的（逆变）。
参数个数，在索引位置相同的参数和返回值类型兼容的前提下，函数兼容性取决于参数个数，参数个数少的兼容个数多。
let lessParams = (one: number) => void 0;
let moreParams = (one: number, two: string) => void 0;
lessParams = moreParams; // ts(2322)
moreParams = lessParams; // ok
可选和剩余参数，可选参数可以兼容剩余参数、不可选参数。
```
