// BFS（实现原理-queue）
/**
 *
 * @param {*} node {val: Number, left: node|null, right: node|null}
 * @param {*} target
 * @return {boolean}
 */
function BFS(node, target) {
  // 开始前放入根节点
  let queue = [node];
  // queue不为空，继续遍历
  while (queue.length) {
    let len = queue.length;
    for (let i = 0; i < len; i++) {
      let first = queue.shift();
      if (first.val === target) {
        return true;
      }
      // 将其子节点放入队列
      first.left && queue.push(first.left);
      first.right && queue.push(first.right);
    }
  }
  return false;
}

// DFS（实现原理-栈，递归原理其实也是栈，只不过是系统栈）
/**
 *
 * @param {*} node
 * @param {*} target
 */
function DFS(node, target) {
  let stack = [node];
  let list = [];
  while (stack.length) {
    let top = stack.pop();
    list.push(top.val);
    // 根
    if (top.val === target) return true;
    // 左
    top.left && stack.push(top.left);
    // 右
    top.right && stack.push(top.right);
  }
}

// 🌲的preOrder、midOrder、postOrder
// 左根右
var midOrder = function (node, ary) {
  if (node.left) {
    midOrder(node.left, ary);
  }
  ary.push(node.val);
  if (node.right) {
    midOrder(node.right, ary);
  }
  return ary;
};
