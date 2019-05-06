// 栈( stack )又称堆栈，是一种后进先出的有序集合，其中一端为栈顶，另一端为栈底，添加元素（称为压栈/入栈或进栈）时，将新元素压入栈顶，删除元素（称为出栈或退栈）时，将栈底元素删除并返回被删除元素。
// 参考地址https://juejin.im/post/5cb2df0c5188251aca7340a0

const _items = Symbol();
const _arr = Symbol();

export default class Stack {
    constructor (){
        this[_items] = []; // 数据栈
        this[_arr] = [];   // 辅助栈
    }
    push( element ){
        this[_items].push(element);
        let min = Math.min(...this[_items]);
        this[_arr].push( min === element ? this.size() - 1 : 0);
    }
    pop(){
        this[_arr].pop();
        return this[_items].pop();
    }
    peek(){
        return this[_items][this[_items].length - 1];
    }
    isEmpty(){
        return this[_items].length === 1;
    }
    clear(){
        this[_items] = [];
    }
    size(){
        return this[_items].length;
    }
    min (){
        let last = this[_arr][this[_arr].length - 1];
        return this[_items][last];
    }
}

