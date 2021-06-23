# 基础功能
从 JavaScript 角度来讲解如何学习 Dart。
##  基础数据类型、函数、基础运算符、类、异步原理和文件库引入
### Symbol 的区别
在 Dart 中，Symbol 是不透明的动态字符串名称，用于反映库中的元数据。用 Symbol 可以获得或引用类的一个镜像，概念比较复杂，但其实和 JavaScript 的用法基本上是一致的。
```
void main() {
  Map test = new Map();
  test[#t] = 'symbol test';
  print(test);
  print(test[#t]);
  print(test[Symbol('t')]); // test[#t] 和 test[Symbol('t')] 等价
  print(#t);
}
```
### Undefined 和 Null
由于 Dart 是静态脚本语言，因此在 Dart 中如果没有定义一个变量是无法通过编译的，无 Undefined
null 是弱类型 object 的子类型，并非基础数据类型。所有数据类型，如果被初始化后没有赋值的话都将会被赋值 null 类型。
```
var number;
int num2;
num num1;
double num3;
```
### Map 和 List
Map 和 List 与 JavaScript 中的 Map 和 Array 基本一致，但在 JavaScript 中不是基本数据类型，都属于引用数据类型。因此也就是分类不同，但在用法和类型上基本没有太大差异。
### 弱类型（var、object 和 dynamic）
相对 JavaScript 而言，Dart 也存在弱类型（可以使用 var、object 和 dynamic 来声明），不过在这方面为了避免弱类型导致的客户端（App）Crash 的异常，Dart 还是对弱类型加强了校验。
### 基础运算符
两种语言的基础运算符基本都一致。由于 Dart 是强数据类型，因此在 Dart 中没有 “=== ”的运算符。
Dart 中比较简洁的写法
```
t??'test' 是 t!= null ? t : 'test' 的缩写
级联操作，允许对同一对象或者同一函数进行一系列操作， testObj 对象中有三个方法
testObj.add('t')
..delete('d')
..show()
```
### 函数
在 Dart 中由于是强类型，因此在声明函数的时候可以增加一个返回类型，这点在 TypeScript 中的用法是一致的。
### 类
```
// 命名构造函数
Dart 支持一个类有多个构造函数，并且在实例化的时候可以选择不同的构造函数。
class Dog {
  String color;
  // 1
  Dog.red(){
    this.color = 'red';
  }
  // 2
  Dog.black(){
    this.color = 'black';
  }
}
void main(List<String> args) {
  Dog redDog = new Dog.red();
  print(redDog.color);

  Dog blackDog = new Dog.black();
  print(blackDog.color);
}
// 访问控制
默认情况下都是 public，如果需要设置为私有属性，则在方法或者属性前使用 “_”。
// 抽象类
抽象类和其他语言的抽象类概念一样，主要是实现一个类被用于其他子类继承，抽象类是无法实例化的。
abstract class AggressiveArms {
  attack();
  hurt()；
}
class Gun extends AggressiveArms {
  attack() {
    print("造成100点伤害");
  }
  hurt() {
    print("可以造成100点伤害");
  }
}
// 泛型类
class Array<T> {
  List _list = new List<T>();
  Array();
  void add<T>(T value) {
    this._list.add(value);
  }
  get value{
    return this._list;
  }
}
void main(List<String> args) {
  Array arr = new Array<String>();
  arr.add('aa');
  arr.add('bb');
  print(arr.value);
}
// 库与调用
http://pub.dev/ 类似 npm
pubspec.yaml 类似 package.json
import 'package:startup_namer/pages/homepage.dart';
```
##  事件循环
在 Dart 中同样是单线程执行，其次也包含了两个事件队列，一个是微任务事件队列，一个是事件队列。
```
// 微任务队列
微任务队列包含有 Dart 内部的微任务，主要是通过 scheduleMicrotask 来调度。
// 事件队列
事件队列包含外部事件，例如 I/O 、 Timer ，绘制事件等等。
// 事件循环
首先是执行 main 函数，并生产两个相应的微任务和事件任务队列；
判断是否存在微任务，有则执行，执行完成后再继续判断是否还存在微任务，无则判断是否存在事件任务；
如果没有可执行的微任务，则判断是否存在事件任务，有则执行，无则继续返回判断是否还存在微任务；
在微任务和事件任务执行过程中，同样会产生微任务和事件任务，因此需要再次判断是否需要插入微任务队列和事件任务队列。
// Dart 运行过程中是否会被事件运行卡住?
答案是会，比如在运行某个微任务，该微任务非常的耗时，会导致其他微任务和事件任务卡住，从而影响到一些实际运行
// Isolate 多线程
Dart 的单线程叫作 isolate 线程，每个 isolate 线程之间是不共享内存的，通过消息机制通信。
import 'dart:async';
import 'dart:isolate';
Isolate isolate;
String name = 'dart';
void main() {
	// 执行新线程创建函数
 	isolateServer();
}
/// 多线程函数
void isolateServer()async{
	// 创建新的线程，并且执行回调 changName 
	final receive = ReceivePort();
	isolate = await Isolate.spawn(changName, receive.sendPort);
	// 监听线程返回信息 
	receive.listen((data){
		print("Myname is $data"); // 打印线程返回的数据
		print("Myname is $name"); // 打印全局 name 的数据
	});
}
/// 线程回调处理函数
void changName(SendPort port){
	name = 'dart isloate'; // 修改当前全局 name 属性
	port.send(name); // 将当前name发送给监听方
	print("Myname is $name in isloate"); // 打印当前线程中的 name
}
```
##  规范
```
// 注释文档生成
/// 本模块函数，加载状态类组件HomePageState
class HomePage extends StatefulWidget{
  @override
  createState() => new HomePageState();
}
/// 首页有状态组件类
/// 主要是获取当前时间，并动态展示当前时间
class HomePageState extends State<HomePage> {
  /// 获取当前时间戳
  ///
  /// [prefix]需要传入一个前缀信息
  /// 返回一个字符串类型的前缀信息：时间戳
  String getCurrentTime( String prefix ) {
  }
  /// 有状态类返回组件信息
  @override
  Widget build(BuildContext context) {
  }
}

dartdoc
// 库引入规范
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:two_you_friend/pages/home_page.dart';

import 'util.dart';
// 代码美化 pritter
dartfmt -h
// 修复当前的代码规范
dartfmt -w --fix lib/ 
https://github.com/dart-lang/dart_style/wiki/Formatting-Rules
// 工具化
在 Dart 中同样存在和 eslint 一样的工具 dartanalyzer 来保证代码质量。
该工具（ dartanalyzer ）已经集成在 Dart SDK ，你只需要在 Dart 项目根目录下新增analysis_options.yaml 文件
https://dart-lang.github.io/linter/lints/
规范模版库 pedantic 和 effective_dart
// 检查代码，提示、警告或者报错信息
dartanalyzer lib // dart analyze lib

// lib下目录建议
在 lib 下创建一个 pages 目录
在 pages 下创建一个类为 home_page.dart 文件;
在 home_page.dart 文件中创建两个类，一个是 HomePage，另一个是 HomePageState；

// main.dart
在 main 函数中引入 home_page.dart 模块，并调用 HomePage 类。
import 'package:two_you_friend/pages/home_page.dart';
```
##  Flutter 生命周期
组件 Widget:无状态组件 StatelessWidget \有状态组件 StatefulWidget
```
// 生命周期(有状态组件)
createState ，该函数为 StatefulWidget 中创建 State 的方法，当 StatefulWidget 被调用时会立即执行 createState 。
initState ，该函数为 State 初始化调用，因此可以在此期间执行 State 各变量的初始赋值，同时也可以在此期间与服务端交互，获取服务端数据后调用 setState 来设置 State。
didChangeDependencies ，该函数是在该组件依赖的 State 发生变化时，这里说的 State 为全局 State ，例如语言或者主题等，类似于前端 Redux 存储的 State 。
build ，主要是返回需要渲染的 Widget ，由于 build 会被调用多次，因此在该函数中只能做返回 Widget 相关逻辑，避免因为执行多次导致状态异常。
reassemble ，主要是提供开发阶段使用，在 debug 模式下，每次热重载都会调用该函数，因此在 debug 阶段可以在此期间增加一些 debug 代码，来检查代码问题。
didUpdateWidget ，该函数主要是在组件重新构建，比如说热重载，父组件发生 build 的情况下，子组件该方法才会被调用，其次该方法调用之后一定会再调用本组件中的 build 方法。
deactivate ，在组件被移除节点后会被调用，如果该组件被移除节点，然后未被插入到其他节点时，则会继续调用 dispose 永久移除。
dispose ，永久移除组件，并释放组件资源。

// 整个过程分为四个阶段
初始化阶段，包括两个生命周期函数 createState 和 initState；
组件创建阶段，也可以称组件出生阶段，包括 didChangeDependencies 和 build；
触发组件多次 build ，这个阶段有可能是因为 didChangeDependencies、setState 或者 didUpdateWidget 而引发的组件重新 build ，在组件运行过程中会多次被触发，这也是优化过程中需要着重需要注意的点；
最后是组件销毁阶段，deactivate 和 dispose。
```





# 其他
```
lib 目录
pages // 页面级
comps // 组件
main.dart // app 配置



// 增加依赖后安装
flutter pub upgrade
```
