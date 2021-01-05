// 添加水印
function addWaterMarker(
    str = '水印', 
    parentNode = document.querySelector('body'), 
    font = '16px Microsoft JhengHei', 
    textColor) {
    // 水印文字，父元素，字体，文字颜色
    var can = document.createElement('canvas')
    parentNode.appendChild(can)
    can.width = 200
    can.height = 150
    can.style.display = 'none'
    var cans = can.getContext('2d')
    cans.rotate((-20 * Math.PI) / 180)
    cans.font = font || '16px Microsoft JhengHei'
    cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 10, can.height / 2)
    parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')'
    // 会不会删除节点时，canvas.toDataURL 还没有执行？？
    setTimeout(() => {
        parentNode.removeChild(can)
    }, 500);
  }