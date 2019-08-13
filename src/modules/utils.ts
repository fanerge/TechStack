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
        return new RegExp(obj);
    }
    if(checkType(obj) === 'Date') {
        return new Date(obj);
    }
    // 非复杂类型(null、undefined、string、number、symbol、boolean、function)
    if(obj === null || typeof obj !== 'object') {
        return obj;
    }
    if(hash.has(obj)) {
        return hash.get(obj);
    }

    // 处理Object和Array
    // let newObj = checkType(obj) === 'Array' ? [] : {};
    /**
     * 如果 obj 是数组，那么 obj.constructor 是 [Function: Array]
     * 如果 obj 是对象，那么 obj.constructor 是 [Function: Object]
     */
    // let newObj = new obj.constructor();
    // for(let key in obj) {
    //     if(obj.hasOwnProperty(key)) {
    //         // newObj[key] = deepClone(key);
    //         if (typeof obj[key] === 'object' && obj[key]!==null) {
    //             newObj[key] = deepClone(obj[key]);   //递归复制
    //         } else {
    //             newObj[key] = obj[key];
    //         }
    //     }   
    // }

    let newObj = new obj.constructor();
    hash.set(obj, newObj);
    Object.keys(obj).forEach(function(key) {
        if(typeof obj[key] === 'object' && obj[key] !== null) {
            newObj[key] = deepClone(obj[key], hash);
        }else{
            newObj[key] = obj[key];
        }
    });

    return newObj;
}

// 自定义call
export function myCall() {
    let [thisArg, ...args] = Array.from(arguments);
    if (!thisArg) {
        //context 为 null 或者是 undefined
        thisArg = typeof window === 'undefined' ? global : window;
    }
    // this 的指向的是当前函数 func (func.call)
    // 为thisArg对象添加func方法，func方法又指向myCall，所以在func中this指向thisArg
    thisArg.func = this;
    debugger
    // 执行函数
    let result = thisArg.func(...args);
    // thisArg 上并没有 func 属性，因此需要移除
    delete thisArg.func; 
    return result;
}

// 自定义apply
export function myApply() {
    let [thisArg, args] = Array.from(arguments);
    if (!thisArg) {
        //context 为 null 或者是 undefined
        thisArg = typeof window === 'undefined' ? global : window;
    }
    // this 的指向的是当前函数 func (func.call)
    thisArg.func = this;
    // 执行函数
    let result = thisArg.func(...args);
    // thisArg 上并没有 func 属性，因此需要移除
    delete thisArg.func; 
    return result;
}

// 自定义bind
export function myBind() {
    let [thisArg, ...args] = Array.from(arguments);
    if (!thisArg) {
        //context 为 null 或者是 undefined
        thisArg = typeof window === 'undefined' ? global : window;
    }
    thisArg.func = this;

    return function() {
        let result = thisArg.func(...args);
        // thisArg原本没有func方法
        delete thisArg.func;
        return result;
    }
}

// 柯里化函数实现curry
export function curry(fn: any, ...args: any[]) {
    args.length < fn.length
    // 参数长度不足时，重新柯里化该函数，等待接受新参数
    ? (...rest: any[]) => curry(fn, ...args, ...rest)
    // 参数长度满足时，执行函数
    : fn(...args);
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
    let regExp = /\d{1,3}(?=(\d{3})+\.*)/g;
    return String(num).replace(regExp, "$&,");
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

// 随机数





