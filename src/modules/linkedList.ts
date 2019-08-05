export default (function() {

    return class LinkedList {
        length: number;
        head: null | Node;
        constructor() {
            this.length = 0;
            this.head = null;
        }

        append(element: any){
            let node  = new Node(element),
            current: Node;
            // 添加时还没有节点
            if(this.head === null) {
                this.head = node;
            }else{
                current = this.head;
                // 添加时有节点，则需要找到最后一个节点添加
                while(current.next) {
                    current = current.next;
                }
                // 最后一个节点的next属性指向新的节点
                current.next = node;
            }
            // 同步更新其长度
            this.length++;
        }

        removeAt(position: number) {
            if(position < -1 || position > this.length) {
                return null;
            }
            let current = this.head,
                previous,
                index = 0;
            // 移除第一个 
            if(position === 0) {
                this.head = current.next;
            }else{
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                //将previous与current的下一项链接起来:跳过current，从而移除它
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        }

        insert(position: number, element: any): boolean {
            if(position < -1 || position > this.length) {
                return false;
            }
            let node = new Node(element);
            let current = this.head;
            let previous: null | Node;
            let index: number = 0;
            if(position === 0) {
                node.next = current;
                this.head = node;  
            }else{
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        }

        remove(element: any) {
            let previous;
            let current = this.head;
            while(current && current.element !== element) {
                previous = current;
                current = current.next;
            }
            if(current) {
                previous.next = current.next;
            }else{
                return false;
            }
        }

        getHead(): null | Node {
            return this.head;
        }

        size(): number {
            return this.length;
        }

        isEmpty(): boolean {
            return this.length === 0;
        }

        print() {
            let current = this.head;
            let str: string = '';
            while(current) {
                str += `${current.element};`
                current = current.next;
            }
            return str;
        }
    }
})();

export class Node {
    element: any;
    next: any;
    constructor(element: any) {
        this.element = element;
        this.next = null;
    }
}
