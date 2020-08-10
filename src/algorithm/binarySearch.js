// 模版
// https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie/er-fen-cha-zhao-xiang-jie
// int binarySearch(int[] nums, int target) {
//   int left = 0, right = ...;
//   while(...) {
//       int mid = left + Math.floor((right - left) / 2);
//       if (nums[mid] == target) {
//           ...
//       } else if (nums[mid] < target) {
//           left = ...
//       } else if (nums[mid] > target) {
//           right = ...
//       }
//   }
//   return ...;
// }
// 分析：如果 right=nums.length-1; 则while循环应该为 left<=right; 访问区间[0, nums.length-1]
// 分析：如果 right=nums.length; 则while循环应该为 left<right; 访问区间[0, nums.length) // 开区间
// 注意下面的越界处理
// 分析：当while循环为 left<=right时，退出循环 left=right+1
// 分析：当while循环为 left<right时，退出循环 left===right

/**
 * 二分查找1种原型+6种变体
 * 原型right 初始值取 ary.length，循环条件left <= right，mid 初始值为 left + Math.floor((right - left) / 2)
 * 6种变体，right 初始值取 ary.length - 1，循环条件left < right
 * 重点6种变体的mid 初始值（求解最大值）left + Math.floor((right - left + 1) / 2)
 * 重点6种变体的mid 初始值（求解最小值）left + Math.floor((right - left) / 2)
 * 如果 left = mid + 1; right = mid - 1; 则上面循环条件必须为 left <= right，不然会遗漏掉 left=right的情况
 * PS边界处理需要注意
 * left + Math.floor((right - left) / 2) 为向下取整
 * left + Math.floor((right - left + 1) / 2) 为向上取整
 *
 */
// 二分查找
// 查找某个元素是否存在
function findValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
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

// leetcode整理的3个模版
// https://leetcode-cn.com/explore/learn/card/binary-search/212/template-analysis/847/
// template1
/**
 * 终止迭代后：right + 1 = left
 * 二分查找的最基础和最基本的形式。
 * 查找条件可以在不与元素的两侧进行比较的情况下确定（或使用它周围的特定元素）。
 * 不需要后处理，因为每一步中，你都在检查是否找到了元素。如果到达末尾，则知道未找到该元素。
 */
function template1(ary, target) {
  let left = 0;
  let right = ary.length - 1;
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
  // console.log(left, right);
  return -1;
}
// console.log(template1([1, 2, 4, 5, 7, 8, 9], 6));

// template2
/**
 * 终止迭代后：right = left
 * 一种实现二分查找的高级方法。
 * 查找条件需要访问元素的直接右邻居。
 * 使用元素的右邻居来确定是否满足条件，并决定是向左还是向右。
 * 保证查找空间在每一步中至少有 2 个元素。
 * 需要进行后处理。 当你剩下 1 个元素时，循环 / 递归结束。 需要评估剩余元素是否符合条件。
 */
function template2(ary, target) {
  let left = 0;
  let right = ary.length;
  let mid;
  while (left < right) {
    // 防止 left + right 溢出
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  // console.log(left, right);

  // 根据不同要求得到结果
  // 小于等于target
  // return ary[left] <= target ? left : left - 1;
  // 小于target
  // return ary[left] < target ? left : left - 1;
  // 大于等于target
  // return ary[left] >= target ? left : -1;
  // 大于target
  return ary[left] > target ? left : left + 1;
}
// console.log(template2([1, 2, 4, 5, 7, 8], 8));

// template3
/**
 * 终止迭代后：right = left + 1
 * 实现二分查找的另一种方法。
 * 搜索条件需要访问元素的直接左右邻居。
 * 使用元素的邻居来确定它是向右还是向左。
 * 保证查找空间在每个步骤中至少有 3 个元素。
 * 需要进行后处理。 当剩下 2 个元素时，循环 / 递归结束。 需要评估其余元素是否符合条件。
 */
function template3(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let mid;
  while (left + 1 < right) {
    mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid;
    } else {
      right = mid;
    }
  }
  // console.log(left, right);
  return nums[left] === target ? left : -1;
}
// console.log(template3([1, 2, 4, 5, 7, 8], 5));
