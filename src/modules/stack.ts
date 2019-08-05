// ES6
// 不可用let _items = Symbol()来做私有属性
// Object.getOwnPropertySymbols(stack);获取到
// const items = new WeakMap();
const items: any = new Map();

export default class Stack {

    // name: any;
    constructor() {
        items.set(this, []);
        // 类似于stack.name
        // this.name = name;
    }

    // 类似于Stack.protype.push
    push(element: any) {
        let s = items.get(this);
        // s.push(element);
        s[s.length] = element;
        // return s;
    }

    pop() {
        let s = items.get(this);
        let last: any = s[s.length - 1];
        s[s.length - 1] = null;
        // delete s[s.length - 1];
        // 模拟pop方法需length - 1
        s.length = s.length - 1;
        
        // return s.pop();
        return last;
    }

    peek() {
        let s = items.get(this);
        return s[s.length - 1];
    }

    isEmpty() {
        let s = items.get(this);
        return s.length === 0;
    }

    clear() {
        let s = items.get(this);
        s.length = 0;
    }

    size() {
        let s = items.get(this);
        return s.length;
    }

    toString() {
        let s = items.get(this);
        return Array.prototype.toString.call(s);
    }
}

/**
 * 10进制转2进制
 * @param num 
 */
export function divideBy2(num: number) {
    let arr = new Stack();
    let temp;
    let str: string = '';
    while(num > 0) {
        temp = Math.floor(num % 2);
        arr.push(temp);
        num = Math.floor(num / 2);
    }
    
    while(!arr.isEmpty()) {
        str += `${arr.pop()}`;
    }

    return  str;
}

/**
 * 
 * @param num 
 */
export function baseConverter(num: number, base: number) {
    let arr = new Stack();
    let index;
    let str: string = '';
    let digits: string[] = '0123456789ABCDEF'.split('');
    while(num > 0) {
        index = Math.floor(num % base);
        arr.push(digits[index]);
        num = Math.floor(num / base);
    }
    
    while(!arr.isEmpty()) {
        str += `${arr.pop()}`;
    }

    return  str;
}
