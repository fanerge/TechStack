# 思路一
mousedown，mousemove，mouseup
```
/*--------------拖曳效果----------------
*原理：标记拖曳状态dragging ,坐标位置iX, iY
*         mousedown:fn(){dragging = true, 记录起始坐标位置，设置鼠标捕获}
*         mouseover:fn(){判断如果dragging = true, 则当前坐标位置 - 记录起始坐标位置，绝对定位的元素获得差值}
*         mouseup:fn(){dragging = false, 释放鼠标捕获，防止冒泡}
*/
var dragging = false;
var iX, iY;
$("#drag").mousedown(function(e) {
    dragging = true;
    iX = e.clientX - this.offsetLeft;
    iY = e.clientY - this.offsetTop;
    return false;
});
document.onmousemove = function(e) {
    if (dragging) {
    var e = e || window.event;
    var oX = e.clientX - iX;
    var oY = e.clientY - iY;
    $("#drag").css({"left":oX + "px", "top":oY + "px"});
    return false;
    }
};
$(document).mouseup(function(e) {
    dragging = false;
})
```
# 思路二
[HTML drag && drop](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)

```
<script>
  function dragstart_handler(ev) {
    // 定义拖拽数据
    ev.dataTransfer.setData("text/plain", ev.target.id);
    // 定义拖拽图像
    var img = new Image(); 
    img.src = 'example.gif'; 
    ev.dataTransfer.setDragImage(img, 10, 10);
    // 定义拖拽效果
    ev.dataTransfer.dropEffect = "copy"; // copy、move、link
  }
  // 拖动元素
  const element = document.getElementById("p1");
  // dragStart 事件
  element.addEventListener("dragstart", dragstart_handler);

  function dragover_handler(ev) {
    ev.preventDefault();
    // 处理放置效果
    ev.dataTransfer.dropEffect = "move";
  }
  function drop_handler(ev) {
    ev.preventDefault();
    // 拖拽结束
    var data = ev.dataTransfer.getData("text/plain");
    ev.target.appendChild(document.getElementById(data));
  }

</script>
// 定义一个可拖拽元素
<p id="p1" draggable="true">This element is draggable.</p>
// 定义一个放置区
<p id="target" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">Drop Zone</p>
```



