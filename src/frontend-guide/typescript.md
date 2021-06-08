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

