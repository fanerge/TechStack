// 二分查找
// 查找某个元素是否存在
function findValue(ary, target) {
  let left = 0;
  let right = ary.length;
  let mid;
  while (left <= right) {
    // 防止 left + right 溢出，可以使用
    // mid = left + Math.floor((right - left) / 2)
    mid = Math.floor((left + right) / 2);
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

// 查找第一个值等于给定值的元素
// 1 3 4 5 6 8 8 8 11 18 查找8 return 5
function findFirstValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // mid = left + (right - left) / 2;
    mid = Math.floor((left + right) / 2);
    if (ary[mid] > target) {
      right = mid - 1;
    } else if (ary[mid] < target) {
      left = mid + 1;
    } else {
      // 等于匹配值
      if (mid === 0 || ary[mid - 1] !== target) {
        return mid;
      } else {
        // 向前移动
        right = mid - 1;
      }
    }
  }
  return -1;
}

// 查找第一个值等于给定值的元素
// 1 3 4 5 6 8 8 8 11 18 查找8 return 7
function findLastValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    // mid = left + (right - left) / 2;
    mid = Math.floor((left + right) / 2);
    if (ary[mid] > target) {
      right = mid - 1;
    } else if (ary[mid] < target) {
      left = mid + 1;
    } else {
      // 等于匹配值
      if (mid === 0 || ary[mid + 1] !== target) {
        return mid;
      } else {
        // 向前移动
        left = mid + 1;
      }
    }
  }
  return -1;
}

// 查找第一个大于等于给定值的元素
// console.log(findEqGtValue([1, 2, 3, 4, 5, 9, 9, 9, 11, 18], 8)); 5
function findEqGtValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    mid = Math.floor((left + right) / 2);
    if (ary[mid] >= target) {
      // mid 前一个必须要比target小
      if (mid === 0 || ary[mid - 1] < target) {
        return mid;
      } else {
        right = mid - 1;
      }
    } else {
      left = mid + 1;
    }
  }
  return -1;
}

// 查找最后一个小于等于给定值的元素
function findEqLtValue(ary, target) {
  let left = 0;
  let right = ary.length - 1;
  let mid;
  while (left < right) {
    mid = Math.floor((left + right) / 2);
    if (ary[mid] <= target) {
      // mid 前一个必须要比target小
      if (ary[mid + 1] > target) {
        return mid;
      } else {
        left = mid + 1;
      }
    } else {
      left = mid + 1;
    }
  }
  return -1;
}

// console.log(findEqLtValue([1, 2, 3, 4, 5, 9, 9, 9, 11, 18], 9));
