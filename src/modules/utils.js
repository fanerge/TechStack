// 测试代码
var p1 = function(){
  return new Promise((resolve, reject) => {setTimeout(function(){resolve('error')}, 1000)})
};
var p2 = function(){
  return new Promise((resolve, reject) => {setTimeout(function(){resolve(2)}, 2000)})
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

function promiseAll(tasks) {
  let ary = new Array(tasks.length).fill(1).map(item => {return {val: undefined, success: false}});
  return new Promise((resolve, reject) => {
    for(let i = 0; i < tasks.length; i++) {
      tasks[i]().then(res => {
        ary[i].val = res;
        ary[i].success = true;
        if(ary.every(item => item.success === true)){
          resolve(ary.map(item => item.val))
        }
      }).catch(err => {
        reject(err);
      });
    }
  });
}

// test
/*
promiseAll([p1, p2, p3]).then(res => console.log(res)).catch(err => {
  console.log(err);
});
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

// [{id: 0, pid: -1}, {id: 1, pid: 0}, {id: 2, pid: 0}, {id: 3, pid: 1}]
// 转化为tree（约定pid为-1是根节点） {id: 0, children: [{id: 1, children: [{id: 3, children: []}]}, {id: 2, children: []}]}
var testTreeData = [{id: 0, pid: -1}, {id: 1, pid: 0}, {id: 2, pid: 0}, {id: 3, pid: 1}];
function dataChangeTree(data) {
  debugger;
  return 123;
}
console.log(dataChangeTree(testTreeData));
