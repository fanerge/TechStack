// 实现 Trie (前缀树)
class TreeNode {
	constructor(val = null, isWord = false, children = {}) {
		this.val = val;
		// 插入的单词是否有在此处结尾的
		this.isWord = isWord;
		this.children = children;
	}
}
class Trie {
	constructor() {
		this.root = new TreeNode();
	}

	// word
	insert(word) {
		let curNode = this.root;
		let arr = word.split('');
		for(let i=0; i<arr.length; i++) {
			let isHasChildNode = curNode.children[arr[i]];
			// 没有子节点的话，就要创建一个以当前字符为val的子节点
			if(!isHasChildNode) {
				curNode.children[arr[i]] = new TreeNode(arr[i]);
			}
			curNode = curNode.children[arr[i]];
			// 遍历到最后一个字符所对应的节点，将这个节点的isWord属性设为true
			if(i === arr.length - 1) {
				curNode.isWord = true;
			}
		}
	}

	// @returns {boolean}
	search(word) {
		let curNode = this.root;
		let arr = word.split('');
		for(let i=0; i<arr.length; i++) {
            // 凡是查找的单词的中间某个字符，没有找到节点的，返回false
			if(!curNode.children[arr[i]]) {
				return false;
			}
			curNode = curNode.children[arr[i]];
			// 搜素到最后一个字符，根据isWord属性判断是否曾经存过这个单词
			if(i === arr.length - 1) {
				return curNode.isWord === true;
			}
		}
	}

	startsWith(prefix) {
		let curNode = this.root;
		let arr = prefix.split('');
		for(let i=0; i<arr.length; i++) {
			// 凡是查找的单词的中间某个字符，没有找到节点的，返回false
			if(!curNode.children[arr[i]]) {
				return false;
			}
			curNode = curNode.children[arr[i]];
		}
		return true;
	}
}

let trie = new Trie();
// trie.insert("apple");
// console.log(trie.search("apple")); // 返回 true
// console.log(trie.search("app")); // 返回 false
// console.log(trie.startsWith("app")); // 返回 true
// trie.insert("app");
// console.log(trie.search("app")); // 返回 true
// console.log(trie.search("appp")); // 返回 false

