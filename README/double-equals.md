1.  字符串与布尔值比较，也都要转换为数字。
// false == ‘0’ true ==> 0 == 0
// true == ‘true’ false ==> 1 == NaN
2.  对于非原始值（非Number、String、Boolean、Symbol、BigInt）拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。
// 拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。
3.  对象如果转换成了 primitive 类型跟等号另一边类型恰好相同，则不需要转换成数字。
// [] == '' true ==> [].toString() / '' == ''
// [] == 0 true ==> [].toString() 为'', Number('') == 0
// [] == false true ==> [].toString() 为'', Number('') == 0, Number(false)
