"use strict";
exports.__esModule = true;
exports.baseConverter = exports.divideBy2 = void 0;
// ES6
// 不可用let _items = Symbol()来做私有属性
// Object.getOwnPropertySymbols(stack);获取到
// const items = new WeakMap();
var items = new Map();
var Stack = /** @class */ (function () {
    // name: any;
    function Stack() {
        items.set(this, []);
        // 类似于stack.name
        // this.name = name;
    }
    // 类似于Stack.protype.push
    Stack.prototype.push = function (element) {
        var s = items.get(this);
        // s.push(element);
        s[s.length] = element;
        // return s;
    };
    Stack.prototype.pop = function () {
        var s = items.get(this);
        var last = s[s.length - 1];
        s[s.length - 1] = null;
        // delete s[s.length - 1];
        // 模拟pop方法需length - 1
        s.length = s.length - 1;
        // return s.pop();
        return last;
    };
    Stack.prototype.peek = function () {
        var s = items.get(this);
        return s[s.length - 1];
    };
    Stack.prototype.isEmpty = function () {
        var s = items.get(this);
        return s.length === 0;
    };
    Stack.prototype.clear = function () {
        var s = items.get(this);
        s.length = 0;
    };
    Stack.prototype.size = function () {
        var s = items.get(this);
        return s.length;
    };
    Stack.prototype.toString = function () {
        var s = items.get(this);
        return Array.prototype.toString.call(s);
    };
    return Stack;
}());
exports["default"] = Stack;
/**
 * 10进制转2进制
 * @param num
 */
function divideBy2(num) {
    var arr = new Stack();
    var temp;
    var str = '';
    while (num > 0) {
        temp = Math.floor(num % 2);
        arr.push(temp);
        num = Math.floor(num / 2);
    }
    while (!arr.isEmpty()) {
        str += "" + arr.pop();
    }
    return str;
}
exports.divideBy2 = divideBy2;
/**
 *
 * @param num
 */
function baseConverter(num, base) {
    var arr = new Stack();
    var index;
    var str = '';
    var digits = '0123456789ABCDEF'.split('');
    while (num > 0) {
        index = Math.floor(num % base);
        arr.push(digits[index]);
        num = Math.floor(num / base);
    }
    while (!arr.isEmpty()) {
        str += "" + arr.pop();
    }
    return str;
}
exports.baseConverter = baseConverter;
