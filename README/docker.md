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
