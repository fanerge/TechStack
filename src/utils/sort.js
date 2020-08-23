// 冒泡排序
// 原理：两个元素比较，如果前者大于后者则交换位置，一次遍历后当前最大的元素将移动到后面
function bubbleSort(ary) {
  for (let i = 0; i < ary.length; i++) {
    let flag = true;
    for (let j = 0; j < ary.length - i - 1; j++) {
      if (ary[j] > ary[j + 1]) {
        flag = false;
        [ary[j], ary[j + 1]] = [ary[j + 1], ary[j]];
      }
    }
    if (flag) return ary;
  }
  return ary;
}
// console.log(bubbleSort([3, 21, 1, 4, 325]));

// 选择排序
// 原理：
function selectSort(ary) {
  for (let i = 0; i < ary.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < ary.length; j++) {
      if (ary[minIndex] > ary[j]) {
        minIndex = j;
      }
    }
    [ary[i], ary[minIndex]] = [ary[minIndex], ary[i]];
  }
  return ary;
}
// console.log(selectSort([3, 21, 1, 4, 325]));

// 插入排序
// 原理：顺序从待排序中取出一个元素然后与已排好序的元素逐个比较放入合适的位置（向后移动比它大的元素）

function insertSort(ary) {
  // 默认第一个已经排好序了
  for (let i = 1; i < ary.length; i++) {
    let currentInsertValue = ary[i];
    // 向前遍历已排好的元素
    for (let j = i - 1; j >= 0; j--) {
      // 找到比待插入大的值将其后移，将待插入的值放入移动后的空位
      if (ary[j] > currentInsertValue) {
        ary[j + 1] = ary[j];
        ary[j] = currentInsertValue;
      }
    }
  }
  return ary;
}
// console.log(insertSort([6, 999, 5, 4, 3, 2, 12]));

// 归并排序
// 原理：采用分治法（Divide and Conquer）的方法，将已有序的子序列合并，直到得到完全有序的序列
function mergeSort(ary) {
  if (ary.length === 1) {
    return ary;
  }
  let mid = Math.floor(ary.length / 2);
  let left = ary.slice(0, mid);
  let right = ary.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let ary = [];
  while (left.length && right.length) {
    let left0 = left[0];
    let right0 = right[0];
    if (left0 > right0) {
      ary.push(right.shift());
    } else {
      ary.push(left.shift());
    }
  }

  if (left.length) {
    ary = ary.concat(left);
  }

  if (right.length) {
    ary = ary.concat(right);
  }

  return ary;
}
// console.log(mergeSort([6, 999, 5, 4, 3, 2, 12]));

// 快速排序
// 原理：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据都比另外一部分的所有数据都要小，然后再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列
function quickSort(arr) {
  const sort = (ary, left = 0, right = ary.length - 1) => {
    // debugger;
    if (left >= right) return;
    let i = left;
    let j = right;
    let baseValue = ary[right];
    while (i < j) {
      while (i < j && ary[i] <= baseValue) {
        i++;
      }
      ary[j] = ary[i];
      while (i < j && ary[j] >= baseValue) {
        j--;
      }
      ary[i] = ary[j];
    }
    // i = j
    ary[i] = baseValue;
    sort(ary, left, i - 1);
    sort(ary, i + 1, right);
  };
  sort(arr);
  return arr;
}
// console.log(quickSort([6, 999, 5, 4, 3, 2, 12]));

// 基数排序
// 原理：将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后, 数列就变成一个有序序列。
// 数排序的方式可以采用LSD（Least significant digital）或MSD（Most significant digital），LSD的排序方式由键值的最右边开始，而MSD则相反，由键值的最左边开始。
function radixSort(ary, maxDigit) {
  // 实际为二维数组，外面为桶的编号（0-9），内部为每个基数的桶如1则可以放11，21，31等
  let counter = [];
  let mov = 10;
  let dev = 1;
  for (let i = 0; i < maxDigit; i++, dev *= 10, mov *= 10) {
    // 放入桶中
    for (let j = 0; j < ary.length; j++) {
      // 第一轮以个位为index，第二轮以十位位index，...
      let bucketIndex = parseInt((ary[j] % mov) / dev);
      if (!Array.isArray(counter[bucketIndex])) {
        counter[bucketIndex] = [];
      }
      counter[bucketIndex].push(ary[j]);
    }
    let pos = 0;
    let value;
    // 依次从桶中取出并放入原数组中
    for (let k = 0; k < counter.length; k++) {
      if (Array.isArray(counter[k])) {
        while ((value = counter[k].shift()) !== undefined) {
          ary[pos++] = value;
        }
      }
    }
  }

  return ary;
}
// console.log(radixSort([3, 21, 1, 4, 325], 3));

// 计数排序
// 原理：对于给定的输入序列中的每一个元素x，确定该序列中值小于x的元素的个数（此处并非比较各元素的大小，而是通过对元素值的计数和计数值的累加来确定）。一旦有了这个信息，就可以将x直接存放到最终的输出序列的正确位置上。例如，如果输入序列中只有17个元素的值小于x的值，则x可以直接存放在输出序列的第18个位置上。
// 你知道有17个数比你小，那你肯定排在第18的位置呗
//
function countingSort(ary) {
  // 用一个数组，用数组的值作为 buckets 数组的index，对应的值为 出现的次数
  let buckets = [];
  let index = 0;
  for (let i = 0; i < ary.length; i++) {
    if (!buckets[ary[i]]) {
      buckets[ary[i]] = 0;
    }
    buckets[ary[i]]++;
  }
  for (let j = 0; j < buckets.length; j++) {
    while (buckets[j] > 0) {
      ary[index++] = j;
      buckets[j]--;
    }
  }
  return ary;
}
// console.log(countingSort([3, 2, 1, 67, 1, 34, 00, 09]));

// 桶排序
// 原理：是计数排序的改进，将数组元素分别放入各个桶中（区间），然后对每个桶分别排序，最后依次重桶中取出即可
function bucketSort(ary, bucketSize = 5) {
  if (ary.length === 0) {
    return arr;
  }
  let buckets = []; // 二位数组
  // 用于等会儿为数组每个元素找到在桶中index
  let min = Math.min(...ary);

  for (let i = 0; i < ary.length; i++) {
    // 将元素放入对应的桶中
    let index = Math.floor((ary[i] - min) / bucketSize);
    if (!Array.isArray(buckets[index])) {
      buckets[index] = [];
    }
    buckets[index].push(ary[i]);
  }
  // 清空原数组放新数组
  ary = [];
  for (let j = 0; j < buckets.length; j++) {
    // 对每个桶中元素进行排序
    if (Array.isArray(buckets[j]) && buckets[j].length > 0) {
      ary.push(...insertSort(buckets[j]));
    }
  }
  return ary;
}
// console.log(bucketSort([3, 2, 1, 67, 1, 34, 00, 09]));

// shellSort
// 原理：定义gap，将数组按gap分割为多个子序列，对每个子序列分别进行插入排序，继续gap减小直到为1，重复上述过程
// 三层循环，第一层gap增量减小，第二三层为间隔为gap的子序列进行插入排序
// 动态定义间隔
// while(gap < len/5) { //动态定义间隔序列
//   gap =gap*5+1;
// }
function shellSort(ary) {
  for (
    let gap = Math.floor(ary.length / 2);
    gap >= 1;
    gap = Math.floor(gap / 2)
  ) {
    // 直接插入排序
    for (let i = gap; i < ary.length; i++) {
      // 对前面间隔gap的元素排序
      for (let j = i - gap; j >= 0; j -= gap) {
        if (ary[j] > ary[gap + j]) {
          [ary[j], ary[gap + j]] = [ary[gap + j], ary[j]];
        }
      }
    }
  }

  return ary;
}
// // console.log(shellSort([3, 2, 1, 67, 1, 34, 00, 09]));

// heapSort
// 原理：利用的堆的性质，每次取出堆顶（最大或最小的值），然后调整堆，继续上面的过程
// 大顶堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
// 小顶堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；
// 对数组中的前n项整理成堆
function heapSort(array) {
  let n = array.length;
  while (n > 0) {
    // 刷新堆之后，将array[0]（最大值）与最后一个子节点交换
    // 然后重新刷新堆(不包括最后那些排好序的节点了)
    refreshHeap(array, n--);
    [array[0], array[n]] = [array[n], array[0]];
  }
  return array;
}

function refreshHeap(array, n) {
  // i 为层数
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    // 堆调整
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let largest = i;
    // 检查left child 是否比父节点小
    if (left < n && array[left] > array[largest]) {
      largest = left;
    }
    // 检查right child 是否比父节点小
    if (right < n && array[right] > array[largest]) {
      largest = right;
    }
    if (largest !== i) {
      // 更新最大节点
      [array[i], array[largest]] = [array[largest], array[i]];
      refreshHeap(array, largest);
    }
  }
  return array;
}

// console.log(heapSort([3, 2, 1, 67, 1, 34, 00, 09], 9));


// 堆排序
// 将待排序序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。
// 将其与末尾元素进行交换，此时末尾就为最大值。
// 然后调整堆，从n-1中取出最小值。如此反复执行，便能得到一个有序序列了。
class HeapSort {
  constructor(array) {
    this.sort(array);
    console.log(array)
    return array;
  }

  sort(array) {
    const {adjustHeap, swap} = this;
    // 1.构建大顶堆
    for(let i = Math.floor(array.length/2) - 1; i >= 0; i--) {
      // 从第一个非叶子结点从下至上，从右至左调整结构
      adjustHeap(array, i, array.length);
    }

    // 2.调整堆结构+交换堆顶元素与末尾元素
    for(let j = array.length-1; j>0;j--) {
      // 将堆顶元素与末尾元素进行交换
      swap(array, 0, j);
      // 重新对堆进行调整
      adjustHeap(array, 0, j);
    }
  }

 // 调整大顶堆（仅是调整过程，建立在大顶堆已构建的基础上）
  adjustHeap(arr, i, length) {
    // 先取出当前元素i
    let temp = arr[i];
    // 从i结点的左子结点开始，也就是2i+1处开始
    for(let k = 2*i+1; k<length; k=k*2+1) {
      if(k+1 < length && arr[k] < arr[k+1]) {
        // 如果左子结点小于右子结点，k指向右子结点
        k++;
      }
      // 如果子节点大于父节点，将子节点值赋给父节点（不用进行交换）
      if(arr[k] > temp) {
        arr[i] = arr[k];
        i = k;
      }else{
        break;
      }
    }
    // 将temp值放到最终的位置
    arr[i] = temp;

  }

  swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// var heapSort1 = new HeapSort([3, 2, 1, 67, 1, 34, 00, 09]);