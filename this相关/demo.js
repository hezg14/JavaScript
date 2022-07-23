/*
 * this总是指向一个对象，具体指向哪个对象是基于函数的执行环境动态绑定的；
 * this 指向大致分为以下4种，
 */

// 1、作为对象的方法调用,此时this指向该对象；
var obj = {
  name: 'ai',
  getName: function () {
    console.log(this === obj);
    console.log('this', this)
    console.log('obj', obj)
    console.log(this.name);
  }
}
// 调用对象的方法
obj.getName(); // 输出：true, this Object, obj Object, ai



// 2、作为普通函数调用，总是指向他的全局对象
window.AAA = '猪儿虫';
var getName = function () {
  console.log(this)
  console.log(this.AAA)
}
console.log(getName()) // windoW{xxxxxxxx}, 猪儿虫, undefined


// 3、构造器调用时，通常情况this会指向返回的对象；
// 显示返回一个对象，
var fluitClass = function () {
  this.name = '苹果';
  console.log(this)
  return {
    name: '菠萝'
  }
}
var fluitObj = new fluitClass();
console.log(fluitObj.name) // 菠萝，正常我们想输出的是苹果，说明this指向变了；

// 不显示返回任何一个数据，或者返回一个非对象类型的数据,此时this指向不会发生变化；
var vegetablesClass = function () {
  this.name = '西红柿';
  return '土豆';
}
var vegetablesObj = new vegetablesClass();
console.log(vegetablesObj.name) // 西红柿


// 4、call和apply调用时，动态的改变传入函数的this；
var foodObj = {
  name: '红油小面',
  getName: function () {
    return this.name
  }
}
var drinkObj = {
  name: '大乌苏'
}
console.log(foodObj.getName()) // 红油小面
console.log(foodObj.getName.call(drinkObj)) // 大乌苏，此时this指向了drinkObj


// this丢失问题
// 1、指向改变
var ageObj = {
  age: 18,
  getAge: function () {
    console.log(this.age)
  }
}
console.log('ageObj', ageObj.getAge()) // ageObj， 18
var getAge2 = ageObj.getAge;
console.log('getAge2', getAge2()) // getAge2， undefined（普通函数调用this指向全局window对象）

// 修订普通函数调用时this指向window的问题
document.getElementById = (function (func) {
  return function () {
    return func.apply(document, arguments)
  }
})(document.getElementById);
var getId = document.getElementById;
var demoId = getId('demoId');
console.log('demoId', demoId) // demoId <div id=​"demoId">​</div>​



// call、apply详解
/*
相同点
  作用一样，
  1、都可以改变this指向,
  2、可以借用其他对象的方法；此时需要传null来替代某个的具体对象；

区别：
  apply 接受两个参数，第一个参数指定this对象的指向，第二个参数是一个带下标的集合，可以为数组或者类数组，
  apply可以将集合中的元素作为参数传递给被调用的函数。
  javascript的参数在内部就是用一个数组来表示的，从这个层面说的话，apply要比call使用率更高，因为我们无需关心有多少参数传入函数，只管用apply全部推过去就好。

  call传入的参数数量不固定，第一个参数指定this的指向，第二个参数开始每个参数依次传入函数；
  call是包装在apply的语法糖，如果我们明确知道有几个参数，想明确的表达形参和实参之间的关系，可以用call来传递参数
*/

var funCa = function (a, b, c, d) {
  console.log([a, b, c, d]);
}
funCa.call(null, 1, 2, 3, 4)

var funcAp = function (a, b, c) {
  console.log(this === window)
}
funcAp.apply(null, [1, 2, 3])

// call源码实现 func.call(this, a...)
Function.prototype.myCall = function (context) {
  // 转为对象
  context = context ? Object(context) : window;
  // 给对象绑定this,全局指向window，函数中时指向调用它的方法
  context.fn = this;
  // 取出所有实参，
  let args = [...arguments].slice(1);
  // 调用函数
  let result = context.fn(...args);
  // 删除函数
  delete result;
  // 抛出函数返回值
  return result;
}

// test myCall
console.log('myCall', foodObj.getName.myCall(drinkObj)) // 大乌苏


// applay 源码实现  func.apply(this, [array])
Function.prototype.myApply = function (context, arr) {
  // 先转换为对象
  context = context ? Object(context) : window;
  // 绑定this
  context.fn = this;
  console.log('context', context)
  // 定义函数
  let result;
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
  }
  // 删除函数
  delete result;
  // 抛出结果
  return result;
}

// test myApply 
let ageArr = [19, 18, 14, 88, 24];
let funMin = Math.min(ageArr);
console.log('funMin', funMin) // funMin NaN, Math.min不接受数组作为参数，
// 可以写成 Math.min(...ageArr) 或者 Math.min.apply(null, ageArr)二者均能求出最小值
let myFunMin = Math.min.myApply(Math, ageArr);
console.log('myFunMin', myFunMin) // 14

// bind方法，创建一个新的函数，被调用时这个新函数的this指向第一个参数，其余参数作为新函数的参数使用，
// bind方法返回的是一个执行上下文的函数，而call和apply是直接执行函数；
// bind()实现步骤，1、指定this, 2、传入参数， 3、返回一个函数， 4、柯里化
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.myBind - what is trying to be bound is not callable')
  }
  // this指向调用者
  let self = this;
  // 截取第一个之后的参数作为新函数的参数
  let args = Array.prototype.slice.call(arguments, 1);
  // 创建一个空对象
  let obj = function () {};
  // 返回一个函数
  let func = function () {
    // 提取出新函数所需要的的参数
    let bindArgs = Array.prototype.slice.call(arguments);
    // 返回函数
    return self.apply(this instanceof obj ? this : context, args.concat(bindArgs))
  }
  // 空对象原型指向绑定对象的原型
  obj.prototype = this.prototype;
  // 空对象的实例赋值给func.prototype
  func.prototype = new obj();
  // 抛出函数
  return func();
}

// test myBind
function car(col, price) {
  return {
    name: this.name,
    col: col,
    price: price
  }
};
let name = '奔驰迈巴赫'
let modifyName = {
  name: '宾利飞驰'
}
let oldBind = car.bind(modifyName, '黑色', 10000000);
console.log('oldBind', oldBind()); // oldBind {name: '宾利飞驰', col: '黑色', price: 10000000}
let curMyBind = car.myBind(modifyName, '白色', 222222222222);
console.log('curMyBind', curMyBind) // curMyBind {name: '宾利飞驰', col: '白色', price: 222222222222}