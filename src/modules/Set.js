"use strict";
exports.__esModule = true;
exports["default"] = (function () {
    var items = new WeakMap();
    return /** @class */ (function () {
        function Sets() {
            items.set(this, {});
        }
        Sets.prototype.add = function (value) {
            var obj = items.get(this);
            if (this.has(value)) {
                return false;
            }
            obj[value] = value;
            return true;
        };
        Sets.prototype["delete"] = function (value) {
            var obj = items.get(this);
            if (this.has(value)) {
                delete obj[value];
                return true;
            }
            return false;
        };
        Sets.prototype.has = function (value) {
            var obj = items.get(this);
            return Object.values(obj).includes(value);
        };
        Sets.prototype.size = function () {
            var obj = items.get(this);
            return Object.values(obj).length || 0;
        };
        Sets.prototype.clear = function () {
            items.set(this, {});
        };
        Sets.prototype.values = function () {
            var obj = items.get(this);
            return Object.values(obj) || [];
        };
        // 并集
        Sets.prototype.union = function (otherSet) {
            var unionSet = new Sets();
            var values1 = this.values();
            var values2 = otherSet.values();
            values1.forEach(function (item) {
                if (!unionSet.has(item)) {
                    unionSet.add(item);
                }
            });
            values2.forEach(function (item) {
                if (!unionSet.has(item)) {
                    unionSet.add(item);
                }
            });
            return unionSet;
        };
        // 交集
        Sets.prototype.intersection = function (otherSet) {
            var _this = this;
            var unionSet = this.union(otherSet);
            var newSet = new Sets();
            unionSet.values().forEach(function (item) {
                if (_this.has(item) && otherSet.has(item)) {
                    newSet.add(item);
                }
            });
            return newSet;
        };
        // 差集
        Sets.prototype.difference = function (otherSet) {
            var newSet = new Sets();
            this.values().forEach(function (item) {
                if (!otherSet.has(item)) {
                    newSet.add(item);
                }
            });
            return newSet;
        };
        // 是否为子集
        Sets.prototype.isSubSet = function (otherSet) {
            var array = this.values();
            return otherSet.values().every(function (item) {
                return array.includes(item);
            });
        };
        Sets.prototype.print = function () {
            var obj = items.get(this);
            return Object.values(obj).reduce(function (acc, item, index) {
                return acc + item + ';';
            }, '');
        };
        return Sets;
    }());
})();
// ES6的并集
// let unionAb = new Set(); //{1}
// for (let x of setA) unionAb.add(x); //{2}
// for (let x of setB) unionAb.add(x); //{3}
// 交集
// let intersection = function(setA, setB) {
//   let intersectionSet = new Set();
//   for (let x of setA) {
//     if (setB.has(x)) { //{1}
//       intersectionSet.add(x);
// } }
//   return intersectionSet;
// };
// let intersectionAB = intersection(setA, setB);
// 差集
// let difference = function(setA, setB) {
//   let differenceSet = new Set();
//   for (let x of setA) {
//  if (!setB.has(x)) { //{1}
// } }
//   return differenceSet;
// };
//  let differenceAB = difference(setA, setB);
