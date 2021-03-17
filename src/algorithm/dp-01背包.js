/**
 * 01背包问题
 * N=3（3个物品） W=4（背包容器）
 * wt = [2, 1, 3];
 * val = [4, 2, 3];
 * 返回6，当选择前两个物品时装进背包，总重量3小于W，获得价值为6.
 */

 /**
  * 动态规划解决思路
  * 1.明确【状态】和【选择】
  * 状态有：1.可选择物品 2.背包的容量
  * 选择：1.第i个物品装进背包 2.第i个物品不装进背包
  * for 状态1 in 状态1所有的值
  *     for 状态2 in 状态2所有的值
  *         dp[状态1][状态2] = 选择（选择1，选择2）
  * 
  * 2.明确dp数组的定义
  * 状态有两个，二维dp数组
  * dp[i][w] = 对与前i个物品，当前背包的容量为w，这种情况可以装的最大价值是dp[i][w];
  * // base case
  * dp[0][xxx] = 0;
  * dp[xxx][0] = 0;
  * 
  * 3.  状态转移方程
  * 选择：1.第i个物品装进背包 2.第i个物品不装进背包
  * dp[i][W-wt[i-1]] = dp[i-1][w] + val[i-1];
  * dp[i-1][w] = dp[i-1][w];
  * dp[i][w] = Math.max(dp[i-1][w] + val[i-1], dp[i-1][w])
  */

/**
 * 
 * @param {Number} W 背包容量
 * @param {Number} N 物品总数
 * @param {Array} wt 物品重量数组
 * @param {Array} val 物品价值数组
 * @returns Number 背包装的最大价值
 */
  function resolution(W, N, wt, val) {
    // init 二维数组和 base case
    let dp = Array.from(new Array(N+1), () => new Array(W+1).fill(0))
    for(let i=1; i<=N; i++) {
        for(let w=1; w<=W; w++) {
            // 包容量可以没有了
            // w-wt[i] 表示前i个物品剩余的容量 - 第i个物品需要的容量（防止剩余空间装不下）
            if(w-wt[i-1] <= 0) {
                dp[i][w] = dp[i-1][w];
            }else{
                dp[i][w] = Math.max(
                    dp[i-1][w-wt[i-1]] + val[i-1], 
                    dp[i-1][w]
                ) 
            }
        }
    }
    console.log(dp)
    return dp[N][W];
  }

// console.log(resolution(4,3, [2, 1, 3], [4, 2, 3]))