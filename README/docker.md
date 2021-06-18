docker 对于我来说，最主要的中用是开发环境的快速搭建、迁移环境的能力。
# 工作原理

Docker 是利用 Linux 的 Namespace 、Cgroups 和联合文件系统三大机制来保证实现。它的原理是使用 Namespace 做主机名、网络、PID 等资源的隔离，使用 Cgroups 对进程或者进程组做资源（例如：CPU、内存等）的限制，联合文件系统用于镜像构建和容器运行环境。

## Namespace

Namespace 是 Linux 内核的一项功能，该功能对内核资源进行隔离，使得容器中的进程都可以在单独的命名空间中运行，并且只可以访问当前容器命名空间的资源。Namespace 可以隔离进程 ID、主机名、用户 ID、文件名、网络访问和进程间通信等相关资源。
### 目前 Linux 已经有 8 种 namespace
```
Namespace 名称	作用	内核版本
Mount（mnt）	隔离挂载点	2.4.19
Process ID (pid)	隔离进程 ID	2.6.24
Network (net)	隔离网络设备，端口号等	2.6.29
Interprocess Communication (ipc)	隔离 System V IPC 和 POSIX message queues	2.6.19
UTS Namespace(uts)	隔离主机名和域名	2.6.19
User Namespace (user)	隔离用户和用户组	3.8
Control group (cgroup) Namespace	隔离 Cgroups 根目录	4.6
Time Namespace	隔离系统时间
```

### docker 目前使用了 linux 的 6 种 namespace

unshare 是 util-linux 工具包中的一个工具。
unshare 命令可以实现创建并访问不同类型的 Namespace。

#### Mount Namespace

Mount Namespace 它可以用来隔离不同的进程或进程组看到的挂载点。通俗地说，就是可以实现在不同的进程中看到不同的挂载目录。
```
// 创建一个 bash 进程并且新建一个 Mount Namespace
sudo unshare --mount --fork /bin/bash
```

#### PID Namespace

PID Namespace 的作用是用来隔离进程。在不同的 PID Namespace 中，进程可以拥有相同的 PID 号，利用 PID Namespace 可以实现每个容器的主进程为 1 号进程，而容器内的进程在主机上却拥有不同的 PID。
```
// 创建一个 bash 进程，并且新建一个 PID Namespace
sudo unshare --pid --fork --mount-proc /bin/bash
```

#### UTS Namespace

UTS Namespace 主要是用来隔离主机名的，它允许每个 UTS Namespace 拥有一个独立的主机名。
```
// 创建一个 UTS Namespace
sudo unshare --uts --fork /bin/bash
```

#### IPC Namespace

IPC Namespace 主要是用来隔离进程间通信的。例如 PID Namespace 和 IPC Namespace 一起使用可以实现同一 IPC Namespace 内的进程彼此可以通信，不同 IPC Namespace 的进程却不能通信。
```
// 创建一个 IPC Namespace
sudo unshare --ipc --fork /bin/bash
```

#### User Namespace

User Namespace 主要是用来隔离用户和用户组的。一个比较典型的应用场景就是在主机上以非 root 用户运行的进程可以在一个单独的 User Namespace 中映射成 root 用户。
```
// 创建一个 User Namespace
unshare --user -r /bin/bash
```

#### Net Namespace

Net Namespace 是用来隔离网络设备、IP 地址和端口等信息的。Net Namespace 可以让每个进程拥有自己独立的 IP 地址，端口和网卡信息。
```
// 创建一个 Net Namespace
sudo unshare --net --fork /bin/bash
```

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

联合文件系统，又叫 UnionFS，是一种通过创建文件层进程操作的文件系统。因此，联合文件系统非常轻快。Docker 使用联合文件系统为容器提供构建层，使得容器可以实现写时复制以及镜像的分层构建和存储。常用的联合文件系统有 AUFS、Overlay 和 Devicemapper 等。
它可以把多个目录内容联合挂载到同一目录下，从而形成一个单一的文件系统，这种特性可以让使用者像是使用一个目录一样使用联合文件系统。

### AUFS 模式

#### 如何配置 Docker 的 AUFS 模式

AUFS 是联合文件系统，意味着它在主机上使用多层目录存储，每一个目录在 AUFS 中都叫作分支，而在 Docker 中则称之为层（layer），但最终呈现给用户的则是一个普通单层的文件系统，我们把多层以单一层的方式呈现出来的过程叫作联合挂载。

```
// 查看你的系统是否支持 AUFS
grep aufs /proc/filesystems
// /etc/docker 下新建 daemon.json 文件
{
  "storage-driver": "aufs"
}
// restart
sudo systemctl restart docker
docker info
```

### Devicemapper

Devicemapper 是一种映射块设备的技术框架，其提供了一种将物理块设备映射到虚拟块设备的机制。

映射设备通过映射表关联到具体的物理目标设备。事实上，映射设备不仅可以通过映射表关联到物理目标设备，也可以关联到虚拟目标设备，然后虚拟目标设备再通过映射表关联到物理目标设备。

#### 如何在 Docker 中配置 Devicemapper

Docker 的 Devicemapper 模式有两种：第一种是 loop-lvm 模式，该模式主要用来开发和测试使用；第二种是 direct-lvm 模式，该模式推荐在生产环境中使用。

```
// 配置 loop-lvm 模式
sudo systemctl stop docker
// 编辑 /etc/docker/daemon.json 文件
{
  "storage-driver": "devicemapper"
}
// 启动 Docker
sudo systemctl start docker
// 验证
docker info
Storage Driver: devicemapper

// 配置 direct-lvm 模式
// 停止已经运行的 Docker
sudo systemctl stop docker
// 编辑 /etc/docker/daemon.json
{
  "storage-driver": "devicemapper",
  "storage-opts": [
    "dm.directlvm_device=/dev/xdf", // 把 /dev/xdf 设备作为我的 Docker 存储盘
    "dm.thinp_percent=95",
    "dm.thinp_metapercent=1",
    "dm.thinp_autoextend_threshold=80",
    "dm.thinp_autoextend_percent=20",
    "dm.directlvm_device_force=false"
  ]
}
// 启动 Docker
sudo systemctl start docker
// 验证
docker info
Storage Driver: devicemapper
```

### OverlayFS 文件系统

overlay2 和 AUFS 类似，它将所有目录称之为层（layer），overlay2 的目录是镜像和容器分层的基础，而把这些层统一展现到同一的目录下的过程称为联合挂载（union mount）。overlay2 把目录的下一层叫作 lowerdir，上一层叫作 upperdir，联合挂载后的结果叫作 merged。

#### Docker 中配置 overlay2

```
// 停止已经运行的 Docker
sudo systemctl stop docker
// 备份 /var/lib/docker 目录
sudo cp -au /var/lib/docker /var/lib/docker.back
// /etc/docker 目录下创建 daemon.json 文件
{
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.size=20G",
    "overlay2.override_kernel_check=true"
  ]
}
sudo systemctl start docker
docker info
```

# 搭建开发环境
使用 docker 搭建开发环境
```
1.  书写Dockerfile文件
Dockerfile
2.  Build an image from a Dockerfile
imageName 为你构建的镜像名（可加tag），dirName为Dockerfile所在目录
docker image build -t imageName dirName
3.  镜像产出到容器（create + start || run）
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
docker start [OPTIONS] CONTAINER [CONTAINER...]
docker container run -it --name=busybox busybox // create + start
```
##  更好的方式
```
简化 Dockerfile ，在系统上安装必须的依赖如 git node 等
不要把项目代码打包到镜像，通过docker提供了挂载点，可以让容器访问我们本机的文件系统
来实现修改本地代码，docker 对应挂载文件对应代码也更新
// /Users/yuzhenfan/Desktop/coding/techStack 为项目地址
docker container run -p 8888:8888 -v /Users/yuzhenfan/Desktop/coding/techStack:/project -it --name=teach-stack teach-stack /bin/bash 
```
# 核心概念

OCI 全称为开放容器标准（Open Container Initiative），它是一个轻量级、开放的治理结构，目前主要有两个标准文档：容器运行时标准 （runtime spec）和容器镜像标准（image spec）。

![](../img/docker-workflow.png)

## 镜像（images）

它是一个只读的文件和文件夹组合，它包含了容器运行时所需要的所有基础文件和配置信息，是容器启动的基础。

![](../img/docker/docker-images.png)

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
// docker build [OPTIONS] PATH | URL | -
// docker image build 
```

### Docker file 指令
[Dockerfile书写实践](./书写规范Dockerfile.md)
作用是构建镜像。
Dockerfile 的每一行命令都会生成一个独立的镜像层，并且拥有唯一的 ID
docker build  // 使用 Dockerfile 创建镜像

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

![](../img/docker/docker-container.png)

### 容器的生命周期

```
docker ps -a // 列举容器
// created：初建状态
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
docker create -it --name=busybox busybox // 容器处于停止状态

// running：运行状态
docker start [OPTIONS] CONTAINER [CONTAINER...]
docker start busybox

docker run -it --name=busybox busybox // create + start
    -t:在新容器内指定一个伪终端或终端。
    -i:允许你对容器内的标准输入 (STDIN) 进行交互。
    -d:后台模式运行容器。
    -P:将容器内部使用的网络端口映射到我们使用的主机上。
    -p:是容器内部端口绑定到指定的主机端口。
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
docker exec -it 容器id  /bin/bash

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

docker stats 命令可以很方便地看到主机上所有容器的 CPU、内存、网络 IO、磁盘 IO、PID 等资源的使用情况。
// docker stats nginx

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

# Docker 卷与持久化数据存储

Docker 的卷，为我们的容器插上磁盘，实现容器数据的持久化。

## 持久化的原因

因为未持久化数据的容器根目录的生命周期与容器的生命周期一样，容器文件系统的本质是在镜像层上面创建的读写层，运行中的容器对任何文件的修改都存在于该读写层，当容器被删除时，容器中的读写层也会随之消失。部分业务如 MySQL、Kafka 需要保证数据持久性。

## Docker 中的卷

它可以绕过默认的联合文件系统，直接以文件或目录的形式存在于宿主机上。卷的概念不仅解决了数据持久化的问题，还解决了容器间共享数据的问题。使用卷可以将容器内的目录或文件持久化，当容器重启后保证数据不丢失，例如我们可以使用卷将 MySQL 的目录持久化，实现容器重启数据库数据不丢失。

## Docker 卷的操作

```
// 创建一个名为 myvolume 的数据卷
docker volume create myvolume
// 启动了一个 nginx 容器，-v参数使得 Docker 自动生成一个卷并且绑定到容器的 /usr/share/nginx/html 目录中
docker run -d --name=nginx-volume -v /usr/share/nginx/html nginx
// 查看下主机上的卷
docker volume ls
// 查看某个 volumeName 数据卷的详细信息
docker volume inspect volumeName
// 使用数据卷（启动一个 nginx 容器，并将 /usr/share/nginx/html 目录与 myvolume 卷关联）
docker run -d --name=nginx --mount source=myvolume,target=/usr/share/nginx/html nginx
// 删除数据卷
docker volume rm myvolume

// 容器与容器之间数据共享（Filebeat 和 nginx 容器使用同一个目录）
docker volume create log-vol
// 启动一个生产日志的容器
docker run --mount source=log-vol,target=/tmp/log --name=log-producer -it busybox
// 启动一个消费者容器
docker run -it --name consumer --volumes-from log-producer  busybox
// 使用volumes-from参数可以在启动新的容器时来挂载已经存在的容器的卷，volumes-from参数后面跟已经启动的容器名称

// 主机与容器之间数据共享
// Docker 卷的目录默认在 /var/lib/docker 下，当我们想把主机的其他目录映射到容器内时，就需要用到主机与容器之间数据共享的方式了
// 挂载主机的 /data 目录到容器中的 /usr/local/data
docker run -v /data:/usr/local/data -it busybox

```

## Docker 卷的实现原理

Docker 容器的文件系统不是一个真正的文件系统，而是通过联合文件系统实现的一个伪文件系统，而 Docker 卷则是直接利用主机的某个文件或者目录，它可以绕过联合文件系统，直接挂载主机上的文件或目录到容器中，这就是它的工作原理。
Docker 卷的实现原理是在主机的 /var/lib/docker/volumes 目录下，根据卷的名称创建相应的目录，然后在每个卷的目录下创建 \_data 目录，在容器启动时如果使用 --mount 参数，Docker 会把主机上的目录直接映射到容器的指定目录下，实现数据持久化。

#   容器编排

我们的业务越来越复杂时，需要多个容器相互配合，容器编排工具可以帮助我们批量地创建、调度和管理容器，帮助我们解决规模化容器的部署问题。
Docker 三种常用的编排工具：Docker Compose、Docker Swarm 和 Kubernetes。
[wordpress + mysql 开发环境搭建](./docker-compose.yml)
##  Docker Compose（单机编排工具）
Docker Compose 文件主要分为三部分： services（服务）、networks（网络） 和 volumes（数据卷）。
docker-compose.yml
### 编写 services（配置）
services（服务）：服务定义了容器启动的各项配置，就像我们执行docker run命令时传递的容器启动的参数一样，指定了容器应该如何启动，例如容器的启动参数，容器的镜像和环境变量等。

```
// build： 用于构建 Docker 镜像，类似于docker build命令，build 可以指定 Dockerfile 文件路径，然后根据 Dockerfile 命令来构建文件。
build:
  ## 构建执行的上下文目录
  context: .
  ## Dockerfile 名称
  dockerfile: Dockerfile-name
// cap_add、cap_drop： 指定容器可以使用到哪些内核能力（capabilities）。
cap_add:
  - NET_ADMIN
cap_drop:
  - SYS_ADMIN
// command： 用于覆盖容器默认的启动命令，它和 Dockerfile 中的 CMD 用法类似，也有两种使用方式：
command: sleep 3000
command: ["sleep", "3000"]
// container_name： 用于指定容器启动时容器的名称。
container_name: nginx
// depends_on： 用于指定服务间的依赖关系，这样可以先启动被依赖的服务。(例如 my-web 服务依赖 db 服务)
services:
  my-web:
    build: .
    depends_on:
      - db
  db:
    image: mysql
// devices： 挂载主机的设备到容器中。
devices:
  - "/dev/sba:/dev/sda"
// dns： 自定义容器中的 dns 配置。
dns:
  - 8.8.8.8
  - 114.114.114.114
// dns_search： 配置 dns 的搜索域。
dns_search:
  - svc.cluster.com
  - svc1.cluster.com
// entrypoint： 覆盖容器的 entrypoint 命令。
entrypoint: sleep 3000
// env_file： 指定容器的环境变量文件，启动时会把该文件中的环境变量值注入容器中。
env_file:
  - ./dbs.env
env 文件的内容格式如下：
KEY_ENV=values
// environment： 指定容器启动时的环境变量。
environment:
  - KEY_ENV=values
// image： 指定容器镜像的地址。
image: busybox:latest
// pid： 共享主机的进程命名空间，像在主机上直接启动进程一样，可以看到主机的进程信息。
pid: "host"
// ports： 暴露端口信息，使用格式为 HOST:CONTAINER，前面填写要映射到主机上的端口，后面填写对应的容器内的端口。
ports:
  - "8080:80"
// networks： 这是服务要使用的网络名称，对应顶级的 networks 中的配置。
services:
  my-service:
    networks:
     - hello-network
// volumes： 不仅可以挂载主机数据卷到容器中，也可以直接挂载主机的目录到容器中，使用方式类似于使用docker run启动容器时添加 -v 参数。
version: "3"
services:
  db:
    image: mysql:5.6
    volumes:
      - type: volume
        source: /var/lib/mysql
        target: /var/lib/mysql    
```

### 编写 Network 配置
networks（网络）：网络定义了容器的网络配置，就像我们执行docker network create命令创建网络配置一样。
```
// 例如你想声明一个自定义 bridge 网络配置，并且在服务中使用它，使用格式如下：
version: "3"
services:
  web:
    networks:
      mybridge: 
        ipv4_address: 172.16.1.11
networks:
  mybridge:
    driver: bridge
    ipam: 
      driver: default
      config:
        subnet: 172.16.1.0/24
      
```

### 编写 Volume 配置
volumes（数据卷）：数据卷定义了容器的卷配置，就像我们执行docker volume create命令创建数据卷一样。
```
// 如果你想在多个容器间共享数据卷，则需要在外部声明数据卷，然后在容器里声明使用数据卷。例如我想在两个服务间共享日志目录，则使用以下配置：
version: "3"
services:
  my-service1:
    image: service:v1
    volumes:
      - type: volume
        source: logdata
        target: /var/log/mylog
  my-service2:
    image: service:v2
    volumes:
      - type: volume
        source: logdata
        target: /var/log/mylog
volumes:
  logdata:

```

### Docker Compose 操作命令
docker-compose 的参数
```
  -f, --file FILE             指定 docker-compose 文件，默认为 docker-compose.yml
  -p, --project-name NAME     指定项目名称，默认使用当前目录名称作为项目名称
  --verbose                   输出调试信息
  --log-level LEVEL           日志级别 (DEBUG, INFO, WARNING, ERROR, CRITICAL)
  -v, --version               输出当前版本并退出
  -H, --host HOST             指定要连接的 Docker 地址
  --tls                       启用 TLS 认证
  --tlscacert CA_PATH         TLS CA 证书路径
  --tlscert CLIENT_CERT_PATH  TLS 公钥证书问价
  --tlskey TLS_KEY_PATH       TLS 私钥证书文件
  --tlsverify                 使用 TLS 校验对端
  --skip-hostname-check       不校验主机名
  --project-directory PATH    指定工作目录，默认是 Compose 文件所在路径。
```
docker-compose 支持的命令
```
build              构建服务
config             校验和查看 Compose 文件
create             创建服务
down               停止服务，并且删除相关资源
events             实时监控容器的时间信息
exec               在一个运行的容器中运行指定命令
help               获取帮助
images             列出镜像
kill               杀死容器
logs               查看容器输出
pause              暂停容器
port               打印容器端口所映射出的公共端口
ps                 列出项目中的容器列表
pull               拉取服务中的所有镜像
push               推送服务中的所有镜像
restart            重启服务
rm                 删除项目中已经停止的容器
run                在指定服务上运行一个命令
scale              设置服务运行的容器个数
start              启动服务
stop               停止服务
top                限制服务中正在运行中的进程信息
unpause            恢复暂停的容器
up                 创建并且启动服务
version            打印版本信息并退出
```
##  Docker Swarm（容器集群编排）
### Swarm 优点

分布式： Swarm 使用Raft（一种分布式一致性协议）协议来做集群间数据一致性保障，使用多个容器节点组成管理集群，从而避免单点故障。
安全： Swarm 使用 TLS 双向认证来确保节点之间通信的安全，它可以利用双向 TLS 进行节点之间的身份认证，角色授权和加密传输，并且可以自动执行证书的颁发和更换。
简单： Swarm 的操作非常简单，并且除 Docker 外基本无其他外部依赖，而且从 Docker 1.12 版本后， Swarm 直接被内置到了 Docker 中，可以说真正做到了开箱即用。

### 搭建 Swarm 集群
```
// 初始化集群
// advertise-addr 一般用于主机有多块网卡的情况，如果你的主机只有一块网卡，可以忽略此参数。
docker swarm init --advertise-addr <YOUR-IP>
// 初始化，并将当前节点设置为管理节点
docker swarm init
// 加入工作节点
docker swarm join --token SWMTKN-1-1kal5b1iozbfmnnhx3kjfd3y6yqcjjjpcftrlg69pm2g8hw5vx-8j4l0t2is9ok9jwwc3tovtxbp 192.168.31.100:2377
// 假如管理节点（一般管理节点个数为奇数）
docker swarm join-token manager
// 节点查看
docker node ls
```

### 使用 Swarm

```
// 通过 docker service 命令创建服务
docker service create --replicas 1 --name hello-world nginx
docker service ls
docker service rm hello-world
// 生产环境中，我们推荐使用 docker-compose 模板文件来部署服务

// 通过 docker stack 命令创建服务
docker stack deploy -c docker-compose.yml wordpress
```



##  Kubernetes（k8s，更好的容器集群编排方案）

### k8s 组成
Kubernetes 采用典型的主从架构，分为 Master 和 Node 两个角色。
Mater 是 Kubernetes 集群的控制节点，负责整个集群的管理和控制功能。
Node 为工作节点，负责业务容器的生命周期管理。

####    Master 节点
Master 节点负责对集群中所有容器的调度，各种资源对象的控制，以及响应集群的所有请求。Master 节点包含三个重要的组件： kube-apiserver、kube-scheduler、kube-controller-manager。
#####   kube-apiserver
kube-apiserver 主要负责提供 Kubernetes 的 API 服务，所有的组件都需要与 kube-apiserver 交互获取或者更新资源信息，它是 Kubernetes Master 中最前端组件。
#####   kube-scheduler
kube-scheduler 用于监听未被调度的 Pod，然后根据一定调度策略将 Pod 调度到合适的 Node 节点上运行。
####    kube-controller-manager
kube-controller-manager 负责维护整个集群的状态和资源的管理。例如多个副本数量的保证，Pod 的滚动更新等。每种资源的控制器都是一个独立协程。kube-controller-manager 实际上是一系列资源控制器的总称。

#### Node 节点
Node 节点主要包含两个组件 ：kubelet 和 kube-proxy。
#####   kubelet
Kubelet 是在每个工作节点运行的代理，它负责管理容器的生命周期。Kubelet 通过监听分配到自己运行的主机上的 Pod 对象，确保这些 Pod 处于运行状态，并且负责定期检查 Pod 的运行状态，将 Pod 的运行状态更新到 Pod 对象中。

#####   kube-proxy
Kube-proxy 是在每个工作节点的网络插件，它实现了 Kubernetes 的 Service 的概念。Kube-proxy 通过维护集群上的网络规则，实现集群内部可以通过负载均衡的方式访问到后端的容器。

