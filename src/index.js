"use strict";
exports.__esModule = true;
var queue_1 = require("./modules/queue");
require("./style.css");
var utils_1 = require("./modules/utils");
require("./modules/sort");
require("./modules/fp");
// 剑指offer刷题
require("./utils/offer");
require("./modules/utils.js");
require("./utils/sort.js");
require("./algorithm/binarySearch.js");
require("./algorithm/dp.js");
require("./algorithm/template.js");
require("./algorithm/floodfill");
require("./utils/promise");
require("./test");
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
function hotPotato(nameList, num) {
    var queue = new queue_1["default"]();
    for (var i = 0; i < nameList.length; i++) {
        queue.enqueue(nameList[i]);
    }
    var eliminated = "";
    while (queue.size() > 1) {
        for (var i = 0; i < num; i++) {
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
var body = document.querySelector("body");
var fragment = document.createDocumentFragment();
var browsers = ["--------"];
function handle(e) {
    console.log(123);
}
browsers.forEach(function (browser) {
    var h2 = document.createElement("h2");
    h2.textContent = browser;


    fragment.appendChild(h2);

});

const weakMap = new WeakMap();
var click = document.createElement('div');
click.textContent = 'click'
weakMap.set(click, handle);
click.addEventListener('click', weakMap.get(click), false);
body.appendChild(click);

body.appendChild(fragment);

