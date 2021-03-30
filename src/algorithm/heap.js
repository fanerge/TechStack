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
		const {less, parentIndex, swap} = this;
		// 如果浮到堆顶，就不能再上浮了
		while(index > 0 && less(parentIndex(index), index)) {
			// 如果其父节点的值比当前节点的值小则交换
			swap(parentIndex(index), index);
			index = parentIndex(index);
		}
	}
	sink(index) {
		const {arr, leftIndex, less, rightIndex, swap} = this;
		let N = arr.length - 1;
		// 如果沉到堆底，就不能再上沉了，(不一定有优节点，所以这里用左节点 index 来判断)
		while(leftIndex(index) < N) {
			// 先假设左边节点较大
			let older = leftIndex(index);
			// 如果右节点存在，比一下大小
			if(rightIndex(index) <= N && less(older, rightIndex(index))) {
				older = rightIndex(index);
			}
			// index 节点比左右都大就不用下沉了
			if(less(older, index)) break;
			// 否则不符合最大堆，需要下沉该节点
			swap(older, index);
			index = older;
		}

	}
	insert(val) {
		let {arr, swim} = this;
		// 先把新元素放在最后
		let index = arr.length;
		arr[index] = val;
		// 上浮找到对应的位置
		swim(index);
	}
	delMax() {
		// 交换堆顶和堆底的元素，然后再删除堆底元素，再下沉堆顶元素，直到堆平衡
		let {arr, sink} = this;
		let max = arr[0];
		let len = arr.length;
		[arr[0], arr[len-1]] = [arr[len-1], arr[0]]
		arr.length = len - 1;
		sink(0)
		return max;
	}
}

window.priorityQueue = MaxHeap;