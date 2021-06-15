"use strict";
exports.__esModule = true;
exports.Node = void 0;
exports["default"] = (function () {
    return /** @class */ (function () {
        function LinkedList() {
            this.length = 0;
            this.head = null;
        }
        LinkedList.prototype.append = function (element) {
            var node = new Node(element), current;
            // 添加时还没有节点
            if (this.head === null) {
                this.head = node;
            }
            else {
                current = this.head;
                // 添加时有节点，则需要找到最后一个节点添加
                while (current.next) {
                    current = current.next;
                }
                // 最后一个节点的next属性指向新的节点
                current.next = node;
            }
            // 同步更新其长度
            this.length++;
        };
        LinkedList.prototype.removeAt = function (position) {
            if (position < -1 || position > this.length) {
                return null;
            }
            var current = this.head, previous, index = 0;
            // 移除第一个 
            if (position === 0) {
                this.head = current.next;
            }
            else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                //将previous与current的下一项链接起来:跳过current，从而移除它
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        };
        LinkedList.prototype.insert = function (position, element) {
            if (position < -1 || position > this.length) {
                return false;
            }
            var node = new Node(element);
            var current = this.head;
            var previous;
            var index = 0;
            if (position === 0) {
                node.next = current;
                this.head = node;
            }
            else {
                while (index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        };
        LinkedList.prototype.remove = function (element) {
            var previous;
            var current = this.head;
            while (current && current.element !== element) {
                previous = current;
                current = current.next;
            }
            if (current) {
                previous.next = current.next;
            }
            else {
                return false;
            }
        };
        LinkedList.prototype.getHead = function () {
            return this.head;
        };
        LinkedList.prototype.size = function () {
            return this.length;
        };
        LinkedList.prototype.isEmpty = function () {
            return this.length === 0;
        };
        LinkedList.prototype.print = function () {
            var current = this.head;
            var str = '';
            while (current) {
                str += current.element + ";";
                current = current.next;
            }
            return str;
        };
        return LinkedList;
    }());
})();
var Node = /** @class */ (function () {
    function Node(element) {
        this.element = element;
        this.next = null;
    }
    return Node;
}());
exports.Node = Node;
