/**
 * JavaScript中高阶函数可能是比模板方法模式更好的实现；
 * 模板方法模式：基于继承的设计模式-模板方法，是一种只需要使用继承就可以实现的简单模式；（严重依赖抽象类的设计模式）
 * 
 * 组成部分：
 * 一：抽象父类；
 * 二：具体实现的的子类；
 * 通常在抽象父类中封装子类的算法框架，实现一些公共方法以及封装子类所有方法的执行顺序，子类可以继承这个抽象类，并且可以选择重写父类的方法；
 * 在模板方法模式中，子类实现中相同的部分被上移到父类中，而将不同的部分留待子类来实现；很好的体现了泛化的思想；
 * 
 * JavaScript没有抽象类的缺点和解决方案；
 * 缺点：
 *    无法保证子类重写父类中的抽象的方法，万一有一个没重写就会存在异常；
 * 解决方案：
 *    1、鸭子类型模拟接口检查；（会增加一些与业务逻辑无关的代码，带来不必要的复杂性）
 *    2、让父类中的抽象类方法直接抛出一个异常；（缺点：得到信息的时间太靠后）
 * 
 * 
 * 如何隔离变化：使用hook钩子方法；在父类容易变化的地方放置钩子，钩子可以有一个默认实现，究竟要不要挂钩，由子类决定；
 * 钩子的返回结果决定了模板方法后面部分的执行步骤，这样程序就拥有了变化的可能；
 * */

// 示例：乘轻轨\公交车去搬砖；
const travel = function () {};
travel.prototype.toStation = function () {
  console.log('先到车站,')
}

// 空方法，由子类重写
travel.prototype.ticket = function () {
  throw new Error('子类必须重写父类中的ticket方法~')
}
travel.prototype.getInCar = function () {
  throw new Error('子类必须重写父类中的getInCar方法~')
}
travel.prototype.outCar = function () {
  throw new Error('子类必须重写父类中的outCar方法~')
}
// 挂载一个钩子，可以刷卡，，也可以进站的时候支付完成，不用再刷了（假定是这样的哈）
travel.prototype.outCarHook = function () {
  return true; // 默认：需要刷卡出站
}

// 模板模式的方法：该方法中封装了子类的算法框架，作为一个算法的模板，指导子类该按照什么顺序执行哪些方法
travel.prototype.init = function () {
  this.toStation();
  this.ticket();
  this.getInCar();
  // 挂载的钩子，子类可以决定执不执行outCar这个抽象类
  if (this.outCarHook()) {
    this.outCar();
  }
}

// 乘坐轻轨方法的子类
const metro = function () {}
metro.prototype = new travel(); // 继承上面的父类

// 重写父类中的一些方法
// 定义地铁站买票的具体操作
metro.prototype.ticket = function () {
  console.log('去自动购票机上买票,')
}
// 定义乘车的操作
metro.prototype.getInCar = function () {
  console.log('需要通过安检,再等待列车进站才可上车,')
}
// 下车的具体操作：可以使用钩子不执行这一步，代码如下
// metro.prototype.outCar = function () {
//   console.log('刷卡出站~')
// }

// 使用钩子不执行出站的抽象类函数,
metro.prototype.outCarHook = function () {
  return alert('不想出站了,今天睡车上~')
}

console.log('metro重写过父类方法', metro.prototype)
const rewriteMetro = new metro();

// 乘坐公交方法的子类
const transit = function () {}
transit.prototype = new travel();

// 重写父类上的一些方法，定义乘坐公交时的一些具体细则
transit.prototype.ticket = function () {
  console.log('无需买票,直接投一块钱就完事,')
}
transit.prototype.getInCar = function () {
  console.log('投完币,上车就行了,')
}
transit.prototype.outCar = function () {
  console.log('到目标站点大喊一声，到站,等师傅开门下车就完了~')
}

const rewriteTransit = new transit();

const btnMetro = document.getElementById('btnMetro');
const btnTransit = document.getElementById('btnTransit');

// test 
btnMetro.addEventListener('click', function () {
  rewriteMetro.init();
})

btnTransit.addEventListener('click', function () {
  rewriteTransit.init();
})