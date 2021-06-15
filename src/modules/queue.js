"use strict";
exports.__esModule = true;
exports.PriorityQueue = void 0;
/**
 * 普通队列
 */
exports["default"] = (function () {
    var items = new WeakMap();
    return /** @class */ (function () {
        function Queue() {
            items.set(this, []);
        }
        Queue.prototype.enqueue = function (element) {
            var s = items.get(this);
            // s.push(element);
            s[s.length] = element;
        };
        Queue.prototype.dequeue = function () {
            var s = items.get(this);
            var dequeueItem = s[0];
            // s.shift();
            for (var i = 0; i < s.length - 1; i++) {
                s[i] = s[i + 1];
            }
            s.length = s.length - 1;
            return dequeueItem;
        };
        Queue.prototype.front = function () {
            var s = items.get(this);
            return s[0];
        };
        Queue.prototype.isEmpty = function () {
            var s = items.get(this);
            return s.length === 0;
        };
        Queue.prototype.size = function () {
            var s = items.get(this);
            return s.length;
        };
        Queue.prototype.toString = function () {
            var s = items.get(this);
            return Array.prototype.toString.call(s);
        };
        return Queue;
    }());
})();
/**
 * 优先队列
 */
exports.PriorityQueue = (function () {
    var items = new WeakMap();
    var QueueElement = /** @class */ (function () {
        function QueueElement(element, priority) {
            this.element = element;
            this.priority = priority;
        }
        return QueueElement;
    }());
    return /** @class */ (function () {
        function PriorityQueue() {
            items.set(this, []);
        }
        PriorityQueue.prototype.enqueue = function (element, priority) {
            var s = items.get(this);
            var queueElement = new QueueElement(element, priority);
            var added = false;
            for (var i = 0; i < s.length; i++) {
                if (queueElement.priority < s[i].priority) {
                    s.splice(i, 0, queueElement);
                    added = true;
                    break;
                }
            }
            if (!added) {
                s.push(queueElement);
            }
        };
        PriorityQueue.prototype.dequeue = function () {
            var s = items.get(this);
            var dequeueItem = s[0];
            // s.shift();
            for (var i = 0; i < s.length - 1; i++) {
                s[i] = s[i + 1];
            }
            s.length = s.length - 1;
            return dequeueItem;
        };
        PriorityQueue.prototype.front = function () {
            var s = items.get(this);
            return s[0];
        };
        PriorityQueue.prototype.isEmpty = function () {
            var s = items.get(this);
            return s.length === 0;
        };
        PriorityQueue.prototype.size = function () {
            var s = items.get(this);
            return s.length;
        };
        PriorityQueue.prototype.toString = function () {
            var s = items.get(this);
            var str = '';
            for (var i = 0; i < s.length; i++) {
                str += s[i].element + ", " + s[i].priority + ";";
            }
            return str;
        };
        return PriorityQueue;
    }());
})();
