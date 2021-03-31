// 链表结点的定义
export class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

export default class MyLinkedList {
    /** code here: 初始化链表*/
    constructor() {
        // 需要 new 出一个链表结点，并且让链表的 dummy 和 tail 指针都指向它
        // 静：dummy 指针初始化好以后，永远都是静止的，再也不会动了。
        this.dummy = new ListNode();
        // 动：tail 指针在链表发生变动的时候，就需要移动调整。
        this.tail = this.dummy;
        this.length = 0;
    }

    addAtTail(val) {
        /* code here: 将值为 val 的结点追加到链表尾部*/
        this.tail.next = new ListNode(val);
        // 后移
        this.tail = this.tail.next;
        this.length++;
    }

    addAtHead(val) {
        /* code here: 插入值val的新结点，使它成为链表的第一个结点*/
        let p = new ListNode(val);
        // this.dummy.next 代表原来链表
        p.next = this.dummy.next;
        this.dummy.next = p;
        // 注意动静结合原则，添加结点时，注意修改tail指针。(非常容易忘记)
        if (this.tail == this.dummy) {
            this.tail = p;
        }
        this.length++;
    }

    getPrevNode(index) {
        /*返回index结点的前驱结点，如果index不存在，那么返回dummy*/
        // 初始化front与back，分别一前一后(快慢指针)
        let back = this.dummy;
        let front = this.dummy.next;
        // 在查找的时候，front与back总是一起走(front !== null 防止越界)
        for (let i = 0; i < index && front !== null; i++) {
            back = front;
            front = front.next;
        }

        return back;
    }

    get(index) {
        /* code here: 获取链表中第index个结点的值。如果索引无效，则返回-1。*/
        // index从0开始。
        if (index < 0 || index >= this.length) {
            return -1;
        }

        return this.getPrevNode(index).next.val;
    }

    addAtIndex(index, val) {
        // code here:
        // 在链表中的第 index 个结点之前添加值为 val  的结点。
        // 1. 如果 index 等于链表的长度，则该结点将附加到链表的末尾。
        // 2. 如果 index 大于链表长度，则不会插入结点。
        // 3. 如果index小于0，则在头
        // 4. 否则在指定位置前面插入结点。
        if (index > this.length) {
            // case1
            return;
        } else if (index === this.length) {
            // case2
            this.addAtTail(val);
        } else if (index <= 0) {
            // case3
            this.addAtHead(val);
        } else {
            let prev = this.getPrevNode(index);
            let node = new ListNode(val);
            // 先保存原来剩余的链表节点
            node.next = prev.next;
            prev.next = node;
            this.length++;
        }
    }

    deleteAtIndex(index) {
        /* code here: 如果索引index有效，则删除链表中的第index个结点。*/
        // Case 1. 如果index无效，那么什么也不做。
        if (index < 0 || index >= this.length) {
            return false;
        }
        // Case 2. 删除index结点
        // step 1. 找到index前面的结点
        // step 2. 如果要删除的是最后一个结点，那么需要更改tail指针
        // step 3. 进行删除操作。并修改链表长度。
        let prev = this.getPrevNode(index);
        // 删除的是尾节点需要移动尾指针
        if (this.tail === prev.next) {
            this.tail = prev;
        }
        prev.next = prev.next.next;
        this.length--;
        return true;
    }
}


// test
// let link1 = new MyLinkedList();
// link1.addAtHead(-1)
// link1.addAtHead(-2)
// link1.addAtTail(0)
// link1.deleteAtIndex(2)
// // link1.addAtTail(1)
// console.log(link1)

/**
 * 输入一个链表的头结点，反转该链表，并返回反转后链表的头结点。
输入：1->2->3
输出：3->2->1
 */

function reverse(head) {
    let dummy = new ListNode();
    while(head !== null) {
        let temp = head.next;
        head.next = dummy.next;
        dummy.next = head;
        head = temp;
    }

    return dummy.next;
}

/**
 * 【题目】给定一个链表头及一个整数值，要求把链表里面等于整数值的结点都从链表中移除出去。
输入：1->2->3->2->4, remove = 2
输出：1->3->4。
 */

function remove(head, val) {
    // 生成一个新链表
    let dummy = new ListNode();
    let tail = dummy;
    // 依次取出旧链表中的每个结点
    while(head !== null) {
        let temp = head.next;
        // 如果结点值需要保留，那么采用属部追加的方法
        // 添加到新链表中
        if(head.val !== val) {
            tail.next = head;
            // test
            tail = tail.next;
        }
        head = temp;
    }
    // 注意设置尾巴的next为空
    tail.next = null;

    return dummy.next;
}