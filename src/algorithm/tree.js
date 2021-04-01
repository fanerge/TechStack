// 参考地址
// https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie/xue-xi-shu-ju-jie-gou-he-suan-fa-de-gao-xiao-fang-fa
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

// 遍历模版
// void traverse(TreeNode root) {
//   // 前序遍历
//   traverse(root.left)
//   // 中序遍历
//   traverse(root.right)
//   // 后序遍历
// }

// BFS（实现原理-queue）
/**
 *
 * @param {*} node {val: Number, left: node|null, right: node|null}
 * @return {array} output
 */
function BFS(node) {
  let output = [];
  // 开始前放入根节点
  let queue = [node];
  // queue不为空，继续遍历
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let first = queue.shift();
      output.push(first.val);
      // 将其子节点放入队列
      first.left && queue.push(first.left);
      first.right && queue.push(first.right);
    }
  }
  return output;
}

// DFS（实现原理-栈，递归原理其实也是栈，只不过是系统栈）
// 🌲的preOrder（递归版，使用系统调用栈）

function preOrder(node, ary = []) {
  if (!node) return ary;
  // 根
  ary.push(node.val);
  // 左
  preOrder(node.left, ary);
  // 右
  preOrder(node.right, ary);
  return ary;
}
// 🌲的preOrder（迭代版，使用模拟栈）
function preOrder1(root) {
  let stack = [];
  let ans = [];
  // 开始利用栈来进行遍历
  while (root !== null || stack.length > 0) {
    // 模拟递归的压栈过程(根-》左-》右)
    while (root !== null) {
      stack.push(root);
      ans.push(root.val);
      root = root.left;
    }
    // 下一次迭代将右节点入栈，当无法压栈的时候，将root.right进行压栈
    let top = stack.pop();
    root = top.right;
  }

  return ans;
}

/**
 * https://zhuanlan.zhihu.com/p/101321696
 * tree，神级遍历——morris
 * morris遍历利用的是树的叶节点左右孩子为空（树的大量空闲指针），实现空间开销的极限缩减。
 */

// 🌲的midOrder（递归版，使用系统调用栈）
function midOrder(root, ary = []) {
  if (!root) return ary;
  // 左
  midOrder(root.left, ary);
  // 根
  ary.push(root.val);
  // 右
  midOrder(root.right, ary);
  return ary;
}
// 🌲的midOrder（迭代版，使用模拟栈）
function midOrder1(root) {
  let stack = [];
  let ans = [];
  while (root !== null || stack.length > 0) {
    // 往左边走，连续入栈，直到不能再走为止
    while (root !== null) {
      stack.push(root);
      root = root.left;
    }
    // 到达了最左边，把结点弹出来，进行遍历
    root = stack.pop();
    ans.push(root.val);
    // 转向右子树
    root = root.right
  }

  return ans;
}

// 🌲的postOrder（递归版，使用系统调用栈）
function postOrder(root, ary = []) {
  if (!root) return ary;
  // 左右根
  postOrder(root.left, ary);
  postOrder(root.right, ary);
  ary.push(root.val);
  return ary;
}
// 🌲的postOrder（迭代版，使用模拟栈）
function postOrder1(t) {
  let ans = [];
  // pre表示遍历时前面一个已经遍历过的结点
  let pre = null;
  let stack = [];
  // 如果栈中还有元素，或者当前结点t非空
  while (stack.length > 0 || t !== null) {
    // 顺着左子树走，并且将所有的元素压入栈中
    while (t !== null) {
      stack.push(t);
      t = t.left;
    }
    // 当没有任何元素可以压栈的时候
    // 拿栈顶元素，注意这里并不将栈顶元素弹出
    // 因为在迭代时，根结点需要遍历两次，这里需要判断一下
    // 右子树是否遍历完毕
    t = stack[stack.length - 1];
    // 如果要遍历当前结点，需要确保右子树已经遍历完毕
    // 1. 如果当前结点左子树为空，那么右子树没有遍历的必要
    // 需要将当前结点放到ans中
    // 2. 当t.right == pre时，说明右子树已经被打印过了
    // 那么此时需要将当前结点放到ans中
    if (t.right === null || t.right === pre) {
      // 右子树已经遍历完毕，放到ans中。
      ans.push(t.val);
      // 弹栈
      stack.pop();
      // 因为已经遍历了当前结点，所以需要更新pre结点
      pre = t;
      // 已经打印完毕。需要设置为空，否则下一轮循环
      // 还会遍历t的左子树。
      t = null;
    } else {
      // 第一次走到t结点，不能放到ans中，因为t的右子树还没有遍历。
      // 需要将t结点的右子树遍历
      t = t.right;
    }
  }

  return ans;
}

// 从中序与后序遍历序列构造二叉树
function buildTree(inorder, postorder) {
  let build = (inorder) => {
    if (inorder.length === 0) return null;
    // 先序的话，根节点在 preorder.shift()
    let rootVal = postorder.pop();
    let rootIndex = inorder.indexOf(rootVal);
    let root = new TreeNode(rootVal);
    // 先序的话，需要交换 root.right 和 root.left 个构建顺序
    root.right = build(inorder.slice(rootIndex + 1));
    root.left = build(inorder.slice(0, rootIndex));
    return root;
  };

  return build(inorder);
}

/**
 * 
给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。
输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
输出：[[5,4,11,2],[5,8,4,5]]
 */
var pathSum = function (root, sum) {
  let ans = [];
  function backTrack(node, path = [], cur, target, ans) {
    if (node === null) {
      return;
    }
    // 前序遍历，加上累计的和
    cur += node.val;
    // 将结点添加到路径中，相当于压栈一样
    path.push(node.val);
    if (node.left === null && node.right === null) {
      if (cur === target) {
        ans.push(path.slice(0));
      }
    } else {
      // 回溯，分别再看子情况。
      backTrack(node.left, path, cur, target, ans);
      backTrack(node.right, path, cur, target, ans);
    }
    // 函数结束的时候弹栈，也要把结点从路径最后扔掉!
    path.pop();
  }
  backTrack(root, [], 0, sum, ans)

  return ans;
};
