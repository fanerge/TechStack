# 架构

[图片无版权](https://unsplash.com/)

# HTML 相关

[Front-End-Checklist](https://github.com/thedaviddias/Front-End-Checklist)
[HTML/Head 详细说明](https://github.com/joshbuchea/HEAD)

# shell

## shellCheck

[shellCheck](https://www.shellcheck.net/)

# git

## git ssh 相关

// 生成 ssh 密钥
ssh-keygen -t rsa -C "your_email@example.com"
// 将密钥添加到 ssh-agent 服务
ssh-add ~/.ssh/id_rsa
// 测试是否成功
ssh -T git@github.com

## 分支管理策略

Feature Flag VS Feature Branches

## rebase vs merge

Git merge 和 rebase 的目的是一样的，它们都是将多个分支合并成一个，但这两种方法实现的方式是不同的。

### merge

1. fast-forward 方式就是当条件允许的时候，git 直接把 HEAD 指针指向合并分支的头，完成合并（不产生一个新的 commit）。
2. git merge --no-ff // 关闭 fast-forward 方式
3. git merge --squash // 可以对 commit 进行压缩

### rebase

rebase 主要可以保证我们的 commit 历史呈线性的，始终把我们的代码放在最前面（有一个线性且清晰的 commit 历史记录）。
rebase 通常是发生在自己的个人 branch 上的，在主分之上 rebase 容易出 bug（如多个人在主分支上 rebase 会产生多个 HEAD，这时再 push 的会出问题）。

```
如果有冲突，处理冲突
git add
git rebase --continue
it rebase —-abort
```

# Node.js

```
Node 版本管理：nvm、n
npm 源管理：nrm
daemon：forever、pm2、
```

# W3C-Validator

[css-validator](https://jigsaw.w3.org/css-validator)

## 代码部署工具

Jenkins、CircleCI、Github Actions、Gitlab CI

## 前端依赖的安装方式

npm、yarn、pnpm

## 资源压缩（图片/SVG）

[tinypng-支持 png 和 jpg](https://tinypng.com/)
[pngquant](https://pngquant.org/)
[imagemin](https://www.npmjs.com/package/imagemin)
[imagemin-jpegtran](https://www.npmjs.com/package/imagemin-jpegtran)
[imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
[压缩-svg](https://github.com/svg/svgo)

### 合理利用 git hook

如帮 UI 团队在 commit 时压缩图片（团队小伙伴实现）
思路，每次 commit 之前执行一段 shell 脚本，该脚本作用，找出本次提交且在‘/assets/(.\*).png’的文件，
新建 target 文件夹放压缩后的文件，然后循环执行压缩图片命令再将压缩产出的图片重定向到 target 文件。

```
install.sh
chmod +x pngquant
cp ./pre-commit.sh .git/hooks/pre-commit

// pre-commit.sh
#!/bin/bash
files=($(git diff --cached --name-only | grep -Ei "assets/(.*)/.png"))
for((i=0; i<${#files[@]};i++))
do
	source=${files[$i]}
	echo $source
	target=$(echo $source | sed 's/\/assets\/compress/')
	path=$(dirname $target)
	echo "processing: $source"
	mkdir -p "$path"
	#pngquant 为可执行的二进制文件
	./pngquant - < $source > $target
	echo "compressed $target"
done

```

## 项目组织方案

SourceMap、
代码组织：multirepo 和 monorepo
Mock：Mock.js 和 Faker.js、YApi 和 Apifox

## 代码组织：multirepo 和 monorepo

multrepo：将项目分化成为多个模块，并针对每一个模块单独的开辟一个 reporsitory 来进行管理。
monorepo：是将所有的模块统一的放在一个主干分支之中管理。不进行分库存储，当有特定的需要的时候进行分支，但是问题修改还是在主干上操作，并有专门人员合并到分支内容上，在特定需求完结的时候，分支也将会被废弃。

## 提高效率的 VScode 插件

Code Spell Checker、Todo Tree、Bracket Pair Colorizer、draw.io

Remote-Development、Remote-Containers、Remote-SSH

## mac 相关

homebrew 安装
[设置国内镜像](https://blog.csdn.net/iroguel/article/details/93481795)
[文本搜索-ag](https://www.mankier.com/1/ag)

## 常用的 npm 包

```
数字处理：Math.js、big.js
数字格式化：numeral
数字计算精度问题：Math.js/decimal.js/big.js/BigNumber.js
时间格式化：moment/dayjs
process.env 动态添加配置：dotenv
发布订阅消息：EventEmitter3/wolfy87-eventemitter
开发环境接口代理：http-proxy-middleware
请求库（client & server）：isomorphic-unfetch
捕获错误信息：@sentry/browser、@sentry/node
表单验证库（支持异步验证）：async-validator
分步引导库（操作引导）： driver.js
实现拖拽：react-dnd 和 react-draggable
预览 PDF：react-pdf-viewer
播放视频：Video-React
列表问题的解决（虚拟滚动）：react-window 和 react-virtualized
随机数：uuid
前端状态机（流程开发）：xstate
web 黏贴板：clipboard
代码格式化：prettier
代理配置（开发环境）：http-proxy-middleware
富文本编辑器：Quill、tinymce
元素尺寸改变监听：element-resize-event、iframe-resizer
polyfill（兼容）：stickyfilljs
git hook：husky
移动端调试：vConsole、eruda
menu-aim: react-menu-aim、es6-menu-aim
```

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

# 动画解决方案

lottie-复杂帧动画的解决方案
