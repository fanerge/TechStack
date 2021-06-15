"use strict";
exports.__esModule = true;
var dictionary_1 = require("./dictionary");
var queue_1 = require("./queue");
var Graph = /** @class */ (function () {
    function Graph() {
        this.time = 0;
        // 我们使用一个数组来存储图中所有顶点的名字
        this.vertices = [];
        // 一个字典来存储邻接表，字典将会使用顶点的名字作为键，邻接顶点列表作为值。
        this.adjList = new dictionary_1["default"]();
    }
    // 添加顶点
    Graph.prototype.addVertex = function (v) {
        this.vertices.push(v);
        this.adjList.set(v, []);
    };
    // 添加边（边为自v到w，vw为顶点）
    Graph.prototype.addEdge = function (v, w) {
        // 有向图只需这一行
        this.adjList.get(v).push(w);
        this.adjList.get(w).push(v);
    };
    // 初始（未访问标记未白色）
    Graph.prototype.initializeColor = function () {
        return this.vertices.reduce(function (acc, item) {
            acc[item] = 'white';
            return acc;
        }, []);
    };
    // 广度优先搜索
    Graph.prototype.BFS = function (v) {
        var color = this.initializeColor();
        var queue = new queue_1["default"]();
        // 距离数组
        var d = [];
        // 前溯点
        var pred = [];
        queue.enqueue(v);
        for (var i = 0; i < this.vertices.length; i++) {
            d[this.vertices[i]] = 0;
            pred[this.vertices[i]] = null;
        }
        var _loop_1 = function () {
            var u = queue.dequeue();
            var neighbors = this_1.adjList.get(u) || [];
            color[u] = 'grey';
            neighbors.forEach(function (item) {
                var w = color[item];
                if (w === 'white') {
                    w = 'grey';
                    d[item] = d[u] + 1;
                    pred[item] = u;
                    queue.enqueue(item);
                }
            });
            color[u] = 'black';
        };
        var this_1 = this;
        while (!queue.isEmpty()) {
            _loop_1();
        }
        return {
            distances: d,
            predecessors: pred
        };
    };
    Graph.prototype.dfsVisit = function (u, color, d, f, p) {
        var _this = this;
        color[u] = 'grey';
        d[u] = ++this.time;
        var neighbors = this.adjList.get(u);
        neighbors.forEach(function (ele) {
            if (color[ele] === 'white') {
                p[ele] = u;
                _this.dfsVisit(ele, color, d, f, p);
            }
        });
        color[u] = 'black';
        f[u] = ++this.time;
        console.log('explored ' + u);
    };
    // DFS
    Graph.prototype.DFS = function () {
        var _this = this;
        var color = this.initializeColor();
        var d = [];
        var f = [];
        var p = [];
        this.time = 0;
        this.vertices.forEach(function (el) {
            f[el] = 0;
            d[el] = 0;
            p[el] = null;
        });
        this.vertices.forEach(function (el) {
            if (color[el] === 'white') {
                _this.dfsVisit(el, color, d, f, p);
            }
        });
        return {
            discovery: d,
            finished: f,
            predecessors: p
        };
    };
    // debug
    Graph.prototype.toString = function () {
        var _this = this;
        var s = '';
        return this.vertices.reduce(function (acc, item) {
            var subS = _this.adjList.get(item).reduce(function (subAcc, subItem) {
                return subAcc + " " + subItem;
            }, '');
            return acc + " " + item + " -> " + subS + " \n";
        }, s);
    };
    return Graph;
}());
exports["default"] = Graph;
