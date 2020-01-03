#   实现发布订阅模式
```
// 订阅消息（obj为任意DOM节点，它必须有addEventListener、dispatchEvent事件）
obj.addEventListener("cat", function(e) { console.log(e.detail) })

// 装载数据
var event = new CustomEvent("cat", {
    "detail": 111 // 数据通过这里携带
})
// 触发事件（发布消息）
obj.dispatchEvent(event)
```
CustomEvent 继承于 Event。
[MDN-Event](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
[MDN-CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)