#   布局容器相关属性
```
.gridBox {
    dispaly: grid; // inline-grid;
}
```
##  grid-template
设置项目二维排列方式
```
grid-template-rows: [linename] 100px repeat(3, 1fr, [linename]) 1fr;
grid-template-columns: [linename] 100px repeat(3, 1fr, [linename]) 1fr; 
```
##  gap
设置项目间隔
```
grid-column-gap // 设置项目列间隔
grid-row-gap // 设置项目行间隔
grid-gap: 行间隔 列间隔;
gap: 行间隔 列间隔;
```
##   网格中各项目对齐方式
// 容器内项目分布
```
.gridBox {
    // justify表示水平方向Row
    justify-items: start center end stretch;
    // align表示垂直方向Column
    align-items:  start center end stretch;
    // 简写方式
    place-items: 垂直方向column 水平方向row;
}
```
##   content
// 容器内空间分布
```
.gridBox {
    // justify表示水平方向Row，space-evenly使两边间隔和items间隔相同
    justify-content: start center end stretch space-bettwen;
    // align表示垂直方向Column
    align-content:  start center end stretch;
    // 简写方式
    place-content: 垂直方向column 水平方向row;
}
```
##   grid-auto
不建议使用。
用于设置自动生成的网格轨道的大小（隐式网格轨道）。
隐式网格轨道：超出指定网格范围的行或列时被创建（行或列不够时）。
```
grid-auto-columns
grid-auto-rows
// 控制自动布局算法的工作方式
gird-auto-flow: row | column | row dense | column dense;
```
##   grid
为下列属性的简写：
```
grid-template-rows
grid-template-columns
grid-template-areas
gird-auro-rows
grid-auto-column
gird-auto-flow

```
#   CSS函数
##  repeat
```
// 跟踪列表的重复片段，允许大量显示重复模式的列或行以更紧凑的形式编写。
// 参数1.（重复次数auto-fill、auto-fit）和2.值（max-content、min-content、auto）
// auto-fill以网格项为准自动填充
// auto-fit以网格容器为准自动填充
// 只能用于grid-template-rows 或 grid-template-columns
repeat(repeatNum, value) 
```
##  fit-content
内容适配
根据公式min（最大大小、最大值（最小大小、参数））将给定大小夹紧为可用大小。
```
// 只能用于grid-template-rows 或 grid-template-columns
```
##  minmax
长度范围
定义了一个长宽范围的闭区间。

#   网格项属性
##  start/end
可以指定某个网格项目在网格容器的位置。
```
grid-column-start: 2;
grid-column-end: 5;
// 简写
grid-column: 2 / 5;
grid-row-start: 2;
grid-row-end: 4;
// 简写
grid-row: 2 / 4;
```
##  grid-area
可以指定某个网格项目在网格容器的位置。
先使用gird-template-areas来为各个网格项目命名以便在grid-area中使用。
```
.item {
    grid-area: name | <row-start> / <col-start> / <row-end> / <col-end>;
}
```
##  self
设置单个网格元素对齐方式。
```
.item2 {
    // justify-self表示单个网格元素的水平对齐方式。
    justify-self: stretch | start | end | center;
    // align-self指定了网格元素的垂直呈现方式，是垂直拉伸显示，还是上中下对齐。
    align-self: stretch | start | end | center;
}
```