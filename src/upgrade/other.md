#   你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示
```
window.onresize = function() {
    let dpr = window.devicePixelRatio;
    if(dpr !== 1) {
        console.log('你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示!');
    }
}
```
# flex
![](./img/flex.jpg)
## 容器的属性

```
flex-direction（设置主轴方向）
flex-wrap（多行 Flex 容器）
flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式
justify-content（主轴上的排列方式）
align-items（侧轴上的排列方式）
align-content（定义了多根轴线的对齐方式）
```

## 项目的属性

```
order（定义项目的排列顺序）
flex-grow（定义项目的放大比例，默认为0，即有剩余空间也不放大）
flex-shrink（定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小）
flex-basis（定义了在分配多余空间之前，项目占据的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间）
flex（flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto）
align-self（设置单个项目的对齐方式，可覆盖align-items属性）
```

#   部分不常用的数据结构的作用
```
布隆过滤器（Bloom Filter）：用于检索一个元素是否在一个集合中。它的优点是空间效率和查询时间都比一般的算法要好的多，缺点是有一定的误识别率和删除困难。
字典树、单词查找树，Trie树：它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。
红黑树（Red Black Tree）：高效的查找速度，算法时间复杂度为O(log n)。
```
