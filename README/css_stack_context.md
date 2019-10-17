#   同一个堆叠上下文堆叠顺序（从低到高）
1.  z-index < 0（需要配合定位属性才能生效）
1.  background
2.  border
3.  块级子元素（div）
4.  float元素
5.  内联子元素和内联块子元素（span）
6.  定位子元素（relative、absolute）
7.  z-index > 0（需要配合定位属性才能生效）

#   几种情况形成堆叠上下文?
1.  根元素 (HTML)
2.  z-index 值不为 "auto"的 绝对/相对定位，
3.  一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，
4.  opacity 属性值小于 1 的元素（参考 the specification for opacity），
5.  transform 属性值不为 "none"的元素，
6.  mix-blend-mode 属性值不为 "normal"的元素，
7.  filter值不为“none”的元素，
8.  perspective值不为“none”的元素，
9.  isolation 属性被设置为 "isolate"的元素，
10. position: fixed
11. 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值（参考 这篇文章）
12. -webkit-overflow-scrolling 属性被设置 "touch"的元素

[堆叠上下文](https://www.cnblogs.com/CCCLARITY/p/8290403.html)