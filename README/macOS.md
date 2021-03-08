本文用于记录 mac 操作技巧，主要为 shell 技巧

# mac 软件
```
软件搜索网站：http://www.pc6.com/mac/113099.html
视频三件套：Downie4 + Permute3 + INA
电脑硬件信息监控软件：istatmenus
最强防火墙：Little Snitch
文件定制：Colorful Folders
下载工具：Folx Go
文件比对：Beyond Compare
文件查找：ProFind
清理软件：CleanMyMac x
```
##  fix文件不能安装
```
sudo spctl --master-disable
// 拖动文件
xattr -cr 
```

# mac 软件包的管理器 brew

/usr/bin/ruby -e "\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
[Homebrew](https://brew.sh/index_zh-cn)

## 常用命令

```
brew install <packageName>
brew uninstall <packageName>
brew search <packageName>
brew list // 查看已安装的包
brew info <packageName> // 查看包信息
brew update // 更新brew
brew upgrade <packageName> // 更新某个包
brew -v // 查看版本
brew -h // 帮助信息
brew link <packageName> // 创建包的
```

## 更改 origin

```
// 替换 brew.git
# 切换到 Homebrew 目录
cd "$(brew --repo)"
# 切换成阿里源, 其实就是改了远程仓库的地址
git remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git
原始源：https://github.com/Homebrew/brew.git

// 替换 homebrew-core.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git
原始源：https://github.com/Homebrew/homebrew-core.git

// 替换 homebrew-bottles: 二进制文件, 注意自己机器上使用的 SHELL
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc

// 替换 homebrew-cask.git: cask 表示 GUI 应用的源, 阿里云没有提供 cask 源, 故使用 USTC 源
cd "$(brew --repo)"/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git
原始源：https://github.com/Homebrew/homebrew-cask
```

[brew 设置 origin](https://www.cnblogs.com/magexi/p/11664539.html)

# hosts 文件

cat /etc/hosts

# 查看本机支持的 shell

cat /etc/shells

# 默认 ssh key 存放地址

cd ~/.ssh
