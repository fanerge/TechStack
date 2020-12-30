# 基础

内存分页：在分配内存时是按页分配，分页机制让程序可以在逻辑上连续、物理上离散。

```
wget // 指定的 URL 下载文件
make // GNU 的工程化编译工具，用于编译众多相互关联的源代码文件，以实现工程化的管理，提高开发效率。
$env // 环境变量，全局
$path // 指令查找路径
```

# 存储器分级

## 存储器分级策略

我们需要综合考虑速度快（离 CPU 较近）、体积小、空间大、能耗低、散热好等因素来设计存储器分级策略。
离 CPU 较近就会导致散热不好，离 CPU 较远就会导致速度慢。
一种可行的方案，就是根据数据的使用频率使用不同的存储器：高频使用的数据，读写越快越好，因此用最贵的材料，放到离 CPU 最近的位置；使用频率越低的数据，我们放到离 CPU 越远的位置，用越便宜的材料。

### 分级策略

寄存器；
L1-Cache；
L2-Cache；
L3-Cahce；
内存；
硬盘/SSD

### 寄存器（Register）

寄存器紧挨着 CPU 的控制单元和逻辑计算单元，它所使用的材料速度也是最快的。
寄存器的数量通常在几十到几百之间，每个寄存器可以用来存储一定字节（byte）的数据。
寄存机的访问速度非常快，一般要求在半个 CPU 时钟周期内完成读写。<br>
作用：寄存器的主要作用是用来暂时存放参与运算的数据和运算结果，具有接收数据、存放数据和输出数据的功能。

### L1-Cache

L1- 缓存在 CPU 中，相比寄存器，虽然它的位置距离 CPU 核心更远，但造价更低。通常 L1-Cache 大小在几十 Kb 到几百 Kb 不等，读写速度在 2~4 个 CPU 时钟周期。
协助 CPU 处理指令预读。
L1- 缓存通常会分成两个区域，一个是指令区，一个是数据区（就不会存在数据缓存覆盖了指令缓存）。

### L2-Cache

L2- 缓存也在 CPU 中，位置比 L1- 缓存距离 CPU 核心更远。它的大小比 L1-Cache 更大，具体大小要看 CPU 型号，有 2M 的，也有更小或者更大的，速度在 10~20 个 CPU 周期。

### L3-Cache

L3- 缓存同样在 CPU 中，位置比 L2- 缓存距离 CPU 核心更远。大小通常比 L2-Cache 更大，读写速度在 20~60 个 CPU 周期。L3 缓存大小也是看型号的，比如 i9 CPU 有 512KB L1 Cache；有 2MB L2 Cache； 有 16MB L3 Cache。

### 内存

内存的主要材料是半导体硅，是插在主板上工作的。因为它的位置距离 CPU 有一段距离，所以需要用总线和 CPU 连接。
内存速度大概在 200~300 个 CPU 周期之间。

### SSD 和硬盘

SSD 也叫固态硬盘，结构和内存类似，但是它的优点在于断电后数据还在。内存、寄存器、缓存断电后数据就消失了。内存的读写速度比 SSD 大概快 10~1000 倍。

## 缓存条目结构

无论是缓存，还是内存，它们都是一个线性存储器，也就是数据一个挨着一个的存储。如果我们把内存想象成一个只有 1 列的表格，那么缓存就是一个多列的表格，这个表格中的每一行叫作一个缓存条目。

### 设计缓存条目结构

比如有 1000 个内存地址，但只有 10 个缓存条目。内存地址的编号是 0、1、2、3，...，999，缓存条目的编号是 0~9。我们思考一个内存编号，比如 701，然后用数学方法把它映射到一个缓存条目，比如 701 整除 10，得到缓存条目 1（地址 % 10，其实就构成了一个简单的哈希函数）。

## 指令的预读

CPU 顺序执行内存中的指令，CPU 执行指令的速度是非常快的，一般是 2~6 个 CPU 时钟周期；我们发现内存的读写速度其实是非常慢的，大概有 200~300 个时钟周期。
解决办法就是 CPU 把内存中的指令预读几十条或者上百条到读写速度较快的 L1- 缓存中，因为 L1- 缓存的读写速度只有 2~4 个时钟周期，是可以跟上 CPU 的执行速度的。

## 缓存的命中率

命中就是指在缓存中找到需要的数据。和命中相反的是穿透，也叫 miss，就是一次读取操作没有从缓存中找到对应的数据。

## 缓存置换问题

现在 L1- 缓存条目已经存满了，接下来 CPU 又读了内存，需要把一个新的条目存到 L1- 缓存中，既然有一个新的条目要进来，那就有一个旧的条目要出去。

# Linux 指令入门

Shell 把我们输入的指令，传递给操作系统去执行，所以 Shell 是一个命令行的用户界面。
usr 是 unix system resources 的缩写。
$PATH 保存了 Linux 会在哪些目录中查找可执行文件。

## 文件

```
man * // manual
which * // 可执行文件的路径
pwd（Print Working Directory）查看工作目录
cd * （change directory）切换工作目录
touch * 指令本来是用来更改文件的时间戳的，但是如果文件不存在touch也会帮助创建一个空文件
mkdir *（ make directory）创建目录
mkdir -p * // 当发现目标目录的父级目录不存在的时候会递归的创建
ls * 是 list 查看文件
ls -l // 查看详情
rm * 是 remove 的缩写，删除
nano/vi * // 编辑器
// 查阅文件内容
cat * // 将文件连接到标准输出流并打印到屏幕上
more/less * // 读取文件，但不需要读取整个文件到内存中，过滤、翻页
head/tail * // 用来读取一个文件的头部 N 行或者尾部 N 行
tail -n 1000 // 查看最后的 1000 行
tail -f 文件名 // 实时查看动态文件，follow
grep * filePath // global regular expression pattern
grep  -v * filePath // invert-match 反面
find // 指令帮助我们在文件系统中查找文件
find / -iname "*.txt" // 查看系统所有以txt结尾的文件
```

## 进程、重定向和管道指令

### 进程（processes）

进程，操作系统分配资源的最小单位。
作用：进程是应用的执行副本，如 rm 指令执行时，产生的进程其实是/usr/bin/rm 文件\应用的副本。

```
// 进程
ps -e // processes snapshot 所有的进程（当前状态的进程快照）
ps -ef // 所有的进程更多信息
top // 实时更新数据进程信息
htop // 类似 top 但信息更全，需要单独安装
```

### 管道（Pipeline）

特性，FIFO（First In First Out）
管道（Pipeline）的作用是在命令和命令之间及进程之间，传递数据。
标准输入、输出、错误流
标准输入流（用 0 表示）可以作为进程执行的上下文（进程执行可以从输入流中获取数据）。
标准输出流（用 1 表示）中写入的结果会被打印到屏幕上。
如果进程在执行过程中发生异常，那么异常信息会被记录到标准错误流（用 2 表示）中。
重定向，> 符号叫作覆盖重定向；>> 叫作追加重定向；& 代表一种引用关系。
如 ls -l > out 将 ls -l 的标准输出流重定向到 out 文件中，不再屏幕上显示
如 ls1 > out 出错了，所以标准错误流被定向到了标准输出流。&代表一种引用关系，具体代表的是 ls1 >out 的标准输出流。

#### 管道的分类

匿名管道（Unnamed Pipeline），这种管道也在文件系统中，但是它只是一个存储节点，不属于任何一个目录。说白了，就是没有路径。
命名管道（Named Pipeline），这种管道就是一个文件，有自己的路径。

```
// 用法
ls ｜ sort -r // 对ls的输出流进行逆序
// 去重
sort a.txt | uniq
// 筛选
find ./ | grep Spring // 所有文件名中含有Spring的文件
// 数行数
wc -l a.txt
// 获取管道中的数据
ls -l | tee save | grep 'css.md' //  将管道中输出流保存到 save 文件中，然后继续传给 grep 指令继续执行

// 命名管道
mkfifo pipeName
// 后面增加了一个&符号。这个&符号代表指令在后台执行，不会阻塞用户继续输入。
cat pipeName &
```

### xargs

xargs 指令从标准数据流中构造为指令并执行。
xargs 从输入流获取字符串，然后利用空白、换行符等切割字符串，在这些字符串的基础上构造指令，最后一行行执行这些指令。

```
cat url-list.txt | xargs wget -c
// 假如你有一个文件包含了很多你希望下载的 URL，你能够使用 xargs下载所有链接
```

## 用户和权限管理

### 权限划分

用户维度。每个文件可以所属 1 个用户，用户维度配置的 rwx 在用户维度生效；
组维度。每个文件可以所属 1 个分组，组维度配置的 rwx 在组维度生效；
全部用户维度。设置对所有用户的权限 rwx。

Root 账户也叫作超级管理员。
创建用户时会创建一个同名的分组。
新创建的文件默认权限为 rw-rw-r--，文件的所属用户会被设置成创建文件的用户。
公共执行文件的权限为 rwxr-xr-x，如 ls -l /usr/bin/ls

### 权限架构思想

最小权限原则（Least Privilege)
权限划分（边界清晰）
分级保护
权限包围（Privilege Bracking）（比如一个应用，临时需要高级权限，验证身份后，然后执行需要高级权限的操作，然后马上恢复到普通权限工作）

### 指令

adm 分组用于系统监控，比如/var/log 中的部分日志就是 adm 分组。
sudo 分组用户可以通过 sudo 指令提升权限。
sudo 原意是 superuser do。

```
groups // 查看当前用户的分组
id // 查看当前用户
cat /etc/passwd // 查看所有的用户
useradd * // 创建用户
groupadd * // 创建分组
usermod -a -G sudo userName // 为用户增加次级分组，-a代表append，-G代表一个次级分组的清单，userName 是账户名
usermod -g somegroup userName // 修改用户主要分组，
// 文件权限管理指令
ls -l // 查看文件的权限
chmod // 修改文件权限，chmod（ change file mode bits）
chmod +x ./foo
chmod -x ./foo
#设置rwxrwxrwx (111111111 -> 777)
chmod 777 ./foo
chown userName ./foo // 修改文件所属用户
chown g.u ./foo // 同时修改foo的分组位g，用户为u
```

## 网络指令

```
cat etc/hosts // 本地配置的 ip 映射
// 远程操作
ssh user@ip // ssh（Secure Shell）,远程登录到目标计算机并进行远程操作
scp localFilePath user@ip:remotePath // 拷贝一个文件到远程
// 查看本地网络状态
ifconfig // 本地ip以及本地有哪些网络接口
netstat // 本机的网络使用情况
netstat -t tcp // 查看 TCP 连接
netstat -ntlp | grep port // 查看端口占用，-n是将一些特殊的端口号用数字显示，-t是指看 TCP 协议，-l是只显示连接中的连接，-p是显示程序名称。
// 网络测试
ping ip // 本机到某个网站的网络延迟，使用 ICMP 协议，DNS Lookup
telnet www.lagou.com 443 // 本机到某个 IP + 端口的网络是否通畅
host www.lagou.com // DNS 查询工具
host -t AAAA www.lagou.com // DNS 查询工具 IPv6
dig www.lagou.com // DNS 查询，更详细些
nslookup domain // 用于查询DNS的记录
// HTTP 相关
curl // 可以发起请求，支持很多种协议，比如 LDAP、SMTP、FTP、HTTP
```

PS：ttl 叫作 time to live，一个封包从发出就开始倒计时，如果途中超过多少 ms，这个包就会被丢弃。

## 软件的安装

编译安装和包管理器安装

### 包管理器，就要提到 dpkg 和 rpm

dpkg（debian package），是 linux 一个主流的社区分支开发出来的。
rpm（redhatpackage manager），RedHat。
有的时候一个包会依赖很多其他的包，而 dpkg 和 rpm 不会对这种情况进行管理，所以有自动依赖管理。

### 自动依赖管理

yum 的全名是 Yellodog Updator，Modified。
yum 的主要能力就是帮你解决下载和依赖两个问题。
apt 全名是 Advanced Packaging Tools，是一个 debian 及其衍生 Linux 系统下的包管理器。

```
sudo apt install vim
sudo apt remove vim
sudo apt purge vim // 彻底删除配置文件
apt serach mysql // 查找mysql的包
apt list musql-server // 精确查找一个叫作mysql-server的包
tar // 解压，t代表tape（磁带）；ar是 archive（档案）
```

QPS 是吞吐量大，需要快速响应，高并发时则需要合理安排任务调度。

## 日志分析

是否能在当前机器上查看日志，htop 指令看一下当前的负载，否则建议你用 scp 指令将文件拷贝到闲置服务器再分析。

```
ls -l access.log --block-size=M
less access.log // 查看
wc -l access.log // pv
awk '{print $4}' access.log | less // 查看第四列的信息
awk '{print substr($4, 2, 11)}' access.log | less
```

## Linux 指令管理一个集群

// 集群中安装一个 Java 环境

```
foreach.sh
// 循环遍历 IP 列表(iplist)
#!/usr/bin/bash
readarray -t ips < iplist
for ip in ${ips[@]}
do
  scp ~/remote/create_lagou.sh user@ip:~/create_lagou.sh // 批量创建用户
  sh ./transfer_key.sh $ip // 批量设置主服务器公钥
done
// 创建集群管理账户(为每个机器都创建一个lagou管理员用户)
create_lagou.sh
#!/usr/bin/bash
sudo useradd -m -d /home/lagou lagou // 创建这个账户 lagou
sudo passwd lagou // 改密码
sudo usermod -G sudo lagou // 将 lagou 添加至 sudo 分组
sudo usermod --shell /bin/bash lagou // 设置 lagou 用户默认bash
sudo cp ~/.bashrc /home/lagou/ // 将bashrc拷贝到/home/lagou/下，包含了bash相关配置
sudo chown lagou.lagou /home/lagou/.bashrc // 更改bashrc文件的所属用户和所属分组
sduo sh -c 'echo "lagou ALL=(ALL)  NOPASSWD:ALL">>/etc/sudoers' // lagou账号 sudo 时可以免去密码输入环节
// 打通集群权限(主服务器的公钥在各个服务器间登录，避免输入密码)
tranfer_key.sh
ip=$1
pubkey=$(cat ~/.ssh/id_rsa.pub)
echo "execute on .. $ip"
ssh lagou@$ip " 
mkdir -p ~/.ssh
echo $pubkey >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
// 安装 Java 环境
install_java.sh
sudo apt -y install openjdk-11-jdk
sudo useradd -m -d /opt/ujava ujava
sudo usermod --shell /bin/bash ujava
sudo sh -c 'echo "export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64/" >> /opt/ujava/.bash_profile'
```

sshpass // 帮你把密码传递给要远程执行的指令

# 操作系统

## 内核

内核至少应该提供以下 4 种基本能力：
管理进程、线程（决定哪个进程、线程使用 CPU）；
管理内存（决定内存用来做什么）；
连接硬件设备（为进程、和设备间提供通信能力）；
提供系统调用（接收进程发送来的系统调用）。

## 用户态线程和内核态线程

内核空间（Kernal Space），这个空间只有内核程序可以访问；
用户空间（User Space），这部分内存专门给应用程序使用。
用户空间中的代码被限制了只能使用一个局部的内存空间，我们说这些程序在用户态（User Mode） 执行。内核空间中的代码可以访问所有内存，我们称这些程序在内核态（Kernal Mode） 执行。

## 中断和中断向量

### 中断

主板知道有新的按键后，通知 CPU，CPU 要中断当前执行的程序，将 PC 指针跳转到一个固定的位置，我们称为一次中断（interrupt）。

### 中断向量

我们需要把不同的中断类型进行分类，这个类型叫作中断识别码。比如按键，我们可以考虑用编号 16，数字 16 就是按键中断类型的识别码。不同类型的中断发生时，CPU 需要知道 PC 指针该跳转到哪个地址，这个地址，称为中断向量（Interupt Vector）。

### Java/Js 等语言为什么可以捕获到键盘输入？

为了捕获到键盘输入，硬件层面需要把按键抽象成中断，中断 CPU 执行。CPU 根据中断类型找到对应的中断向量。操作系统预置了中断向量，因此发生中断后操作系统接管了程序。操作系统实现了基本解析按键的算法，将按键抽象成键盘事件，并且提供了队列存储多个按键，还提供了监听按键的 API。因此应用程序，比如 Java/Node.js 虚拟机，就可以通过调用操作系统的 API 使用键盘事件。

# 进程和线程

进程（Process），顾名思义就是正在执行的应用程序，是软件的执行副本。
进程（Process），需要分配计算资源（CPU）、内存资源和文件资源。
线程（Thread），只被分配了计算资源（CPU），因此被称为轻量级进程。

## 分时和调度

因为通常机器中 CPU 核心数量少（从几个到几十个）、进程&线程数量很多（从几十到几百甚至更多），因此进程们在操作系统中只能排着队一个个执行。

## 进程和线程的状态

一个进程（线程）运行的过程，会经历以下 3 个状态：
进程（线程）创建后，就开始排队，此时它会处在“就绪”（Ready）状态；
当轮到该进程（线程）执行时，会变成“运行”（Running）状态；
当一个进程（线程）将操作系统分配的时间片段用完后，会回到“就绪”（Ready）状态。

## 进程（线程）切换

进程（线程）在操作系统中是不断切换的，现代操作系统中只有线程的切换。 每次切换需要先保存当前寄存器的值的内存，注意 PC 指针也是一种寄存器。当恢复执行的时候，就需要从内存中读出所有的寄存器，恢复之前的状态，然后执行。

# 锁、信号量

## 原子操作

原子操作就是操作不可分。在多线程环境，一个原子操作的执行过程无法被中断。

## 竞争条件

竞争条件就是说多个线程对一个资源（内存地址）的读写存在竞争，在这种条件下，最后这个资源的值不可预测，而是取决于竞争时具体的执行顺序。

### 解决竞争条件

解决竞争条件有很多方案，一种方案就是不要让程序同时进入临界区，这个方案叫作互斥。还有一些方案旨在避免竞争条件，比如 ThreadLocal、 cas 指令以及乐观锁。

### cas 指令

利用 CPU 的指令，让其成为一个原子操作。 很多 CPU 都提供 Compare And Swap 指令。这个指令的作用是更新一个内存地址的值。

```
// &oldValue 代表其内存地址
cas(&oldValue, expectedValue, targetValue)
```

### tas 指令

tas 指令，有的 CPU 没有提供 cas（大部分服务器是提供的），提供一种 Test-And-Set 指令（tas）。

### 锁

锁（lock），目标是实现抢占（preempt）。就是只让给定数量的线程进入临界区。
悲观锁/乐观锁

### 悲观锁（PressimisticLock）

常见案例：MySQL 的表锁、行锁、Java 的锁
它是以一种预防的姿态在修改数据之前把数据锁住，然后再对数据进行读写，在它释放锁之前任何人都不能对其数据进行操作，直到解锁后，其他人又进行同样的操作。

### 乐观锁（Optimistic Lock）

常见案例：Git
乐观锁是对于数据冲突保持一种乐观态度，操作数据时不会对操作的数据进行加锁（这使得多个任务可以并行的对数据进行操作），只有到数据提交的时候才通过一种机制来验证数据是否存在冲突(一般实现方式是通过加版本号然后进行版本号的对比方式实现)。

# 进程的调度方法

## 先到先服务（First Come First Service，FCFS）

需要用到一个叫作队列的数据结构，具有先入先出（First In First Out，FIFO）性质。先进入队列的作业，先处理，因此从公平性来说，这个算法非常朴素。另外，一个作业完全完成才会进入下一个作业，作业之间不会发生切换，从吞吐量上说，是最优的——因为没有额外开销。

## 短作业优先（Shortest Job First，SJF）

平均等待时间 = 总等待时间/任务数
平均等待时间和用户满意度是成反比的，等待时间越长，用户越不满意，因此在大多数情况下，应该优先处理用时少的，从而降低平均等待时长。

## 优先级队列（PriorityQueue）

优先级队列的一种实现方法就是用到了堆（Heap）这种数据结构，堆（Heap）可以帮助你在 O(1) 的时间复杂度内查找到最大优先级的元素。
等待时间（W） 和预估执行时间（P） 中，找一个数学关系来描述。比如：优先级 = W/P。

## 抢占（Preemption）

抢占就是把执行能力分时，分成时间片段。 让每个任务都执行一个时间片段。如果在时间片段内，任务完成，那么就调度下一个任务。如果任务没有执行完成，则中断任务，让任务重新排队，调度下一个任务。

## 多级队列模型

高优先级队列可以考虑用非抢占（每个任务执行完才执行下一个）+ 优先级队列实现，这样紧急任务优先级有个区分。如果遇到十万火急的情况，就可以优先处理这个任务。
低优先级队列可以考虑抢占 + 优先级队列的方式实现，这样每次执行一个时间片段就可以判断一下高优先级的队列中是否有任务。

## 线程调度都有哪些方法？

非抢占的先到先服务的模型是最朴素的，公平性和吞吐量可以保证。但是因为希望减少用户的平均等待时间，操作系统往往需要实现抢占。操作系统实现抢占，仍然希望有优先级，希望有最短任务优先。

但是这里有个困难，操作系统无法预判每个任务的预估执行时间，就需要使用分级队列。最高优先级的任务可以考虑非抢占的优先级队列。 其他任务放到分级队列模型中执行，从最高优先级时间片段最小向最低优先级时间片段最大逐渐沉淀。这样就同时保证了小任务先行和高优任务最先执行。
