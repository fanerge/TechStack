/**
 * 题目】字符串中只有字符'('和')'。合法字符串需要括号可以配对。比如：
输入："()"
输出：true
解释：()，()()，(())是合法的。)(，()(，(()是非法的。
 */
function stack1(str) {
  if (!str) {
    return true;
  }
  let leftNum = 0;
  // let stack = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      // stack.push('(')
      ++leftNum;
    } else {
      // if (stack.length > 0) stack.pop();
      if (leftNum > 0) --leftNum;
    }
  }

  // return stack.length === 0;
  return leftNum === 0;
}
// test
// console.log(stack1('(())(()('));

/**
 * 【题目扩展】给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。有效字符串需满足：
左括号必须用相同类型的右括号闭合
左括号必须以正确的顺序闭合
注意空字符串可被认为是有效字符串
 */
function stack2(str) {
  if (!str) { return true }
  const len = str.length;
  if (len % 2 === 1) return false;
  let stack = [];
  const lefts = ['(', '{', '['];
  for (let i = 0; i < len; i++) {
    if (lefts.includes(str[i])) {
      stack.push(str[i])
    } else if (str[i] === ')') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '(') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    } else if (str[i] === '}') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '{') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    } else if (str[i] === ']') {
      if (stack.length > 0) {
        let last = stack.slice(-1)[0];
        if (last !== '[') {
          return false;
        }
        stack.pop();
      } else {
        return false;
      }
    }
  }

  return stack.length === 0;
}
// test
// console.log(stack2('(){'));

/**
 * 【题目】在水中有许多鱼，可以认为这些鱼停放在 x 轴上。再给定两个数组 Size，Dir，Size[i] 表示第 i 条鱼的大小，Dir[i] 表示鱼的方向 （0 表示向左游，1 表示向右游）。这两个数组分别表示鱼的大小和游动的方向，并且两个数组的长度相等。鱼的行为符合以下几个条件:
所有的鱼都同时开始游动，每次按照鱼的方向，都游动一个单位距离；
当方向相对时，大鱼会吃掉小鱼；
鱼的大小都不一样。
 */
function stack3(sizes, dirs) {
  let fishNum = sizes.length;
  if (fishNum <= 1) return fishNum;
  let left = 0;
  let right = 1;
  // 存放 index
  let stack = [];

  for (let i = 0; i < fishNum; i++) {
    let curSize = sizes[i];
    let curDir = dirs[i];
    // 当前的鱼是否被栈中的鱼吃掉了
    let hasEat = false;
    // 如果栈中还有鱼，并且栈中鱼向右，当前的鱼向左游，那么就会有相遇的可能性
    while (stack.length > 0 && dirs[stack.slice(-1)[0]] === right && curDir === left) {
      // 栈顶的鱼比当前比较的鱼大
      if (sizes[stack.slice(-1)[0]] > curSize) {
        hasEat = true;
        break;
      }
      stack.pop();
    }
    if (!hasEat) {
      stack.push(i);
    }
  }

  return stack.length;
}
var Size = [4, 2, 5, 3, 1];
var Dir = [1, 1, 0, 0, 0]
// console.log(stack3(Size, Dir));

