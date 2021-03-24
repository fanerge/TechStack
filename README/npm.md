# npmrc

npm 的配置文件，npm 获得 config 设置从，1.命令行、2.环境变量、3.npmrc 获得

# init

在项目中引导创建一个 package.json 文件

```
npm init
```

# help&&help-search

```
// 查看某条命令的详细帮助 
npm help <term> [<terms..>]
// 搜索 npm 帮助文档
npm help-search <text>
```

# 运行

```
npm run-script test
npm run test
npm test
npm t
// npm 执行传参
npm run <script> --argName=234
// 要依次运行多个脚本，可以使用 &&
npm run lint && npm test
// 要并行运行多个脚本，可以使用＆(这仅适用于 Unix 环境)
npm run lint ＆ npm test
// 静默消息(如果想减少错误日志并非防止脚本抛出错误)
npm run <script> --silent
// 或者
npm run <script> -s
// 如果脚本名不存在时不想报错，可以使用 --if-present ，比如：
npm run <script> --if-present
// 指定输出日志等级("silent", "error", "warn", "notice", "http", "timing", "info", "verbose", "silly".)
npm run <script> --loglevel <info>
```

# root

查看包的安装路径

```
npm root -g
npm root
```

# cache

管理模块的缓存

```
npm cache add <tarball file>
npm cache add <folder>
npm cache add <tarball url>
npm cache add <name>@<version>
npm cache ls [<path>]
npm cache clean [<path>]
npm cache clean --force
```

# start/stop/restart/build

项目执行命令，具体做什么查看 package.json 的 scripts 字段中声明

```
npm start [-- <args>]
Npm run start [-- <args>]
npm run stop [-- <args>]
npm run restart [-- <args>]
Npm run test [-- <args>]
npm build [<package-folder>]
```

# config

管理 npm 的配置信息

```
npm config set <key> <value> [-g|--global]
npm config get <key>
npm config delete <key>
npm config list [-l] [--json]
npm config edit
npm get <key>
npm set <key> <value> [-g|--global]
```

# install

Node Package 安装

```
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
common options: [-S|--save|-D|--save-dev|-O|--save-optional] [-E|--save-exact] [--dry-run]
// npm5之后安装方式，适用于项目初次安装，且package-lock.json 或 npm-shrinkwrap.json
// 特点速度快、不会修改package.json 和package-lock.json
npm ci
```

# uninstall/remove/rm/r/un/unlink

Node Package 卸载

```
Npm uninstall [package] // 只卸载包
npm uninstall [package] -S // 卸载包并从package.json中删除记录
npm uninstall [package] -D // 卸载包并从package.json中删除记录（dev）
npm uninstall [<@scope>/]<pkg>[@<version>]... [-S|--save|-D|--save-dev|-O|--save-optional]
```

# update

更新模块

```
npm update <name> -g // 更新全局包npm update <name> -S // 更新生产依赖包
npm update <name> -D // 更新开发依赖包
```

# outdated

检查模块是否已经过时

```
npm outdated // 列出所有过时的包
npm outdated [[<@scope>/]<pkg> ...]

```

# ls/list/la/ll

查看安装的模块

```
npm ls  -g
npm ls [[<@scope>/]<pkg> ...] // 列出依赖对应包的包
```

# view/show/info/v

查看模块的注册信息

## 查看 package 信息

npm v [package]

## 查看线上 package 版本

npm v [package] version

## 查看 package 某个版本的 dependencies

npm v [package@x.y.z] dependencies // 返回所有依赖{name: ‘版本依赖’}
npm v [package@x.y.z] dependencies.[name] // 返回对应依赖的版本信息

## 查看 package 的 repository 信息

npm v [package] repository // 返回{type: ‘’, url: ‘’}
npm v [package] repository.url // 返回 url

## other

npm v [package] contributors
npm v [package] contributors.email

# 其他

```
// 搜索包（search、s、se、find）
npm search [-l|--long] [--json] [--parseable] [--no-description] [search terms ...]
// 查看node和npm等的版本信息
npm version
// npm包更新
npm version patch
// 登录&&发布
npm adduser // 用户登录（发布前）
npm publish [<tarball>|<folder>] [--tag <tag>] [--access <public|restricted>] // 发布
// 在发布的包上设置访问等级
npm access public [<package>]
// 作废指定包的指定版本
npm deprecate <pkg>[@<version>] <message>
// 认证
npm audit [--json|--parseable]
// 查看bin文件目录
npm bin
npm bin -g // 全局bin目录
// 在浏览器端查看某个pkg的bugs
npm bugs [<pkgname>]
npm issues [<pkgname>]
// 在浏览器端查看某个pkg的文档
npm docs [pkg]
// 检查npm环境
npm doctor
// pkg去重(多个模块依赖统一版本的包)
npm dedupe
// 编辑已安装的软件包
npm edit <pkg>[/<subpkg>...]
// 浏览已安装的软件包
npm explore <pkg> [ -- <command>]
```
