import Dictionary from './dictionary';
import Queue from './queue';

export default class Graph {
  vertices: any;
  adjList: any;
  time: number = 0;
  constructor() {
    // 我们使用一个数组来存储图中所有顶点的名字
    this.vertices = [];
    // 一个字典来存储邻接表，字典将会使用顶点的名字作为键，邻接顶点列表作为值。
    this.adjList = new Dictionary();
  }

  // 添加顶点
  addVertex(v: any) {
    this.vertices.push(v);
    this.adjList.set(v, []);
  }

  // 添加边（边为自v到w，vw为顶点）
  addEdge(v: any, w: any) {
    // 有向图只需这一行
    this.adjList.get(v).push(w);
    this.adjList.get(w).push(v);
  }

  // 初始（未访问标记未白色）
  initializeColor() {
    return this.vertices.reduce((acc: any, item: any) => {
      acc[item] = 'white';
      return acc;
    }, []);
  }

  // 广度优先搜索
  BFS(v: any) {
    let color = this.initializeColor();
    let queue = new Queue();
    // 距离数组
    let d: any[] = [];
    // 前溯点
    let pred: any[] = [];
    queue.enqueue(v);

    for(let i = 0; i < this.vertices.length; i++) {
      d[this.vertices[i]] = 0;
      pred[this.vertices[i]] = null;
    }

    while(!queue.isEmpty()) {
      const u = queue.dequeue();
      const neighbors = this.adjList.get(u) || [];
      color[u] = 'grey';
      neighbors.forEach((item: any) => {
        let w = color[item];
        if(w === 'white') {
          w = 'grey';
          d[item] = d[u] + 1;
          pred[item] = u;
          queue.enqueue(item);
        }
      });
      color[u] = 'black';
    }

    return {
      distances: d,
      predecessors: pred
    };
  }

  private dfsVisit(u: any, color: any, d: any, f: any, p: any) {
    color[u] = 'grey';
    d[u] = ++this.time;
    let neighbors = this.adjList.get(u);
    neighbors.forEach((ele: any) => {
      if(color[ele] === 'white') {
        p[ele] = u;
        this.dfsVisit(ele, color, d, f, p);
      }
    });
    color[u] = 'black';
    f[u] = ++this.time;
    console.log('explored ' + u);
  }

  // DFS
  DFS() {
    let color = this.initializeColor();
    let d: any = [];
    let f: any = [];
    let p:any = [];
    this.time = 0;

    this.vertices.forEach((el: any)  => {
      f[el] = 0;
      d[el] = 0;
      p[el] = null;
    });

    this.vertices.forEach((el: any)  => {
      if(color[el] === 'white') {
        this.dfsVisit(el, color, d, f, p);
      }
    });

    return {
      discovery: d,
      finished: f,
      predecessors: p
    };
  }

  // debug
  toString() {
    let s = '';
    return this.vertices.reduce((acc: any, item: any) => {
      let subS = this.adjList.get(item).reduce((subAcc: any, subItem: any) => {
        return `${subAcc} ${subItem}`
      }, '');
      return `${acc} ${item} -> ${subS} \n`;
    }, s);
  }
}