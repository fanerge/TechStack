// Flood fill 算法是从一个区域中提取若干个连通的点与其他相邻区域区分开（或分别染成不同颜色）的经典 算法。
/**
 * 200. 岛屿数量
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。
 * @param {*} grid 
 */

const grid = [
  ["1", "1", "1", "1", "0"],
  ["1", "1", "0", "1", "0"],
  ["1", "1", "0", "0", "0"],
  ["0", "0", "0", "0", "0"],
];

// dfs
const numIslands = function (grid) {
  let rows = grid.length;
  if (rows.length === 0) return 0;
  let cols = grid[0].length;
  let count = 0;
  // 标记该位置是否访问过，类似于水流过的地方
  let marked = grid.map((row) => {
    return row.map((col) => false);
  });
  // 方向数组，它表示了相对于当前位置的 4 个方向的横、纵坐标的偏移量，这是一个常见的技巧
  let direction = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 为岛屿且，没有访问过
      if (grid[i][j] === "1" && !marked[i][j]) {
        count++;
        dfs(i, j);
      }
    }
  }

  function dfs(x, y) {
    // 标记为访问过
    marked[x][y] = true;
    let directionLen = direction.length;
    for (let i = 0; i < directionLen; i++) {
      let newX = x + direction[i][0];
      let newY = y + direction[i][1];
      // 不越界 是岛屿 没访问过
      if (
        inArea(newX, newY) &&
        grid[newX][newY] === "1" &&
        !marked[newX][newY]
      ) {
        dfs(newX, newY);
      }
    }
  }

  function inArea(x, y) {
    return 0 <= x && x < rows && 0 <= y && y < cols;
  }

  return count;
};

// bfs
const numIslands1 = function (grid) {
  let rows = grid.length;
  if (rows.length === 0) return 0;
  let cols = grid[0].length;
  let count = 0;
  // 标记该位置是否访问过，类似于水流过的地方
  let marked = grid.map((row) => {
    return row.map((col) => false);
  });
  // 方向数组，它表示了相对于当前位置的 4 个方向的横、纵坐标的偏移量，这是一个常见的技巧
  let direction = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 为岛屿且，没有访问过
      if (grid[i][j] === "1" && !marked[i][j]) {
        count++;
        bfs(i, j);
      }
    }
  }

  function bfs(x, y) {
    // 标记为访问过
    marked[x][y] = true;
    let queue = [[x, y]];
    while (queue.length > 0) {
      let first = queue.shift();
      let directionLen = direction.length;
      for (let i = 0; i < directionLen; i++) {
        let newX = first[0] + direction[i][0];
        let newY = first[1] + direction[i][1];
        // 不越界 是岛屿 没访问过
        if (
          inArea(newX, newY) &&
          grid[newX][newY] === "1" &&
          !marked[newX][newY]
        ) {
          queue.push([newX, newY]);
          marked[newX][newY] = true;
        }
      }
    }
  }

  function inArea(x, y) {
    return 0 <= x && x < rows && 0 <= y && y < cols;
  }

  return count;
};

console.log(numIslands1(grid));
