// 深拷贝、节流防抖、千分位、排序算法、设计模式、call/apply、继承
// [参考](https://mp.weixin.qq.com/s/FHiSjn2Ooj7ZNqp9IfJ8mA)
// 检查数据类型
export function checkType(obj: any): string {

  const type = Object.prototype.toString.call(obj);
  return type.slice(8, -1);
}

// 深拷贝（hash = new WeakMap()考虑循环引用的问题）
export function deepClone(obj: any, hash = new WeakMap()) : any{
  if(checkType(obj) === 'RegExp') {
    // regExp.source 正则对象的源模式文本;
    // regExp.flags 正则表达式对象的标志字符串;
    // regExp.lastIndex 下次匹配开始的字符串索引位置
    let temp =  new RegExp(obj.source, obj.flags);
    temp.lastIndex = obj.lastIndex;
    return temp;
  }
  if(checkType(obj) === 'Date') {
      return new Date(obj);
  }
  // 非复杂类型(null、undefined、string、number、symbol、boolean、function)
  if(obj === null || typeof obj !== 'object') {
      return obj;
  }
  // 还可以扩展其他类型。。。
  // 与后面hash.set()防止循环引用
  if(hash.has(obj)) {

      return hash.get(obj);

  }

  let newObj = new obj.constructor();
  hash.set(obj, newObj);
  // Object.keys(obj)类型于 for in 和 obj.hasOwnProperty
  // 是否应该拷贝自身属性（可枚举的和不可枚举的以及symbol）
  Reflect.ownKeys(obj).forEach(function(key) {
      if(typeof obj[key] === 'object' && obj[key] !== null) {
          newObj[key] = deepClone(obj[key], hash);
      }else{
          // 直接赋值
          // newObj[key] = obj[key];
          // 是否应该保留属性描述符
          Object.defineProperty(newObj, key, Object.getOwnPropertyDescriptor(obj, key));
      }
  });

  return newObj;
}

// FP中柯里化函数实现curry
export function curry(fn: any, ...args: any[]) {
    args.length < fn.length
    // 参数长度不足时，重新柯里化该函数，等待接受新参数
    ? (...rest: any[]) => curry(fn, ...args, ...rest)
    // 参数长度满足时，执行函数
    : fn(...args);
}

// FP中compose（从右往左执行）
export function compose(...args: any[]) {
  return (subArgs: any) => {
    let res = subArgs;
    // for(let i = args.length - 1; i >= 0; i--) {
    //   res = args[i](res);
    // }
    args.reverse().reduce((acc, func,index) => {
      return res = func(acc);
    }, res);
    return res;
  }
}

// FP中pipe（从左往右执行）
export function pipe(...args: any[]) {
  return (subArgs: any) => {
    let res = subArgs;
    // for(let i =0; i < args.length; i++) {
    //   res = args[i](res);
    // }
    args.reduce((acc, func,index) => {
      return res = func(acc);
    }, res);
    return res;
  }
}

// 节流（定时器，时间段最后触发）
export function throttle(func: any, delay: number) {  
    // 初次触发定时器为null，后面产生一份定时器并记下定时器id
    let timer: any = null; 
    // 闭包使定时器id保留在内存中          
    return function() {                
        let context = this;              
        let args = arguments;  
        // 下次触发时，定时器id还存在表示还在节流时间内不予处理              
        if (!timer) {                    
            timer = setTimeout(function() { 
                func.apply(context, args); 
                // 销毁定时器id，以便下次节流函数触发                       
                timer = null;                    
            }, delay);                
        }            
    }        
} 

// 节流（时间段最先触发）
export function throttle1(fn: any,wait: number){
	var lastTime = Date.now();
	return function(){
		var curTime = Date.now();
		if((curTime - lastTime) < wait){return;};
		lastTime = curTime;
		fn.apply(this, arguments);
	}
}

// 防抖
export function debounce(func: any, delay: number) {              
    // 初次触发定时器为null，后面产生一份定时器并记下定时器id
    let timer: any = null; 
    // 闭包使定时器id保留在内存中          
    return function() {                
        let context = this;              
        let args = arguments;  
        // 如果已有定时器id，则需要清除，重新开始延迟执行           
        if (timer) {
            clearTimeout(timer);
            timer = null;                                   
        }
        
        timer = setTimeout( () => { 
            func.apply(this, args); 
            // 销毁定时器id，以便下次节流函数触发                       
            timer = null;                    
        }, delay); 
    }        
}

// 格式化货币
export function fmoney(num: number){
    /* 正则实现 */
    // 参考：https://www.cnblogs.com/lvmylife/p/8287247.html
    let [integer, decimal] = String(num).split('.');
    let regExp = /\d{1,3}(?=(\d{3})+$)/g;
    integer = integer.replace(regExp, '$&,');
    return `${integer}${decimal === undefined ? '': '.'+decimal}`;
    // 正则解释
    // 正则表达式 \d{1,3}(?=(\d{3})+$)  表示前面有1~3个数字，后面的至少由一组3个数字结尾
    // 先行肯定断言(?=)会作为匹配校验，但不会出现在匹配结果字符串里面
    // ?=表示正向引用，可以作为匹配的条件，但匹配到的内容不获取，并且作为下一次查询的开始
    // $& 表示与正则表达式相匹配的内容，具体的可查看 w3school的replace()方法

    /* Number.prototype.toLocaleString()实现 */
    // Number.prototype.toLocaleString()
    // return num.toLocaleString('en');

    /* Intl.NumberFormat().format(number)实现 */
    // Intl.NumberFormat().format(number)
    // return Intl.NumberFormat('en').format(num);

    // reduce 方案
    // let arr = String(num).split('.');
    // let char = arr[0].split('').reverse();   
    // let IntStr = char.reduce((acc, value, index) => {
    //     return `${index % 3 === 0 ? String(value)+',' : String(value)}${acc}`;
    // }, '').slice(0, -1);
    // return `${IntStr}${arr[1]? '.'+arr[1] : '' }`;
}

// reverse money
export function rmoney(num: any){
    return String(num).replace(/,/g, ""); 
}

// 解析URL query
// export function urlParseQuery(url: string){
//   const reg = /.+\?(.+)$/;
//   const queryAry = reg.exec(url)[1].split('&');
//   return queryAry.reduce((acc, item) => {
//     let [key, value] = item.split('=');
//     if(value) {
//       value = decodeURIComponent(value);
//       if(acc.hasOwnProperty(key)) {
//         const oldValue = Array.isArray(acc[key]) ? acc[key] : [acc[key]];
//         acc[key] = [...oldValue, value];
//       }else{
//         acc[key] = value;
//       }
//     }else{
//       acc[key] = true;
//     }
//     return acc;
//   }, {});
// }

// 转camel
export function toCamelCase(str: string) {
  return str.replace(/-\w/g, function(x){
    return x.slice(1).toUpperCase();
  });;
}

// frameWork模版
// ;(function(global, func, name) {
//   global[name] = func.call(global);
// })(this, function(){
//   // 具体实现
// }, 'frameWorkName');





