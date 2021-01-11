#   工作原理
Docker 的底层核心原理是利用了 Linux 内核的 namespace 以及 cgroup 特性，其中 namespace 进行资源隔离，cgroup 进行资源配额。
##  namespace
其中 Linux 内核中一共有 6 种 namespace。
```
Namespace	系统调用函数	隔离内容
UTS	CLONE_NEWUTS	主机与域名
IPC	CLONE_NEWIPC	信号量、消息队列和共享内存
PID	CLONE_NEWPID	进程编号
Network	CLONE_NEWNET	网络设备、网络栈、端口等
Mount	CLONE_NEWNS	挂载点(文件系统)
User	CLONE_NEWUSER	用户和用户组
```
##  cgroup
cgroups 是Linux内核提供的一种可以限制单个进程或者多个进程所使用资源的机制，可以对 cpu，内存等资源实现精细化的控制，目前越来越火的轻量级容器 Docker 就使用了 cgroups 提供的资源限制能力来完成cpu，内存等部分的资源控制。


#   Docker架构
##   Client
我们通过docker命令与Docker deamon来进行交互。<br>
docker build<br>
docker pull<br>
docker run<br>
##   Docker daemon
###  Images
###  Containers
##   Registry
远端仓库
#   常见命令
##  Images/镜像
docker search [imageName] // 搜索镜像<br>
docker images // 列出本地镜像<br>
docker pull // 拉取images 从镜像仓库中拉取或者更新指定镜像<br>
docker rmi // 删除本地一个或多少镜像<br>
docker tag [镜像ID] // 为镜像添加一个新的标签<br>
###     Dockerfile
通过编写简单的文件自创docker镜像<br>
Dockerfile中每一行都产生一个新层<br>
为什么要分层，很多层可以共享<br>
```
    FROM // base image
    RUN // 执行命令
    ADD // 添加文件
    COPY // 拷贝文件
    CMD // 执行命令
    EXPOSE // 暴露端口
    WORKDIR // 指定路径
    MAINTAINER // 维护者
    ENV // 设定环境变量
    ENTRYPOINT // 容器入口
    USER // 指定用户
    VOLUME // mount point
```
docker build // 用于使用 Dockerfile 创建镜像
##  Containers/容器
docker ps // 列出所有在运行的容器信息（常用容器id）<br> 
```
    -l:查询最后一次创建的容器。
```
docker run // 创建一个新的容器并运行一个命令<br>
```
    -t:在新容器内指定一个伪终端或终端。
    -i:允许你对容器内的标准输入 (STDIN) 进行交互。
    -d:后台模式运行容器。
    -P:将容器内部使用的网络端口映射到我们使用的主机上。
    -p:是容器内部端口绑定到指定的主机端口。
```
docker restart [容器ID|容器名] // 正在运行的容器，我们可以使用 docker restart 命令来重启<br>
docker start [容器ID|容器名] // 已经停止的容器，我们可以使用命令 docker start 来启动。 <br> 
docker stop [容器ID|容器名] // 停止容器ID运行<br>
docker rm [容器ID|容器名] // 删除一个或多个容器ID<br>
docker commit // 从容器创建一个新的镜像<br>
docker port [容器ID|容器名] // 查看容器的某个确定端口映射到宿主机的端口号<br>
docker top [容器ID|容器名] // 查看容器内部运行的进程<br>
docker inspect [容器ID|容器名] // 查看 Docker 的底层信息（配置和状态信息）<br>
docker logs [容器ID|容器名] // 查看容器内的标准输出<br>
```
    -f: 让 docker logs 像使用 tail -f 一样来输出容器内部的标准输出
```
通过运行exit命令或者使用CTRL+D来退出容器<br>
##  Registry
镜像仓库<br>
docker search [imageName] <br>
docker pull [imageName] <br>
docker push [imageName] <br>
##  其他
docker // 来查看到 Docker 客户端的所有命令选项<br>
docker [command] --help // 来查看指定的 Docker 命令使用方法<br>
docker cp // 用于容器与主机之间的数据拷贝<br>
docker tag [oldTag] [newTag] // oldTag复制一个newTag<br>
docker login<br>

Volume<br>
提供独立于容器之外的持久化存储<br>

##  docker-compose 
多容器app<br>
docker-compose.yml // 多应用配置文件
```
    version // 指定docker-compose语法版本
    build // 本地创建镜像
    command // 覆盖缺省命令
    depends_on // 链接容器
    ports // 暴露端口
    volumes // 卷
    image // pull镜像
```   
docker-compose build // 更改配置，需重新构建镜像<br>
docker-compose up // 启动服务<br>
docker-compose stop // 停止服务<br>
docker-compose rm // 删除服务中的各个容器<br>
docker-compose logs // 观察各个容器的日志<br>
docker-compose ps // 列出服务相关的容器<br>



