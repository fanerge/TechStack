在JavaScript中讨论数据结构。<br>
顺序数据结构：数组（列表）、栈、队列和链表。<br>
非顺序数据结构：散列表、字典、树。<br>
存储唯一值的数据结构：集合、字典、散列表<br>
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

# 集合（Set）
集合是由一组无序且唯一(即不能重复)的项组成的。这个数据结构使用了与有限集合相同 的数学概念，但应用在计算机科学的数据结构中。
集合也有并集、交集、差集等基本操作。
##  实现简单集合
```
export default (function() {
  let items = new WeakMap();

  return class Sets {

    constructor() {
      items.set(this, {});
    }

    add(value: any): boolean {
      let obj = items.get(this);
      if(this.has(value)) {
        return false;
      }
      obj[value] = value;
      return true;
    }

    delete(value: any) {
      let obj = items.get(this);
      if(this.has(value)) {
        delete obj[value];
        return true;
      }
      return false;
    }

    has(value: any): boolean{
      let obj = items.get(this);
      return Object.values(obj).includes(value);
    }

    size() {
      let obj = items.get(this);
      return Object.values(obj).length || 0;
    }

    clear() {
      items.set(this, {});
    }

    values() {
      let obj = items.get(this);
      return Object.values(obj);
    }

    print() {
      let obj = items.get(this);
      return Object.values(obj).reduce((acc: any, item, index) => {
        return acc + item + ';';
      }, '');
    }
  }
})();
```
##  集合操作
并集:对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。
交集:对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。
差集:对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合。
子集:验证一个给定集合是否是另一集合的子集。
```
// 并集
    union(otherSet: Sets) {
      let unionSet = new Sets();
      const values1 = this.values();
      const values2 = otherSet.values();

      values1.forEach(item => {
        if(!unionSet.has(item)) {
          unionSet.add(item);
        }
      });

      values2.forEach(item => {
        if(!unionSet.has(item)) {
          unionSet.add(item);
        }
      });

      return unionSet;
    }

    // 交集
    intersection(otherSet: Sets) {
      let unionSet = this.union(otherSet);
      let newSet = new Sets();
      unionSet.values().forEach(item => {
        if(this.has(item) && otherSet.has(item)) {
          newSet.add(item);
        }
      });

      return newSet;
    }

    // 差集
    difference(otherSet: Sets) {
      let newSet = new Sets();
      this.values().forEach(item => {
        if(!otherSet.has(item)) {
          newSet.add(item);
        }
      });

      return newSet;
    }

    // 是否为子集
    isSubSet(otherSet: Sets) {
      let array = this.values();
      return otherSet.values().every(item => {
        return array.includes(item);
      });
    }
```

# 字典（Dictionary）
在字典中，存储的是[键，值] 对，其中键名是用来查询特定元素的。字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。字典也称作映射。<br>
ES6元素支持Map。
```
export default (function(){
  let items = new WeakMap();

  // 只考虑string作为object的key（Symbol不考虑）
  return class Dictionary {
    constructor() {
      items.set(this, {});
    }

    has(key: any) {
      let obj = items.get(this);
      return obj[key] !== undefined;
    }

    set(key: any, value: any) {
      let obj = items.get(this);
      obj[key] = value;
    }

    delete(key: any) {
      let obj = items.get(this);
      if(this.has(key)) {
        delete obj[key];
        return true;
      }
      return false;
    }

    get(key: any) {
      let obj = items.get(this);
      return obj[key];
    }

    clear() {
      items.set(this, {});
    }

    size() {
      return Object.keys(items.get(this)).length;
    }

    keys() {
      let obj = items.get(this);
      return Object.keys(obj);
    }

    values() {
      let obj = items.get(this);
      return Object.values(obj);
    }

    print() {
      let obj = items.get(this);
      // let symbols = Object.getOwnPropertySymbols(obj).map(item => {
      //   return [item, obj[item]]
      // });
      return [...Object.entries(obj)];
    }
  }
})();
```

# 散列表（hashTable）
散列算法的作用是尽可能快地在数据结构中找到一个值。<br>
散列函数的作用是给定一个键值，然后 返回值在表中的地址。<br>
##  普通的散列表
```
export default (function(){
  let items = new WeakMap();

  // hash函数（非常重要，必须要防止hash碰撞）
  function loseloseHashCode(key: string) {
    let array = Array.from(key);
    let hash = array.reduce((acc, item) => {
      return acc + item.codePointAt(0);
    }, 0);

    return hash % 37;
  }

  return class HashTable {
    constructor() {
      items.set(this, []);
    }

    put(key: string, value: any) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      console.log(hash);
      table[hash] = value;
    }

    get(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      return table[hash];
    }

    delete(key: string) {
      let hash = loseloseHashCode(key);
      let table = items.get(this);
      if(this.get(key) !== undefined) {
        table[hash] = undefined;
        return true;
      }
      return false;
    }

    print() {
      let table = items.get(this);
      return table;
    }
  }
})();
```
##  处理散列表中的冲突
处理冲突有几种方法:分离链接、线 2 性探查和双散列法。
### 分离链接
分离链接法包括为散列表的每一个位置创建一个链表并将元素存储在里面。它是解决冲突的最简单的方法，但是它在HashTable实例之外还需要额外的存储空间。<br>
[分离链接](../src/modules/hashTable1.ts)
###  线性探查
另一种解决冲突的方法是线性探查。当想向表中某个位置加入一个新元素的时候，如果索引 为index的位置已经被占据了，就尝试index+1的位置。如果index+1的位置也被占据了，就尝试 index+2的位置，以此类推。
### 创建更好的散列函数
一个表现良好的散列函数是由几个方 面构成的:插入和检索元素的时间(即性能)，当然也包括较低的冲突可能性。我们可以在网上 找到一些不同的实现方法，或者也可以实现自己的散列函数。<br>
防碰撞的好方法。
```
var djb2HashCode = function (key) {
  var hash = 5381; //{1}
  for (var i = 0; i < key.length; i++) { //{2}
    hash = hash * 33 + key.charCodeAt(i); //{3}
  }
  return hash % 1013; //{4}
};
```
# 树
树是一种分层数据的抽象模型。现实生活中最常见的树的例子是家谱，或是公司的组织架构 图。
##  相关概念
位于树顶部的节点叫作根节点。<br>
树中的每个元素都叫作节点，节点分 为内部节点和外部节点。<br>
节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。<br>
树的高度取决于所有节点深度的最大值。<br>
##  二叉树和二叉搜索树
二叉树中的节点最多只能有两个子节点:一个是左侧子节点，另一个是右侧子节点。
二叉搜索树(BST)是二叉树的一种，但是它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。
```
import { clearLine } from "readline";

// 节点类
export class Node {
  key: any;
  left: any;
  right: any;
  constructor(key: any) {
    this. key = key;
    this.left = null;
    this.right = null;
  }
}

export default (function() {
  // 私有-插入节点
  function insertNode(node: Node, newNode: Node) {
    if(newNode.key < node.key) {
      if(node.left === null) {
        node.left = newNode;
      }else{
        insertNode(node.left, newNode);
      }
    }else{
      if(node.right === null) {
        node.right = newNode;
      }else{
        insertNode(node.right, newNode);
      }
    }
  }

  // 中序遍历(从小到大，左-》跟-》右)
  function inOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      inOrderTraverseNode(node.left, callback);
      callback(node.key);
      inOrderTraverseNode(node.right, callback);
    }
  }

  // 先序遍历(跟-》左-》右)
  function preOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      callback(node.key);
      preOrderTraverseNode(node.left, callback);
      preOrderTraverseNode(node.right, callback);
    }
  }

  // 后序遍历(左-》右-》跟)
  function postOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      postOrderTraverseNode(node.left, callback);
      postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  // search
  function search(node: Node, type: any) {
    if(node) {
      while(node && node[type] !== null) {
        node = node[type];
      }
      return node.key;
    }
    return null;
  }

  // 
  function searchNode(node: Node, key: any): any {
    if(node === null) {
      return false;
    }
    if(key > node.key) {
      return searchNode(node.right, key);
    }else if(key < node.key){
      return searchNode(node.left, key);
    }else{
      return true;
    }
  }

  // 
  function findMinNode(node: Node) {
    if(node) {
      while(node && node.left !== null) {
        node = node.left;
      }
      return node;
    }
    return null;
  }

  // 
  function deleteNode(node: Node, key: any) {
    if(node === null) {
      return null;
    }
    if(key < node.key) {
      deleteNode(node.left, key);
      // return node;
    }else if(key > node.key){
      deleteNode(node.right, key);
      // return node;
    }else{
      debugger
      // 第一种（叶子节点）
      if(node.left === null && node.right === null) {
        let tempNode = node;
        node = null;
        return tempNode;
      }
      // 第二种（有一个右节点）
      if(node.left === null && node.right !== null) {
        let tempNode = node;
        node = node.right;
        return tempNode;
      }
      // 第三种（有一个左节点）
      if(node.right === null && node.left !== null) {
        let tempNode = node;
        node = node.left;
        return tempNode;
      }
      // 第四种（有两个子节点）
      // (1) 当找到了需要移除的节点后，需要找到它右边子树中最小的节点(它的继承者)。
      // (2) 然后，用它右侧子树中最小节点的键去更新这个节点的值。通过这一步，我 们改变了这个节点的键，也就是说它被移除了。
      // (3) 但是，这样在树中就有两个拥有相同键的节点了，这是不行的。要继续把右侧子树中的 最小节点移除，毕竟它已经被移至要移除的节点的位置了。
      // (4) 最后，向它的父节点返回更新后节点的引用。
      if(node.left !== null && node.right !== null) {
        let aux = findMinNode(node.right);
        node.key = aux.key;
        node.right = deleteNode(node.right, aux.key);
        return node;
      }
    }
  }

  return class BinarySearchTree {
    root: any;
    constructor() {
      this.root = null;
    }

    // 向树中插入值
    insert(key: any) {
      const newNode  = new Node(key);
      if(this.root === null) {
        this.root = newNode;
      }else{
        insertNode(this.root, newNode);
      }
    }

    delete(key: any) {
      return deleteNode(this.root, key);
    }

    // 树的遍历
    // 中序遍历(从小到大，左-》跟-》右)
    inOrderTraverse(callback: any) {
      inOrderTraverseNode(this.root, callback);
    }

    // 先序遍历(跟-》左-》右)
    preOrderTraverse(callback: any) {
      preOrderTraverseNode(this.root, callback);
    }

    // 后序遍历(左-》右-》跟)
    postOrderTraverse(callback: any) {
      postOrderTraverseNode(this.root, callback);
    }

    // search-min
    min() {
      return search(this.root, 'left');
    }

    // search-max
    max() {
      return search(this.root, 'right');
    }

    search(key: any) {
      return searchNode(this.root, key);
    }
  }
})();
```
##  自平衡树
BST存在一个问题:取决于你添加的节点数，树的一条边可能会非常深;也就是说，树的一条分支会有很多层，而其他的分支却只有几层。<br>
这会在需要在某条边上添加、移除和搜索某个节点时引起一些性能问题。<br>
AVL树是一种自平衡二叉搜索树，意思是任何 一个节点左右两侧子树的高度之差最多为1。<br>
在AVL树中插入或移除节点和BST完全相同。然而，AVL树的不同之处在于我们需要检验它 的平衡因子，如果有需要，则将其逻辑应用于树的自平衡。