# npm

## npm install 原理

![](./img/npm-install.png)

### 获取 npm 配置

命令行设置 npm 配置 > env 环境变量设置 npm 配置 > 项目级的 .npmrc 文件 > 用户级的 .npmrc 文件> 全局级的 .npmrc 文件 > npm 内置的 .npmrc 文件

### 是否有 package-lock.json 文件

如果有，则检查 package-lock.json 和 package.json 中声明的依赖是否一致：
一致，直接使用 package-lock.json 中的信息，从缓存或网络资源中加载依赖；
不一致，按照 npm 版本进行处理。
如果没有，则根据 package.json 递归构建依赖树。然后按照构建好的依赖树下载完整的依赖资源，在下载时就会检查是否存在相关资源缓存：
存在，则将缓存内容解压到 node_modules 中；
否则就先从 npm 远程仓库下载包，校验包的完整性，并添加到缓存，同时解压到 node_modules。
最后生成 package-lock.json。
构建依赖树时，当前依赖项目不管其是直接依赖还是子依赖的依赖，都应该按照扁平化原则，优先将其放置在 node_modules 根目录（最新版本 npm 规范）。在这个过程中，遇到相同模块就判断已放置在依赖树中的模块版本是否符合新模块的版本范围，如果符合则跳过；不符合则在当前模块的 node_modules 下放置该模块（最新版本 npm 规范）。

### npm 缓存机制

```
// 获取配置的缓存的根目录
npm config get cache
// /Users/fanerge/.npm，其中又一个_cacache 文件，在npm V5 后都放在这里，里面有 content-v2（放二进制文件） index-v5（对应索引文件）
// 清除所有缓存
npm cache clean --force
当 npm install 执行时，通过pacote把相应的包解压在对应的 node_modules 下面。npm 在下载依赖时，先下载到缓存当中，再解压到项目 node_modules 下。pacote 依赖npm-registry-fetch来下载包，npm-registry-fetch 可以通过设置 cache 属性，在给定的路径下根据IETF RFC 7234生成缓存数据。
接着，在每次安装资源时，根据 package-lock.json 中存储的 integrity、version、name 信息生成一个唯一的 key，这个 key 能够对应到 index-v5 目录下的缓存记录。如果发现有缓存资源，就会找到 tar 包的 hash，根据 hash 再去找缓存的 tar 包，并再次通过pacote把对应的二进制文件解压到相应的项目 node_modules 下面，省去了网络下载资源的开销。
```

## npm 不完全指南

### 自定义 npm init

```
// npm-init.js 中定义了对应代码
npm config set init-module ~\.npm-init.js
// 也可通过config来配置
npm-config
```

### npm link 高效率在本地调试以验证包的可用性

```
// 将本地某个包如 npm-package-1，供 demo 项目使用（调试 npm-package-1 包）
1.  在 npm-package-1 项目中
npm link // 这样 npm link 通过链接目录和可执行文件，实现 npm 包命令的全局可执行
2.  在使用 demo 项目中
npm link npm-package-1 // 它就会去 /usr/local/lib/node_modules/ 这个路径下寻找是否有这个包，如果有就建立软链接
// 全局 node 命令安装路径 /usr/local/bin/
3. 调试完后取消关联
npm unlink npm-package-1
```

### npx 的作用

1.  npx 可以自动去当前项目的 node_modules/.bin 路径和环境变量 $PATH 里面检查命令是否存在
2.  npx 执行模块时会优先安装依赖，但是在安装执行后便删除此依赖，这就避免了全局安装模块带来的问题

### npm dedupe

```
// 重新计算依赖关系，然后将包结构整理得更合理，调整 node_modules 内文件结构
npm dedupe
npm ddp
Yarn 在安装依赖时会自动执行 dedupe 命令
```

### npm 多源镜像

1.  使用 preinstall hook，来管理多源
2.  [nrm](https://www.npmjs.com/package/nrm)
3.  私服，现在社区上主要有 3 种工具来搭建 npm 私服：nexus、verdaccio 以及 cnpm。

# yarn
##  Yarn 缓存
```
// 查看缓存内容
yarn cache dir
```
##  Yarn 安装机制
Yarn 的安装过程主要有以下 5 大步骤

检测（checking）→ 解析包（Resolving Packages） → 获取包（Fetching Packages）→ 链接包（Linking Packages）→ 构建包（Building Packages）
```
// 检测包（checking）
这一步主要是检测项目中是否存在一些 npm 相关文件，比如 package-lock.json 等。如果有，会提示用户注意：这些文件的存在可能会导致冲突。在这一步骤中，也会检查系统 OS、CPU 等信息。
// 解析包（Resolving Packages）
首先获取当前项目中 package.json 定义的 dependencies、devDependencies、optionalDependencies 的内容，这属于首层依赖。
先采用遍历首层依赖的方式获取依赖包的版本信息，再递归获取版本信息，使用 Set 数据结构来存储（保证不会重复）。
// 获取包（Fetching Packages）
这一步我们首先需要检查缓存中是否存在当前的依赖包，同时将缓存中不存在的依赖包下载到缓存目录（维护一个队列，家在某个依赖包）。
// 链接包（Linking Packages）
上一步是将依赖下载到缓存目录，这一步是将项目中的依赖复制到项目 node_modules 下，同时遵循扁平化原则。
// 构建包（Building Packages）
如果依赖包中存在二进制包需要进行编译，会在这一步进行。
```
