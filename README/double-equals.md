# '==' 的隐式类型转换规则

1.	如果类型相同，无须进行类型转换；
2.	如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false；
3.	如果其中一个是 Symbol 类型，那么返回 false；
4.	两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number；
5.	如果一个操作值是 boolean，那么转换成 number；
6.	如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（若有Symbol.toPrimitive 方法则先调用、否则调用 object 的 valueOf/toString 方法进行转换）。

```
== 中一边为 null 或者 undefined，则另一边也必须是 null 或者 undefined 才为 true
parseInt('') // NaN
{}+10 // 10
10 + {} // 10[object Object]
Number(undefined) // NaN

// ！可将变量转换成boolean类型，null、undefined、NaN以及空字符串('')取反都为true，其余都为false。
[] == ![] // true
[] == ![]   ->   [] == false  ->  [] == 0  ->   '' == 0   ->  0 == 0   ->  true
{} == !{} // false 
// {} == !{}   ->   {} == false  ->  {} == 0  ->   NaN == 0    ->  false
```
