/**
 * 列题
 * https://leetcode-cn.com/problems/search-insert-position/
 * https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/
 * https://leetcode-cn.com/problems/peak-index-in-a-mountain-array/description/
 * https://www.acwing.com/problem/content/65/
 * https://leetcode-cn.com/problems/search-in-rotated-sorted-array/description/
 * 
 */


// 首先设定初始区间，这里我们采用开闭原则[l, r)，r为 arr.length，所以取不到
function binarySearch(arr, target) {
  if (!Array.isArray(arr)) return -1;
  if (Array.isArray(arr) && arr.length === 0) return -1;
  let len = arr.length;
  let left = 0;
  let right = len;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else if (arr[mid] > target) {
      right = mid;
    }
  }

  return -1;
}

// console.log(binarySearch([1, 3, 4, 5, 6, 7, 8, 9], 5));

/***
 * 【题目】给定一个有序数组，返回指定元素在数组的最左边的位置
输入：A = [1, 2, 2, 2, 2, 3, 3], target = 2
输出：1
解释：第一个出现的 2 位于下标 1，是从左往右看时，第一个出现 2 的位置。
 */
function lowerBound(arr, target) {
  let len = arr.length;
  let left = 0;
  let right = len;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    // 找到一个最终切分点 L，需要满足 [0, L) 区间里面的元素都必须小于 target，而 [L, ~) 右边的元素都 >= target。
    // 查找的区间一直是一个左开右闭区间 [L, R)；
    // 每次总是把 >= target 的区间扔掉，大于等于的不要了，然后设置 R = M；
    // 当最后的区间元素都 < target 的时候，移动 L，小于的也不要了，然后设置 L = M + 1。
    if (arr[mid] < target) {
      left = mid + 1;
    } else if (arr[mid] >= target) {
      right = mid;
    }
  }

  return left;
}
// console.log(lowerBound([1, 2, 2, 2, 2, 2, 3, 3, 5], 0));

/**
 * 写一个函数 upperBound 寻找数组中给定元素的上界。注意，上界是刚好比 target 大的那个元素的位置。
 * 比如 A = [1, 1, 100, 100]，target = 1，那么 upperBound 应该返回下标 2。
 */
function upperBound(arr, target) {
  let len = arr.length;
  let left = 0;
  let right = len;

  while (left < right) {
    let mid = left + Math.floor((right - left) / 2);
    // upperBound 函数是找一个切分点 L，使得：
    // 所有[0, L) 左区间里面的元素 <= target
    // target < 所有[L, R) 右区间里面的元素
    // 当 A[M] <= target 的时候，需要把 [L, M] 区间扔掉。此时需要设置 L = M + 1；
    // 当 A[M] > target 的时候，需要把(M, R) 区间扔掉。此时需要设置 R = M。
    if (arr[mid] <= target) {
      left = mid + 1;
    } else if (arr[mid] > target) {
      right = mid;
    }
  }

  return left;
}
// console.log(upperBound([1, 2, 2, 2, 2, 2, 3, 3, 5], 2));
