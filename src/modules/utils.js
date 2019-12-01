// 测试代码
var p1 = function(){
  return new Promise((resolve, reject) => {setTimeout(function(){resolve(1)}, 1000)})
};
var p2 = function(){
  return new Promise((resolve, reject) => {setTimeout(function(){resolve(2)}, 1000)})
};
var p3 = function(){
  return new Promise((resolve, reject) => {setTimeout(function(){resolve(3)}, 1000)})
};

// 多个Promise并行
/*
Promise.all(promises)
.then(() => {
  console.log('done')
})
.catch(() => {
  console.log('error')
})
*/

// 多个Promise串行
function parallelPromises(tasks){
  var result = [];
  return tasks.reduce((accumulator,item,index)=>{
    return accumulator.then(res=>{
        item = typeof item === 'function' ? item() : item;
        return item.then(res=>{
          // debugger
              result[index] = res
              return index == tasks.length - 1 ? result : item
        })
    })
  },Promise.resolve())
}
// test
/*
parallelPromises([p1, p2, p3]).then((res) => {
  console.log(res)
}).catch(() => {
  console.log('error')
})
*/


// 多个Promise串行
async function sequential(tasks) {
  let ary = [];
  for (let task of tasks) {
    let temp = await task();
    ary.push(temp);
  }
  return ary;
}

// var demo = sequential([p1, p2, p3]);
// console.log(demo);



