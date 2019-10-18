#   数组（Array）
在JavaScript中的数组不一定是分配了连续内存，它是有条件的：数组项不许是单一类型，在非单一类型的数组中，它就不是连续内存了。
[数组和链表的比较](./array_and_linkedlist.md)
##  首部添加
首先我们要腾出数组里第一个元素的位置，把所有的元素向右移动一位。我们 可以循环数组中的元素，从最后一位+1(长度)开始，将其对应的前一个元素的值赋给它，依次 处理，最后把我们想要的值赋给第一个位置(0)上。<br>
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
[stack.ts](../src/modules/stack.ts)
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
[queue.ts](../src/modules/queue.ts)
##  优先队列
其中一个修改版就是优先队列。元素的添加和移除是基于优先级的。一个现实的例子就是机 场登机的顺序。头等舱和商务舱乘客的优先级要高于经济舱乘客。在有些国家，老年人和孕妇(或 带小孩的妇女)登机时也享有高于其他乘客的优先级。
[queue.ts](../src/modules/queue.ts)
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
[linkedList.ts](../src/modules/linkedList.ts)
##  双向链表
双向链表和普通链表的区别在于，在链表中， 一个节点只有链向下一个节点的链接，而在双向链表中，链接是双向的:一个链向下一个元素（next）， 另一个链向前一个元素（prev）。<br>
[linkedList.ts](../src/modules/linkedList.ts)
##  循环链表
循环链表可以像链表一样只有单向引用，也可以像双向链表一样有双向引用。循环链表和链 表之间唯一的区别在于，最后一个元素指向下一个元素的指针(tail.next)不是引用null， 而是指向第一个元素(head)。<br>
[linkedList.ts](../src/modules/linkedList.ts)
# 集合（Set）
集合是由一组无序且唯一(即不能重复)的项组成的。这个数据结构使用了与有限集合相同 的数学概念，但应用在计算机科学的数据结构中。
集合也有并集、交集、差集等基本操作。
##  实现简单集合
[Set.ts](../src/modules/Set.ts)
##  集合操作
并集:对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。
交集:对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。
差集:对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合。
子集:验证一个给定集合是否是另一集合的子集。<br>
[Set.ts](../src/modules/Set.ts)

# 字典（Dictionary）
在字典中，存储的是[键，值] 对，其中键名是用来查询特定元素的。字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。字典也称作映射。<br>
ES6元素支持Map。<br>
[dictionary.ts](../src/modules/dictionary.ts)

# 散列表（hashTable）
散列算法的作用是尽可能快地在数据结构中找到一个值。<br>
散列函数的作用是给定一个键值，然后 返回值在表中的地址。<br>
##  普通的散列表
[hashTable.ts](../src/modules/hashTable.ts)
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
二叉搜索树(BST)是二叉树的一种，但是它只允许你在左侧节点存储(比父节点)小的值， 在右侧节点存储(比父节点)大(或者等于)的值。<br>
[binarySearchTree.tsd](../src/modules/binarySearchTree.tsd)
##  自平衡树
BST存在一个问题:取决于你添加的节点数，树的一条边可能会非常深;也就是说，树的一条分支会有很多层，而其他的分支却只有几层。<br>
这会在需要在某条边上添加、移除和搜索某个节点时引起一些性能问题。<br>
AVL树是一种自平衡二叉搜索树，意思是任何 一个节点左右两侧子树的高度之差最多为1。<br>
在AVL树中插入或移除节点和BST完全相同。然而，AVL树的不同之处在于我们需要检验它 的平衡因子，如果有需要，则将其逻辑应用于树的自平衡。
# 图
##  图的相关术语
图是网络结构的抽象模型。图是一组由边连接的节点（或顶点）。任何二元关系都可以用图来表示。<br>
图 G = (V, E) // V:一组顶点。 E:一组边，连接V中的顶点。<br>
相邻顶点：由一条边连接在一起的顶点。<br>
顶点的度：相邻顶点的数量。<br>
路径：顶点v1，v2，...，vk的一个连续序列（其中相邻的顶点必须是连续的）。<br>
简单路径：要求不包含重复的顶点（环也是一个简单路径）。<br>
如果图中不存在环，则称该图是无环的。<br>
如果图中每两个顶点间都存在路径，则该图是连通的。<br>
图分为：有向图和无向图，未加权和加权的。<br>
如果图中每两个顶点间在双向上都存在路径，则该图是强连通的。
##  图的表示
邻接矩阵：每个节点都和一个整数相关联，该整数将作为数组的索引。如果索引为i的节点和索引为j的节点相邻，则array[i][j] === 1，否则array[i][j] === 0;<br>
邻接表：邻接表由图中每个顶点的相邻顶点列表所组成。<br>
关联矩阵：在关联矩阵中，矩阵的行表示顶点，列表示边。<br>
##  图的遍历
有两种算法可以对图进行遍历:广度优先 搜索(Breadth-First Search，BFS)和深度优先搜索(Depth-First Search，DFS)。<br>
白色:表示该顶点还没有被访问。<br>
灰色:表示该顶点被访问过，但并未被探索过。<br>
黑色:表示该顶点被访问过且被完全探索过。<br>
这就是之前提到的务必访问每个顶点最多两次的原因。<br>
### 广度优先搜素
广度优先搜索算法会从指定的第一个顶点开始遍历图，先访问其所有的相邻点，就像一次访问图的一层。换句话说，就是先宽后深地访问顶点。<br>
广度优先搜索（队列）通过将顶点存入队列中，最先入队列的顶点先被探索<br>
用途：寻找最短路径，加权图中的最短路径（GPS两城市的最短距离）<br>
Dijkstra算法解决了单源最短路径问题。Bellman-Ford算法解决了边权值为负的 单源最短路径问题。A*搜索算法解决了求仅一对顶点间的最短路径问题，它用经验法则来加速搜 索过程。Floyd-Warshall算法解决了求所有顶点对间的最短路径这一问题。
####  算法步骤（从v开始广度优先搜索）
```
(1) 创建一个队列Q。
(2) 将v标注为被发现的(灰色)，并将v入队列Q。 
(3) 如果Q非空，则运行以下步骤:
  (a) 将u从Q中出队列;
  (b) 将标注u为被发现的(灰色);
  (c) 将u所有未被访问过的邻点(白色)入队列;
  (d) 将u标注为已被探索的(黑色)。
```
[]()
### 深度优先搜索
深度优先搜索（栈）通过将顶点存入栈中，顶点是沿着路径被探索的，存在新的相邻顶点就去访问<br>
深度优先搜索算法将会从第一个指定的顶点开始遍历图，沿着路径直到这条路径最后一个顶 点被访问了，接着原路回退并探索下一条路径。
####  算法步骤
```
要访问顶点v，照如下步骤做。 
(1) 标注v为被发现的(灰色)。
(2) 对于v的所有未访问的邻点w，访问顶点w，标注v为已被探索的(黑色)。
```
用途：拓扑排序（编排一些任务或步骤的执行顺序时）