// 尾递归调用优化，如阶乘
function Factorial(n) {
  if (n === 1) return 1;
  return n * Factorial(n - 1);
}
// 尾调用优化版(把所有的局部变量转化为参数，函数的最后一步返回另一个函数的执行)
function TailFactorial(n, total) {
  if (n === 1) return total;
  return TailFactorial(n - 1, total * n);
}
// console.log(Factorial(100));
// console.log(TailFactorial(400, 1));
