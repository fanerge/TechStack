# 动态动态import
```
<template>
  <div class="container">
    <button @click="isMember = !isMember">{{isMember?'我不想要会员了，哼':'我要成为会员'}}</button>
    <component :is="userComponentImstance" title="component就是好用哟"/>
  </div>
</template>

<script>
export default {
  name: "userImport",
  data() {
    return {
      isMember: false
    };
  },
  computed: {
    userComponentImstance() {
      let { isMember } = this;
      let pathName = isMember ? "MemberInfo" : "UserInfo";
      //通过import动态导入组件 配合webpack实现组件分离
      return () => import(`../components/${pathName}`);
    }
  }
};
</script>
```
[一个鲜为人知的高性能组件注册及实现组件排序技巧](https://mp.weixin.qq.com/s/nilCa5HW0jbiw5cTTxCN8Q)