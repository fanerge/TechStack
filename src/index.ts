import result from "./modules/array";
import Stack, { divideBy2, baseConverter } from "./modules/stack";
import Queue, { PriorityQueue } from "./modules/queue";
import LinkedList, { Node } from "./modules/linkedList";
import Sets from "./modules/Set";
import Dictionary from "./modules/dictionary";
import HashTable from "./modules/hashTable";
import HashTable1 from "./modules/hashTable1";
// import BinarySearchTree from './modules/binarySearchTree';
import Graph from "./modules/graph";
// import { cloneLoop } from './utils/deepClone';
import { cloneOther } from "./utils/other";
import './style.css'
import {
  checkType,
  deepClone,
  curry,
  compose,
  pipe,
  debounce,
  throttle,
  fmoney,
  rmoney,
  toCamelCase,
} from "./modules/utils.ts";
import {
  instance_of,
  myCall,
  myApply,
  myBind,
  objectFactory,
  objectCreate,
} from "./modules/theory";
require("./modules/sort");
require("./modules/fp");
// 剑指offer刷题
require("./utils/offer");
require("./modules/utils.js");
require("./utils/sort.js");
require("./algorithm/binarySearch.js");
require("./algorithm/dp.js");
require("./algorithm/template.js");
import "./algorithm/floodfill";
import "./utils/promise"
import "./test"
import "./interview/javascript"

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
function hotPotato(nameList: string[], num: number) {
  let queue = new Queue();

  for (let i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }

  let eliminated = "";
  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }
    eliminated = queue.dequeue();
    console.log(eliminated + "在击鼓传花游戏中被淘汰。");
  }
  return queue.dequeue();
}
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
// 防抖节流
function handle(e: any) {
  // console.log(Math.random());
  // console.log(e);
}
window.addEventListener("scroll", throttle(handle, 3000));
// let test = fmoney(10000);
// // let test2 = rmoney(test);
// console.log(test);
// document.body.textContent = `${test}`;

// set-test
// const set = new Sets();
// set.add(1);
// set.add(2);
// set.add(3);
// const set1 = new Sets();
// set1.add(1);
// // set1.add(3);
// // set1.add(4);
// let set2 = set.isSubSet(set1);

// test-dictionary
// let dict = new Dictionary();
// dict.set('name', 'fanerge');
// dict.set('age', '28');
// // dict.delete(key1);
// const test = dict.values();

// test-hashTable
// let table = new HashTable();
// table.put('name', 'fanerge');
// table.put('age', 123);
// const test = table.delete('age12');
// console.log(table.print(), test);

// test-hashTable(分离链接)
// let table = new HashTable1();
// table.put('123', 'fan');
// table.put('321', 'fan1');
// table.put('213', '111');
// table.delete('213');
// console.log(table.get('213'));

// test-BST
// const tree = new BinarySearchTree();
// tree.insert(11);
// tree.insert(10);
// tree.insert(12);
// tree.insert(6);
// tree.insert(4);
// const test = tree.delete(4);

// function printNode(value: any){ //{6}
//   console.log(value);
// }
// tree.postOrderTraverse(printNode);
// console.log(tree, test);

// test-deepClone（regExp）
// const re = new RegExp('123', 'igmuy');
// const test = deepClone(re);
// debugger
// console.log(checkType(test));

// test-instance_of
// class B {}
// const b = new B();
// console.log(b instanceof B);
// console.log(instance_of(b, B));

// test-new objectFactory
// function SS(...args: any[]){
//   this.name = args[0];
//   this.age = args[1];
// }
// SS.prototype.getName = function() { return this.name; };
// const ss = objectFactory(SS, 'cxk', '18');
// console.log(ss);

// function SS(...args: any[]){
//   this.name = args[0];
//   this.age = args[1];
// }
// SS.prototype.getName = function() { return this.name; };
// var test = new SS('yzf', 123);
// console.log(test);

// test-Object.create
// const b = objectCreate(null, {name: {value: '123'}});
// console.log(b);
// const a = Object.create(null, {name: {value: '123'}});
// console.log(a);

// test-promise

// let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
// const obj = urlParseQuery(url);
// console.log(obj);
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/

// test-camelCase
// const test = toCamelCase('wer-sdf-sdf');
// console.log(test);

// test-fmoney
// const test = fmoney(1234123123);
// console.log(test);

// test-graph
// var graph = new Graph();
// var myVertices = ['A','B','C','D','E','F','G','H','I']; //{7}
// for (var i=0; i<myVertices.length; i++){ //{8}
//   graph.addVertex(myVertices[i]);
// }

// graph.addEdge('A', 'B'); //{9}
// graph.addEdge('A', 'C');
// graph.addEdge('A', 'D');
// graph.addEdge('C', 'D');
// graph.addEdge('C', 'G');
// graph.addEdge('D', 'G');
// graph.addEdge('D', 'H');
// graph.addEdge('B', 'E');
// graph.addEdge('B', 'F');
// graph.addEdge('E', 'I');

// function printNode(u: any) {
//   console.log(u);
// }
// const test = graph.DFS();
// console.log(test);

// test-deepClone 堆栈溢出
//cloneLoop
// let obj1 = {
//   a: 12,
//   aa: {name: 'yu', age: '28'},
//   aaa: {name: 'yua', age: '28a'}
// };
// let objClone = cloneLoop(obj1);
// console.log(obj1, objClone, obj1.aa === objClone.aa);

// js热更新配置
// module.hot.accept();

// bigInt 9007199254740991n BigInt(9007199254740991)
// let symbol1 = Symbol(123);
// let reg1 = new RegExp('1234', 'igmuys');
// let date1 = new Date();
// let map1 = new Map();
// let obj: any = {
//   bigInt: BigInt(9007199254740991),
//   ary: [{name: 'yzf'}, {age: 123}],
//   [symbol1]: 'symbol',
//   reg1,
//   date1,
//   map1
// }

// const obj1: any = cloneOther(obj);
// console.log(obj1);
