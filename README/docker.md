# 工作原理

Docker 是利用 Linux 的 Namespace 、Cgroups 和联合文件系统三大机制来保证实现的， 所以它的原理是使用 Namespace 做主机名、网络、PID 等资源的隔离，使用 Cgroups 对进程或者进程组做资源（例如：CPU、内存等）的限制，联合文件系统用于镜像构建和容器运行环境。

## Namespace

Namespace 是 Linux 内核的一项功能，该功能对内核资源进行隔离，使得容器中的进程都可以在单独的命名空间中运行，并且只可以访问当前容器命名空间的资源。Namespace 可以隔离进程 ID、主机名、用户 ID、文件名、网络访问和进程间通信等相关资源。

### docker 目前使用了 linux 的 6 中 namespace

unshare 是 util-linux 工具包中的一个工具。
unshare 命令可以实现创建并访问不同类型的 Namespace。

#### Mount Namespace

Mount Namespace 它可以用来隔离不同的进程或进程组看到的挂载点。通俗地说，就是可以实现在不同的进程中看到不同的挂载目录。
// 创建一个 bash 进程并且新建一个 Mount Namespace
sudo unshare --mount --fork /bin/bash

#### PID Namespace

PID Namespace 的作用是用来隔离进程。在不同的 PID Namespace 中，进程可以拥有相同的 PID 号，利用 PID Namespace 可以实现每个容器的主进程为 1 号进程，而容器内的进程在主机上却拥有不同的 PID。
// 创建一个 bash 进程，并且新建一个 PID Namespace
sudo unshare --pid --fork --mount-proc /bin/bash

#### UTS Namespace

UTS Namespace 主要是用来隔离主机名的，它允许每个 UTS Namespace 拥有一个独立的主机名。
// 创建一个 UTS Namespace
sudo unshare --uts --fork /bin/bash

#### IPC Namespace

IPC Namespace 主要是用来隔离进程间通信的。例如 PID Namespace 和 IPC Namespace 一起使用可以实现同一 IPC Namespace 内的进程彼此可以通信，不同 IPC Namespace 的进程却不能通信。
// 创建一个 IPC Namespace
sudo unshare --ipc --fork /bin/bash

#### User Namespace

User Namespace 主要是用来隔离用户和用户组的。一个比较典型的应用场景就是在主机上以非 root 用户运行的进程可以在一个单独的 User Namespace 中映射成 root 用户。
// 创建一个 User Namespace
unshare --user -r /bin/bash

#### Net Namespace

Net Namespace 是用来隔离网络设备、IP 地址和端口等信息的。Net Namespace 可以让每个进程拥有自己独立的 IP 地址，端口和网卡信息。
// 创建一个 Net Namespace
sudo unshare --net --fork /bin/bash

## Cgroups

cgroups（全称：control groups）是 Linux 内核的一个功能，它可以实现限制进程或者进程组的资源（如 CPU、内存、磁盘 IO 等）。
也被称为进程容器（process containers）。

### 核心概念

cgroups 功能的实现依赖于三个核心概念：子系统、控制组、层级树。

1.  子系统（subsystem）：是一个内核的组件，一个子系统代表一类资源调度控制器。例如内存子系统可以限制内存的使用量，CPU 子系统可以限制 CPU 的使用时间。
2.  控制组（cgroup）：表示一组进程和一组带有参数的子系统的关联关系。例如，一个进程使用了 CPU 子系统来限制 CPU 的使用时间，则这个进程和 CPU 子系统的关联关系称为控制组。
3.  层级树（hierarchy）：是由一系列的控制组按照树状结构排列组成的。这种排列方式可以使得控制组拥有父子关系，子控制组默认拥有父控制组的属性，也就是子控制组会继承于父控制组。比如，系统中定义了一个控制组 c1，限制了 CPU 可以使用 1 核，然后另外一个控制组 c2 想实现既限制 CPU 使用 1 核，同时限制内存使用 2G，那么 c2 就可以直接继承 c1，无须重复定义 CPU 限制。

### Cgroups 功能

1.  资源限制： 限制资源的使用量，例如我们可以通过限制某个业务的内存上限，从而保护主机其他业务的安全运行。
2.  优先级控制：不同的组可以有不同的资源（ CPU 、磁盘 IO 等）使用优先级。
3.  审计：计算控制组的资源使用情况。
4.  控制：控制进程的挂起或恢复。

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

## 仓库（repository）

仓库（Repository）是存储和分发 Docker 镜像的地方。

### 注册服务器（Registry）和仓库（Repository）

注册服务器是存放仓库的实际服务器，而仓库则可以被理解为一个具体的项目或者目录；注册服务器可以包含很多个仓库，每个仓库又可以包含多个镜像。

### 仓库操作

[官方镜像仓库](https://hub.docker.com/)

```
// 推送镜像
docker login
docker push [repository]/[repository]
// 搭建私有仓库
// https://github.com/docker/distribution
// https://hub.docker.com/_/registry
// 私有镜像仓库 localhost:5000
docker run -d -p 5000:5000 --name registry registry:2.7
// 重命名
docker tag busybox localhost:5000/busybox
docker push localhost:5000/busybox
docker pull localhost:5000/busybox
// 持久化镜像存储（把 Docker 容器的某个目录或文件挂载到主机上，保证容器被重建后数据不丢失）
docker run -v /var/lib/registry/data:/var/lib/registry -d -p 5000:5000 --name registry registry:2.7
// 构建外部可访问的镜像仓库
docker stop registry && docker rm registry
// 使用 -v 参数把镜像数据持久化在/var/lib/registry/data目录中，同时把主机上的证书文件挂载到了容器的 /certs 目录下，同时通过 -e 参数设置 HTTPS 相关的环境变量参数，最后让仓库在主机上监听 443 端口。
$ docker run -d \
  --name registry \
  -v "/var/lib/registry/data:/var/lib/registry \
  -v "/var/lib/registry/certs:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:443 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/regisry.lagoudocker.io.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/regisry.lagoudocker.io.key \
  -p 443:443 \
  registry:2.7

// 更好私有仓库
https://goharbor.io/
```

# Dockerfile

生产实践中一定优先使用 Dockerfile 的方式构建镜像

## 使用 Dockerfile 构建镜像可以带来很多好处

易于版本化管理
过程可追溯，Dockerfile 的每一行指令代表一个镜像层
屏蔽构建环境异构，使用 Dockerfile 构建镜像无须考虑构建环境，基于相同 Dockerfile 无论在哪里运行，构建结果都一致

## Dockerfile 书写原则

1.  单一职责/由于容器的本质是进程，一个容器代表一个进程，因此不同功能的应用应该尽量拆分为不同的容器，每个容器只负责单一业务进程。
2.  提供注释信息/保持良好的代码编写习惯，晦涩难懂的代码尽量添加注释，让协作者可以一目了然地知道每一行代码的作用，并且方便扩展和使用。
3.  保持容器最小化/应该避免安装无用的软件包。
4.  合理选择基础镜像/容器的核心是应用，因此只要基础镜像能够满足应用的运行环境即可。
5.  使用 .dockerignore 文件/.dockerignore 文件允许我们在构建时，忽略一些不需要参与构建的文件，从而提升构建效率。
6.  尽量使用构建缓存/如果构建时发现要构建的镜像层的父镜像层已经存在，并且下一条命令使用了相同的指令，即可命中构建缓存。
7.  不轻易改变的指令放到 Dockerfile 前面（例如安装软件包），而可能经常发生改变的指令放在 Dockerfile 末尾（例如编译应用程序）。
8.  正确设置时区
9.  国内软件源加快镜像构建速度
10. 最小化镜像层数/在构建镜像时尽可能地减少 Dockerfile 指令行数。

```
// 正确设置时区 中国时区
// Ubuntu 和Debian 系统
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" >> /etc/timezone
// CentOS 系统
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

// .dockerignore
规则	含义
#	# 开头的表示注释，# 后面所有内容将会被忽略
/tmp	匹配当前目录下任何以 tmp 开头的文件或者文件夹
*.md	匹配以 .md 为后缀的任意文件
tem?	匹配以 tem 开头并且以任意字符结尾的文件，？代表任意一个字符
!README.md	! 表示排除忽略。
例如 .dockerignore 定义如下：

*.md
!README.md

表示除了 README.md 文件外所有以 .md 结尾的文件。

```

## Dockerfile 指令书写建议

1.  RUN/RUN 指令在构建时将会生成一个新的镜像层并且执行 RUN 指令后面的内容。
    当 RUN 指令后面跟的内容比较复杂时，建议使用反斜杠（\） 结尾并且换行；
    RUN 指令后面的内容尽量按照字母顺序排序，提高可读性。

```
FROM centos:7

RUN yum install -y automake \
                   curl \
                   python \
                   vim
```

2.  CMD 和 ENTRYPOINT
    CMD/ENTRYPOINT["command" , "param"]。这种格式是使用 Linux 的 exec 实现的， 一般称为 exec 模式，这种书写格式为 CMD/ENTRYPOINT 后面跟 json 数组，也是 Docker 推荐的使用格式。
3.  ADD 和 COPY
    ADD 和 COPY 指令功能类似，都是从外部往容器内添加文件。但是 COPY 指令只支持基本的文件和文件夹拷贝功能，ADD 则支持更多文件来源类型，比如自动提取 tar 包，并且可以支持源文件为 URL 格式。
4.  WORKDIR/为了使构建过程更加清晰明了，推荐使用 WORKDIR 来指定容器的工作路径

[Dockerfile/nginx](https://github.com/nginxinc/docker-nginx/blob/9774b522d4661effea57a1fbf64c883e699ac3ec/mainline/buster/Dockerfile)

# Docker 安全

1.  使用 Capabilities 划分权限/特殊权限可以使用 --cap-add 参数，根据使用场景适当添加相应的权限。
2.  使用安全加固组件/Linux 的 SELinux、AppArmor、GRSecurity 组件都是 Docker 官方推荐的安全加固组件。下面我对这三个组件做简单介绍。
3.  资源限制/核、内存、PID 数量

```
// 启动一个 1 核 2G 的容器，并且限制在容器内最多只能创建 1000 个 PID
docker run -it --cpus=1 -m=2048m --pids-limit=1000 busybox sh
--cpus                          限制 CPU 配额
-m, --memory                    限制内存配额
--pids-limit                    限制容器的 PID 个数
```

# 容器监控

生产环境中监控容器的运行状况十分重要，通过监控我们可以随时掌握容器的运行状态，做到线上隐患和问题早发现，早解决。

## 使用 docker stats 命令

docker stats nginx
docker stats 命令可以很方便地看到主机上所有容器的 CPU、内存、网络 IO、磁盘 IO、PID 等资源的使用情况。

## cAdvisor

cAdvisor 不仅可以采集机器上所有运行的容器信息，还提供了基础的查询界面和 HTTP 接口，更方便与外部系统结合。

```
docker pull lagoudocker/cadvisor
docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:ro \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --volume=/dev/disk/:/dev/disk:ro \
  --publish=8080:8080 \
  --detach=true \
  --name=cadvisor \
  --privileged \
  --device=/dev/kmsg \
  lagoudocker/cadvisor:v0.37.0
// cAdvisor 查看主机监控
http://localhost:8080/containers/
// cAdvisor 查看容器监控
http://localhost:8080/docker/
```

### cAdvisor 监控原理

容器的监控原理其实就是定时读取 Linux 主机上相关的文件并展示给用户。
我们知道 Docker 是基于 Namespace、Cgroups 和联合文件系统实现的。其中 Cgroups 不仅可以用于容器资源的限制，还可以提供容器的资源使用率。无论何种监控方案的实现，底层数据都来源于 Cgroups。
/sys/fs/cgroup 目录下包含了 Cgroups 的所有内容。

# Docker 的组件构成

## Docker 相关的组件

docker、dockerd、docker-init 和 docker-proxy

### docker

Docker 客户端与服务端的交互过程是：docker 组件向服务端发送请求后，服务端根据请求执行具体的动作并将结果返回给 docker，docker 解析服务端的返回结果，并将结果通过命令行标准输出展示给用户。

### dockerd

dockerd 是 Docker 服务端的后台常驻进程，用来接收客户端发送的请求，执行具体的处理任务，处理完成后将结果返回给客户端。
Docker 客户端与 dockerd 的交互方式有三种：通过 UNIX 套接字与服务端通信、通过 TCP 与服务端通信、通过文件描述符的方式与服务端通信

### docker-init

1 号进程是 init 进程，是所有进程的父进程。主机上的进程出现问题时，init 进程可以帮我们回收这些问题进程。
docker-init 作为 1 号进程，帮你管理容器内子进程，例如回收僵尸进程等。

```
docker run -it --init busybox sh
```

### docker-proxy

docker-proxy 主要是用来做端口映射的。当我们使用 docker run 命令启动容器时，如果使用了 -p 参数，docker-proxy 组件就会把容器内相应的端口映射到主机上来，底层是依赖于 iptables 实现的。

```
// 启动一个 nginx 容器并把容器的 80 端口映射到主机的 8080 端口
docker run --name=nginx -d -p 8080:80 nginx
```

## containerd 相关的组件

containerd、containerd-shim 和 ctr

### containerd

containerd 不仅负责容器生命周期的管理，而且负责以下命令。
镜像的管理，例如容器运行前从镜像仓库拉取镜像到本地
接收 dockerd 的请求，通过适当的参数调用 runc 启动容器
管理存储相关资源
管理网络相关资源

### containerd-shim

containerd-shim 的意思是垫片，类似于拧螺丝时夹在螺丝和螺母之间的垫片。containerd-shim 的主要作用是将 containerd 和真正的容器进程解耦，使用 containerd-shim 作为容器进程的父进程，从而实现重启 containerd 不影响已经启动的容器进程。

### ctr

ctr 实际上是 containerd-ctr，它是 containerd 的客户端，主要用来开发和调试，在没有 dockerd 的环境中，ctr 可以充当 docker 客户端的部分角色，直接向 containerd 守护进程发送操作容器的请求。

## 容器运行时相关的组件 runc

runc 是一个标准的 OCI 容器运行时的实现，它是一个命令行工具，可以直接用来创建和运行容器。

# 网络模型

Docker 团队把网络功能从 Docker 中剥离出来，成为独立的项目 libnetwork，它通过插件的形式为 Docker 提供网络功能。

## CNM (Container Network Model)

Docker 定义的网络模型标准称之为 CNM (Container Network Model) 。

## CNM 定义的网络标准包含三个重要元素

### 沙箱（Sandbox）

沙箱代表了一系列网络堆栈的配置，其中包含路由信息、网络接口等网络资源的管理，沙箱的实现通常是 Linux 的 Net Namespace，但也可以通过其他技术来实现，比如 FreeBSD jail 等。

### 接入点（Endpoint）

接入点将沙箱连接到网络中，代表容器的网络接口，接入点的实现通常是 Linux 的 veth 设备对。

### 网络（Network）

网络是一组可以互相通信的接入点，它将多接入点组成一个子网，并且多个接入点之间可以相互通信。

## Libnetwork 常见网络模式

### null 空网络模式

可以帮助我们构建一个没有网络接入的容器环境，以保障数据安全。
使用 Docker 创建 null 空网络模式的容器时，容器拥有自己独立的 Net Namespace，但是此时的容器并没有任何网络配置。

```
docker run --net=none -it busybox
```

### bridge 桥接模式（默认模式）

Docker 的 bridge 网络是启动容器时默认的网络模式，使用 bridge 网络可以实现容器与容器的互通，可以从一个容器直接通过容器 IP 访问到另外一个容器。同时使用 bridge 网络可以实现主机与容器的互通，我们在容器内启动的业务，可以从主机直接请求。
veth 是 Linux 中的虚拟设备接口，veth 都是成对出现的，它在容器中，通常充当一个桥梁。veth 可以用来连接虚拟网络设备，例如 veth 可以用来连通两个 Net Namespace，从而使得两个 Net Namespace 之间可以互相访问。

### host 主机网络模式

容器内的网络并不是希望永远跟主机是隔离的，有些基础业务需要创建或更新主机的网络配置，我们的程序必须以主机网络模式运行才能够修改主机网络，这时候就需要用到 Docker 的 host 主机网络模式。

```
docker run -it --net=host busybox
```

### container 网络模式

container 网络模式允许一个容器共享另一个容器的网络命名空间。当两个容器需要共享网络，但其他资源仍然需要隔离时就可以使用 container 网络模式，例如我们开发了一个 http 服务，但又想使用 nginx 的一些特性，让 nginx 代理外部的请求然后转发给自己的业务，这时我们使用 container 网络模式将自己开发的服务和 nginx 服务部署到同一个网络命名空间中。

```
// 启动一个 busybox1 容器
docker run -d --name=busybox1 busybox sleep 3600
// 使用 docker exec 命令进入到 centos 容器中查看一下网络配置
docker exec -it busybox1 sh
// 再启动一个 busybox2 容器，通过 container 网络模式连接到 busybox1 的网络
docker run -it --net=container:busybox1 --name=busybox2 busybox sh
// 此时，busybox2 共享了 busybox1 的网络
```

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
