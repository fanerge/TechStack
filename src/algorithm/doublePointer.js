// 可以解决三类问题：最长区间，定长区间，最短区间

//#region 
/**
 *
step1. 将A[i]加到区间中，形成新区间(left, i]
// 遍历A[i]的区间右端固定集合，直找到以A[i]为右端点的最优解
step2. while (left < i && (left,i]区间不满足要求) {
  left++;
}
// 此时要么得到一个满足要求的
step 3. (left, i]区间满足要求
 */
//#endregion

// # 最长区间
/**
 *
 * 两个指针，left 指针和 right 指针，两个指针形成的区间为 (left, right]。这里的开闭原则是左开右闭；
 * 惰性原则，如果把 left 指针当成一个人，那么这个人是非常懒惰的，他总是要等到火烧屁股（条件不满足了）才向右移动。
 */
function check() {
  // TODO 检查区间状态是否满足条件
}
function maxLength(A) {
  let N = A.length;
  // 区间left指针
  let left = -1;
  let ans = 0;
  for (let i = 0; i < N; i++) {
    // assert 在加入A[i]之前，(left, i-1]是一个合法有效的区间
    // step 1. 直接将A[i]加到区间中，形成(left, i]
    // step 2. 将A[i]加入之后，惰性原则
    while (check(left, i)/*TODO 检查区间状态是否满足条件*/) {
      ++left; // 如果不满足条件，移动左指针
      // TODO 修改区间的状态
    }
    // assert 此时(left, i]必然满足条件
    ans = max(ans, i - left);
  }
  return ans; // 返回最优解
}
// 例题，剑指 Offer 48. 最长不含重复字符的子字符串
var lengthOfLongestSubstring = function (s) {
  let N = s.length;
  let pos = Array.from({ length: 256 }).fill(-1);
  let left = -1;
  let ans = 0;
  for (let i = 0; i < N; i++) {
    let idx = s.charCodeAt(i);
    // (left, i)已经是一个有效的解
    // 现在要把s[i]加进来
    // 1. 坏了才移动
    // 那么看一下是否会坏？
    while (pos[idx] > left) {
      // 如果(left, i)里面已经有了s[i]
      // 那么需要移动左边，
      // 移动的时候，怎么移动？
      // 可以直接将left 移动到pos[s[i]]
      // 因为我们采用的区间是左开右闭
      left++;
    }
    pos[idx] = i;
    ans = Math.max(ans, i - left);
  }
  return ans;
};

// #定长区间
//#region 
/**
 * 固定长度：题目要求解的是不是一个固定长度的子串？
 * 约束条件： 这个定长区间必须要满足什么性质？
 */
function fixedLength(A, windowSize) {
  let N = A == null ? 0 : A.length;
  let left = -1;
  let ans = 0;

  for (let i = 0; i < N; i++) {
    // step 1. 直接将A[i]加到区间中，形成(left, i]
    // TODO 修改区间的状态
    // 如果滑动窗口还太小
    if (i - left < windowSize) {
      continue;
    }

    // assert 此时(left, i]长度必然等于windowSize
    // TODO 判断区间的状态是否满足约束条件
    left++;

    // step 2. 移除A[left]
    // TODO 修改区间状态
  }

  return ans; // 返回最优解
}
//#endregion

// #最短区间
//#region 
/**
 * 两个指针，left 指针和 right 指针，这两个指针形成的区间为 (left, right]，这里的开闭原则是左开右闭；
 * 积极原则，如果把 left 指针当成一个人，那么这个人是非常积极的，他总是主动积极地破坏区间已经满足的条件。
 *
 */
function minimalRange(A) {
  let N = A == null ? 0 : A.length;
  // 子串的左边，采用左开右闭原则(left, i]表示一个子串
  let left = -1;
  // 记录最短的子串的长度
  let ans = A.length + 1;
  for (let i = 0; i < N; i++) {
    // 注意 在加入A[i]之前，(left, i-1]可能不满足条件!
    // step 1. 直接将A[i]加到区间中，形成(left, i]
    // step 2. TODO 更新区间的状态
    while (区间超出 / 满足条件) {
      ans = Math.min(ans, i - left);
      // step 3. 移除A[++left];
      // step 4. TODO 更新区间的状态
    }
    // assert ! 区间(left, i]到这里肯定不满足条件
  }

  return ans;
}

//#endregion
