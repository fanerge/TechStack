const arr = [
  [1, 2, 3],
  [7, 8, 9],
  [8, 9, 10]
];

function isInclude(arr, value) {
  const min = arr[0][0];
  const max = arr[arr.length -1].slice(-1);
  if (value < min) {
    return false;
  }
  if (value > max) {
    return false;
  }
  // 找出每个数组最大值
  const arrMax = arr.map((item) => item[item.length -1]); // 3, 4, 5
  const arrMin = arr.map((item) => item[0]); // 1, 2, 7
  const arrIndex = [];
  for (let i = 0; i < arrMax.length; i++) {
    if(arrMax[i] === value) {
      return true;
    }
    if (arrMax[i] < value) {
      arrIndex.push(i);
    }
  }
  for (let i = 0; i < arrMin.length; i++) {
    if(arrMin[i] === value) {
      return true;
    }
    if (arrMin[i] > value) {
      arrIndex.push(i);
    }
  }
  // ...new Set(arrIndex)
  const newArray = [];
  [...new Set(arrIndex)].forEach(item => {
    newArray.push(...arr[item]);
  });

  return newArray.includes(value);
}

const test = isInclude(arr, 7);
console.log(test);