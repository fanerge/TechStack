"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.toCamelCase = exports.rmoney = exports.fmoney = exports.debounce = exports.throttle = exports.pipe = exports.compose = exports.curry = exports.deepClone = exports.checkType = void 0;
// 深拷贝、节流防抖、千分位、排序算法、设计模式、call/apply、继承
// [参考](https://mp.weixin.qq.com/s/FHiSjn2Ooj7ZNqp9IfJ8mA)
// 检查数据类型
function checkType(obj) {
    var type = Object.prototype.toString.call(obj);
    return type.slice(8, -1);
}
exports.checkType = checkType;
// 深拷贝（hash = new WeakMap()考虑循环引用的问题）
function deepClone(obj, hash) {
    if (hash === void 0) { hash = new WeakMap(); }
    if (checkType(obj) === 'RegExp') {
        // regExp.source 正则对象的源模式文本;
        // regExp.flags 正则表达式对象的标志字符串;
        // regExp.lastIndex 下次匹配开始的字符串索引位置
        var temp = new RegExp(obj.source, obj.flags);
        temp.lastIndex = obj.lastIndex;
        return temp;
    }
    if (checkType(obj) === 'Date') {
        return new Date(obj);
    }
    // 非复杂类型(null、undefined、string、number、symbol、boolean、function)
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // 还可以扩展其他类型。。。
    // 与后面hash.set()防止循环引用
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    var newObj = new obj.constructor();
    hash.set(obj, newObj);
    // Object.keys(obj)类型于 for in 和 obj.hasOwnProperty
    // 是否应该拷贝自身属性（可枚举的和不可枚举的以及symbol）
    Reflect.ownKeys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            newObj[key] = deepClone(obj[key], hash);
        }
        else {
            // 直接赋值
            // newObj[key] = obj[key];
            // 是否应该保留属性描述符
            Object.defineProperty(newObj, key, Object.getOwnPropertyDescriptor(obj, key));
        }
    });
    return newObj;
}
exports.deepClone = deepClone;
// FP中柯里化函数实现curry
function curry(fn) {
    return function judgeCurry() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fn.length > args.length ?
            function () {
                var args1 = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args1[_i] = arguments[_i];
                }
                return judgeCurry.apply(void 0, __spreadArray(__spreadArray([], args), args1));
            } : fn.apply(void 0, args);
    };
}
exports.curry = curry;
// FP中compose（从右往左执行）
function compose() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (subArgs) {
        // for(let i = args.length - 1; i >= 0; i--) {
        //   res = args[i](res);
        // }
        return args.reverse().reduce(function (acc, func, index) {
            return func(acc);
        }, subArgs);
    };
}
exports.compose = compose;
// FP中pipe（从左往右执行）
function pipe() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (subArgs) {
        // for(let i = args.length - 1; i >= 0; i--) {
        //   res = args[i](res);
        // }
        return args.reduce(function (acc, func, index) {
            return func(acc);
        }, subArgs);
    };
}
exports.pipe = pipe;
// 节流
function throttle(fn, wait) {
    var last;
    return function () {
        var now = Date.now();
        // 初次执行
        if (!last) {
            fn.apply(this, arguments);
            last = now;
            return;
        }
        // 以后触发，需要判断是否到延迟
        if (now - last >= wait) {
            fn.apply(this, arguments);
            last = now;
        }
    };
}
exports.throttle = throttle;
// 防抖
function debounce(func, delay) {
    // 初次触发定时器为null，后面产生一份定时器并记下定时器id
    var timer = null;
    // 闭包使定时器id逃逸   
    return function () {
        var _this = this;
        var args = arguments;
        // 如果已有定时器id，则需要清除，重新开始延迟执行           
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function () {
            func.apply(_this, args);
            // 销毁定时器id，以便下次节流函数触发                       
            timer = null;
        }, delay);
    };
}
exports.debounce = debounce;
// 格式化货币
function fmoney(num) {
    /* 正则实现 */
    // 参考：https://www.cnblogs.com/lvmylife/p/8287247.html
    var _a = String(num).split('.'), integer = _a[0], decimal = _a[1];
    var regExp = /\d{1,3}(?=(\d{3})+$)/g;
    // integer.replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,')
    integer = integer.replace(regExp, '$&,');
    return "" + integer + (decimal === undefined ? '' : '.' + decimal);
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
}
exports.fmoney = fmoney;
function formatMoney1(num) {
    var _a = String(num).split('.'), int = _a[0], dec = _a[1];
    var list = __spreadArray([], int);
    var len = list.length;
    int = list.reduceRight(function (acc, item, index) {
        // reduceRight 的 index 也是正序的 index
        var num = len - index;
        if (num % 3 === 0) {
            acc += "," + item;
        }
        return acc;
    }, '');
    dec = dec ? "." + dec : '';
    return "" + int + dec;
}
// reverse money
function rmoney(num) {
    return String(num).replace(/,/g, "");
}
exports.rmoney = rmoney;
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
function toCamelCase(str) {
    return str.replace(/-\w/g, function (x) {
        return x.slice(1).toUpperCase();
    });
    ;
}
exports.toCamelCase = toCamelCase;
// frameWork模版
// ;(function(global, func, name) {
//   global[name] = func.call(global);
// })(this, function(){
//   // 具体实现
// }, 'frameWorkName');
