
wget // 指定的URL下载文件
make // GNU的工程化编译工具，用于编译众多相互关联的源代码文件，以实现工程化的管理，提高开发效率。
$env // 环境变量，全局
$path // 

##  软件的安装
编译安装和包管理器安装
### 包管理器，就要提到 dpkg 和 rpm
dpkg（debian package），是linux一个主流的社区分支开发出来的。
rpm（redhatpackage manager），RedHat。
有的时候一个包会依赖很多其他的包，而dpkg和rpm不会对这种情况进行管理，所以有自动依赖管理。
### 自动依赖管理
yum的全名是 Yellodog Updator，Modified。
yum的主要能力就是帮你解决下载和依赖两个问题。
apt全名是 Advanced Packaging Tools，是一个debian及其衍生 Linux 系统下的包管理器。
```
sudo apt install vim
sudo apt remove vim
sudo apt purge vim // 彻底删除配置文件
apt serach mysql // 查找mysql的包
apt list musql-server // 精确查找一个叫作mysql-server的包
tar // 解压，t代表tape（磁带）；ar是 archive（档案）
```
QPS 是吞吐量大，需要快速响应，高并发时则需要合理安排任务调度。


##  日志分析
是否能在当前机器上查看日志，htop指令看一下当前的负载，否则建议你用scp指令将文件拷贝到闲置服务器再分析。
```
ls -l access.log --block-size=M
less access.log // 查看
wc -l access.log // pv
awk '{print $4}' access.log | less // 查看第四列的信息
awk '{print substr($4, 2, 11)}' access.log | less 
```

##  Linux 指令管理一个集群
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

##  用户态线程和内核态线程
内核空间（Kernal Space），这个空间只有内核程序可以访问；
用户空间（User Space），这部分内存专门给应用程序使用。
用户空间中的代码被限制了只能使用一个局部的内存空间，我们说这些程序在用户态（User Mode） 执行。内核空间中的代码可以访问所有内存，我们称这些程序在内核态（Kernal Mode） 执行。

##  中断和中断向量
### 中断
主板知道有新的按键后，通知 CPU，CPU 要中断当前执行的程序，将 PC 指针跳转到一个固定的位置，我们称为一次中断（interrupt）。
### 中断向量
我们需要把不同的中断类型进行分类，这个类型叫作中断识别码。比如按键，我们可以考虑用编号 16，数字 16 就是按键中断类型的识别码。不同类型的中断发生时，CPU 需要知道 PC 指针该跳转到哪个地址，这个地址，称为中断向量（Interupt Vector）。
### Java/Js 等语言为什么可以捕获到键盘输入？
为了捕获到键盘输入，硬件层面需要把按键抽象成中断，中断 CPU 执行。CPU 根据中断类型找到对应的中断向量。操作系统预置了中断向量，因此发生中断后操作系统接管了程序。操作系统实现了基本解析按键的算法，将按键抽象成键盘事件，并且提供了队列存储多个按键，还提供了监听按键的 API。因此应用程序，比如 Java/Node.js 虚拟机，就可以通过调用操作系统的 API 使用键盘事件。
