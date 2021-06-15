"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports["default"] = (function () {
    var items = new WeakMap();
    // 只考虑string作为object的key（Symbol不考虑）
    return /** @class */ (function () {
        function Dictionary() {
            items.set(this, {});
        }
        Dictionary.prototype.has = function (key) {
            var obj = items.get(this);
            return obj[key] !== undefined;
        };
        Dictionary.prototype.set = function (key, value) {
            var obj = items.get(this);
            obj[key] = value;
        };
        Dictionary.prototype["delete"] = function (key) {
            var obj = items.get(this);
            if (this.has(key)) {
                delete obj[key];
                return true;
            }
            return false;
        };
        Dictionary.prototype.get = function (key) {
            var obj = items.get(this);
            return obj[key];
        };
        Dictionary.prototype.clear = function () {
            items.set(this, {});
        };
        Dictionary.prototype.size = function () {
            return Object.keys(items.get(this)).length;
        };
        Dictionary.prototype.keys = function () {
            var obj = items.get(this);
            return Object.keys(obj);
        };
        Dictionary.prototype.values = function () {
            var obj = items.get(this);
            return Object.values(obj);
        };
        Dictionary.prototype.print = function () {
            var obj = items.get(this);
            // let symbols = Object.getOwnPropertySymbols(obj).map(item => {
            //   return [item, obj[item]]
            // });
            return __spreadArray([], Object.entries(obj));
        };
        return Dictionary;
    }());
})();
