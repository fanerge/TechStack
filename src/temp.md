
wget // 指定的URL下载文件
make // GNU的工程化编译工具，用于编译众多相互关联的源代码文件，以实现工程化的管理，提高开发效率。


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









