"use strict";
exports.__esModule = true;
var linkedList_1 = require("./linkedList");
exports["default"] = (function () {
    var items = new WeakMap();
    // hash函数（非常重要，必须要防止hash碰撞）
    function loseloseHashCode(key) {
        var array = Array.from(key);
        var hash = array.reduce(function (acc, item) {
            return acc + item.codePointAt(0);
        }, 0);
        return hash % 37;
    }
    // 辅助类（ValuePair）
    var ValuePair = /** @class */ (function () {
        function ValuePair(key, value) {
            this.key = key;
            this.value = value;
        }
        ValuePair.prototype.toString = function () {
            return '[' + this.key + ' - ' + this.value + ']';
        };
        ;
        return ValuePair;
    }());
    // 分离链接版
    return /** @class */ (function () {
        function HashTable() {
            items.set(this, []);
        }
        HashTable.prototype.put = function (key, value) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            if (table[hash] === undefined) {
                table[hash] = new linkedList_1["default"]();
            }
            table[hash].append(new ValuePair(key, value));
        };
        HashTable.prototype.get = function (key) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            var item = table[hash];
            // let item = new LinkedList();
            if (item !== undefined) {
                var current = item.getHead();
                while (current) {
                    if (current.element.key === key) {
                        return current.element.value;
                    }
                    current = current.next;
                }
            }
            return undefined;
        };
        HashTable.prototype["delete"] = function (key) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            if (table[hash] !== undefined) {
                var current = table[hash].getHead();
                while (current) {
                    if (current.element.key === key) {
                        table[hash].remove(current.element);
                        // 移除最后一项，特殊处理
                        if (table[hash].isEmpty()) {
                            table[hash] = undefined;
                        }
                        return true;
                    }
                    current = current.next;
                }
            }
            return false;
        };
        HashTable.prototype.print = function () {
            var table = items.get(this);
            return table;
        };
        return HashTable;
    }());
})();
