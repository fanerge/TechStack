import dd from './dp-01背包.js'
// 解题步骤
/**
 * 【题目】给定不同面额的硬币 coins 和一个总金额 amount，需要你编写一个函数计算可以凑成总金额所需的最少的硬币个数。如果没有任何一种硬币组合能组成总金额，则返回 -1。你可以认为每种硬币的数量是无限的。
输入：coins = [1, 2, 5]，amount = 11
输出：3
DP 的 6 步破题法
1. 最后一步
以这道题为例，最后一步指的是：兑换硬币的时候，假设每一步操作总是选择一个硬币，那么我们看一下最后一步如何达到 amount？
以给定的输入为例：
coins = [1, 2, 5], amount = 11
最后一步可以通过以下 3 个选项得到：
已经用硬币兑换好了 10 元，再添加 1 个 1 元的硬币，凑成 11 元；
已经用硬币兑换好了 9 元，再添加 1 个 2 元的硬币，凑成 11 元；
已经用硬币兑换好了 6 元，再添加 1 个 5 元的硬币，凑成 11 元。
接下来，应该立即将以上 3 个选项中的未知项展开成子问题！
注意：如果你找的最后一步，待处理的问题规模仍然没有减小，那么说明你只找到了原始问题的等价问题，并没有找到真正的最后一步。
2. 子问题
拿到 3 个选项之后，你可能会想：[10元，9元，6元] 是如何得到？到此时，一定不要尝试递归地去求解 10 元、9 元、6 元，正确的做法是将它们表达为 3 个子问题：
如何利用最少的硬币组成 10 元？
如何利用最少的硬币组成 9 元？
如何利用最少的硬币组成 6 元？
我们原来的问题是，如何用最少的硬币组成 11 元。
不难发现，如果用 f(x) 表示如何利用最少的硬币组成 x 元，就可以用 f(x) 将原问题与 3 个子问题统一起来，得到如下内容：
原问题表达为 f(11)；
3 个子问题分别表达为 f(10)、f(9)、f(6)。
接下来我们再利用 f(x) 表示最后一步的 3 个选项：
f(10) + 1 个 1 元得到 f(11)；
f(9) + 1 个 2 元得到 f(11)；
f(6) + 1 个 5 元得到 f(11)。
3. 递推关系
递推关系，一般需要通过两次替换得到。
最后一步，可以通过 3 个选项得到。哪一个选项才是最少的步骤呢？这个时候，我们可以采用一个 min 函数来从这 3 个选项中得到最小值。
f(11) = min(f(11-1), f(11-2), f(11-5)) + 1
接下来，第一次替换：只需要将 11 换成一个更普通的值，就可以得到更加通用的递推关系：
f(x) = min(f(x-1), f(x-2), f(x-5)) + 1
当然，这里 [1, 2, 5] 我们依然使用的是输入示例，进行第二次替换：
f(x) = min(f(x-y), y in coins) + 1
写成伪代码就是：
f(x) = inf
for y in coins:
    f(x) = min(f(x), f(x-y) + 1)
4. f(x) 的表达
接下来我们要做的就是在写代码的时候，如何表达 f(x)？
这里有一个小窍门。
直接把 f(x) 当成一个哈希函数。那么 f 就是一个 HashMap。
对于大部分 DP 题目而言，如果用 HashMap 替换 f 函数都是可以工作的。如果遇到 f(x, y) 类似的函数，就需要用 Map<Integer/x/, Map<Integer/y/, Integer>> 这种嵌套的方式来表达 f(x, y)。
当然，有时候，用数组作为哈希函数是一种更加简单高效的做法。具体来说：
如果要表达的是一维的信息，就用一维数组 dp[] 表示 f(x)；
如果要表达的是二维的信息，就用二维数组 dp[][] 表示 f(x, y)
这就是为什么很多 DP 代码里面可以看到很多dp数组的原因。但是，现在你要知道：
用 dp[] 数组并不是求解 DP 问题的核心。
因为，数组只是信息表达的一种方式。而题目总是千万变化的，有时候可能还需要使用其他数据结构来表达 f(x)、f(x, y) 这些信息。比如：
f(x)、f(x, y) 里面的 x, y 都不是整数怎么办？是字符串怎么办？是结构体怎么办？
当然，就这个题而言，可以发现有两个特点：
1）f(x) 中的 x 是一个整数；
2）f(x) 要表达的信息是一维信息。
那么，针对这道题而言言，我们可以使用一维数组，如下所示：
int[] dp = new int[amount + 1];
数组下标 i 表示 x，而数组元素的值 dp[i] 就表示 f(x)。
那么递推关系可以表示如下：
dp[x] = inf;
for y in coins:
  dp[x] = min(dp[x], dp[x-y] + 1);
5. 初始条件与边界
那么，如何得到初始条件与边界呢？这里我分享一个小技巧： 你从问题的起始输入开始调用这个递归函数，如果递归函数出现“不正确/无法计算/越界”的情况，那么这就是你需要处理的初始条件和边界。
比如，如果我们去调用以下两个递归函数。
coinChange(0)：可以发现给定 0 元的时候，dp[amount-x] 会导致数组越界，因此需要特别处理dp[0]。
coinChange(-1) 或者 coinChange(-2) 的调用也是会遇到数组越界，说明这些情况都需要做特别处理。
那么什么情况作为初始条件？什么情况作为边界？答案就是：
如果结果本身的存放不越界，只是计算过程中出现越界，那么应该作为初始条件。比如 dp[0]、dp[1]；
如果结果本身的存放是越界的，那么需要作为边界来处理，比如 dp[-1]。
当然，就这道题而言，初始条件是 dp[0] = 0，因为当只有 0 元钱需要兑换的时候，应该是只需 0 个硬币。
6. 计算顺序
说来有趣，计算顺序最简单，我们只需要在初始条件的基础上使用正向推导多走两步可以了。比如：
初始条件：dp[0] = 0
那么接下来的示例中的输入：coins[] = [1, 2, 5]。我们已经知道 dp[0] = 0，再加上可以做的 3 个选项，那么可以得到：
dp[1] = dp[0] + 1 元硬币 = 1
dp[2] = dp[0] + 2 元硬币 = 1
dp[5] = dp[0] + 5 元硬币 = 1
 *
 */
var coinChange = function (coins, amount) {
  let inf = Number.MAX_VALUE;
  let dp = Array.from({ length: amount + 1 }).fill(inf);

  dp[0] = 0;
  for (let i = 0; i < amount; i++) {
    for (coin of coins) {
      if (i + coin <= amount + 1) {
        dp[i + coin] = Math.min(dp[i + coin], dp[i] + 1);
      }
    }
  }

  return dp[amount] === inf ? -1 : dp[amount];
}



// 参考地址
// https://labuladong.gitbook.io/algo/di-ling-zhang-bi-du-xi-lie/dong-tai-gui-hua-xiang-jie-jin-jie
// 动态规划模版
// # 初始化 base case
// dp[0][0][...] = base
// # 进行状态转移
// for 状态1 in 状态1的所有取值：
//     for 状态2 in 状态2的所有取值：
//         for ...
//             dp[状态1][状态2][...] = 求最值(选择1，选择2...) // 一般为最大、最小值

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
// console.log(massage2([2, 1, 4, 5, 3, 1, 1, 3]));

/**
 * 跳跃游戏
 给定一个非负整数数组，你最初位于数组的第一个位置。
 数组中的每个元素代表你在该位置可以跳跃的最大长度。
 判断你是否能够到达最后一个位置。
 https://leetcode-cn.com/explore/interview/card/top-interview-questions-medium/51/dynamic-programming/104/
 */
var canJump = function (nums) {
  if (nums.length === 0) return true;
  // 记录当前位置最大能走多远（前面剩余的步数 和 当前可走步数的最大值）
  let dp = [];
  let preMax = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    dp[i] = Math.max(preMax - 1, nums[i]);
    preMax = dp[i];
  }

  if (!dp.some((item) => item === 0)) {
    return true;
  } else {
    let index = dp.indexOf(0);
    return index === nums.length - 1;
  }

  // dp 中最后没有0 或 dp中最后一个为0 都表示可以到达最后一项
  return !dp.some((item) => item === 0) || dp.indexOf(0) === nums.length - 1;
};
