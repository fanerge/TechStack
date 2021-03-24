/**
 * 从上到下按层打印二叉树，同一层结点按从左到右的顺序打印，每一层打印到一行。
 */
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
// 用队列实现
function queue1(tree) {
  let ans = [];
  let queue = [];

  if (tree) {
    queue.push(tree);
  }

  while (queue.length > 0) {
    let size = queue.length;
    let temp = [];
    for (let i = 0; i < size; i++) {
      let cur = queue.shift();
      cur.left && queue.push(cur.left)
      cur.right && queue.push(cur.right)
      temp.push(cur.val)
    }
    ans.push(temp)
  }

  return ans;
}

// 用 List 来表示每一层，把下一层的结点统一放到一个新生成的 List 里面。
function queue2(tree) {
  let ans = [];
  let curLevel = [];

  if (tree) {
    curLevel.push(tree);
  }

  while (curLevel.length > 0) {
    // 用来存放当前层的结果
    let curResult = [];
    // 准备用来存放下一层的结点
    let nextLevel = [];

    for (let cur of curLevel) {
      curResult.push(cur.val);
      // 生成下一层
      cur.left && nextLevel.push(cur.left);
      cur.right && nextLevel.push(cur.right);
    }
    curLevel = nextLevel;
    ans.push(curResult);
  }

  return ans;
}


/**
 * 设计一个可以容纳 k 个元素的循环队列
 */
// 只使用 k 个元素的空间，三个变量 front, rear, used 来控制循环队列的使用
// used 的作用，记录队列中右多少个元素，因为空对和满对时 front 和 rear 都相同
// 当前 index 为i，前一个 index =  (i-1 + k) % k;后一个 index = (i+1) % k
class MyCircularQueue {
  constructor(k) {
    // 下标只能在 [0, k-1]
    // 已经使用的元素个数
    this.used = 0;
    // 第一个元素所在位置
    this.front = 0;
    // rear是enQueue可在存放的位置，[front, rear)
    this.rear = 0;
    // 循环队列最多可以存放的元素个数
    this.capacity = k;
    // 循环队列的存储空间
    this.list = [];
  }

  // 将value放到队列中, 成功返回true
  enQueue(val) {
    const { list, rear, capacity } = this;
    if (this.isFull()) {
      return false;
    }
    list[rear] = val;
    this.rear = (rear + 1) % capacity;
    this.used++;
    console.log(`${val}入队`)
    return true;
  }

  // 删除队首元素，成功返回true
  deQueue() {
    const { list, front, capacity } = this;
    if (this.isEmpty()) {
      return false;
    }
    let temp = list[front];
    this.front = (front + 1) % capacity;
    this.used--;
    list[front] = null;
    console.log(`${temp}出队`)
    return true;
  }

  // 得到队首元素，如果为空，返回-1
  Front() {
    const { list, front } = this;
    if (this.isEmpty()) {
      return -1;
    }
    return list[front];
  }

  // 得到队尾元素，如果队列为空，返回-1
  Rear() {
    const { list, rear, capacity } = this;
    if (this.isEmpty()) {
      return -1;
    }
    // 注意：这里不能使用rear - 1
    // 需要取模
    let tail = (rear - 1 + capacity) % capacity;
    return list[tail];
  }

  // 看一下循环队列是否为空
  isEmpty() {
    const { used } = this;
    return used === 0;
  }

  // 看一下循环队列是否已放满k个元素
  isFull() {
    const { used, capacity } = this;
    return used === capacity;
  }
}

let cirQ = new MyCircularQueue(4);
window.qq = cirQ;
