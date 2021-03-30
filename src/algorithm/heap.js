// 最常见用途：实现优先级队列，Priority Queue
// 主要操作就两个，sink（下沉）和swim（上浮），用以维护二叉堆的性质。
// 主要应用有两个，首先是一种排序方法「堆排序」，第二是一种很有用的数据结构「优先级队列」。
// 二叉堆其实就是一种特殊的二叉树（完全二叉树），只不过存储在数组里。一般的链表二叉树，我们操作节点的指针，而在数组里，我们把数组索引作为指针
// 父节点的索引, 索引从1开始及索引1为堆顶
// 最大堆为例

export default class MaxHeap {
	constructor(arr) {
		this.arr = arr;
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
		// 如果沉到堆底，就不能再上沉了，(不一定有右节点，所以这里用左节点 index 来判断)
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
// let maxHeap = new MaxHeap();
// maxHeap.insert(7)
// maxHeap.insert(8)
// maxHeap.insert(9)
// maxHeap.insert(10)
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
	delMin() {
		// 交换堆顶和堆底的元素，然后再删除堆底元素，再下沉堆顶元素，直到堆平衡
		let { arr } = this;
		let min = arr[0];
		let len = arr.length;
		[arr[0], arr[len - 1]] = [arr[len - 1], arr[0]]
		arr.length = len - 1;
		this.sink(0)
		return min;
	}
	size() {
		return this.arr.length;
	}

	// 堆顶
	peek() {
		return this.arr[0]
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
// console.log(heap2(['aaa', "aa", "a"], 1));


/**
 * 一只蚂蚁在树下吃果子，第 i 天会掉 落A[i] 个果子，这些果子会在接下来的 B[i] 天（即第 i+B[i] 天）立马坏掉不能吃。给定 A，B 两个数组，蚂蚁一天只能吃一个果子。吃不完了它可以存放起来。请问最多蚂蚁可以吃多少个果子。
输入：A = [3, 1], B = [3, 1]
输出：3
思路：用小堆保存苹果
node {bad: 这批苹果坏的剩余天数, num: 这批苹果剩余个数}
 */

class AppleNode {
	constructor(num, bad) {
		// 
		this.num = num;
		this.bad = bad;
	}
}
// A数组表示第i天要掉落的果子数
// B表示从掉落那天起，i + B[i]那天立马坏掉不能吃了。
function eatenApples(A, B) {
	let N = A === null ? 0 : A.length;
	// 以 bad 的小堆，bad 小于 0 时弹出
	let Q = new MinHeap();
	let ans = 0;
	// i为天数
	let i = 1;
	while (i <= N || Q.size() > 0) {
		// 第i天得到 num 个苹果
		// 会在 bad 那天坏掉
		if (i < N) {
			let num = A[i - 1];
			let bad = i + B[i - 1];
			if (num > 0) {
				Q.insert(new AppleNode(num, bad))
			}
		}
		// 把已经过期的都扔掉
		while (Q.size() > 0 && Q.peek().bad <= i) {
			Q.delMin();
		}

		if (Q.size() > 0) {
			// 选出今天吃的
			let cur = Q.delMin();
			ans++;
			if (--cur.num > 0) {
				// 如果还能还有剩余苹果将重新放入堆中，即使马上过期，也会在第二天吃之前出堆
				Q.insert(cur)
			}
		}
		i++;
	}

	return ans;
}
// test
var apples = [1, 2, 3, 5, 2], days = [3, 2, 1, 4, 2]
// console.log(eatenApples(apples, days));


