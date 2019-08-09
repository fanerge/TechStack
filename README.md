在JavaScript中讨论数据结构，暴扣数组、栈、队列、链表等。
#   工具函数
[工具函数集合](./README/utils.md)
#   数组（Array）
在JavaScript中的数组不一定是分配了连续内存，它是有条件的：数组项不许是单一类型，在非单一类型的数组中，它就不是连续内存了。
[数组和链表的比较](./README/array_and_linkedlist.md)
##  首部添加
首先我们要腾出数组里第一个元素的位置，把所有的元素向右移动一位。我们 可以循环数组中的元素，从最后一位+1(长度)开始，将其对应的前一个元素的值赋给它，依次 处理，最后把我们想要的值赋给第一个位置(-1)上。<br>
Array.prototype.unshift();
```
for (var i=numbers.length; i>=0; i--){
    numbers[i] = numbers[i-1];
}
numbers[0] = -1;
```
##  首部删除
Array.prototype.shift();
```
for (var i = 0; i < numbers.length; i++){
    numbers[i] = numbers[i+1];
}
```
##  尾部添加
Array.prototype.push();
```
arr1[arr1.length] = 11;
```
##  尾部移除
Array.prototype.pop();
```
arr1[arr1.length - 1] = null; 
delete arr1[arr1.length - 1];
arr1.length = [arr1.length - 1];
```
#   栈（Stack）
栈是一种遵从后进先出(LIFO)原则的有序集合。新添加的或待删除的元素都保存在栈的
同一端，称作栈顶，另一端就叫栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。
##  栈的实现
```
// ES6
// 不可用let _items = Symbol()来做私有属性
// Object.getOwnPropertySymbols(stack);获取到
// const items = new WeakMap();
const items: any = new Map();

export default class Stack {

    // name: any;
    constructor() {
        items.set(this, []);
        // 类似于stack.name
        // this.name = name;
    }

    // 类似于Stack.protype.push
    push(element: any) {
        let s = items.get(this);
        // s.push(element);
        s[s.length] = element;
        // return s;
    }

    pop() {
        let s = items.get(this);
        let last: any = s[s.length - 1];
        s[s.length - 1] = null;
        // delete s[s.length - 1];
        // 模拟pop方法需length - 1
        s.length = s.length - 1;
        
        // return s.pop();
        return s.length;
    }

    peek() {
        let s = items.get(this);
        return s[s.length - 1];
    }

    isEmpty() {
        let s = items.get(this);
        return s.length === 0;
    }

    clear() {
        let s = items.get(this);
        s.length = 0;
    }

    size() {
        let s = items.get(this);
        return s.length;
    }
}
```
##  栈能解决哪些问题
我们可以用栈来解决十进制转二进制问题，以及任意进制转换的算法、平衡圆括号问题、用栈解决汉诺塔问题。
这里演示十进制转二进制问题
```
 * 10进制转2进制
 * @param num 
 */
export function divideBy2(num: number) {
    let arr = new Stack();
    let temp;
    let str: string = '';
    while(num > 0) {
        temp = Math.floor(num % 2);
        arr.push(temp);
        num = Math.floor(num / 2);
    }
    
    while(!arr.isEmpty()) {
        str += `${arr.pop()}`;
    }

    return  str;
}
```
#   队列（Queue）
队列是遵循FIFO(First In First Out，先进先出，也称为先来先服务)原则的一组有序的项。
队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。
##  普通队列
```
export default (function() {
    let items = new WeakMap();

    return class Queue {
        constructor() {
            items.set(this, []);
        }

        enqueue(element: any) {
            let s = items.get(this);
            // s.push(element);
            s[s.length] = element;
        }

        dequeue() {
            let s = items.get(this);
            // s.shift();
            for(let i = 0; i < s.length - 1; i++) {
                s[i] = s[i+1];
            }
            s.length = s.length - 1;
        }

        front() {
            let s = items.get(this);
            return s[0];
        }

        isEmpty() {
            let s = items.get(this);
            return s.length === 0;
        }

        size() {
            let s = items.get(this);
            return s.length;
        }

        toString() {
            let s = items.get(this);
            return Array.prototype.toString.call(s);
        }
    }
})();
```
##  优先队列
其中一个修改版就是优先队列。元素的添加和移除是基于优先级的。一个现实的例子就是机 场登机的顺序。头等舱和商务舱乘客的优先级要高于经济舱乘客。在有些国家，老年人和孕妇(或 带小孩的妇女)登机时也享有高于其他乘客的优先级。
```
/**
 * 优先队列
 */
export const PriorityQueue = (function() {
    let items = new WeakMap();

    class QueueElement {
        element: any;
        priority: number;

        constructor(element: any, priority: number) {
            this.element = element;
            this.priority = priority;
        }
    }

    return class PriorityQueue {
        constructor() {
            items.set(this, []);
        }

        enqueue(element: any, priority: number) {
            let s = items.get(this);
            let queueElement = new QueueElement(element, priority);
            let added = false;
            for(let i =0; i < s.length; i++) {
                if(queueElement.priority < s[i].priority) {
                    s.splice(i, 0, queueElement);
                    added = true;
                    break;
                }
            }
            if(!added) {
                s.push(queueElement);
            }
        }

        dequeue() {
            let s = items.get(this);
            // s.shift();
            for(let i = 0; i < s.length - 1; i++) {
                s[i] = s[i+1];
            }
            s.length = s.length - 1;
        }

        front() {
            let s = items.get(this);
            return s[0];
        }

        isEmpty() {
            let s = items.get(this);
            return s.length === 0;
        }

        size() {
            let s = items.get(this);
            return s.length;
        }

        toString() {
            let s = items.get(this);
            let str = '';
            for(let i = 0; i < s.length; i++) {
                str += `${s[i].element}, ${s[i].priority};`;
            }
            return str;
        }
    }
})();
```
##  队列的应用
循环队列——击鼓传花
```
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
let names = ['John','Jack','Camila','Ingrid','Carl'];
let winner = hotPotato(names, 8);
console.log('The winner is: ' + winner);
```
#   链表
链表存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。每个 元素由一个存储元素本身的节点和一个指向下一个元素的引用(也称指针或链接)组成。
##  单向链表
```
export default (function() {

    return class LinkedList {
        length: number;
        head: null | Node;
        constructor() {
            this.length = 0;
            this.head = null;
        }

        append(element: any){
            let node  = new Node(element),
            current: Node;
            // 添加时还没有节点
            if(this.head === null) {
                this.head = node;
            }else{
                current = this.head;
                // 添加时有节点，则需要找到最后一个节点添加
                while(current.next) {
                    current = current.next;
                }
                // 最后一个节点的next属性指向新的节点
                current.next = node;
            }
            // 同步更新其长度
            this.length++;
        }

        removeAt(position: number) {
            if(position < -1 || position > this.length) {
                return null;
            }
            let current = this.head,
                previous,
                index = 0;
            // 移除第一个 
            if(position === 0) {
                this.head = current.next;
            }else{
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                //将previous与current的下一项链接起来:跳过current，从而移除它
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        }

        insert(position: number, element: any): boolean {
            if(position < -1 || position > this.length) {
                return false;
            }
            let node = new Node(element);
            let current = this.head;
            let previous: null | Node;
            let index: number = 0;
            if(position === 0) {
                node.next = current;
                this.head = node;  
            }else{
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        }

        remove(element: any) {
            let previous;
            let current = this.head;
            while(current && current.element !== element) {
                previous = current;
                current = current.next;
            }
            if(current) {
                previous.next = current.next;
            }else{
                return false;
            }
        }

        getHead(): null | Node {
            return this.head;
        }

        size(): number {
            return this.length;
        }

        isEmpty(): boolean {
            return this.length === 0;
        }

        print() {
            let current = this.head;
            let str: string = '';
            while(current) {
                str += `${current.element};`
                current = current.next;
            }
            return str;
        }
    }
})();

export class Node {
    element: any;
    next: any;
    constructor(element: any) {
        this.element = element;
        this.next = null;
    }
}
```
##  双向链表
双向链表和普通链表的区别在于，在链表中， 一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的:一个链向下一个元素（next）， 另一个链向前一个元素（prev）。
##  循环链表
循环链表可以像链表一样只有单向引用，也可以像双向链表一样有双向引用。循环链表和链 表之间唯一的区别在于，最后一个元素指向下一个元素的指针(tail.next)不是引用null， 而是指向第一个元素(head)。


