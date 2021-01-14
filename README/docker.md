# 工作原理

Docker 是利用 Linux 的 Namespace 、Cgroups 和联合文件系统三大机制来保证实现的， 所以它的原理是使用 Namespace 做主机名、网络、PID 等资源的隔离，使用 Cgroups 对进程或者进程组做资源（例如：CPU、内存等）的限制，联合文件系统用于镜像构建和容器运行环境。

## Namespace

Namespace 是 Linux 内核的一项功能，该功能对内核资源进行隔离，使得容器中的进程都可以在单独的命名空间中运行，并且只可以访问当前容器命名空间的资源。Namespace 可以隔离进程 ID、主机名、用户 ID、文件名、网络访问和进程间通信等相关资源。

```
// Docker 主要用到以下五种命名空间
pid namespace：用于隔离进程 ID。
net namespace：隔离网络接口，在虚拟的 net namespace 内用户可以拥有自己独立的 IP、路由、端口等。
mnt namespace：文件系统挂载点隔离。
ipc namespace：信号量,消息队列和共享内存的隔离。
uts namespace：主机名和域名的隔离。
```

## Cgroups

Cgroups 是一种 Linux 内核功能，可以限制和隔离进程的资源使用情况（CPU、内存、磁盘 I/O、网络等）。在容器的实现中，Cgroups 通常用来限制容器的 CPU 和内存等资源的使用。

## 联合文件系统

联合文件系统，又叫 UnionFS，是一种通过创建文件层进程操作的文件系统，因此，联合文件系统非常轻快。Docker 使用联合文件系统为容器提供构建层，使得容器可以实现写时复制以及镜像的分层构建和存储。常用的联合文件系统有 AUFS、Overlay 和 Devicemapper 等。

# 核心概念

OCI 全称为开放容器标准（Open Container Initiative），它是一个轻量级、开放的治理结构，目前主要有两个标准文档：容器运行时标准 （runtime spec）和容器镜像标准（image spec）。

## 镜像（images）

它是一个只读的文件和文件夹组合，它包含了容器运行时所需要的所有基础文件和配置信息，是容器启动的基础。

### 镜像操作

```
// 拉取镜像，默认先从本地搜索，如果本地搜索不到busybox镜像
docker pull [Registry]/[Repository]/[Image]:[Tag]
// 查看镜像
docker images
docker image ls
docker images busybox
// “重命名”镜像，它们指向了同一个镜像文件，只是别名不同而已。
docker tag [SOURCE_IMAGE][:TAG] [TARGET_IMAGE][:TAG]
// 删除镜像
docker rmi busybox
docker image rm busybox
// 构建镜像
// 1.   使用docker commit命令从运行中的容器提交为镜像；
// 将当前运行的 busybox commit 为一个 busybox tag 为hello 的镜像
docker commit busybox busybox:hello
// 2.   使用docker build命令从 Dockerfile 构建镜像。
```

### Docker file 指令

Dockerfile 的每一行命令都会生成一个独立的镜像层，并且拥有唯一的 ID

```
Dockerfile 指令 指令简介
FROM Dockerfile 除了注释第一行必须是 FROM ，FROM 后面跟镜像名称，代表我们要基于哪个基础镜像构建我们的容器。
RUN RUN 后面跟一个具体的命令，类似于 Linux 命令行执行命令。
ADD 拷贝本机文件或者远程文件到镜像内
COPY 拷贝本机文件到镜像内
USER 指定容器启动的用户
ENTRYPOINT 容器的启动命令
CMD CMD 为 ENTRYPOINT 指令提供默认参数，也可以单独使用 CMD 指定容器启动参数
ENV 指定容器运行时的环境变量，格式为 key=value
ARG 定义外部变量，构建镜像时可以使用 build-arg = 的格式传递参数用于构建
EXPOSE 指定容器监听的端口，格式为 [port]/tcp 或者 [port]/udp
WORKDIR 为 Dockerfile 中跟在其后的所有 RUN、CMD、ENTRYPOINT、COPY 和 ADD 命令设置工作目录。
```

### 清理容器多余数据

```
// 仅仅清除没有被容器使用的镜像文件
docker image prune -af
// 清除多余的数据，包括停止的容器、多余的镜像、未被使用的volume等等
docker system prune -f
```

## 容器（container）

容器是基于镜像创建的可运行实例，并且单独存在，一个镜像可以创建出多个容器。运行容器化环境时，实际上是在容器内部创建该文件系统的读写副本。 这将添加一个容器层，该层允许修改镜像的整个副本。

### 容器的生命周期

```
// created：初建状态
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
docker create -it --name=busybox busybox // 容器处于停止状态

// running：运行状态
docker start [OPTIONS] CONTAINER [CONTAINER...]
docker start busybox

docker run -it --name=busybox busybox // create + start
docker restart [OPTIONS] CONTAINER [CONTAINER...]
docker restart busybox

// stopped：停止状态
docker stop [OPTIONS] CONTAINER [CONTAINER...]
docker stop busybox

// paused： 暂停状态
docker pause [OPTIONS] CONTAINER [CONTAINER...]
docker pause busybox
docker unpause [OPTIONS] CONTAINER [CONTAINER...]
docker unpause busybox

// deleted：删除状态
docker rm [OPTIONS] CONTAINER [CONTAINER...]
docker rm busybox
docker rm -f busybox // --force

// 进入容器
docker attach [OPTIONS] CONTAINER
docker attach busybox // 多个终端同步显示可能会发生命令阻塞
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
docker exec -it busybox sh // 各个终端是独立的

// 导出导入容器（实现容器的迁移）
// export
docker export [OPTIONS] CONTAINER
docker export busybox > busybox.tar
// import
docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]
docker import busybox.tar busybox:test
```

用来存储和分发 Docker 镜像。
[官方镜像仓库](https://hub.docker.com/)

---

# 工作原理

Docker 的底层核心原理是利用了 Linux 内核的 namespace 以及 cgroup 特性，其中 namespace 进行资源隔离，cgroup 进行资源配额。

## namespace

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

## cgroup

cgroups 是 Linux 内核提供的一种可以限制单个进程或者多个进程所使用资源的机制，可以对 cpu，内存等资源实现精细化的控制，目前越来越火的轻量级容器 Docker 就使用了 cgroups 提供的资源限制能力来完成 cpu，内存等部分的资源控制。

# Docker 架构

## Client

我们通过 docker 命令与 Docker deamon 来进行交互。<br>
docker build<br>
docker pull<br>
docker run<br>

## Docker daemon

### Images

### Containers

## Registry

远端仓库

# 常见命令

## Images/镜像

docker search [imageName] // 搜索镜像<br>
docker images // 列出本地镜像<br>
docker pull // 拉取 images 从镜像仓库中拉取或者更新指定镜像<br>
docker rmi // 删除本地一个或多少镜像<br>
docker tag [镜像 ID] // 为镜像添加一个新的标签<br>

### Dockerfile

通过编写简单的文件自创 docker 镜像<br>
Dockerfile 中每一行都产生一个新层<br>
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

## Containers/容器

docker ps // 列出所有在运行的容器信息（常用容器 id）<br>

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

docker restart [容器 ID|容器名] // 正在运行的容器，我们可以使用 docker restart 命令来重启<br>
docker start [容器 ID|容器名] // 已经停止的容器，我们可以使用命令 docker start 来启动。 <br>
docker stop [容器 ID|容器名] // 停止容器 ID 运行<br>
docker rm [容器 ID|容器名] // 删除一个或多个容器 ID<br>
docker commit // 从容器创建一个新的镜像<br>
docker port [容器 ID|容器名] // 查看容器的某个确定端口映射到宿主机的端口号<br>
docker top [容器 ID|容器名] // 查看容器内部运行的进程<br>
docker inspect [容器 ID|容器名] // 查看 Docker 的底层信息（配置和状态信息）<br>
docker logs [容器 ID|容器名] // 查看容器内的标准输出<br>

```
    -f: 让 docker logs 像使用 tail -f 一样来输出容器内部的标准输出
```

通过运行 exit 命令或者使用 CTRL+D 来退出容器<br>

## Registry

镜像仓库<br>
docker search [imageName] <br>
docker pull [imageName] <br>
docker push [imageName] <br>

## 其他

docker // 来查看到 Docker 客户端的所有命令选项<br>
docker [command] --help // 来查看指定的 Docker 命令使用方法<br>
docker cp // 用于容器与主机之间的数据拷贝<br>
docker tag [oldTag] [newTag] // oldTag 复制一个 newTag<br>
docker login<br>

Volume<br>
提供独立于容器之外的持久化存储<br>

## docker-compose

多容器 app<br>
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
