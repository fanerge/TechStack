/**
 * 参考大佬文章：
 * https://leetcode-cn.com/problems/the-masseuse-lcci/solution/dong-tai-gui-hua-by-liweiwei1419-8/
 * 一个有名的按摩师会收到源源不断的预约请求，每个预约都可以选择接或不接。在每次预约服务之间要有休息时间，因此她不能接受相邻的预约。给定一个预约请求序列，替按摩师找到最优的预约集合（总预约时间最长），返回总的分钟数。
 * 输入： [1,2,3,1]
 * 输出： 4
 * 解释： 选择 1 号预约和 3 号预约，总时长 = 1 + 3 = 4。
 */

// 方法一：设计二维状态变量
/*
 * 状态转移方程演算过程：
 * dp数组表示前i个预约总共接受的时间
 * dp[i] = Max(dp[i][0], dp[i][1]) // dp[i][0] 表示第i个预约不接受，dp[i][1] 表示表示第i个预约接受
 * dp[i][0] = Max(dp[i-1][0], dp[i-1][1]) // 第i个预约不接受，则第i-1个预约可接受也可不接受
 * dp[i][1] = dp[i-1][0] + nums[i] // 第i个预约接受，则第i-1个预约不能接受
 */
var massage1 = function (nums) {
  let n = nums.length;
  let dp = [];
  if (!n) return 0;
  dp[0] = [];
  dp[0][0] = Math.max(0, 0);
  dp[0][1] = 0 + nums[0];
  for (let i = 1; i < n; i++) {
    dp[i] = [];
    let dpi0 = Math.max(dp[i - 1][0], dp[i - 1][1]);
    let dpi1 = nums[i] + dp[i - 1][0];
    dp[i][0] = dpi0;
    dp[i][1] = dpi1;
  }
  return Math.max(dp[dp.length - 1][0], dp[dp.length - 1][1]);
};
massage1([2, 1, 4, 5, 3, 1, 1, 3]);

// 方法二：设计一维状态变量
/**
 * 状态转移方程演算过程：
 * dp数组表示前i个预约总共接受的时间
 * dp[i]还是分为第i个预约接受还是不接受
 * 第i个预约接受，则第i-1个预约不能接受，dp[i-2] + nums[i]
 * 第i个预约不接受，则第i-1个预约可接受可不接受，dp[i-1]
 * dp[i] = Max(dp[i-2] + nums[i], dp[i-1])
 */
// dp[i] = max(dp[i-1], dp[i-2] + nums[i])
var massage2 = function (nums) {
  // 边界处理
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let dp = [];
  dp[0] = Math.max(0, 0 + nums[0]);
  dp[1] = Math.max(dp[0], 0 + nums[1]);
  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
  }
  return dp[dp.length - 1];
};
console.log(massage2([2, 1, 4, 5, 3, 1, 1, 3]));
