/** promise 的一些特性，2020-12-21更新 */
// 参考地址：https://mp.weixin.qq.com/s/ON4m0uNF6u-FjLHYih8JIA
// 1. 只有promise.then 执行时才将其callback放入大 MicroQueue 中
// 2. 要触发promise.catch 只有 promise.rejected 可以，直接 throw 不行（类似于，Promise.resolve(new Error('error!!!'))）
// 3. promise.then 或 promise.catch 参数只接受函数，传入非函数则会发生值穿透
// 4. promise.then 可以接收两个参数，第一个是处理成功的函数，第二个是处理错误的函数。但第二个处理错误的函数不能捕获第一个函数抛出的错误但promise.catch可以


/**第一题 */
// JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个
// http://blog.mapplat.com/public/javascript/%E4%B8%80%E4%B8%AA%E5%85%B3%E4%BA%8Epromise%E7%9A%84%E9%97%AE%E9%A2%98/
// 当前执行并发大于等于2时，生成一个暂停的Promise，把resolve添到一个数组中，下面的代码被暂停执行
// 当前执行并发小于2, 立即执行异步操作并在该异步操作执行完毕后从数组中弹出最先push的resolve改变Promise的状态
// 由于Promise被resolve了，最初被暂停的代码可以继续执行
// 关键点为 Promise 没有被 resolve 或 reject 时后面代码会被暂停，Promise 的 resolve 或 reject 可以在Promise构造函数外执行

class Scheduler {
  constructor(limit = 2) {
    this.awaitArr = [];
    this.count = 0;
    this.limit = limit;
  }
  async add(promiseCreator) {
    if (this.count >= this.limit) {
      await new Promise((resolve) => {
        this.awaitArr.push(resolve);
      });
    }
    this.count++;
    const res = await promiseCreator();
    this.count--;
    if (this.awaitArr.length) {
      // 前面promise的resolve
      this.awaitArr.shift()();
    }
    return res;
  }
}
const scheduler = new Scheduler(2);
const timeout = (time) => {
  return new Promise(r => setTimeout(r, time))
}
const addTask = (time, order) => {
  scheduler.add(() => timeout(time))
    .then(() => console.log(order))
}
// test
// addTask(1000, 1)
// addTask(500, 2)
// addTask(300, 3)
// addTask(400, 4)

/**第二题 */
// Promise.all()
// 结束条件：有一个 Promise rejected 或 所有 Promise resolved。 
// 1、接收一个 Promise 实例的数组或具有 Iterator 接口的对象
// 2、如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
// 3、如果全部成功，状态变为 resolved，返回值将组成一个数组传给回调
// 4、只要有一个失败，状态就变为 rejected，返回值将直接传递给回调all() 的返回值也是新的 Promise 对象
// array\string\map\set\有length属性的对象
function promiseAll(iterable) {
  let array = Array.from(iterable);
  let resolveNum = 0;
  let promiseNum = array.length;
  let lists = new Array(promiseNum);
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(array[i]).then(res => {
        lists[i] = res;
        resolveNum++;
        if (resolveNum === promiseNum) {
          return resolve(lists)
        }
      }).catch(reason => {
        return reject(reason);
      });
    }
  });
}
// promiseAll([1, Promise.reject(12)]).then(res => {
//   console.log(res)
// }).catch(reason => {
//   console.log(reason)
// });

/**第三题 */
// Promise.any()
// 结束条件：有一个 Promise resolved 或 所有 Promise rejected 就返回一个AggregateError类型的实例。
// 如果可迭代对象中没有一个 promise 成功（即所有的 promises 都拒绝），就返回一个失败的 promise 和AggregateError类型的实例，它是 Error 的一个子类，用于把单一的错误集合在一起。
function promiseAny(iterable) {
  let array = Array.from(iterable);
  let promiseNum = array.length;
  let rejectNum = 0;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(array[i]).then(res => {
        return resolve(res);
      }).catch(error => {
        rejectNum++;
        if (rejectNum === promiseNum) {
          return reject(new AggregateError("", "All promises were rejected"))
        }
      });
    }
  });
}

// var p1 = new Promise(function (resolve, reject) {
//   setTimeout(reject, 500, "one");
// });
// var p2 = new Promise(function (resolve, reject) {
//   setTimeout(reject, 600, "two");
// });
// promiseAny([p1, p2]).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// });

/**第四题 */
// Promise.race()
// 结束条件：一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
function promiseRace(iterable) {
  let array = Array.from(iterable);
  let promiseNum = array.length;
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(array[i]).then(res => {
        return resolve(res);
      }).catch(error => {
        return reject(error);
      });
    }
  });
}
// var p1 = new Promise(function (resolve, reject) {
//   setTimeout(resolve, 500, "one");
// });
// var p2 = new Promise(function (resolve, reject) {
//   setTimeout(reject, 600, "two");
// });
// promiseRace([p1, p2]).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// });

/**第五题 */
// Promise.allSettled()
// 结束条件：所有给定的promise都已经fulfilled或rejected后的promise。
// 对于 promise 为 resolved 时对象为 {status: 'fulfilled', value: promise的值}
// 对于 promise 为 rejected 时对象为 {status: 'rejected', reason: rejected的原因}
function promiseAllSettled(iterable) {
  let array = Array.from(iterable);
  let promiseNum = array.length;
  let num = 0;
  let list = new Array(promiseNum);
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      let obj = {
        status: ''
      };
      Promise.resolve(array[i]).then(res => {
        obj.status = 'fulfilled';
        obj.value = res;
      }).catch(error => {
        obj.status = 'rejected';
        obj.reason = error;
      }).finally(() => {
        num++;
        list[i] = obj;
        if (promiseNum === num) {
          return resolve(list);
        }
      });
    }
  });
}
// const promise1 = Promise.reject(3);
// const promise2 = new Promise((resolve, reject) => setTimeout(resolve, 100, 'foo'));
// promiseAllSettled([promise1, promise2]).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// });

/**第六题 */
// 多个返回promise的函数串行执行
function promiseSerial(array) {
  if (array.length === 0) throw '参数数组至少有一项'
  array.reduce((preP, nextP) => {
    return preP.then(() => nextP());
  }, Promise.resolve());
}

async function promiseSerial1(array) {
  if (array.length === 0) throw '参数数组至少有一项'
  for (let promise of array) {
    await promise();
  }
}

const createPromise = (time, id) => () =>
  new Promise(solve =>
    setTimeout(() => {
      console.log(Date.now() / 1000);
      console.log("promise", id);
      solve();
    }, time)
  );
// test
// promiseSerial1([
//   createPromise(1000, 1),
//   createPromise(1000, 2),
//   createPromise(1000, 3)
// ])

/**第七题 */
// Promise 超时设计，利用Promise.race来实现
function resolveAfter(ms, value = undefined) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('timeout');
      resolve(value || Promise.reject(new Error('Operation timed out')));
    }, ms);
  });
}
function PromiseTimeout(ms, promise) {
  return Promise.race([
    promise,
    resolveAfter(ms)
  ]);
}
// test
// var p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     console.log('p1');
//     resolve('p1-resolved')
//   }, 1000);
// })
// PromiseTimeout(100, p1).then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// });

/**第八题 */
// 红灯3秒亮一次，绿灯1秒亮一次，黄灯2秒亮一次；如何使用Promise让三个灯不断交替重复亮灯？
let testNowTime = Date.now();
function red() {
  let testCurTime = Date.now();
  console.log((testCurTime - testNowTime)/1000)
  testNowTime = testCurTime
  console.log('red');
}

function green() {
  let testCurTime = Date.now();
  console.log((testCurTime - testNowTime)/1000)
  testNowTime = testCurTime
  console.log('green');
}

function yellow() {
  let testCurTime = Date.now();
  console.log((testCurTime - testNowTime)/1000)
  testNowTime = testCurTime
  console.log('yellow');
}

const myLight = (timer, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      cb();
      resolve();
    }, timer);
  });
}

const myStep = () => {
  Promise.resolve().then(() => {
    return myLight(3000, red)
  }).then(() => {
    return myLight(1000, green)
  }).then(() => {
    return myLight(2000, yellow)
  }).then(() => {
    myStep();
  })
}
// myStep()

const myStepAsync = async () => {
  await myLight(3000, red);
  await myLight(1000, green);
  await myLight(2000, yellow)
  myStepAsync();
}
// myStepAsync();

/**第九题 */
// 请实现一个mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中。
const timeoutMerge = ms => new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve();
  }, ms);
});

const ajax1 = () => timeoutMerge(2000).then(() => {
  console.log('1');
  return 1;
});

const ajax2 = () => timeoutMerge(1000).then(() => {
  console.log('2');
  return 2;
});

const ajax3 = () => timeoutMerge(2000).then(() => {
  console.log('3');
  return 3;
});

const mergePromise = ajaxArray => {
  // 在这里实现你的代码
  let data = [];

  let p = ajaxArray.reduce((acc, func, index) => {
    return acc.then(func).then(res => {
      data.push(res);
    })
  }, Promise.resolve());

  return p.then(() => data);
}

const mergePromise1 = ajaxArray => {
  // 在这里实现你的代码
  var data = [];

  // Promise.resolve方法调用时不带参数，直接返回一个resolved状态的 Promise 对象。
  var sequence = Promise.resolve();

  ajaxArray.forEach(item => {
    // 第一次的 then 方法用来执行数组中的每个函数，
    // 第二次的 then 方法接受数组中的函数执行后返回的结果，
    // 并把结果添加到 data 中，然后把 data 返回。
    sequence = sequence.then(item).then(res => {
      data.push(res);
      return data;
    });
  });

// 遍历结束后，返回一个 Promise，也就是 sequence， 他的 [[PromiseValue]] 值就是 data，
// 而 data（保存数组中的函数执行后的结果） 也会作为参数，传入下次调用的 then 方法中。
  return sequence;
};
// test
// mergePromise([ajax1, ajax2, ajax3]).then(data => {
//   console.log('done');
//   console.log(data); // data 为 [1, 2, 3]
// });

/**第十题 */
// 现有8个图片资源的url，已经存储在数组urls中，且已有一个函数function loading，输入一个url链接，返回一个Promise，该Promise在图片下载完成的时候resolve，下载失败则reject。
var urls = ['https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg', 'https://www.kkkk1000.com/images/getImgData/gray.gif', 'https://www.kkkk1000.com/images/getImgData/Particle.gif', 'https://www.kkkk1000.com/images/getImgData/arithmetic.png', 'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif', 'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg', 'https://www.kkkk1000.com/images/getImgData/arithmetic.gif', 'https://www.kkkk1000.com/images/wxQrCode2.png'];

function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            console.log('一张图片加载完成');
            resolve();
        }
        img.onerror = reject;
        img.src = url;
    })
};

function limitLoad(urls, handler, limit) {
  let schedulers = new Scheduler(limit);
  urls.forEach(url => {
    schedulers.add(handler.bind(null, url))
  });
  
}

// limitLoad(urls, loadImg, 3);

