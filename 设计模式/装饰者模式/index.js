/**
 * 装饰者模式：给对象动态增加职责，在不改变对象自身的基础上，再程序运行期间给对象动态的添加职责。
 * 
 * 代理模式和装饰者模式区别联系：
 * 联系：都是为对象提供一定程度上的间接引用，
 * 区别：
 *    代理模式：直接访问本题不方便或者不符合需求时，为本体提供一个替代者；
 *    装饰者模式：为对象动态的添加行为；
 * 
 * 由于JavaScript语言的特殊性，JavaScript中给对象动态添加或者改变职责会改变对象自身，但是这更符合JavaScript的语言特色；
 * 
 * 
 * 通过保存原引用的方式可以改写某个函数，但是存在以下两个问题：（通过AOP装饰函数可改变此情况）
 * 1、必须维护中间变量，如果装饰链较长，或者装饰的函数较多，这时中间变量的数量也会变多。
 * 2、this的指向问题需要处理；
 * 缺点：
 *    返回的是一个新的函数，如果原函数上保存了一些属性，这些属性会丢失；
 *    同时这种装饰者模式也叠加了作用域，装饰链条过长时性能也会受到一定的影响；
 * 
 * */

// 示例：未改动自身的装饰者模式示例
let Supermarket = function () {};
Supermarket.prototype.sell = function () {
  console.log('卖点泡面~')
}
// 增加两个装饰类，卖香烟和酒（动态添加职责，未真正改动自身）
let addSmokeCategory = function (sup) {
  this.supermarket = sup;
}

addSmokeCategory.prototype.sell = function () {
  this.supermarket.sell();
  console.log('卖点香烟~')
}

let addAlcoholCategory = function (sup) {
  this.supermarket = sup;
}

addAlcoholCategory.prototype.sell = function () {
  this.supermarket.sell();
  console.log('再卖两瓶酒~')
}

let supermarket = new Supermarket();
supermarket = new addSmokeCategory(supermarket);
supermarket = new addAlcoholCategory(supermarket);

supermarket.sell();
// 卖点泡面~卖点香烟~再卖两瓶酒~


// JavaScript中的装饰者模式示例：
var plane = {
  fire: function () {
    console.log('发射普通子弹');
  }
}
var missileDecorator = function () {
  console.log('发射导弹');
}
var atomDecorator = function () {
  console.log('发射原子弹');
}
var fire1 = plane.fire;
plane.fire = function () {
  fire1();
  missileDecorator();
}
var fire2 = plane.fire;
plane.fire = function () {
  fire2();
  atomDecorator();
}
plane.fire();
// 分别输出： 发射普通子弹、发射导弹、发射原子弹


/**
 * 处理不修改原函数本身增加新的函数时，引发的问题；
 * Function.prototype.before 接受一个参数当作原函数，这个函数是新添加的函数，装载了新添加的功能代码；
 * Function.prototype.after 唯一before不同的地方在于让新添加的函数在原函数执行之后再执行。
 * */
Function.prototype.before = function (beforefn) {
  // 保存原函数的引用
  let _self = this;
  // 返回包含原函数和新函数的代理函数
  return function () {
    // 执行函数保证this不会被劫持，新函数接受新的参数也会被原封不动地传入原函数，新函数再原函数之前执行；
    beforefn.apply(this, arguments);
    // 执行原函数并返回原函数的执行结果，保证this不会被劫持
    return _self.apply(this, arguments);
  }
}

Function.prototype.after = function (afterfn) {
  let _self = this;
  return function () {
    let ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  }
}

// AOP实例：数据统计上报AOP分离(将两个层面的函数解耦)：
Function.prototype.after = function (afterfn) {
  let _self = this;
  return function () {
    let ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  }
}

let showLogin = function () {
  console.log('打开登录浮层~')
}

let log = function (tag) {
  console.log(`上报标签为:${this.getAttribute('tag')}`)
  // 具体的执行函数
}

showLogin = showLogin.after(log) // 打开登录层之后上报数据
document.getElementById('button').onclick = showLogin;

// AOP动态改变函数的参数:before，示例：为ajax添加token,保证了ajax的纯净，提高复用性，迁移时无需做任何修改；
let ajax = function (type, url, param) {
  // 此函数为一个纯函数，就只负责数据通信，不涉及其他的各类处理
  console.log('纯ajax函数', param)
}

let getToken = function () {
  // 纯返回token的函数
  return 'Token';
}

// 将token参数装饰到ajax函数的param对象中；
ajax = ajax.before(function (type, url, param) {
  param.token = getToken();
})

// test 测试ajax发送
ajax('get', 'http://xxxxxxx.test', {
  name: 'Jack'
});
// 查看token是否有打印出来: 纯ajax函数 {name: 'Jack', token: 'Token'}

// 插件式的表单验证
let username = document.getElementById('username'),
  password = document.getElementById('password'),
  submitBtn = document.getElementById('submitBtn');
Function.prototype.before = function (beforefn) {
  var _self = this;
  return function () {  
    if (!beforefn.apply(this, arguments)) {
      // 返回是false，直接return，不在执行之后的函数
      return
    }
    return _self.apply(this, arguments);
  }
}

// 规则校验的函数
let validata = function () {
  // 各类规则校验
  if (!username.value) {
    alert('用户名不能为空~')
    return false;
  }
  if (!password.value) {
    alert('密码不能为空~')
    return false;
  }
}

let formSubmit = function () {
  let param = {
    username: username.value,
    password: password.value
  }
  ajax('http://xxxxx.test', param)
}


formSubmit = formSubmit.before(validata);
submitBtn.onclick = function () {
  formSubmit();
}