class ArrayList{
  array: any[];
  constructor() {
    this.array = [];
  }

  insert(item: any) {
    this.array.push(item);
  };

  // 交换数组元素
  private swap(array: any, index1: number, index2: number) {
    // let temp = array[index1];
    // array[index1] = array[index2];
    // array[index2] = temp;
    [array[index2], array[index1]] = [array[index1], array[index2]]
  }

  // 冒泡排序
  // 冒泡排序比较任何两个相邻的项，如果第一个比第二个大，则交换它们。元素项向上移动至 正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。
  // 时间复杂度 O(n^2)
  bubbleSort() {
    let list = this.array.slice(0);
    for(let i = 0; i < list.length; i++) {
      // 每循环一次，冒泡一个现有最大值
      for(let j = 0; j < list.length-1-i; j++) {
        if(list[j] > list[j+1]) {
          this.swap(list, j, j+1);
        }
      }
    }
    return list;
  }

  // 选择排序
  // 选择排序大致的思路是找到数据结构中的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推。
  // 时间复杂度 O(n^2)
  selectionSort() {
    let list = this.array.slice(0);
    let indexMin: number;
    for(let i = 0; i < list.length-1; i++) {
      // 假设i为最小值的index
      indexMin = i;
      for(let j = i; j < list.length; j++) {
        // 后面还有最小值的index，则更新indexMin值
        if(list[indexMin] > list[j]) {
          indexMin = j;
        }
      }
      if(i !== indexMin) {
        this.swap(list, i, indexMin);
      }
    }
    return list;
  }

  // 插入排序
  // 假设前i项已排好序，i+1插入到已排好序的数组中
  insertionSort() {
    let list = this.array.slice(0);
    let j, temp;
    for(let i = 1; i < list.length; i++) {
      j = i;
      // 待插入的项目
      temp = list[i];
      // 逐次与前面排好序的数组比较
      while(j > 0 && list[j-1] > temp) {
        list[j] = list[j-1];
        j--;
      }
      list[j] = temp;
    }
    return list;
  }

  toString() {
    return this.array.join();
  }
}

const ary = new ArrayList();
ary.insert(1);
ary.insert(3);
ary.insert(2);
ary.insert(9);
ary.insert(8);
ary.insert(7);
ary.insert(6);


console.log(ary.insertionSort());