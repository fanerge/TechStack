# 面试技巧

1.  回答问题效率（不要太多废话，太啰嗦了，直接回答问题，免得让人觉得需要沟通成本）
2.  放慢语速，不要紧张（当成一般的技术交流来对待）
3.  短时间需要把亮点展示处理（比如自我介绍的时候，“我对 JS 有比较深的理解”，面试官就会着重考察你这方面的知识）
4.  大厂都需要刷题（1 年期限刷题/2020-01-01）
5.  作为前端，工作中处理过什么复杂的需求，如何解决的?
6.  面试技巧：技术成体系，逻辑清晰，等面试官说完先停顿两秒认真思考后再回答。
7.  如何促进业务落地
8.  难点/亮点（实践 HTTP2 HPACK 等）

# 任务安排

2020 主要研究算法和数据结构、其次 leetcode、牛客网适量刷题

# 面试前看

[如何仅通过简历判断前端开发工程师的技术水平？](https://www.zhihu.com/question/352896523/answer/876463728?utm_source=wechat_session&utm_medium=social&utm_oi=663345137078505472)
[面试/项目经历准备篇](https://mp.weixin.qq.com/s/tkyGa6nxHVrqD6WoWGBNLg)
[从写简历，到面试、谈薪酬的那些技巧和防坑指南](https://mp.weixin.qq.com/s/KA9lTZlqySgc3JBBdBkZqA)

# 解决业务痛点

## CJK 输入的问题

在中文输入是会频繁触发 input 事件，我们应该在待确认文本选择时才触发对应事件
对应事件先后顺序
compositionstart > compositionupdate > input > compositionend

```
// 解决思路
let iscomposing = true;
$('input').on('input', function(e){
  if(iscomposing) {
    // todo
    inputDoing()
  }
})
$('input').on('compositionstart', function(e){
  // 这里就阻止 input 在中文没选择时就执行
  iscomposing = false;
})
$('input').on('compositionend', function(e){
  // 如果输入非CJK文字，则不存在该问题，需重置为true
  iscomposing = true;
  // CJK被阻止了，所以这里要执行一次
  inputDoing()
})
```

## Form 实现 scrollFirstError

element-ui 的 Form 组件不支持 scrollFirstError
VUE 自定义 directive，在钩子函数中有个叫 vnode 的属性，vnode.componentInstance 可以拿到组件的实例
通过重写 componentInstance 的 validate 方法

```
const form = vnode.componentInstance
let oldValidate = from.validate;
from.validate = (callback) => {
  let promise = new Promise((resolve, reject) => {
    oldValidate().then(valid => {
      resolve(valid)
    }).catch(error => {
      let errorList = form.fields.filter(d => d.validateState === 'error')
      // 即可实现
      errorList[0].$el.scrollIntoView();
    })
  })
  return promise;
}
```
