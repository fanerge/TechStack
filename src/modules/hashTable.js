"use strict";
exports.__esModule = true;
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
    return /** @class */ (function () {
        function HashTable() {
            items.set(this, []);
        }
        HashTable.prototype.put = function (key, value) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            console.log(hash);
            table[hash] = value;
        };
        HashTable.prototype.get = function (key) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            return table[hash];
        };
        HashTable.prototype["delete"] = function (key) {
            var hash = loseloseHashCode(key);
            var table = items.get(this);
            if (this.get(key) !== undefined) {
                table[hash] = undefined;
                return true;
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
