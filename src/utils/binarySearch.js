/**
 * 二分查找1种原型+6种变体
 * 原型right 初始值取 ary.length，循环条件left <= right，mid 初始值为 left + Math.floor((right - left) / 2)
 * 6种变体，right 初始值取 ary.length - 1，循环条件left < right
 * 重点6种变体的mid 初始值（求解最大值）left + Math.floor((right - left + 1) / 2)
 * 重点6种变体的mid 初始值（求解最小值）left + Math.floor((right - left) / 2)
 *
 */
// 二分查找
// 查找某个元素是否存在
function findValue(ary, target) {
  let left = 0;
  let right = ary.length;
  let mid;
  while (left <= right) {
    // 防止 left + right 溢出
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] === target) {
      return mid;
    } else if (ary[mid] > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return -1;
}
// console.log(findValue([1, 2, 4, 5, 7], 2));

// 最小的i， 满足a[i] = target. 不存在 返回 -1
function findFirstEQValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间； 偶数： 两个中间数的第一个
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] >= target) {
      right = mid;
    } else {
      // ary[mid] < target
      left = mid + 1;
    }
  }

  return ary[left] === target ? left : -1;
}
// console.log(findFirstEQValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 10));

// 最大的i， 满足arr[i] = target. 不存在 返回 -1
function findLastEQValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间；  偶数 ： 两个中间数的第二个
    mid = left + Math.floor((right - left + 1) / 2);
    if (ary[mid] <= target) {
      left = mid;
    } else {
      // ary[mid] > target
      right = mid - 1;
    }
  }

  return ary[left] === target ? left : -1;
}
// console.log(findLastEQValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 6));

// 求最小的i，使得a[i] > target，若不存在，则返回-1
function findFirstGTValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间；  偶数 ： 两个中间数的第一个
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] > target) {
      right = mid;
    } else {
      // ary[mid] <= target
      left = mid + 1;
    }
  }

  return ary[left] > target ? left : -1;
}
// console.log(findFirstGTValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 9));

// 求最大的i，满足a[i] < target， 若不存在， 返回 -1
function findLastLTValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间；  偶数 ： 两个中间数的第二个
    mid = left + Math.floor((right - left + 1) / 2);
    if (ary[mid] < target) {
      left = mid;
    } else {
      // ary[mid] >= target
      right = mid - 1;
    }
  }

  return ary[left] < target ? left : -1;
}
// console.log(findLastLTValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 9));

// 求最小的i，满足a[i] >= target， 若不存在， 返回 -1
function findFirstGEValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间；  偶数 ： 两个中间数的第一个
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] >= target) {
      right = mid;
    } else {
      // ary[mid] < target
      left = mid + 1;
    }
  }

  return ary[left] >= target ? left : -1;
}
// console.log(findFirstGEValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 6));

// 求最大的i，满足a[i] <= target， 若不存在， 返回 -1
function findLastLEValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // 奇数： 中间；  偶数 ： 两个中间数的第二个
    mid = left + Math.floor((right - left + 1) / 2);
    if (ary[mid] <= target) {
      left = mid;
    } else {
      // ary[mid] > target
      right = mid - 1;
    }
  }

  return ary[left] <= target ? left : -1;
}
// console.log(findLastLEValue([1, 2, 3, 4, 5, 9, 9, 9, 9, 9, 11, 18], 20));
