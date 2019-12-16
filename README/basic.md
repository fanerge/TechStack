#   SSHkey
```
// 查看本地SSH key所在目录
ls -al ~/.ssh
// 生成SSH key
ssh-keygen -t rsa -C"you_email"
// 生成的.ssh文件
id_rsa（私钥）
id_rsa.pub（公钥，放远端github、gitlab等，即可免登陆）	
known_hosts
// 查看SSH key（根据个人配置）
cat /Users/xxx/.ssh/id_rsa.pub
```
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
