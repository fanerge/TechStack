#   你知道CSS中不同属性设置为百分比%时对应的计算基准？
公式：当前元素某CSS属性值 = 基准 * 对应的百分比<br>
元素的 position 为 relative 和 absolute 时，top和bottom、left和right基准分别为包含块的 height、width<br>
元素的 position 为 fixed 时，top和bottom、left和right基准分别为初始包含块（也就是视口）的 height、width，[移动设备较为复杂，基准为 Layout viewport 的 height、width](https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md#53positionfixed%E5%9C%A8-android-%E4%B8%8B%E6%97%A0%E6%95%88%E6%80%8E%E4%B9%88%E5%A4%84%E7%90%86)<br>
元素的 height 和 width 设置为百分比时，基准分别为包含块的 height 和 width<br>
元素的 margin 和 padding 设置为百分比时，基准为包含块的 width（易错）<br>
元素的 border-width，不支持百分比<br>
元素的 text-indent，基准为包含块的 width<br>

元素的 border-radius，基准为分别为自身的height、width<br>
元素的 background-size，基准为分别为自身的height、width<br>
元素的 translateX、translateY，基准为分别为自身的height、width<br>
元素的 line-height，基准为自身的 font-size<br>

元素的 font-size，基准为父元素字体<br>

[整理](https://blog.csdn.net/zw52yany/article/details/85324855)
[原理](https://juejin.im/post/5b0bc994f265da092918d421)

#   当一个属性不是继承属性时，可以使用 inherit 关键字指定一个属性应从父级元素继承它的值，inherit 关键字用于显式地指定继承性，可用于任何继承性/非继承性属性。

#   position/absolute 定位的元素，是相对于它的第一个 position 值不为 static 的祖先元素的 padding box 的左上角来进行定位的

#   网页置灰
```
html {
    -webkit-filter: grayscale(100%);
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
```

#   用纯 CSS 创建一个三角形的原理
采用的是相邻边框连接处的均分原理。
将元素的宽高设为0，只设置 border，把任意三条边隐藏掉（颜色设为transparent），剩下的就是一个三角形。
```
#demo {
  width: 0;
  height: 0;
  border-width: 20px;
  border-style: solid;
  border-color: transparent transparent red transparent;
}
```
#   CSS 多列等高如何实现？
1.  容器 overflow: hidden; 每列设置 margin-bottom: -9999px; padding-bottom: 9999px; 
2.  容器 display: table; 每列设置 table-cell; 利用表格特性
3.  flex 布局，默认交叉轴为纵轴，align-items: stretch;
[常用的多列等高布局收藏ka](https://juejin.im/post/6844903615182667789)



>   参考
[CSS](https://github.com/CavsZhouyou/Front-End-Interview-Notebook/blob/master/Css/Css.md)
