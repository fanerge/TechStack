FROM node:10


# 创建 app 目录
WORKDIR /app

# 把 package.json，package-lock.json(npm@5+) 或 yarn.lock 复制到工作目录(相对路径)
COPY ["package.json","*.lock","./"]

# 打包 app 源码
# 特别注意：要指定工作目录中的文件名
COPY src ./src

# 使用.dockerignore文件，上面两个COPY合并成一个
# COPY . .

# 使用Yarn安装 app 依赖
# 如果你需要构建生产环境下的代码，请使用：
# --prod参数
# RUN yarn --prod --registry=https://registry.npm.taobao.org
RUN npm install

# 对外暴露端口 -p 4000:3000
EXPOSE 3000

CMD [ "node", "src/index.js" ]
