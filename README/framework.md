# 架构

[图片无版权](https://unsplash.com/)

## 项目组织方案

multirepo 和 monorepo

## git ssh 相关

// 生成 ssh 密钥
ssh-keygen -t rsa -C "your_email@example.com"
// 将密钥添加到 ssh-agent 服务
ssh-add ~/.ssh/id_rsa
// 测试是否成功
ssh -T git@github.com

## 提高效率的 VScode 插件

Code Spell Checker、Todo Tree、Bracket Pair Colorizer、draw.io

## mac 相关

homebrew 安装
[设置国内镜像](https://blog.csdn.net/iroguel/article/details/93481795)
[文本搜索-ag](https://www.mankier.com/1/ag)

## 常用的 npm 包

数字格式化：numeral
数字计算精度问题：Math.js/decimal.js/big.js/BigNumber.js
时间格式化：moment/dayjs
process.env 动态添加配置：dotenv
发布订阅消息：EventEmitter3/wolfy87-eventemitter
开发环境接口代理：http-proxy-middleware
请求库（client & server）：isomorphic-unfetch
捕获错误信息：@sentry/browser、@sentry/node
表单验证库（支持异步验证）：async-validator
分步引导库： driver.js
随机数：uuid
前端状态机（流程开发）：xstate
web 黏贴板：clipboard
代码格式化：prettier
操作引导：driver.js
代理配置（开发环境）：http-proxy-middleware
富文本编辑器：Quill、tinymce
元素尺寸改变监听：element-resize-event、iframe-resizer
polyfill（兼容）：stickyfilljs
git hook：husky
移动端调试：vConsole、eruda

## react 系列

拖拽：react-dnd
组件与 viewport 交互：react-waypoint
Svg 以组件导入：svg-react-loader
动画：react-transition-group、react-motion、react-spring、framer-motion、Animated (React Native)
可视化和图表库：nivo、Victory、react-vis、Recharts、Chart Parts
表单库：formik、react-hook-form
国际化：react-i18next、react-intl、LinguiJS、FBT
富文本编辑器：Draft.js、Slate
文档：Styleguidist、docz、Docusaurus

```
Const Sentry = required('@sentry/node')
// 监听应用报错事触发
server.on(‘error’, (e) => {
	Sentry.captureMessage(e, ‘error’)
})
```

通过 user-agent 返回适合浏览器的 polyfill：polyfill-service

```
Const { getPolyfillString } = required(‘polyfill-service’);
// 每次进入应用触发该请求，下载对应需要的polyfill
Server.get(‘/polyfill’, async (req, res) => {
	const budleString = await getPolyfillString({
		unstring: req.get(‘user-agent’),
		minify: false,
		features: {default: {}}
	})
	res.type(‘application/javascript’)
	res.send(budleString)
})
```

样式处理：postcss、autoprefixer 等

代码风格管理：husky、lint-staged、prettier、eslint、eslint-config-prettier

```
"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test",
    }
  }
"lint-staged": {
    “src/**/*.{js,jsx,ts,tsx}”: “prettier — write”
  }
```

typescript 依赖：@types/node、@types/react、@types/react-dom、@types/styled-jsx
