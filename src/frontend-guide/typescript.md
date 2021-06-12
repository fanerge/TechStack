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
/** 联合 */
type MixedType = string | number;
/** 交叉 */
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
```
