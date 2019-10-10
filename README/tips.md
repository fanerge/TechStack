# 求字符串中某个字符出现的次数
`
const str = '123411';
// 方式1
let count1 = str.length - str.replace(/1/g, '').length;
// 方式2
str.match(/1/g).length;
`
# 