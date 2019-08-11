#   todolist
-[x] checkType 类型检查包含String、Boolean、Number、Undefined、Null、Symbol、BigInt、Map、HTMLBodyElement、HTML*Element等
-[x] deepClone 深拷贝（包含重复引用）
-[x] myCall、myApply、myBind 自定义call、apply、bind函数
-[x] curry 柯里化函数
-[x] throttle、debounce
-[x] 千分位 正则、Number.prototype.toLocaleString、Intl.NumberFormat().format(number)、reduce版本













#   正则介绍
##  先行断言(lookahead)和后行断言(lookbehind)
先行断言和后行断言也有类似的作用，它们只匹配某些位置，在匹配过程中，不占用字符，所以被称为“零宽”。
Lookarounds是零宽度断言，匹配字符串而不消耗任何东西。
### (?=pattern) 先行肯定断言
代表字符串中的一个位置，紧接该位置之后的字符序列能够匹配pattern。<br>
```
const pattern = /\d+(?= dollars)/u;
const result = pattern.exec('42 dollars');
// → result[0] === '42'
```
### (?!pattern) 先行否定断言
代表字符串中的一个位置，紧接该位置之后的字符序列不能匹配pattern。<br>
```
const pattern = /\d+(?! dollars)/u;
const result = pattern.exec('42 pesos');
// → result[0] === '42'
```
### (?<=pattern) 后行肯定断言
代表字符串中的一个位置，紧接该位置之前的字符序列能够匹配pattern。<br>
```
const pattern = /(?<=\$)\d+/u;
const result = pattern.exec('$42');
// → result[0] === '42'
```
### (?!pattern) 先行否定断言
代表字符串中的一个位置，紧接该位置之前的字符序列不能匹配pattern。<br>
```
const pattern = /(?<!\$)\d+/u;
const result = pattern.exec('€42');
// → result[0] === '42'
```
[正则表达式的先行断言(lookahead)和后行断言(lookbehind)](https://blog.csdn.net/u012047933/article/details/38365541)
[ECMA正则](https://mathiasbynens.be/notes/es-regexp-proposals)

