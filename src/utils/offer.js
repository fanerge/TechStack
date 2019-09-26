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
const outStack = [],
  inStack = [];
function push(node) {
  // write code here
  inStack.push(node);
}
function pop() {
  // 每次都要outStack取完了再往里添加
  if (!outStack.length) {
    while (inStack.length) {
      outStack.push(inStack.pop());
    }
  }
  return outStack.pop();
}
push(1)
push(2)
push(4)
console.log(pop());
console.log(pop());
push(5);
push(6);
console.log(pop());
console.log(pop());
console.log(pop());
console.log(pop());