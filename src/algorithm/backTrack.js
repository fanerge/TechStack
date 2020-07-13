/**
 * 理解回溯算法
 * 22题括号生成
 * 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
输入：n = 3
输出：[
       "((()))",
       "(()())",
       "(())()",
       "()(())",
       "()()()"
     ]
 * @param {*} n 
 */
var generateParenthesis = function (n) {
  if (n === 0) return [];
  // 存储结果
  let res = [];
  backTrack("", 0, 0, n);
  /**
   *
   * @param {*} cur 构建好的字符串
   * @param {*} left 构建好的字符数串中左括号的数量
   * @param {*} right 构建好的字符数串中右括号的数量
   * @param {*} max 左右括号的最大数量
   */
  function backTrack(cur, left, right, max) {
    if (cur.length === 2 * max) {
      res.push(cur);
      return;
    }

    // 过滤掉不满足要求的结构（剪枝）
    // 左括号小于max
    if (left < max) {
      backTrack(cur + "(", left + 1, right, max);
      // 回溯到之前的状态给后面可能的结果使用
      cur = cur.slice(0, cur.length);
    }

    // 左括号的数量大于右括号才允许添加右括号
    if (left > right) {
      backTrack(cur + ")", left, right + 1, max);
      // 回溯到之前的状态给后面可能的结果使用
      cur = cur.slice(0, cur.length);
    }
  }

  return res;
};

/**
 * 单词搜索
 * 给定一个二维网格和一个单词，找出该单词是否存在于网格中。
单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
给定 word = "ABCCED", 返回 true
给定 word = "SEE", 返回 true
给定 word = "ABCB", 返回 false
相关类型题型链接
[「力扣」第 130 题：被围绕的区域](https://leetcode-cn.com/problems/surrounded-regions/)
[「力扣」第 200 题：岛屿数量](https://leetcode-cn.com/problems/number-of-islands/)
* @param {*} board 
 * @param {*} word 
 */
var exist = function (board, word) {
  // 作为标记，表示该坐标的字符是否已经使用，如果已经使用后续将不能再使用
  let marked = board.map((row) => {
    return row.map((col) => {
      return false;
    });
  });

  // 一维数组下标分别代表'上右下左'的坐标变化，二维数组第一项代表横坐标，第二项代表纵坐标
  const direction = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const rows = board.length;
  const cols = board[0].length;

  if (rows === 0) {
    return false;
  }

  // 从二维数组中任意位置作为起点
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dfs(i, j, 0)) {
        return true;
      }
    }
  }

  function dfs(row, col, curIndex) {
    // 是否已经匹配到word的最后一个字符
    if (curIndex === word.length - 1) {
      // 最后一个字符都匹配，那肯定找到了呗。
      return board[row][col] === word[curIndex];
    }
    if (board[row][col] === word[curIndex]) {
      // 继续匹配word的下一个字符(可能4个方向)
      marked[row][col] = true;
      let directionLen = direction.length;
      for (let i = 0; i < directionLen; i++) {
        let newRow = row + direction[i][0];
        let newCol = col + direction[i][1];
        // marked 作为标记是否已经使用过该坐标
        if (inArea(newRow, newCol) && !marked[newRow][newCol]) {
          if (dfs(newRow, newCol, curIndex + 1)) {
            return true;
          }
        }
      }
      marked[row][col] = false;
    }
    return false;
  }

  function inArea(row, col) {
    return 0 <= row && row < rows && 0 <= col && col < cols;
  }

  return false;
};
const board = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(exist(board, "ABCCED"));
