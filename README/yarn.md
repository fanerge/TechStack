# 准备条件

[Homebrew，macOS 的包管理](https://brew.sh/)

```
// 配置全局访问 Yarn 的可执行文件
export PATH="$PATH:`yarn global bin`"
brew install yarn
brew upgrade yarn
```

# 基础命令

```
yarn init
// 添加依赖包
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
// 添加依赖包到不同依赖项
yarn add [package] --dev // devDependencies
yarn add [package] --peer // peerDependencies
yarn add [package] --optional // optionalDependencies
// 升级依赖包
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
// 移除依赖包
yarn remove [package]
// 安装项目的全部依赖
yarn
yarn install
```

[npm cli 和 yarn cli 对照](https://yarn.bootcss.com/docs/migrating-from-npm/#cli-commands-comparison-)
[yarn cli 手册](https://yarn.bootcss.com/docs/cli/)
