import result from './modules/array';
import Stack, { divideBy2, baseConverter } from './modules/stack';
import Queue, { PriorityQueue } from './modules/queue';
import LinkedList, { Node } from './modules/linkedList';
import Sets from './modules/Set';
import Dictionary from './modules/dictionary';
import HashTable from './modules/hashTable';
import HashTable1 from './modules/hashTable1';
// import BinarySearchTree from './modules/binarySearchTree';
import { 
    checkType, 
    deepClone, 
    myCall, 
    myApply, 
    myBind, 
    curry, 
    debounce,
    throttle,
    throttle1,
    fmoney,
    rmoney,
 } from './modules/utils';
import { debug } from 'webpack';

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
function handle(e: any) {            
    // console.log(Math.random());   
    console.log(e);      
}
window.addEventListener('scroll', throttle1(handle, 1000));
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