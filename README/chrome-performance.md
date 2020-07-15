## FP（First Paint）

这个指标用于记录页面第一次绘制像素的时间。

## FCP（First Contentful Paint）

这个指标用于记录页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间。

## LCP（Largest Contentful Paint）

最大内容绘制，用于记录视窗内最大的元素绘制的时间，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录。

## TTI（Time to Interactive）

首次可交互时间。

## FID（First Input Delay）

首次输入延迟，记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。

## TBT（Total Blocking Time）

阻塞总时间，记录在 FCP 到 TTI 之间所有长任务的阻塞时间总和。

## CLS（Cumulative Layout Shift）

累计位移偏移，记录了页面上非预期的位移波动。

> [最新性能指标](https://mp.weixin.qq.com/s/y7EqNlJ9Bm6vZKxYwJ090Q)
