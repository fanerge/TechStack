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

var findTheDistanceValue = function (arr1, arr2, d) {
  let n = 0;
  arr2.sort((a, b) => a - b);
  for (let i = 0; i < arr1.length; i++) {
    let index = bf(arr2, arr1[i]);
    debugger;
    if (
      Math.abs(arr1[i] - arr2[index]) >= d &&
      Math.abs(arr1[i] - arr2[index - 1]) >= d &&
      Math.abs(arr1[i] - arr2[index + 1]) >= d
    ) {
      n++;
    }
  }
  return n;
};

var merge = function (A, m, B, n) {
  let i = m - 1;
  let j = n - 1;
  let k = n + m - 1;
  if (m === 0) {
    while (j >= 0) {
      A[k] = B[j];
      j--;
      k--;
    }
  }
  while (i >= 0 && j >= 0) {
    if (A[i] >= B[j]) {
      A[k] = A[i];
      i--;
    } else {
      A[k] = B.pop();
      j--;
    }
    k--;
  }
  if (i === -1) {
    while (B.length) {
      A[k] = B.pop();
      k--;
    }
  }
  console.log(A);
};

var arrayRankTransform = function (arr) {
  let sortArr = [...new Set(arr)].sort((a, b) => a - b);
  let temp = arr.map((item, index) => {
    return sortArr.indexOf(item) + 1;
    // return sortArr.findIndex(item1 => {
    //     return item1 === item
    // }) + 1;
  });
  console.log(temp);
  return temp;
};

var balancedStringSplit = function (s) {
  let a = [];
  let i = 1;
  let n = 0;
  a.push(s[0]);
  while (i < s.length) {
    if (a.length === 0 || a[a.length - 1] === s[i]) {
      a.push(s[i]);
    } else {
      a.pop();
      if (a.length === 0) {
        n++;
      }
    }
    i++;
  }
  return n;
};

var compress = function (chars) {
  let oldCount;
  let count = 1;
  let i = 1;
  let aryLen = 0;
  if (chars.length === 1) {
    return;
  }
  while (i < chars.length) {
    if (chars[i - 1] === chars[i]) {
      count++;
    } else {
      oldCount = count;
      count = 1;
    }
    if (count === 1 && oldCount > 0) {
      debugger;
      let oldStr = String(oldCount);
      // 字符
      chars[aryLen++] = chars[i - 1];
      // 数量
      if (oldCount > 1 && oldStr.length >= 1) {
        let j = 0;
        while (j < oldStr.length) {
          chars[aryLen++] = oldStr[j];
          j++;
        }
      }
    }
    // 对尾巴特殊处理
    if (i === chars.length - 1) {
      if (chars[i - 1] === chars[i]) {
        oldCount = count;
        let oldStr = String(oldCount);
        // 字符
        chars[aryLen++] = chars[i - 1];
        // 数量
        let j = 0;
        while (j < oldStr.length) {
          chars[aryLen++] = oldStr[j];
          j++;
        }
      } else {
        chars[aryLen++] = chars[i];
      }
    }
    i++;
  }
  console.log(aryLen);
  chars.length = aryLen;
  console.log(chars);
};

/**
 * @param {string} s
 * @return {string}
 */
var reformat = function (s) {
  let numAry = [];
  let strAry = [];
  let result = [];
  for (let i = 0; i < s.length; i++) {
    if (/\d/.test(s[i])) {
      numAry.push(s[i]);
    } else {
      strAry.push(s[i]);
    }
  }

  if (Math.abs(numAry.length - strAry.length) <= 1) {
    if (numAry.length !== strAry.length) {
      let bool = numAry.length > strAry.length;
      let longAry = bool ? numAry : strAry;
      let shortAry = bool ? strAry : numAry;
      for (let i = 0; i < s.length; i++) {
        if (i % 2 === 0) {
          result.push(longAry.shift());
        } else {
          result.push(shortAry.shift());
        }
      }
    } else {
      for (let i = 0; i < s.length; i++) {
        if (i % 2 === 0) {
          result.push(numAry.shift());
        } else {
          result.push(strAry.shift());
        }
      }
    }

    return result.join("");
  } else {
    return "";
  }
};

var gcdOfStrings = function (str1, str2) {
  if (`${str1}${str2}` !== `${str2}${str1}`) return "";

  return str2.substring(0, gcd(str1.length, str2.length));
};

var gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

var removeDuplicates = function (S) {
  let ary = [];
  // 栈
  [...S].forEach((item) => {
    if (ary.length > 0 && ary[ary.length - 1] === item) {
      ary.pop();
    } else {
      ary.push(item);
    }
  });
  console.log(ary.join(""));
  return ary.join("");
};

function radixSort(arr, maxDigit) {
  var mod = 10;
  var dev = 1;
  var counter = [];
  for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
    for (var j = 0; j < arr.length; j++) {
      var bucket = parseInt((arr[j] % mod) / dev);
      if (counter[bucket] == null) {
        counter[bucket] = [];
      }
      counter[bucket].push(arr[j]);
    }
    var pos = 0;
    for (var j = 0; j < counter.length; j++) {
      var value = null;
      if (counter[j] != null) {
        while ((value = counter[j].shift()) != null) {
          arr[pos++] = value;
        }
      }
    }
  }
  return arr;
}
var findRadius = function (houses, heaters) {
  houses = houses.sort((a, b) => a - b);
  heaters = heaters.sort((a, b) => a - b);
  heaters.unshift(Number.MIN_SAFE_INTEGER);
  heaters.push(Number.MAX_SAFE_INTEGER);

  let minList = houses.map((item, index) => {
    let left = 0;
    let right = heaters.length - 1;
    let mid;
    let distance;
    while (left < right) {
      mid = Math.floor((right + left) / 2);
      // 房子的位置比mid取暖位置要大，则需要去更大的取暖位置
      if (item > heaters[mid]) {
        left = mid + 1;
      } else {
        right = mid;
      }
      distance = Math.min(
        Math.abs(item - heaters[left - 1]),
        Math.abs(item - heaters[left])
      );
    }

    return distance;
  });

  return Math.max(...minList);
};

var countNegatives = function (grid) {
  let n = grid[0].length;
  return grid.reduce((acc, ary) => {
    let index = firstNegativeIndex(ary);
    // console.log(index);
    if (index !== -1) {
      acc = acc + n - index;
    }
    return acc;
  }, 0);
};

var firstNegativeIndex = function (ary) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);
    if (ary[mid] < 0) {
      if (mid === 0 || ary[mid - 1] >= 0) {
        return mid;
      }
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return -1;
};

var mySqrt = function (x) {
  // 二分
  let left = 0;
  let right = x;
  let mid;
  let res = -1;
  if (x === 0) {
    return 0;
  }
  while (left <= right) {
    /// debugger;
    mid = left + Math.floor((right - left) / 2);
    let val = mid * mid;
    if (val <= x) {
      if ((mid + 1) * (mid + 1) > x) {
        return mid;
      }
      // res = mid;
      // left = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // return res;
  // return Number.parseInt(Math.sqrt(x))
};

var dd = function (nums) {
  for (let i = 0; i < nums.length; i++) {
    debugger;
    if ((i = nums[i])) return i;
  }
  return -1;
};
console.log(dd([0, 2, 3, 4, 5]));
