import result from './modules/array';
import Stack, { divideBy2, baseConverter } from './modules/stack';
import Queue, { PriorityQueue } from './modules/queue';
import LinkedList, { Node } from './modules/linkedList';
import { 
    checkType, 
    deepClone, 
    myCall, 
    myApply, 
    myBind, 
    curry, 
    debounce,
    throttle,
    fmoney,
    rmoney,
 } from './modules/utils';

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
    
    for(let i = 0; i < nameList.length; i++ ) {
        queue.enqueue(nameList[i]);
    }

    let eliminated = '';
    while (queue.size() > 1){
        for (let i=0; i<num; i++){
            queue.enqueue(queue.dequeue()); 
        }
        eliminated = queue.dequeue();
        console.log(eliminated + '在击鼓传花游戏中被淘汰。');
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

// 测试myApply
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

// test-throttle
let body = document.querySelector('body');
let fragment = document.createDocumentFragment();
var browsers = ['Firefox', 'Chrome', 'Opera', 'Safari', 'Internet Explorer'];

browsers.forEach(function(browser) {
    var h2 = document.createElement('h2');
    h2.textContent = browser;
    fragment.appendChild(h2);
});

body.appendChild(fragment);
// 防抖节流
// function handle(e: any) {            
//     console.log(Math.random());        
// }
// window.addEventListener('scroll', debounce(handle, 2000));
let test = fmoney(10000);
// let test2 = rmoney(test);
console.log(test);

// document.body.textContent = `${test}`;
