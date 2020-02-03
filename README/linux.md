# linux 基础

[不错的 linux 教程](http://c.biancheng.net/view/944.html)

## 命令

### man [选项][命令]

用来查看系统中自带的各种参考手册<br>
manual

# source [fileName]

source 命令也称为“点命令”，也就是一个点符号（.）。source 命令通常用于重新执行刚修改的文件，使之立即生效，而不必注销并重新登录。

### echo [字符串 | 变量]

用于在终端显示字符串或变量

### date [选项][+指定格式]

用于显示/设置系统的时间和日期
[日期格式和参数](https://www.runoob.com/linux/linux-comm-date.html)

### reboot

用于重启系统（仅 root 用户可使用）

### ifconfig [网络设备][选项]

用于获取网卡配置与网络状态等信息
[参数](https://www.runoob.com/linux/linux-comm-ifconfig.html)

### uname [选项]

查看系统内核版本等信息
[参数](https://www.runoob.com/linux/linux-comm-uname.html)

### uptime

用于查看系统的负载情况
[说明](https://www.cnblogs.com/ftl1012/p/uptime.html)

### top [选项]

用于实时显示 process 的动态

### watch [选项][命令]

监测一个命令的运行结果
[说明](https://www.cnblogs.com/ftl1012/p/watch.html)

### free [选项]

显示当前系统中内存的使用量
[说明](https://www.runoob.com/linux/linux-comm-free.html)

### who [选项]

查看当前登入主机的用户情况

### last [选项]

查看所有系统的登入记录

### history [-c]

查看当前用户在系统中执行过的命令<br>
这些历史命令会被保存到用户家目录的“.bash_history”中。<br>
history 默认会保存 1000 条，可以编辑/etc/profile 文件的 HISTSIZE 值。

### sosreport

手机系统配置并诊断信息后输出结论文档

## 环境变量

你可以通过"env"来查看当前用户可使用的环境变量

```
HOME    用户的主目录“家”
SHELL   当前的shell是那个那个程序
HISTSIZE    历史命令记录条数
MAIL    邮件信箱文件
LANG    语言数据
RANDOM  随机数字
PS1 bash提示符
HISTFILESIZE    history命令存储数量
PATH    在路径中的目录查找执行文件
EDITOR  默认文件编辑器
```

其实“/etc/profile” 保存了所有用户都可以使用的全局变量<br>
其实“/home/[userName]/.bash_profile” 保存了[userName]可以使用的全局变量<br>
export 命令用于将局部变量提升为全局变量，格式为：“export 变量名[=变量值]”
PS：PATH 中保存了命令执行文件的查找路径<br>
为 PATH 增加值，“PARTH=\$PATH:[newValue]”

## 查看

### cat [选项][文件]

查看纯文本文件

```
-n 显示行号
-b 显示行号（不包括空行）
-A 显示“不可见”的符号，如空格，tab键盘
```

### more [选项][文件]

查看文本文件（较长的）

```
-n 预先显示的行数
-d 显示提示语句与报错信息
```

### head [选项][文件]

查看纯文本文件的前 N 行

### tail [选项][文件]

查看纯文本文件的后 N 行

```
// 动态查看后100行日志
tail -f -n 100 text.log
```

### od [选项][文件]

查看特殊格式的文件（如 ASCII 字符、八进制）

### tr [原始字符][目标字符]

转换文本文件中的字符

### wc [选项][文本]

统计指定文本的行数、字数、字节数

### cut [选项][文本]

通过列来提取文本字符

### diff [选项][文件]

比较多个文件的差异

### dd [选项]

从标准输入或文件中读取数据，根据指定的格式来转换数据，再输出到文件、设备或标准输出

## 用户&&群组

### useradd [选项][用户名]

用于建立用户帐号<br>
[说明](https://www.runoob.com/linux/linux-comm-useradd.html)

### passwd [选项][用户名]

修改用户的密码

### userdel [选项][用户名]

删除用户帐号

### usermod [选项][用户名]

修改用户的属性

### groundadd [选项][群组名]

创建群组

### su [选项][用户名]

用于变更为其他使用者的身份，除 root 外，需要键入该使用者的密码

```
-s 同时切换环境变量
```

### sudo [选项][命令行]

Linux sudo 命令以系统管理者的身份执行指令，也就是说，经由 sudo 所执行的指令就好像是 root 亲自执行。<br>
使用权限：在 /etc/sudoers 中有出现的使用者。

### alias [别名=命令]

查看全部设置的别名或设置单个命令的别名

### unalias [别名]

取消命令的别名

```
-a 　删除全部的别名
```

### tar [选项][文件]

对文件压缩或解压<br>
[说明](https://www.runoob.com/linux/linux-comm-tar.html)

### grep [选项][文件]

对文本进行搜索<br>
grep 'Ubuntu' linuxidc.txt // 在 linuxidc.txt 中查找‘Ubuntu’字符<br>
grep 'Ubuntu' linuxidc* // 在前缀 linuxidc 中查找‘Ubuntu’字符<br>
grep 'Ubuntu' *.txt // 在后缀为.txt 中查找‘Ubuntu’字符<br>
grep 'Linux.\*.Fedora' linuxidc.txt // 在..中查找对应字符<br>

### find [查找路径][寻找条件] [操作]

### which [查找路径][寻找条件] [操作]

用于查找并显示给定命令的绝对路径，环境变量 PATH 中保存了查找命令时需要遍历的目录。<br>
which node // 返回命令的决定路径

## 管道符、重定向、环境变量

管道命令符“|”的作用是将前一个命令的标准输出当作后一个命令的标准输入，格式为“命令 A|命令 B”

```
#   统计文件“/etc/passwd”中“/sbin/nologin”出现多想行
grep "/sbin/nologin" /etc/passwd | wc -l
#   使用非交互式设置用户密码（root用户）
echo "fanerge" | passwd --stdin root
```

### 输入、输出重定向符语法表

重定向输出
| 符号 | 作用 |
| -------- | -----: |
| 命令 > 文件 | 将标准输出重定向到一个文件中（清空原文件的数据）|
| 命令 >> 文件 | 将标准输出重定向到一个文件中（追加原文件的数据）|
| 命令 2> 文件 | 将错误输出重定向到一个文件中（清空原文件的数据）|
| 命令 2>> 文件 | 将错误输出重定向到一个文件中（追加原文件的数据）|
| 命令 >> 文件 2> \$1 | 将标准输出和错误输出重定向到一个文件中（追加原文件的数据）|
重定向输入
| 符号 | 作用 |
| -------- | -----: |
| 命令 < 文件 | 将文件作为命令的标准输入|
| 命令 << 文件 | 从标准输入中国读入，直到遇到“分界符”才停止|
| 命令 < 文件 1 > 文件 2 | 将文件 1 作为命令的标准输入并将标准输出到文件 2|

### 命令行通配符

| 适配符                   |                 作用 |
| ------------------------ | -------------------: |
| \*                       |   匹配零个或多个字符 |
| ?                        |     匹配任意单个字符 |
| [0-9]                    |     匹配范围内的数字 |
| [abc]                    | 匹配范围内的任意字符 |
| \(反斜杠)                |     转义后面单个字符 |
| ''(单引号)               |     转义后面所有字符 |
| ""(双引号)               |         变量依然生效 |
| ``(反引号)| 执行命令语句 |

## 包管理&&三方工具

### 包管理

apt-get、yum、rpm 等。<br>
mac 可使用 brew。

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install wget
```

### wget [选项][下载地址]

下载文件的工具

```
-b 后台下载模式。
-O 下载到指定目录。
-t 最大尝试次数。
-c 断点续传。
-p 下载页面内所有资源（图片、视频等）。
-r 递归下载。
```

### elinks [选项][网址]

实现一个纯文本界面的浏览器
[elinks-命令行中的浏览器](https://www.jianshu.com/p/31cb89ce32d9)

### crontab

用来定期执行程序的命令

# 文件和目录操作

linux 中“一切皆为文件”

## cd [选项] 目录名称

切换工作目录<br>
Change Directory

```
. 是表示目前所在的目录
.. 表示目前目录位置的上一层目录
~ 表示用户主目录，如root用户的主目录为/root，其他用户的主目录为/home/[userName]
~用户名 表示切换至指定用户的主目录
- 表示前一个工作目录
/ 表示绝对路径
```

## pwd

显示当前路径<br>
Print Working Directory

## ls [选项] 目录名称

显示当前目录下的内容<br>
list

```
-A	显示全部的文件，连同隐藏文件，但不包括 . 与 .. 这两个目录。
-l	使用长格式列出文件和目录信息。
```

[参数](http://c.biancheng.net/view/721.html)

## mkdir [选项] 目录名

创建目录<br>
Make Directories

```
-m 选项用于手动配置所创建目录的权限，而不再使用默认权限。
-p 选项递归创建所有目录，以创建 /home/test/demo 为例，在默认情况下，你需要一层一层的创建各个目录，而使用 -p 选项，则系统会自动帮你创建 /home、/home/test 以及 /home/test/demo。
```

## rmdir [-p] 目录名

删除空目录<br>
remove empty directories

```
-p 选项用于递归删除空目录。
```

## touch [选项] 文件名

创建文件及修改文件时间戳<br>

```
访问时间（Access Time，简称 atime）：只要文件的内容被读取，访问时间就会更新。例如，使用 cat 命令可以查看文件的内容，此时文件的访问时间就会发生改变。
数据修改时间（Modify Time，简称 mtime）：当文件的内容数据发生改变，此文件的数据修改时间就会跟着相应改变。
状态修改时间（Change Time，简称 ctime）：当文件的状态发生变化，就会相应改变这个时间。比如说，如果文件的权限或者属性发生改变，此时间就会相应改变。
-a：只修改文件的访问时间；
-c：仅修改文件的时间参数（3 个时间参数都改变），如果文件不存在，则不建立新文件。
-d：后面可以跟欲修订的日期，而不用当前的日期，即把文件的 atime 和 mtime 时间改为指定的时间。
-m：只修改文件的数据修改时间。
-t：命令后面可以跟欲修订的时间，而不用目前的时间，时间书写格式为 YYMMDDhhmm。
```

## cp [选项] 源文件 目标文件

linux 系统内复制文件和目录<br>
copy

```
-a：相当于 -d、-p、-r 选项的集合；
-d：如果源文件为软链接（对硬链接无效），则复制出的目标文件也为软链接；
-i：询问，如果目标文件已经存在，则会询问是否覆盖；
-l：把目标文件建立为源文件的硬链接文件，而不是复制源文件；
-s：把目标文件建立为源文件的软链接文件，而不是复制源文件；
-p：复制后目标文件保留源文件的属性（包括所有者、所属组、权限和时间）；
-r：递归复制，用于复制目录；
-u：若目标文件比源文件有差异，则使用该选项可以更新目标文件，此选项可用于对文件的升级和备用。
```

## scp [选项] 源文件 目标文件

linux 系统间复制文件和目录<br>
secure copy<br>
scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。
[参数](https://www.runoob.com/linux/linux-comm-scp.html)

## rm [选项] 文件或目录

删除文件或目录<br>

```
-f：强制删除（force），和 -i 选项相反，使用 -f，系统将不再询问，而是直接删除目标文件或目录。
-i：和 -f 正好相反，在删除文件或目录之前，系统会给出提示信息，使用 -i 可以有效防止不小心删除有用的文件或目录。
-r：递归删除，主要用于删除目录，可删除指定目录及包含的所有内容，包括所有的子目录和文件。
```

## mv [选项] 源文件 目标文件

移动文件或改名<br>
move

```
-f：强制覆盖，如果目标文件已经存在，则不询问，直接强制覆盖；
-i：交互移动，如果目标文件已经存在，则询问用户是否覆盖（默认选项）；
-n：如果目标文件已经存在，则不会覆盖移动，而且不询问用户；
-v：显示文件或目录的移动过程；
-u：若目标文件已经存在，但两者相比，源文件更新，则会对目标文件进行升级；
```

## type [选项][命令]

判断另外一个命令是否是内置命令

# Shell 脚本

Shell 作为用户与 Linux 系统通讯的媒介，自身也定义了各种变量与参数，并提供了诸如循环、分支等高级语言才有的控制结构特性。<br>

## 语法

文件后缀名 shell 脚本后缀为.sh<br>
执行 shell 脚本 sh **.sh 或者**.sh<br>

### 结构

```
脚本声明（#!）：告知系统用何种shell来解释。
注释信息（#）：对可执行语句或程序功能做介绍，可以不写。
可执行语句：执行的具体命令。
```

### 接收参数

```
如：**.sh one two three four
上面执行shell脚本时传入了4个参数（默认$0为当前执行shell脚本的程序名）
在shell脚本中如何取变量？
$1 为第一个变量
$2 为第一个变量
$# 一共有多少个参数
$* 所有位置变量的值
$? 判断上一条命令是否执行成功，0为成哥，非0为失败
```

### 文件测试

语法：[ 操作符 文件或目录 ] // 注意空格

```
-d  测试是否为目录
-f  判断是否为文件
-e  测试文件或目录是否存在
-rwx    判断当前用户是否有读写执行的权限
```

例如判断是否有“/etc/fstab”的写权限

```
[ -w /etc/fstab ]
echo $? // 输出为0表示没有权限
```

### 逻辑测试

语法：[ 表达式 1 ] 操作符 [ 表达式 2 ]

```
&&  逻辑的与，“而且”
||  逻辑的或，“或者”
!   逻辑的否
```

如当前用户

```
[ $USER != root ] && echo "user" || echo "root"
```

### 整数比较

语法：[ 整数 1 操作符 整数 2 ]

```
-eq 判断是否等于
-ne 判断是否不等于
-gt 判断是否大于
-lt 判读啊 是否小于
-le 判断是否等于或小于
-ge 判断是否大于或等于
```

如：10 是否等于 10

```
[ 10 -eq 10 ]
echo $? // 0
```

### 字符串比较

语法：[ 字符串 1 操作符 字符串 2 ]

```
=   比较字符串内容是否相同
!=  比较字符串内容是否不同
-z  比较字符串内容为空
```

如：判断字符串是否为空

```
[ -z 'fanerge' ]
echo $? // 1不为空
```

### 条件测试

[shell-流程控制](https://www.runoob.com/linux/linux-shell-process-control.html)

#### 单分支

if-then-fi

#### 双分支

if-then-else-fi

#### 多分支

if-then-elif-then-fi

#### for 条件语句

for-in-do-done

#### while 条件语句

while-do-done

#### case 条件语句

case-;;-esac

### 计划任务服务

```
at [时间] 安排一次性任务
atq 或 at -l 查看任务列表
at -c 序号  预览任务与设置环境
atrm 序号   删除任务
crontab 创建长期可循环的计划任务
```

[crontab](https://www.runoob.com/linux/linux-comm-crontab.html)

# 用户身份与文件权限

在 linux 中也存在一个超级用户 root，root 拥有最高的权限。<br>
权限分配原则为“分配最小权限”。

## 文件权限与归属

linux 系统中一起都是文件，文件和目录的所属与权限，来分别规定所有者、所有组、其他人的权限。

```
ls -l demo.txt
-rw-r--r--  1 yuzhenfan  staff      0  6 11 09:40 demo.txt
// 权限第一位代表文件类型
- 普通文件 // 如demo.txt
d 目录文件 // etc/
l 链接文件 // 类似与windows的快捷方式
b 块设备文件
c 字符设备文件
p 管道文件
// 文件权限另一种表示
如某文件权限为7，代表可读、可写、可执行（4+2+1）// r=4,w=2,x=1
```

## 文件的特殊权限

SUID：让执行者临时拥有属主的权限（仅对拥有执行权限的二进制程序有效）。<br>
SGID：让执行者临时拥有属组的权限（仅对拥有执行权限的二进制程序有效）。<br>
SBIT：只可管理自己的数据而不能删除他人文件，设置粘滞位 sticky bit（仅对目录有效）。

```
chmod [选项] 权限 [文件或目录] // 修改所属主的文件或目录的权限
chown [选项] 权限 [文件或目录] // 修改所属组的文件或目录的权限
chmod o+t /test // 为test目录设置粘泻权限
chattr [选项] [文件] // 设置文件的隐藏权限
lsattr [选项] [文件] // 显示文件的隐藏权限
```

## su 命令与 sudo 服务

```
su [选项] [userName] // 切换用户
// - 选项，同时切换环境变量
exit // 从su切换用户用户模式推出
sudo [选项] 命令名称 // 以root身份来执行命令，sudo的配置文件（/etc/sudoers）。
```

## 文件访问控制列表

作用：对某个指定的用户进行单独的权限设置。<br>

```
setfacl [选项] [文件] // 增加或者修改ACL规则，访问控制列表（Access Control List，ACL）
getfacl 文件 // 显示文件的ACL规则
```

# 存储结构与磁盘划分

## linux 主要目录介绍

[linux 目录](https://www.cnblogs.com/zhuchenglin/p/8686924.html)

## 文件系统与数据资料

文件管理系统的作用是将硬盘合理的规划，使得用户能够在上面正常建立文件、写入、读取、修改、转存文件与控制文件。<br>
常见的文件系统：Ext3、Ext4、XFS。<br>
每个文件的权限与属性都会记录在 inode table 中（包括文件的真实数据地址），实际数据则保存在 block 块中（每个 block 大小可以是 1k、2k、4k）。

## 挂载硬件设备

挂载操作指的是当用户需要使用硬盘设备或分区数据时，需要先将其与一个已经存在的目录文件做关联，这个动作称为“挂载”。<br>
mount 命令用于挂载文件系统，格式为：mount 文件系统 挂载目录<br>
重启后失效，需要永久挂载则按照指定的格式写入到/etc/fstab 文件中。

```
// 将光盘挂载
mount /dev/cdrom /media/cdrom
// 用于撤销已经挂载的设备文件
unmount [挂载点/设备文件]
```

## 添加硬盘设备

```
// 用于管理磁盘
fdisk [磁盘名称]
// 格式化为**文件系统
mkfs.文件系统名称 [硬盘分区名称]
// 格式化为xfs文件系统
mkfs.xfs [硬盘分区名称]
// 查看挂载点信息与磁盘使用量
df [选项] [文件]
// 查看磁盘的使用量
du [选项] [文件]
// 查看当前的内存使用量情况
free -m
// 显示开机信息
dmesg [选项]
```

## 磁盘容量配额

```
// 显示磁盘已使用的空间与限制
quota [选项] [用户|群组]
// 用于超级用户编辑其他用户的quota配置限制
edquota [选项] [用户]
```

## 软硬方式链接

ln [选项] 源文件 目标文件<br>
在文件之间建立链接（硬链接和软链接）<br>

```
文件：inode（存放文件的元信息） + block（存放文件的真实数据）。
inode：索引节点，它用来存放档案及目录的基本信息，包含时间、档名、使用者及群组等。
// 硬链接和软连接
软链接：类似于 Windows 系统中给文件创建快捷方式，即产生一个特殊的文件，该文件用来指向另一个文件(即保持了原文件的路径)，此链接方式同样适用于目录。
硬链接：我们知道，文件的基本信息都存储在 inode 中，而硬链接指的就是给一个文件的 inode 拥有多个有效路径名，通过任何一个有效路径名，都可以找到此文件的 inode，从而读取该文件的数据信息，硬连接的作用是允许一个文件拥有多个有效路径名，这样用户就可以建立硬连接到重要文件，以防止“误删”的功能。
-s：建立软链接文件。如果不加 "-s" 选项，则建立硬链接文件；
-f：强制。如果目标文件已经存在，则删除目标文件后再建立链接文件；
```

# 防火墙

防火墙分为软件或硬件。<br>
功能：对外部请求进行过滤，成为公网与内网之间的保护屏障，防火墙会监控每一个数据包并判断是否有相应的匹配策略规则，直到满足其中一条策略规则，而防火墙规则策略可以基于来源地址、请求动作或协议来定制，最终仅让合法的用户请求流入内网中，其余的均被抛弃。<br>
iptables 服务和 Firewalled 服务，将定义好的规则交由内核中的 netfilter（网络过滤器）来读取，从而实现防火墙功能。<br>

## iptables

iptables 命令用于管理防火墙的规则策略。<br>

```
iptables [-t 表名] 选项 [链名] [条件] [-j 控制类型]
iptables -L // 查看已有的规则
iptables -F // 清空已有的规则
如仅允许来自192.168.10.0/24域的用户链接本机的ssh服务（允许规则必须在拒绝规则前面）
iptables -I INPUT -s 192.168.10.0/24 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p --dport 22 -j REJECT
```

[iptables](https://www.cnblogs.com/alimac/p/5848372.html)<br>
SNAT<br>
SNAT 既源地址转换技术，能够让多个内网用户通过一个外网地址上网。<br>
DNAT<br>
DNAT 既目地地址转换技术，能够让外网 IP 用户访问局域网内不同的服务器。<br>
端口转发功能：将原本到某端口的数据包转发到其他端口。<br>

```
// 将888端口的请求转发发哦22端口
firewall-cmd --premanent --zone=public --add-forward-port=port=888:port=tcp:toport=22:toaddr=192.168.10.10
// 使用ssh访问888端口
ssh -p 888 192.168.10.10
```

## 服务的访问控制列表

Tcp_wrappers(Transmission Control Protocol Wrappers)是一个基于 IP 层的 ACL 访问控制列表流量监控程序。<br>
运行名单：/etc/hosts.allow<br>
拒绝名单：/etc/hosts.deny<br>

# linux 常用操作

红帽 RHEL7 的系统守护进程为 systemd，之后用 sytemctl 代替了很多管理命令。<br>

## linux 系统初始化进程

BIOS 开始-》进入“Boot Loader”-》加载内核-》内核的初始化-》启动初始化进程

## 管理服务命令

sytemctl 管理服务的启动、重启、停止、重载、查看状态的命令。<br>

## 监视资源&&管理进程

```
// 查看系统中的进程状态
ps [选项]
// 查找某个特定的进程信息
ps -aux | grep 进程名
// 用于监视进程的活动与系统负载（强化版的windows任务管理器）
top
// 用于查询某个特定程序的进程PID值
pidof [参数] [程序名称]
// 终止某个特定PID号码的进程
kill [参数] [进程PID号]
// 终止某个特定名称的所有进程
killall [选项] [进程名称]
// 让后台的程序继续执行
bg [选项]
// 将后台的进程再调回前台
fg
```

## 配置网卡连接网络

```
// 查看网卡信息
nmcli connection show
// 查看网卡的连接状态
nmcli device status
// 查看某个网卡设备
nmcli con show [网卡]
// 重新加载网卡
systemctl restart network
// 查看从本季到另外一台电脑经过的路由信息
tracepath [ip | domain]
```

## 安全密钥验证

```
// 主机中生成“密钥对”，放在“/root/.ssh”
ssh-keygen
// 将公钥传说直远程主机
ssh-copy-id [ip | 域名]
// 修改远程主机的sshd服务的配置文件
vim /etc/ssh/sshd_config
PasswordAuthentication no // 允许密码验证的参数设置为no
PubkeyAuthentication yes // 允许密钥验证的参数设置为yes
systemctl restart sshd // 重启ssh服务
// ssh用于远程管理linux，-p可指定端口，-v显示连接过程的详细信息
ssh [选项] 主机
// ssh登入系统
ssh [userName]@[ip | domain]
```

## 远程传输命令

多个 linux 系统传输文件

```
scp [参数] 本地文件 远程账号@IP地址:远程目录
cp [参数] [源文件] [目标文件] // linux内拷贝文件
```

## 不间断会话服务

我们通过 ssh 连接服务时，当连接的终端被关闭时，运行在服务器上的命令也会中断。<br>

```
brew install screen // 该三方包来完成
1.  创建与使用会话功能
screen -S [backup] // 创建名称为backup的会话
screen -ls // 查看当前已经存在的会话
2.  回到某个会话（恢复会话）
screen -r [backup]
3.  将某个会话离线
screen -d [backup]
4.  同步终端信息
screen -x
```

[linux screen 工具](https://www.cnblogs.com/lpfuture/p/5786843.html)

## 务传输文件（Vsftpd）

FTP 协议占用两个端口<br>
21 端口：命令控制，用于接收客户端执行的 FTP 命令。<br>
20 端口：数据传输，用于上传、下载文件数据。<br>
Vsftpd（Very Secure FTP Daemon）<br>

```
brew install vsftpd
ftp [参数] [FTP主机] // 使用FTP服务
```

[Vsftpd](https://blog.51cto.com/meiling/2071122)

## 使用 Samba 或 NFS 实现文件共享

Samba<br>

```
brew install samba
cat /etc/samba/smb.conf
```

[NFS](https://www.cnblogs.com/sunny18/p/8287934.html)

## 域名解析服务（Bind）

```
brew isntall bind-chroot
/etc/named.conf // 配置文件
nslookup // 测试domain-》ip
```

[使用 Bind 提供域名解析服务](https://blog.csdn.net/neo233/article/details/79371422)

## DHCP 动态管理主机地址

DHCP 动态主机管理协议（Dynamic Host Configuration Protocol）基于 UDP 协议且仅限用于局域网的网络协议，用途为为局域网内部设备或网络供应商自动分配 IP 地址。

```
brew install dhcp
/etc/dhcp/dhcpd.conf // 配置文件地址
systemctl start dhcpd // 重启dhcpd服务
systemctl enable dhcpd // 添加至开机启动
```

[DHCP 动态分配主机地址配置](https://www.cnblogs.com/zhangjianghua/p/9185039.html)

## 代理缓存服务/Squid

```
brew install squid
/etc/squid/squid.conf
systemctl enable squid
```

[squid 介绍及其简单配置](https://www.cnblogs.com/yingsong/p/4929482.html)
