// offer1
const arr = [
  [1, 2, 3],
  [7, 8, 9],
  [8, 9, 10]
];
function isInclude(arr, value) {
  const min = arr[0][0];
  const max = arr[arr.length -1].slice(-1);
  if (value < min) {
    return false;
  }
  if (value > max) {
    return false;
  }
  // 找出每个数组最大值
  const arrMax = arr.map((item) => item[item.length -1]); // 3, 4, 5
  const arrMin = arr.map((item) => item[0]); // 1, 2, 7
  const arrIndex = [];
  for (let i = 0; i < arrMax.length; i++) {
    if(arrMax[i] === value) {
      return true;
    }
    if (arrMax[i] < value) {
      arrIndex.push(i);
    }
  }
  for (let i = 0; i < arrMin.length; i++) {
    if(arrMin[i] === value) {
      return true;
    }
    if (arrMin[i] > value) {
      arrIndex.push(i);
    }
  }
  // ...new Set(arrIndex)
  const newArray = [];
  [...new Set(arrIndex)].forEach(item => {
    newArray.push(...arr[item]);
  });

  return newArray.includes(value);
}
// const test = isInclude(arr, 7);
// console.log(test);

// offer 2
// We Are Happy => We%20Are%20Happy
function spaceReplace (str) {
  return str.replace(/\s/g, '%20');
}
// const str = 'We Are Happy';
// const test = spaceReplace(str);
// console.log(test);

// offer（3）从尾到头打印链表
// 栈的思想
function tailPrint (head) {
  let arr = [];
  let node  = head;
  while(node){
    arr.unshift(node);
    node = node.next;
  }

  return arr;
}

// offer（4）重建二叉树
// 先序遍历（根左右）VLR
// 中序遍历（左根右）
// 后序遍历（左右根）
// 例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回
function reConstructBinaryTree (pre, vin) {
  if (pre.length === 0 || vin.length === 0) {
    return null;
  }
  let index = vin.indexOf(pre[0]); // 根节点
  let left = vin.slice(0, index); // 左子树
  let right = vin.slice(index + 1); // 右子树

  return {
    val: pre[0],
    left: reConstructBinaryTree(pre.slice(1, index + 1), left),
    right: reConstructBinaryTree(pre.slice(index + 1), right)
  };
}
// var pre = [1,2,4,7,3,5,6,8];
// var vin = [4,7,2,1,5,3,8,6];
// console.log(reConstructBinaryTree(pre, vin));

// offer（5）用两个栈实现队列
// 栈先进后出
// 队列先进先出
// 用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。
// const outStack = [];
// const inStack = [];
// function push (node) {
//   inStack.push(node);
// }

// function pop () {
//   let len = inStack.length;
//   if (len > 0) {
//     for (let i = 0; i < len; i++) {
//       outStack.push(inStack.pop());
//     }
//   }
//   return outStack.pop();
// }
// const outStack = [],
//   inStack = [];
// function push(node) {
//   // write code here
//   inStack.push(node);
// }
// function pop() {
//   // 每次都要outStack取完了再往里添加
//   if (!outStack.length) {
//     while (inStack.length) {
//       outStack.push(inStack.pop());
//     }
//   }
//   return outStack.pop();
// }
// push(1)
// push(2)
// push(4)
// console.log(pop());
// console.log(pop());
// push(5);
// push(6);
// console.log(pop());
// console.log(pop());
// console.log(pop());
// console.log(pop());


// offer 6

// offer 7 斐波那契数列 1 1 2 3 5 8 13 21
// 递归方案
// function offer7 (n) {
//   if (n === 1 || n === 2) {
//     return 1;
//   }

//   return offer7(n-1) + offer7(n-2);
// }
// console.log(offer7(6));
// 动态规划
// 动态规划的特点是：最优子结构、无后效性、子问题重叠。
// 确定边界：F[1] = 1; F[2] = 1;
// 状态转移：F[i] = F[i - 1] + F[i - 2]; 
// function offer7 (n) {
//   let n1 = 1;
//   let n2 = 1;
//   let n3 = 1;

//   for (var i = 3; i <= n; i++) {
//     n3 = n1 + n2;
//     n1 = n2;
//     n2 = n3;
//   }

//   return n3;
// }
// console.log(offer7(8))

// 剑指offer（8）跳台阶
// 一只青蛙一次可以跳上1级台阶，也可以跳上2级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
// a.假定第一次跳的是一阶，那么剩下的是n-1个台阶，跳法是f(n-1);
// b.假定第一次跳的是2阶，那么剩下的是n-2个台阶，跳法是f(n-2)
// c.由a\b假设可以得出总跳法为: f(n) = f(n-1) + f(n-2) 
// d.然后通过实际的情况可以得出：只有一阶的时候 f(1) = 1 ,只有两阶的时候可以有 f(2) = 2
function offer8(n){
  let n1 = 1;
  let n2 = 2;
  let n3 = n === n1 ? n1 : n2;

  for (let i = 3; i <= n; i++) {
    n3 = n2 + n1;
    n1 = n2;
    n2 = n3;
  }

  return n3;
}
// console.log(offer8(5));

// 剑指offer（9）变态跳台阶,一只青蛙一次可以跳上1级台阶，也可以跳上2级……它也可以跳上n级。求该青蛙跳上一个n级的台阶总共有多少种跳法。
// f(n) = 2f(n-1)
// f(1) = 1;
// f(2) = 2;
// f(3) = 4;
function offer9(n) {
  if (n === 1) {
    return 1;
  }
  let n1 = 1;
  let temp;
  for (let i = 2; i <= n; i++) {
    temp = 2 * n1;
    n1 = 2 * n1;
  }

  return temp;
}
// console.log(offer9(4));

// 剑指offer（10）矩形覆盖












