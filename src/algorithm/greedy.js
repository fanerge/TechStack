/**
 * 贪心算法（Greedy Algorithms）指的是求解问题时，总是做出在当前看来是最好的选择。 一个全局最优解可以通过选择局部最优解来达到。
 */

/**
* https://leetcode-cn.com/problems/container-with-most-water/
* 盛最多水的容器
* @param {number[]} height
* @return {number}
*/
var maxArea = function (height) {
  let left = 0;
  let right = height.length - 1;
  let max = -Infinity;

  while (left < right) {
    let v = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, v);
    if (height[left] <= height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
};
