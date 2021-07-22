// import result from "./modules/array";
// import Stack, { divideBy2, baseConverter } from "./modules/stack";
// import Queue, { PriorityQueue } from "./modules/queue";
// import LinkedList, { Node } from "./modules/linkedList";
// import Sets from "./modules/Set";
// import Dictionary from "./modules/dictionary";
// import HashTable from "./modules/hashTable";
// import HashTable1 from "./modules/hashTable1";
// // import BinarySearchTree from './modules/binarySearchTree';
// import Graph from "./modules/graph";
// // import { cloneLoop } from './utils/deepClone';
// import { cloneOther } from "./utils/other";
// import './style.css'
// import {
//   checkType,
//   deepClone,
//   curry,
//   compose,
//   pipe,
//   debounce,
//   throttle,
//   fmoney,
//   rmoney,
//   toCamelCase,
// } from "./modules/utils";
// import {
//   instance_of,
//   myCall,
//   myApply,
//   myBind,
//   objectFactory,
//   objectCreate,
// } from "./modules/theory";
// require("./modules/sort");
// require("./modules/fp");
// // 剑指offer刷题
// require("./utils/offer");
// require("./modules/utils.js");
// require("./utils/sort.js");
// require("./algorithm/binarySearch.js");
// require("./algorithm/dp.js");
// require("./algorithm/template.js");
// import "./algorithm/floodfill";
// import "./utils/promise"
// import "./test"
import "./upgrade/javascript"

// 栈
// const stack: Stack = new Stack();
// stack.push(1);
// stack.push(2);
// stack.push(3);
// stack.pop();
// // const test: any = divideBy2(10);
// const test: any = baseConverter(100345, 16);

// 队列
// const queue = new Queue();
// queue.enqueue('a');
// queue.enqueue('b');
// queue.enqueue('sd');
// queue.dequeue();
// const test = queue.size();

// 优先队列
// const queue = new PriorityQueue();
// queue.enqueue('d', 4);
// queue.enqueue('a', 1);
// queue.enqueue('b', 2);
// queue.enqueue('sd', 1);
// queue.dequeue();
// const test = queue.toString();

// 循环队列——击鼓传花
// function hotPotato(nameList: string[], num: number) {
//   let queue = new Queue();

//   for (let i = 0; i < nameList.length; i++) {
//     queue.enqueue(nameList[i]);
//   }

//   let eliminated = "";
//   while (queue.size() > 1) {
//     for (let i = 0; i < num; i++) {
//       queue.enqueue(queue.dequeue());
//     }
//     eliminated = queue.dequeue();
//     console.log(eliminated + "在击鼓传花游戏中被淘汰。");
//   }
//   return queue.dequeue();
// }
// let names = ['John','Jack','Camila','Ingrid','Carl'];
// let winner = hotPotato(names, 8);
// console.log('The winner is: ' + winner);

// let link = new LinkedList();
// link.append(1);
// link.append(2);
// link.append(3);
// link.append(4);
// link.remove(2);
// // link.remove(0);

// 测试deepClone
// 测试循环引用
// const obj1 = {
//     x: 1,
//     y: 2
// };
// obj1.z = obj1;

// 测试myCall
// const ss = {name: 'fanerge'};
// Function.prototype.myCall = myCall;
// function demo(a, b) {console.log(this.name); return a + b;};
// console.log(demo.myCall(ss, [1, 2]));

// 测试myApply
// const ss = {name: 'fanerge'};
// Function.prototype.myApply = myApply;
// function demo(a, b, c) {console.log(this.name); return a + b + c;};
// console.log(demo.myApply(ss, [1, 2, 6]));

// // 测试myApply
// const ss = {name: 'fanerge'};
// Function.prototype.myBind = myBind;
// function demo(a, b, c, d) {console.log(this.name); return a + b + c + d;};
// let bindTest = demo.myBind(ss, 1, 2, 3, 5)();
// console.log(bindTest);
// demo.myBind(ss, 1, 2, 3)();

// test-curry
// function sumFn(a: number, b: number, c: number) {
//     return a + b + c;
// }
// var sum = curry(sumFn);
// console.log(sum(2)(3)(5));

// test-compose/pipe
// var greet = function (name: string) { return 'hi:' + name }
// var exclaim = function (statement: any) { return statement.toUpperCase() + '!' }
// var transform = function (str: any) { return str.replace(/[dD]/, 'DDDDD') }
// var welcome1 = compose(greet, exclaim, transform);
// var welcome2 = pipe(greet, exclaim, transform);
// console.log(welcome1('dot'))//hi:DDDDDOT!
// console.log(welcome2('dolb'))//HI:DDDDDOLB!

// test-throttle
let body = document.querySelector("body");
let fragment = document.createDocumentFragment();
var browsers = ["--------"];

browsers.forEach(function (browser) {
  var h2 = document.createElement("h2");
  h2.textContent = browser;
  fragment.appendChild(h2);
});

body.appendChild(fragment);

