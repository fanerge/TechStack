/**
 * 二分查找
 * @param {*} ary 
 * @param {*} target 
 * @return {*} index || -1
 */
function binarySearch(ary, target) {
  let low = 0;
  let high = ary.length - 1;
  // 必须要 low <= high ,因为存在 low = high = mid情况，这是需要 ary[mid] === targe 判断
  while(low <= high) {
      // let mid = parseInt((low + high) / 2, 10);
      let mid = Math.floor((low + high)/2);
      if (target === ary[mid]) {
          return mid;
      }else if(target < ary[mid]) {
          high = mid - 1;
      }else if(target > ary[mid]) {
          low = mid + 1;
      }
  }

  return -1;
}

// 原码、反码、补码
// 正数的原码反码补码相同
// 负数的反码：除符号位外,原码各位取反
// 负数的补码：除符号位外,原码各位取反,再加1（即反码+1）