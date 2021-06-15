"use strict";
exports.__esModule = true;
var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// 末尾添加
/**
console.time('add-length');
arr1[arr1.length] = 11;
console.timeEnd('add-length');
// arr1[arr1.length] = 12;
console.time('add-push');
arr1.push(12);
console.timeEnd('add-push');
// 多次实验 push 更快
**/
// 首位添加
// console.time('first-length');
// for(let i = arr1.length; i >= 0 ; i--) {
//     arr1[i] = arr1[i - 1];
// }
// arr1[0] = 0;
// console.timeEnd('first-length');
// console.time('first-length');
// arr1.unshift(-1);
// console.timeEnd('first-length');
// 删除首部
// console.time('first-length');
// for (var i = 0; i < arr1.length; i++){
//     arr1[i] = arr1[i+1];
// }
// console.timeEnd('first-length');
// console.time('first-length');
// arr1.shift();
// console.timeEnd('first-length');
// 删除尾部
// arr1[arr1.length - 1] = null; 
// delete arr1[arr1.length - 1];
// arr1.length = [arr1.length - 1];
var result = arr1.toString();
exports["default"] = result;
