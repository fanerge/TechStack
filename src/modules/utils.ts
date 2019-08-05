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

// 防抖
export function debounce(func: any, wait: number, immediate = true) {
    
};





