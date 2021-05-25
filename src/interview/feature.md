#   你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示
```
window.onresize = function() {
    let dpr = window.devicePixelRatio;
    if(dpr !== 1) {
        console.log('你的浏览器目前处于缩放状态，页面可能会出现错位现象，建议100%大小显示!');
    }
}
```