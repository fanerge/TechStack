栈（对象）、堆（类）、数据段（类的static）、代码段（类的函数）
#   变量&&常量
##  变量
值传递：将变量保存的值赋值一份，然后将新的值给另外一个变量保存（两个变量没有关系）<br/>
引用传递：将变量保存的值所在的内存地址，传递给另外一个变量：两个变量指向同一块内存空间（两个变量是同一个值）
```
$变量名 = 变量值;

// 值传递
$a = 10;
$b = $a; 
$b = 5;
// $a = 10;$b = 5;新开辟内存

// 引用传递
$c = 10;
$d = &$c; // 共用内存
$c = 5; // $c = 5;$d = 5;

// 使用变量
echo $a;

// 删除变量，释放空间
unset($a);
```
##  常量
```
// 定义
define('PI', 3.14);
const PII = 3;

// 使用
echo PI;
```
##  可变变量
```
$a = ‘b’;
$b = ‘bb’;
// 过程
$$a = $b = 'bb';
```
##  系统常量
```
PHP_VERSION：PHP版本号
PHP_INT_SIZE：整形大小
PHP_INT_MAX：整形能表示的最大值（PHP中整形是允许出现负数：带符号）
__DIR__：当前被执行的脚本所在电脑的绝对路径
__FILE__：当前被执行的脚本所在的电脑的绝对路径（带自己文件的名字）
__LINE__：当前所属的行数
__NAMESPACE__：当前所属的命名空间
__CLASS__：当前所属的类
__METHOD__：当前所属的方法
__FUNCTION__:当前函数式名
```
##  预定义变量
```
$_GET：获取所有表单以get方式提交的数据
$_POST：POST提交的数据都会保存在此
$_REQUEST：GET和POST提交的都会保存
$GLOBALS：PHP中所有的全局变量
$_SERVER：服务器信息
$_SESSION：session会话数据
$_COOKIE：cookie会话数据
$_ENV：环境信息
$_FILES：用户上传的文件信息
```
##  namespace
### 创建命名空间
```
// 唯一可放namespace之前的语句
declare(encoding='UTF-8');
// 一级namespace（{}为非必须）
namespace Person;
namespace Person\Man;（有个Course类）
```
### 引用命名空间
```
namespace Person\Man;
// 调用namespace下的Person\Man中的Course类
$cour = new \Person\Man\Course();
```
### 使用use(类名)
```
use \Person\Man\Course;
use \Person\Man\Course as [别名];
$cour = new Course();
```
#   数据类型
```
在PHP中将数据分为三大类八小类：

简单（基本）数据类型：4个小类
整型：int/integer，系统分配4个字节存储，表示整数类型
浮点型：float/double，系统分配8个字节存储，表示小数或者整型存不下的整数
字符串型：string，系统根据实际长度分配，表示字符串（引号）
布尔类型：bool/boolean，表示布尔类型，只有两个值：true和false

复合数据类型：2个小类
对象类型：object，存放对象（面向对象）
数组类型：array，存储多个数据（一次性）

特殊数据类型：2个小类
资源类型：resource，存放资源数据（PHP外部数据，如数据库、文件）
```
##  强制转换
```
$b = '1.2';
(int)$b; // 1
```
##  类型判断
```
is_int();
is_string();
gettype();
settype('变量名', value); // 设置
empty()：判断数据的值是否为“空”，不是NULL，如果为空返回true，不为空返回false
isset()：判断数据存储的变量本身是否存在，存在变量返回true，不存在返回false
htmlspecialchars($str)：防XSS
addslashes()：防SQL注入
```
#   运算符
##  链接运算符
```
$a = 'hello';
$b = 'world';
$c = $a . $b; // 'hello world'
```
##  错误抑制符
```
$a = 10;
$b = 0;
$c = $a / $b; // 报错，停止执行
$c = @($a / $b); // 不报错，忽略，继续执行
```
##  位运算
注意：
1、	系统进行任何位运算的时候都是使用的补码
2、	运算结束之后都必须转换成原码才是最终要显示的数据
##  循环结构（循环控制）
```
continue 层级; // 中断控制，重新开始循环
break 层级; // 终止控制，该层循环直接结束
```
#   文件
##  文件包含
```
Include：包含文件
Include_once：系统会自动判断文件包含过程中，是否已经包含过（一个文件最多被包含一次）
Require：与include相同
Require_once：以include_once相同
// Include和require区别
Include的错误级别比较轻：不会阻止代码执行
Require要求较高：如果包含出错代码不再执行（require后面的代码
// 每个文件还可以return 数据；
$res = include_once 'function3.php';
var_dump($res); // 获得function3.php文件的返回值
```
#   函数
在PHP中所有的函数都有返回值。（如果没有明确return使用，那么系统默认返回NULL）
##  参数传递方式（只有变量才可以引用传递）
默认参数为值传递
```
function display($a, &$b) {
    // 修改形参
    $a = $a * $a;
    $b = $b * $b;
    return $a, $b;
}
$a = 10;
$b = 5;

display($a, $b);
// 访问全局变量
$a, $b; // 10, 25
```
##  作用域
作用域：变量（常量）能够被访问的区域
1、	变量可以在普通代码中定义
2、	变量也可以在函数内部定义
默认函数内不能访问全局变量，函数外不能访问函数内部变量。
### 函数内部使用全局变量
超全局变量会将全局变量自动纳入到$GLOBALS里面，而$GLOBALS没有作用域限制，所以能够帮助局部去访问全局变量：但是必须使用数组方式。
```
$global = 'global';
function display() {
    echo $GLOBALS['global']; // 访问到全局变量了
}
```
### 函数外访问函数局部变量
```
function display() {
    // 定义变量，使用全局变量
    global $global; // 使用已经存在的全局变量
    
    // 定义变量，全局不存在
    global $inner; // 相当于写了一个全局变量
    $inner = 'inner';
}
display();
echo $inner; // inner
```
##  静态变量
静态变量：static，是在函数内部定义的变量，使用static关键字修饰，用来实现跨函数共享数据的变量：函数运行结束所有局部变量都会清空，如果重新运行一下函数，所有的局部变量又会重新初始化。
```
function display(){
	//定义变量
	static $count = 1; //通常会在定义的时候就直接赋值
	return $count;
}

display(); // 1
display(); // 2
display(); // 3
```
静态变量的使用：
1、	为了统计：当前函数被调用的次数（有没有替代方法？）
2、	为了统筹函数多次调用得到的不同结果（递归思想）
##  可变函数
```
$dis = ‘display’;
function display(){
    // 
}
$dis(); // 执行了display函数
```
##  闭包（Closure）
函数内部有一些局部变量（要执行的代码块）在函数执行之后没有被释放，是因为在函数内部还有对应的函数在引用（函数的内部函数：匿名函数）
```
function display(){
    // 内部变量 
	$inner = '123';
	
	// use 将外部变量（局部）保留给内部使用（闭包）
	$innerFunction = function() use($inner){
	    echo $inner;
	}
	
	return $innerFunction;
}
display()(); // '123'
```
##  常用函数
```
print() // 本质为一种结构（不是函数），返回1
print_r() // 数组使用较多
function_exists()：判断指定的函数名字是否在内存中存在（帮助用户不去使用一个不存在的函数，让代码安全性更高）
func_get_arg()：在自定义函数中去获取指定数值对应的参数
func_get_args()：在自定义函数中获取所有的参数（数组）
func_num_args()：在自定义函数中获取当前函数的参数数量
```
#   错误处理
1）系统错误：
E_PARSE：编译错误，代码不会执行
E_ERROR：fatal error，致命错误，会导致代码不能正确继续执行（出错的位置断掉）
E_WARNING：warning，警告错误，不会影响代码执行，但是可能得到意想不到的结果
E_NOTICE：notice，通知错误，不会影响代码执行
2）用户错误：E_USER_ERROR, E_USER_WARNING, E_USER_NOTICE
用户在使用自定义错误触发的时候，会使用到的错误代号（系统不会用到）
3）其他：E_ALL，代表着所有从错误（通常在进行错误控制的时候使用比较多），建议在开发过程中（开发环境）使用
## 触发
自动触发和手动触发
trigger_error(错误提示, errorType); // 手动触发，但是该函数不会阻止系统报错
##  错误显示设置
### 全局配置（所有php项目都影响）
```
在php.ini
error_reporting = E_ALL;
display_errors = On;
```
### 在单个项目中去设置（权重高）
```
Error_reporting()：设置对应的错误显示级别
Ini_set(‘配置文件中的配置项’,配置值)
Ini_set(‘error_reporting’,E_ALL);
Ini_set(‘display_errors’,1);
```
##  错误日志
### 全局设置
```
log_errors = On;
error_log = 'E:/path';
```
### 自定义错误处理
```
header('Content-type:text/html;charset=utf-8'); // 处理编码问题
error_handler($errno, $errtr, $errfile, $errLine, $errcontext);
```
#   字符串（区别主要为处理转义字符和变量）
##  单引号形式
其中单引号只能够识别\'
不能识别变量
##  双引号形式
其中双引号除\'以外都可识别
能识别变量
```
$a = "hello";
$b = "{$a} world"; // hello world
```
##  nowdoc字符串
```
$str = <<<’边界符’
	字符串内容
边界符; // 必须要顶格
```
##  heredoc字符串
```
$str = <<<边界符
	字符串内容
边界符; // 必须要顶格
```
##  字符串长度问题
```
strlen()：得到字符串的长度（字节为单位）
// 扩展多字节
mbstring扩展（mb：Multi Bytes）
php.in
extension = php_mbstring.dll;
// 使用
mb_strlen('阿斯顿发s', 'utf-8'); // 5
```
##  字符串相关函数
```
Implode(连接方式,数组)：将数组中的元素按照某个规则连接成一个字符串
Explode(分割字符,目标字符串)：将字符串按照某个格式进行分割，变成数组
// 中国|北京|顺义 == array(‘中国’,‘北京’,’顺义’);
Str_split(字符串,字符长度)：按照指定长度拆分字符串得到数组
Trim(字符串[,指定字符])：本身默认是用来去除字符串两边的空格（中间不行），但是也可以指定要去除的内容，是按照指定的内容循环去除两边有的内容：直到碰到一个不是目标字符为止
ucfirst() ：首字母大写
Str_replace(匹配目标,替换的内容,字符串本身)：将目标字符串中部分字符串进行替换
Strpos(字符串，匹配字符)：判断字符在目标字符串中出现的位置（首次）
Strrpos(字符串，匹配字符)：判断字符在目标字符串中最后出现的位置
Printf/sprintf(输出字符串有占位符,顺序占位内容..)：格式化输出数据
Str_repeat()：重复某个字符串N次
Str_shuffle()：随机打乱字符串
```
#   数组
##  定义数组
```
// 方式一
$变量 = array(元素1,元素2,元素3..);
// 方式二
$变量 = [元素1,元素2…];
// 方式三
$变量[] = 值1;	//如果不提供下标也可以，系统自动生成（数字：从0开始）
$变量[下标] = 值;	//中括号里面的内容称之为下标key，该下标可以是字母（单词）或者
```
如果数组下标都为整数：索引数组<br/>
如果数组下标都为字符串：关联数组<br/>
##  数组遍历（依赖于指针）
```
// 使用foreach每次都先重置指针
foreach($数组变量 as [$下标 =>] $值){
	//通过$下标访问元素的下标；通过$值访问元素的值
}
// each
each能够从一个数组中获取当前数组指针所指向的元素的下标和值，拿到之后将数组指针下移
如果each取不到结果（数组指针移动到最后），返回false
正常返回一个数组
0下标 – 》 取得元素的下标值
1下标 - 》 取得元素的值
Key下标 – 》取得元素的下标值
Value下标 – 》取得元素的值
// list
list是一种结构，不是一种函数（没有返回值）
list提供一堆变量去从一个数组中取得元素值，然后依次存放到对应的变量当中（批量为变量赋值：值来源于数组）：list必须从索引数组中去获取数据，而且必须从0开始。
// each 和 list配合使用
$arr = array(1, 'name' => 'fanerge', 3, 'age' => 30);
while(list($key, $value) = echo($arr)){
    echo $key, $value;
}
```
##   相关方法（都是引用传递）
```
sort()：顺序排序（下标重排）
rsort()：逆序排序
asort()：顺序排序（下标保留）
arsort()：逆序排序
ksort()：顺序排序：按照键名（下标）
krsort()：逆序排序
shuffle()：随机打乱数组元素，数组下标会重排
count()：统计数组中元素的数量
array_push()：往数组中加入一个元素（数组后面）
array_pop()：从数组中取出一个元素（数组后面）
array_shift()：从数组中取出一个元素（数组前面）
array_unshift()：从数组中加入一个元素（数组前面）
```
##  数组指针函数
```
reset()：重置指针，将数组指针回到首位
end()：重置指针，将数组指针指导最后一个元素
next()：指针下移，取得下一个元素的值
prev()：指针上移，取得上一个元素的值
current()：获取当前指针对应的元素值
key()：获取当前指针对应的下标值
```
##  配合前端EventSource实时推送数据
```
header('Content-Type:text/event-stream;charset=utf-8;');
CORS等
```
#   面向对象
// 类文件命名：[类名].class.php
```
include('Animal.class.php');
// 自动加载类，实例化时自动加载
__autoload()
function __autoload($className) {
    require $className.'.class.php';
}
class Man extends Animal {
    // 类属性(默认修饰符为public)
    public $name;
    public $age;
    
    // 构造函数，在类实例化时执行
    // 可以给属性赋值，或调用父构造函数
    function __construct() {
        // 点用父构造函数
        // parent::__construct();
    }
    
    // 类方法
    public function getName() {
        return $this->name;
    }
    
    // 销毁属性、关闭数据库等
    function __destruct() {
        $this->name = null;
        mysql_close();
    }
}
```
##  类或接口修饰
```
abstract 抽象类只能被继承不能被实例化
interface 只定义方法名，方法实现有子类完成（重写）
final 该类不能不能被继承（终端）
```
##  类成员修饰符整理
```
public（全局，本身、子类、类外都可访问）
protected（保护，可以在本身和子类里使用）
private（私有，只允许该类的自己进行访问）
abstract（对类和方法的一种描述）
抽象方法: abstract function eat(); // 没有{},没有方法体
final 该方法不能被重写
static
修饰成员属性和方法，不能修饰类
用satic修饰的成员属性，被同一个所有对象共享
static数据，存储在数据段，类第一次被加载就存在了
类内调用static成员，slef::[staticName]
类外调用static成员，[类名]::[staticName]
const
定义常量
全部大写
没有$
只能通过self来访问
```
##  类中使用的命名空间
```
// parent
parent命名空间指向祖先类（找到后就不会继续往上找）
可以在子类中调用被子类重写的方法
parent::[变量]
父类名::[变量] // 等价
// self
self命名空间指向当前类
selft::[变量]
类内部中访问当前类的内容（一般用于static、const成员）
slef::[staticName]
// $this
$this表示当前实例
$this->[名称]
```
##   ::和->和=>区别
```
// ::
范围解析操作符，又名域运算符
php调用类的内部静态成员
// ->
插入式解引用操作符
它是调用由引用传递参数的子程序的方法
// =>
一般用于数组
```
##  封装函数和修饰词
对私有成员操作
```
__set($n, $v) // 对私有属性自动赋值
__get($n) // 自动获取私有属性
__isset() // 私有成员是否存在
__unset() // 自动删除私有成员（该方法要定义为privata，不能随意调用，unset()可触发）
```
##  魔术方法
```
// __call(funName, argsArray)
当实例上调用某个方法，方法不存在是将调__call方法，而不会报错
第一个参数为当前调的方法名
第二个参数为调用时传的参数数组
// __toString
读取该类对象的字符串表示
// __clone() 
克隆对象，复制一个对象，开辟两个空间
默认对象赋值为引用传递，下面发法可改变
$d1 = clone $d; // 触发类的__clone方法
// __sleep()
序列化的时候自动调用，方法中return 需要序列化的属性。
serailize() 时自动调用__sleep()
return array('name', 'age', 'sex');
// __wekeup()
反序列化的时候自动调用
unserailize() 时自动调用__wekeup()
```
##  接口
作用可以定义规范<br>
接口只能包含抽象方法，支持多接口<br>
接口和继承同时存在，先继承后接口<br>
class [类名] extends [父类名] implements [接口名]{
    
}
```
interface int1{
    const NAME = 'sdf';
    function fun1();
}
interface int2{
    const NAME = 'sdf';
    function fun2();
}

classs MyInt implements int1,int2{
    // 依次实现方法
}
```