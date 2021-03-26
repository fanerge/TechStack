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
 * 当前 index 为i，前一个 index =  (i-1 + k) % k;后一个 index = (i+1) % k
 */
// 方法1（多一个变量来区分空队和满队）
// 只使用 k 个元素的空间，三个变量 front, rear, used 来控制循环队列的使用
// used 的作用，记录队列中右多少个元素，因为空对和满对时 front 和 rear 都相同
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
// let cirQ = new MyCircularQueue(4);
// window.qq = cirQ;

// 方法2（多申请一个空间来区分空队和满队）
// 申请空间 k + 1, 并且 capacity 也必须为 k + 1
// front == rear 此时队列为空
// (rear + 1) % capacity == front，此时队列为满
class MyCircularQueue1 {
  // k 为容量
  constructor(k) {
    // 下标只能在 [0, k-1]
    // 第一个元素所在位置
    this.front = 0;
    // rear是enQueue可在存放的位置，[front, rear)
    this.rear = 0;
    // 循环队列最多可以存放的元素个数为 k，需要多申请一个位置
    this.capacity = k + 1;
    // 循环队列的存储空间
    this.list = new Array(k + 1);
    // this.isFull = this.isFull.bind(this);
  }

  // 将value放到队列中, 成功返回true
  enQueue(val) {
    const { isFull, list, rear, capacity } = this;
    if (isFull()) {
      return false;
    }
    list[rear] = val;
    this.rear = (rear + 1) % capacity;
    console.log(`${val}入队`);
    return true;
  }

  // 删除队首元素，成功返回true
  deQueue() {
    const { list, front, capacity } = this;
    let ret = list[front];
    this.front = (front + 1) % capacity
    list[front] = null;
    console.log(`${ret}出队`)
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
    const { Front, Rear } = this;
    return Front === Rear;
  }

  // 看一下循环队列是否已放满k个元素
  isFull() {

    const { front, rear, capacity } = this;
    return (rear + 1) % capacity === front;
  }
}
// let cirQ = new MyCircularQueue1(4);
// window.qq = cirQ;


/**
 * 滑动窗口的最大值
 * 给定一个数组和滑动窗口的大小，请找出所有滑动窗口里的最大值。
 * 输入：nums = [1,3,-1,-3,5,3], k = 3
 * 输出：[3,3,5,5]
 * 根据题意，用单调递减队列解题
 */
class Queue2 {
  constructor() {
    this.queue = [];
  }

  push(val) {
    const { queue } = this;
    while (queue.length > 0 && queue[queue.length - 1] < val) {
      queue.pop();
    }
    queue.push(val);
  }

  pop(val) {
    const { queue } = this;
    if (queue.length > 0 && queue[0] === val) {
      // 注意，队头出对
      queue.shift();
    }
  }

  maxSlidingWindow(nums, k) {
    const { queue } = this;
    let ans = [];
    for (let i = 0; i < nums.length; i++) {
      this.push(nums[i]);
      if (i < k - 1) {
        continue;
      }
      ans.push(queue[0])
      this.pop(nums[i - k + 1])
    }
    return ans;
  }
}
// test
// var list = [1, 3, -1, 3, 5, 3, 5, 6, 7, 1, 2, 3];
// var queue1 = new Queue2();
// console.log(queue1.maxSlidingWindow(list, 3))

// 滑动窗口的最小值
class Queue3 {
  constructor() {
    this.queue = [];
  }

  push(val) {
    const { queue } = this;
    while (queue.length > 0 && queue[queue.length - 1] > val) {
      queue.pop();
    }
    queue.push(val);
  }

  pop(val) {
    const { queue } = this;
    if (queue.length > 0 && queue[0] === val) {
      // 注意，队头出对
      queue.shift();
    }
  }

  maxSlidingWindow(nums, k) {
    const { queue } = this;
    let ans = [];
    for (let i = 0; i < nums.length; i++) {
      this.push(nums[i]);
      if (i < k - 1) {
        continue;
      }
      ans.push(queue[0])
      this.pop(nums[i - k + 1])
    }
    return ans;
  }
}
// test
// var list = [1, 3, -1, 3, 5, 3, 5, 6, 7];
// var queue1 = new Queue3();
// console.log(queue1.maxSlidingWindow(list, 3))


/**
 * 捡金币游戏
 * 给定一个数组 A[]，每个位置 i 放置了金币 A[i]，小明从 A[0] 出发。当小明走到 A[i] 的时候，下一步他可以选择 A[i+1, i+k]（当然，不能超出数组边界）。* 每个位置一旦被选择，将会把那个位置的金币收走（如果为负数，就要交出金币）。请问，最多能收集多少金币？
 * 输入：[1,-1,-100,-1000,100,3], k = 2
 * 输出：4
 * 通过这道题你应该明白，有的时候，滑动窗口不一定是在给定的数组上操作，还可能会在一个隐藏的数组上操作。
 */
function maxResult(A, k) {
  if (A === null || A.length === 0 || k <= 0) {
    return 0;
  }
  // 每个位置可以收集到的金币数目
  let get = [];
  // 单调递减队列(最大值)
  let queue = [];

  for (let i = 0; i < A.length; i++) {
    // 在取最大值之前，需要保证单调队列中都是有效值。
    // 也就是都在区间里面的值
    // 当要求get[i]的时候，
    // 单调队列中应该是只能保存[i-k, i-1]这个范围
    if (i - k > 0) {
      if (queue.length > 0 && queue[0] === get[i - k - 1]) {
        queue.shift();
      }
    }
    // 从单调队列中取得较大值
    let old = queue.length === 0 ? 0 : queue[0];
    get[i] = old + A[i];
    // 入队的时候，采用单调队列入队
    while (queue.length > 0 && queue[queue.length - 1] < get[i]) {
      queue.pop();
    }
    queue.push(get[i])
  }

  return get[A.length - 1]
}
// test
// console.log(maxResult([1, -1, -100, -1000, 100, 3], 2));
