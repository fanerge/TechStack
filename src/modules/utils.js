import _ from 'lodash';

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
var testTreeData = [
  {id: 1, pid: 0, name: '一级1'}, 
  {id: 2, pid: 0, name: '一级2'}, 
  {id: 6, pid: 2, name: '一级2-1'}, 
  {id: 7, pid: 2, name: '一级2-1'}, 
  {id: 3, pid: 1, name: '一级1-1'}, 
  {id: 4, pid: 3, name: '一级1-1-1'}, 
  {id: 5, pid: 3, name: '一级1-1-2'},
  {id: 0, pid: -1, name: '根'}, 
];
function dataToTree(data) {
  let result = [];
  let map = {};
  data.forEach((item, index) => {
    map[item.id] = item;
  });
  data.forEach(item => {
    // debugger
    let parent = map[item.pid];
    if(parent) {
      // 其他节点处理
      (parent.children || (parent.children = [])).push(item);
    }else{
      // 根节点处理
      result.push(item);
    }
  });

  return result;
}
console.log(dataToTree(testTreeData));

// 递归过滤不显示的节点（常见菜单需求）
const testFilterMenuData = [
  {
  name: '阿里巴巴',
  url: '/ali',
  show: true,
  children: [{
    name: '支付宝',
    url: '/ali/alipay',
    show: true,
    children: [{
      name: '花呗',
      url: '/ali/alipay/huabei',
      show: true
    }, {
      name: '借呗',
      url: '/ali/alipay/jiebei',
      show: false
    }, {
      name: '支付',
      url: '/ali/alipay/pay',
      show: false
    }]
  }, {
    name: '高德地图',
    url: '/ali/amap',
    show: true,
    children: [{
      name: '打车',
      url: '/ali/amap/dache',
      show: true
    }, {
      name: '公交',
      url: '/ali/amap/gongjiao',
      show: false
    }]
  }]
  }, 
  {
    name: '平安',
    url: '/pingan',
    show: true,
    children: [{
      name: '平安保险',
      url: '/pingan/baoxian',
      show: true,
      children: [{
        name: '人生保险',
        url: '/pingan/baoxian/shengming',
        show: true
      }, {
        name: '财产保险',
        url: '/pingan/baoxian/caichan',
        show: true
      }]
    }, {
      name: '城市建设科技',
      url: '/pingan/tech',
      show: true,
      children: [{
        name: '供应链事业部',
        url: '/pingan/tech/fangchan',
        show: true,
        children: [{
          name: '建筑商城',
          url: '/pingan/tech/fangchan/shangcheng',
          show: true
        }, {
          name: '建筑管理',
          url: '/pingan/tech/fangchan/guanli',
          show: false
        }]
      }]
    }]
  },
  {
    name: '腾讯',
    url: '/qq',
    show: false,
    children: [{
      name: '微信',
      url: '/qq/weixin',
      show: true,
      children: [{
        name: '支付',
        url: '/qq/weixin/pay',
        show: true
      }, {
        name: '聊天',
        url: '/qq/weixin/chat',
        show: true
      }]
    }, {
      name: 'QQ',
      url: '/qq/qq',
      show: true,
      children: [{
        name: 'QQ游戏',
        url: '/qq/qq/game',
        show: true
      }]
    }]
  }
];

function filterMenuData(ary) {
  // lodash
  let newAry = _.cloneDeep(ary);
  return filterMenuShowNode(newAry);
}
function filterMenuShowNode(ary) {
  let temp = ary.filter(item => item.show);
  temp.forEach((item, index) => {
    if(item.show && item.children && item.children.length > 0) {
      item.children = filterMenuShowNode(item.children);
    }
  });

  return temp;
}
// 过滤show为false的节点
// console.log(testFilterMenuData);
// console.log(filterMenuData(testFilterMenuData));


// 获得各个叶子节点的祖先节点index
function setLeafNodetoMap(ary){
  let map = new Map();
  ary.forEach((item, index) => {
    setNodetoMap(item, [index], map);
  });
  return map;
}
function setNodetoMap(node, ancestor, map){
  if(!node.children || node.children.length === 0) {
    map.set(node.url, ancestor);
    return;
  }

  node.children.forEach((item, index) => {
    setNodetoMap(item, ancestor.concat(index), map);
  });
}
// test
// console.log(filterMenuData(testFilterMenuData));
// console.log(sd(filterMenuData(testFilterMenuData)).entries());










