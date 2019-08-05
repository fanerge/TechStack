import result from './modules/array';
import Stack, { divideBy2, baseConverter } from './modules/stack';
import Queue, { PriorityQueue } from './modules/queue';
import LinkedList, { Node } from './modules/linkedList';

// 栈
// const stack: Stack = new Stack();
// stack.push(1);
// stack.push(2);
// stack.push(3);
// stack.pop();
// // const test: any = divideBy2(10);
// const test: any = baseConverter(100345, 16);

// 队列
// const queue = new Queue();
// queue.enqueue('a');
// queue.enqueue('b');
// queue.enqueue('sd');
// queue.dequeue();
// const test = queue.size();

// 优先队列
// const queue = new PriorityQueue();
// queue.enqueue('d', 4);
// queue.enqueue('a', 1);
// queue.enqueue('b', 2);
// queue.enqueue('sd', 1);
// queue.dequeue();
// const test = queue.toString();

// 循环队列——击鼓传花
function hotPotato(nameList: string[], num: number) {
    let queue = new Queue();
    
    for(let i = 0; i < nameList.length; i++ ) {
        queue.enqueue(nameList[i]);
    }

    let eliminated = '';
    while (queue.size() > 1){
        for (let i=0; i<num; i++){
            queue.enqueue(queue.dequeue()); 
        }
        eliminated = queue.dequeue();
        console.log(eliminated + '在击鼓传花游戏中被淘汰。');
    }
    return queue.dequeue();
}
// let names = ['John','Jack','Camila','Ingrid','Carl'];
// let winner = hotPotato(names, 8);
// console.log('The winner is: ' + winner);

let link = new LinkedList();
link.append(1);
link.append(2);
link.append(3);
link.append(4);
link.remove(2);
// link.remove(0);
const test = link.print();

document.body.textContent = `${test}`;
