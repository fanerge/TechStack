// 主要操作就两个，sink（下沉）和swim（上浮），用以维护二叉堆的性质。
// 主要应用有两个，首先是一种排序方法「堆排序」，第二是一种很有用的数据结构「优先级队列」。
// 二叉堆其实就是一种特殊的二叉树（完全二叉树），只不过存储在数组里。一般的链表二叉树，我们操作节点的指针，而在数组里，我们把数组索引作为指针
// 父节点的索引, 索引从1开始及索引1为堆顶
// 最大堆为例

class MaxHeap {
	constructor() {
		this.arr = [];
	}
	swap(i, j) {
		let arr = this.arr;
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	less(i, j) {
		let arr = this.arr;
		return arr[i] < arr[j];
	}
	parentIndex(index) {
		return Math.floor((index - 1) / 2);
	}
	leftIndex(index) {
		return 2 * index + 1;
	}
	rightIndex(index) {
		return 2 * index + 2;
	}
	swim(index) {
		const { parentIndex } = this;
		// 如果浮到堆顶，就不能再上浮了
		while (index > 0 && this.less(parentIndex(index), index)) {
			// 如果其父节点的值比当前节点的值小则交换
			this.swap(parentIndex(index), index);
			index = parentIndex(index);
		}
	}
	sink(index) {
		const { arr, leftIndex, rightIndex } = this;
		let N = arr.length - 1;
		// 如果沉到堆底，就不能再上沉了
		while (leftIndex(index) < N) {
			// 先假设左边节点较大
			let older = leftIndex(index);
			// 如果右节点存在，比一下大小
			if (rightIndex(index) <= N && this.less(older, rightIndex(index))) {
				older = rightIndex(index);
			}
			// index 节点比左右都大就不用下沉了
			if (this.less(older, index)) break;
			// 否则不符合最大堆，需要下沉该节点
			this.swap(older, index);
			index = older;
		}

	}
	insert(val) {
		let { arr } = this;
		// 先把新元素放在最后
		let index = arr.length;
		arr[index] = val;
		// 上浮找到对应的位置
		this.swim(index);
	}
	delMax() {
		// 交换堆顶和堆底的元素，然后再删除堆底元素，再下沉堆顶元素，直到堆平衡
		let { arr } = this;
		let max = arr[0];
		let len = arr.length;
		[arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
		arr.length = len - 1;
		this.sink(0)
		return max;
	}
	size() {
		return this.arr.length;
	}
}

// test
let maxHeap = new MaxHeap();
maxHeap.insert(7)
maxHeap.insert(8)
maxHeap.insert(9)
maxHeap.insert(10)
// console.log(maxHeap)

// 小堆
class MinHeap {
	constructor() {
		this.arr = [];
	}
	swap(i, j) {
		let arr = this.arr;
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	less(i, j) {
		let arr = this.arr;
		return arr[i] < arr[j];
	}
	parentIndex(index) {
		return Math.floor((index - 1) / 2);
	}
	leftIndex(index) {
		return 2 * index + 1;
	}
	rightIndex(index) {
		return 2 * index + 2;
	}
	swim(index) {
		const { parentIndex } = this;
		// 如果浮到堆顶，就不能再上浮了
		while (index > 0 && this.less(index, parentIndex(index))) {
			// 如果其父节点的值比当前节点的值大则交换
			this.swap(parentIndex(index), index);
			index = parentIndex(index);
		}
	}
	sink(index) {
		const { arr, leftIndex, rightIndex } = this;
		let N = arr.length - 1;
		// 如果沉到堆底，就不能再上沉了
		while (leftIndex(index) < N) {
			// 先假设左边节点较小
			let older = leftIndex(index);
			// 如果右节点存在，比一下大小
			if (rightIndex(index) <= N && this.less(rightIndex(index), older)) {
				older = rightIndex(index);
			}
			// index 节点比左右都大就不用下沉了
			if (this.less(older, index)) break;
			// 否则不符合最小堆，需要下沉该节点
			this.swap(older, index);
			index = older;
		}

	}
	insert(val) {
		let { arr } = this;
		// 先把新元素放在最后
		let index = arr.length;
		arr[index] = val;
		// 上浮找到对应的位置
		this.swim(index);
	}
	delMax() {
		// 交换堆顶和堆底的元素，然后再删除堆底元素，再下沉堆顶元素，直到堆平衡
		let { arr } = this;
		let max = arr[0];
		let len = arr.length;
		[arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
		arr.length = len - 1;
		this.sink(0)
		return max;
	}
	size() {
		return this.arr.length;
	}
}



/**
 * 题目】给定一个数组 a[]，返回这个数组中最小的 k 个数。
输入：A = [3,2,1], k = 2
输出：[2, 1]
 */
function heap1(arr, k) {
	let res = []
	if (arr === null || arr.length === 0 || k <= 0) return res;
	if (k >= arr.length) return arr;
	let maxHeap = new MaxHeap();
	for (let i = 0; i < arr.length; i++) {
		// 当堆中不足k个时，只进不出
		maxHeap.insert(arr[i])
		if (i < k) {
			continue;
		}

		maxHeap.delMax();
	}

	while (maxHeap.size() > 0) {
		res.push(maxHeap.delMax());
	}

	return res;
}

// console.log(heap1([3, 2, 1], 2))

/**
 * 
给定一个数组，求这个数组的前 k 个高频元素。如果有两个数出现次数一样，那么优先取较小的那个数。
输入：A = [1,2,1,1,3,3,2,3] k = 2
输出：[1, 3]} nums
 */

var topKFrequent = function (nums, k) {
	let map = nums.reduce((acc, item, index) => {
		// acc[item] ? acc[item]++ : acc[item] = 0;
		if (!acc[item]) {
			acc[item] = 0;
		}
		acc[item]++;
		return acc;
	}, {});

	let list = Object.entries(map).sort((a, b) => {
		return b[1] - a[1];
	});
	console.log(list)
	let res = [];
	for (let i = 0; i < k; i++) {
		res.push(+list[i][0]);
	}
	return res;
};
// console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2));;

/**
 * 在练习题1的基础上，给定的是一个单词数组，求这个数组前 k 个高频单词。如果有两个单词出现频率是一样的。那么输出字典序较小的那个单词。
输入：A = ["AA", "BB", "AA", "BB", "CCC", "CCC", "CCC", "AA"] k = 2
输出：["AA", "CCC"]
 */
function heap2(words, k) {
	let map = words.reduce((acc, item) => {
		if (!acc[item]) {
			acc[item] = 0;
		}
		acc[item]++;
		return acc;
	}, {});

	let list = Object.entries(map).sort((a, b) => {
		if (b[1] === a[1]) {
			let minLen = Math.min(a[0].length, b[0].length);
			let i = 0;
			while (i < minLen) {
				if (a[0].charCodeAt(i) === b[0].charCodeAt(i)) {
					i++;
					continue;
				}
				return a[0].charCodeAt(i) - b[0].charCodeAt(i);
			}
			return a[0].length - b[0].length;
		}
		return b[1] - a[1];
	});
	let res = [];
	for (let i = 0; i < k; i++) {
		res.push(list[i][0]);
	}
	return res;
}

// console.log(heap2(["i", "love", "leetcode", "i", "love", "coding"], 3));
console.log(heap2(['aaa', "aa", "a"], 1));


