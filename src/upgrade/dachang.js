// 1-1
Function.prototype.call1 = function (thisArg, ...args) {
  // thisArg undei \ null \1 ''
  if (thisArg === null || thisArg === undefined) {
    thisArg = globalThis;
  }
  thisArg = Object(thisArg); // 1, '', 克应用
  let key = Symbol('key');
  thisArg[key] = this;
  let res = thisArg[key](...args)
  delete thisArg[key];
  return res;
}
// 1-2
// this指向

// 1-3
// import 和 require  、treeSharking

// 1-4
// 新一点的语法
// 


// 1-5
// ??
// options chain ?. 对方法的处理

// 2-1
// 介绍项目

// deepCopy
function isComplexType = (type) => {
  return typeof type === 'object' && type !== null || typeof type === 'function';
}
function deepCopy(a, hash = new WeackMap()) {
  // 
  if (!isComplexType(a)) {
    return a;
  }
  // fuzha
  if (hash.has(a)) {
    return hash.get(a);
  }
  let constuctor = a.constructor;
  if (constuctor === Date) {
    return new Date(a);
  }
  if (constuctor === RegExp) {
    return new RegExp(a);
  }
  if (constuctor === Function) {
    // return new Function(`return ${a}`);
  }
  let newA = new constuctor(); // [] ,{}
  hash.set(a, newA);

  // 
  Reflect.ownKeys(a).forEach(key => {
    if (isComplexType(a[key])) {
      return deepCopy(a[key], hash)
    } else {
      // newA[key] = a[key]
      Object.defineProperty(newA, key, Object.getOwnPropertyDescriptor(a, key))
    }
  });
  //

  return newA;
}
// messageChaneel // 
function clone2(a) {
  let { port1, port2 } = new MessageChaneel();
  return new Promise((resolve, reject) => {
    port1.postMessage(a);
    port2.onmessage = function (e) {
      resolve(e.data);
    }
  });
}

// 2-2
// setHeader 
// expires\pragma//
// cache-contraol
//


// router = [];
// *img hash 
// source 
// request.ulr.path
const needCache = 'goods/source'
if (request.ulr.path.includes(needCache)) {
  // ctx
  // s
  ctx.reponse.setHeader('Expires', 'sss');
  // Expires 
  ctx.reponse.setHeader('last-chi', 'sss');
  ctx.reponse.setHeader('cache-Contraol', max - age);
  // 
  ctx.reponse.setHeader('Etag', 'sss');
}
// webpack
webpack // webapck 5
// fileSystem
loader // data
// a
loader // includes \excludes 'n'
dllPlugin \\ dllRe
// codeSplig
chunk: ‘all’, minCount: '' // aSync iimprt()
ctx.reponse.setHeader('Expires', 'sss');
// Expires 
ctx.reponse.setHeader('last-chi', 'sss');
ctx.reponse.setHeader('cache-Contraol', max - age);
// 
ctx.reponse.setHeader('Etag', 'sss');
    // gzip
}

// 2-3
<template>
  <input v-model="inputVal"
    onInput={} // 12
    onCompositionStart={}
    onCompositionUpdate={}
    onCompositionEnd={}
  // shouji egg
  />
  // onCompositionStart onCompositionUpdate onInput onCompositionEnd

  <ul>
    <li v-for="item in list" :key="item.id">
            {{ item.nama }}
        </li>
    </ul>

</template >
  <script>
    export default {
      data() {
        return {
      inputVal: '',
            // 虚拟表格
           list: [],
            // 所有数据
           oldList: [],
           isCoposition:
        }
    },
    mounted() {

    },
        methods: {
      async nitData() {
                const {inputVal} = this;
                try{
      let res = getData(inputVal);
                    this.oldList = res;
                }catch(e){

    }
            }
        }
};
</script>

// 2-4
实现一个函数，接受函数数组参数，并执行，如果有一个函数返回结果是 string，数组剩余函数不执行，否则一直执行，
如果执行结果没有异步的函数，那么整个函数就是同步的。
type FieldValidator<T> = (value: T, allValue: object) => string | undefined | Promise<any>;

function combineValidators<FieldValue = any>(
  validators: FieldValidator<FieldValue>[] | FieldValidator<FieldValue>
): (
    value: FieldValue,
    allValues: any,
    meta?: FieldState<FieldValue>
  ) => string | undefined | Promise<any> {

}

const validator = combineValidators([
  () => undefined,
  () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      });
    }),
  () => 'eeeee',
])
error = await validator('aaa', {});
