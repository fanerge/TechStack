#   SSHkey
```
// 查看本地SSH key所在目录
ls -al ~/.ssh
// 生成SSH key
ssh-keygen -t rsa -C "you_email"
// 生成的.ssh文件
id_rsa（私钥）
id_rsa.pub（公钥，放远端github、gitlab等，即可免登陆）	
known_hosts
// 查看SSH key（根据个人配置）
cat /Users/xxx/.ssh/id_rsa.pub
```
##  多个SSHkey配置多个账号
```
// 和之前一样，但后面选择目录时需要更改（默认时id_rsa，你可以新增为id_rsa_github）
ssh-keygen -t rsa -C "you_email"
// 在.ssh目录中新建config
touch config
// 配置config
#Default 公司(fanerge@**.com)
Host github
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_github

#Default 工作(fanerge@**.com)
Host coding
    HostName ovs.coding.net
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
```
[配置](https://blog.csdn.net/hao495430759/article/details/80673568)
[为不同git网站配置不同ssh key](https://www.cnblogs.com/purehol/p/11734017.html)
#   .npmrc文件
npm gets its config settings from the command line, environment variables, and npmrc files.
```
// 设置或获取某个配置
npm config set <key> <value>
npm config get [<key>]
npm set <key> <value>
npm get [<key>]
// 删除编辑
npm config delete <key>
npm config list [--json]
npm config edit
```
