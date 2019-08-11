import { clearLine } from "readline";

// 节点类
export class Node {
  key: any;
  left: any;
  right: any;
  constructor(key: any) {
    this. key = key;
    this.left = null;
    this.right = null;
  }
}

export default (function() {
  // 私有-插入节点
  function insertNode(node: Node, newNode: Node) {
    if(newNode.key < node.key) {
      if(node.left === null) {
        node.left = newNode;
      }else{
        insertNode(node.left, newNode);
      }
    }else{
      if(node.right === null) {
        node.right = newNode;
      }else{
        insertNode(node.right, newNode);
      }
    }
  }

  // 中序遍历(从小到大，左-》跟-》右)
  function inOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      inOrderTraverseNode(node.left, callback);
      callback(node.key);
      inOrderTraverseNode(node.right, callback);
    }
  }

  // 先序遍历(跟-》左-》右)
  function preOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      callback(node.key);
      preOrderTraverseNode(node.left, callback);
      preOrderTraverseNode(node.right, callback);
    }
  }

  // 后序遍历(左-》右-》跟)
  function postOrderTraverseNode(node: Node, callback: any) {
    if(node !== null) {
      postOrderTraverseNode(node.left, callback);
      postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  // search
  function search(node: Node, type: any) {
    if(node) {
      while(node && node[type] !== null) {
        node = node[type];
      }
      return node.key;
    }
    return null;
  }

  // 
  function searchNode(node: Node, key: any): any {
    if(node === null) {
      return false;
    }
    if(key > node.key) {
      return searchNode(node.right, key);
    }else if(key < node.key){
      return searchNode(node.left, key);
    }else{
      return true;
    }
  }

  // 
  function findMinNode(node: Node) {
    if(node) {
      while(node && node.left !== null) {
        node = node.left;
      }
      return node;
    }
    return null;
  }

  // 
  function deleteNode(node: Node, key: any) {
    if(node === null) {
      return null;
    }
    if(key < node.key) {
      deleteNode(node.left, key);
      // return node;
    }else if(key > node.key){
      deleteNode(node.right, key);
      // return node;
    }else{
      debugger
      // 第一种（叶子节点）
      if(node.left === null && node.right === null) {
        let tempNode = node;
        node = null;
        return tempNode;
      }
      // 第二种（有一个右节点）
      if(node.left === null && node.right !== null) {
        let tempNode = node;
        node = node.right;
        return tempNode;
      }
      // 第三种（有一个左节点）
      if(node.right === null && node.left !== null) {
        let tempNode = node;
        node = node.left;
        return tempNode;
      }
      // 第四种（有两个子节点）
      // (1) 当找到了需要移除的节点后，需要找到它右边子树中最小的节点(它的继承者)。
      // (2) 然后，用它右侧子树中最小节点的键去更新这个节点的值。通过这一步，我 们改变了这个节点的键，也就是说它被移除了。
      // (3) 但是，这样在树中就有两个拥有相同键的节点了，这是不行的。要继续把右侧子树中的 最小节点移除，毕竟它已经被移至要移除的节点的位置了。
      // (4) 最后，向它的父节点返回更新后节点的引用。
      if(node.left !== null && node.right !== null) {
        let aux = findMinNode(node.right);
        node.key = aux.key;
        node.right = deleteNode(node.right, aux.key);
        return node;
      }
    }
  }

  return class BinarySearchTree {
    root: any;
    constructor() {
      this.root = null;
    }

    // 向树中插入值
    insert(key: any) {
      const newNode  = new Node(key);
      if(this.root === null) {
        this.root = newNode;
      }else{
        insertNode(this.root, newNode);
      }
    }

    delete(key: any) {
      return deleteNode(this.root, key);
    }

    // 树的遍历
    // 中序遍历(从小到大，左-》跟-》右)
    inOrderTraverse(callback: any) {
      inOrderTraverseNode(this.root, callback);
    }

    // 先序遍历(跟-》左-》右)
    preOrderTraverse(callback: any) {
      preOrderTraverseNode(this.root, callback);
    }

    // 后序遍历(左-》右-》跟)
    postOrderTraverse(callback: any) {
      postOrderTraverseNode(this.root, callback);
    }

    // search-min
    min() {
      return search(this.root, 'left');
    }

    // search-max
    max() {
      return search(this.root, 'right');
    }

    search(key: any) {
      return searchNode(this.root, key);
    }
  }
})();










