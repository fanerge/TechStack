/**
import result from '../modules/array';
import result from '../modules/array';
import result from '../modules/array';
 * 二分查找
 * @param {*} ary 
 * @param {*} target 
 * @return {*} index || -1
 */
function binarySearch(ary, target) {
  let low = 0;
  let high = ary.length - 1;
  // 必须要 low <= high ,因为存在 low = high = mid情况，这是需要 ary[mid] === targe 判断
  while (low <= high) {
    // let mid = parseInt((low + high) / 2, 10);
    let mid = Math.floor((low + high) / 2);
    if (target === ary[mid]) {
      return mid;
    } else if (target < ary[mid]) {
      high = mid - 1;
    } else if (target > ary[mid]) {
      low = mid + 1;
    }
  }

  return -1;
}

// 原码、反码、补码
// 正数的原码反码补码相同
// 负数的反码：除符号位外,原码各位取反
// 负数的补码：除符号位外,原码各位取反,再加1（即反码+1）

// 最大连续子数组
const oldArr = [1, -2, 3, 10, -4, 7, 2, -5, -1];
// [3, 10, -4, 7, 2]
// 分治法
// 动态规划
// 最优子结构
// 边界条件
// 状态转移方程
function maxAddSub(arr) {
  let startIndex = 0;
  let endIndex = 0;
  // 记录连续子数组最大和
  let result = arr[0];
  let sum = arr[0];
  arr.slice(1).forEach((item, index) => {
    // 如果前几项和大于零则继续追加，否则重置sum为当前值，重置startIndex为当前位置
    if (sum > 0) {
      sum += item;
    } else {
      startIndex = index + 1;
      sum = item;
    }
    // sum大于result，则需要更新result为sum，且endIndex需要重置为当前位置
    if (sum > result) {
      result = sum;
      endIndex = index + 1;
    }
  });
  return arr.slice(startIndex, endIndex + 1);
}
// console.log(maxAddSub(oldArr));
// 递归
function maxAddSub2(arr, startIndex, endIndex) {
  if (startIndex === endIndex) {
    return arr[startIndex];
  }
  let mid = Math.floor((startIndex + endIndex) / 2);
  let m1 = maxAddSub2(arr, startIndex, mid);
  let m2 = maxAddSub2(arr, mid + 1, endIndex);
  let now = arr[mid];
  left = arr[mid];

  for (let i = mid - 1; i >= startIndex; --i) {
    now += arr[i];
    left = Math.max(now, left);
  }
  right = arr[mid + 1];
  now = arr[mid + 1];
  for (let i = mid + 2; i <= endIndex; ++i) {
    now += arr[i];
    right = Math.max(now, right);
  }
  let m3 = left + right;
  return Math.max(m1, m2, m3);
}
// console.log(maxAddSub2(oldArr, 0, oldArr.length - 1))

var arrangeCoins = function (n) {
  for (let i = 0; i < n; i++) {
    debugger;
    if (n === (i * (i + 1)) / 2) {
      return i;
    }
    if (n > (i * (i + 1)) / 2) {
      return i - 1;
    }
  }
};
console.log(arrangeCoins(5));
