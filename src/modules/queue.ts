/**
 * 普通队列
 */
export default (function() {
    let items = new WeakMap();

    return class Queue {
        constructor() {
            items.set(this, []);
        }

        enqueue(element: any) {
            let s = items.get(this);
            // s.push(element);
            s[s.length] = element;
        }

        dequeue() {
            let s = items.get(this);
            let dequeueItem = s[0];
            // s.shift();
            for(let i = 0; i < s.length - 1; i++) {
                s[i] = s[i+1];
            }
            s.length = s.length - 1;
            return dequeueItem;
        }

        front() {
            let s = items.get(this);
            return s[0];
        }

        isEmpty() {
            let s = items.get(this);
            return s.length === 0;
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
})();

/**
 * 优先队列
 */
export const PriorityQueue = (function() {
    let items = new WeakMap();

    class QueueElement {
        element: any;
        priority: number;

        constructor(element: any, priority: number) {
            this.element = element;
            this.priority = priority;
        }
    }

    return class PriorityQueue {
        constructor() {
            items.set(this, []);
        }

        enqueue(element: any, priority: number) {
            let s = items.get(this);
            let queueElement = new QueueElement(element, priority);
            let added = false;
            for(let i =0; i < s.length; i++) {
                if(queueElement.priority < s[i].priority) {
                    s.splice(i, 0, queueElement);
                    added = true;
                    break;
                }
            }
            if(!added) {
                s.push(queueElement);
            }
        }

        dequeue() {
            let s = items.get(this);
            let dequeueItem = s[0];
            // s.shift();
            for(let i = 0; i < s.length - 1; i++) {
                s[i] = s[i+1];
            }
            s.length = s.length - 1;

            return dequeueItem;
        }

        front() {
            let s = items.get(this);
            return s[0];
        }

        isEmpty() {
            let s = items.get(this);
            return s.length === 0;
        }

        size() {
            let s = items.get(this);
            return s.length;
        }

        toString() {
            let s = items.get(this);
            let str = '';
            for(let i = 0; i < s.length; i++) {
                str += `${s[i].element}, ${s[i].priority};`;
            }
            return str;
        }
    }
})();



