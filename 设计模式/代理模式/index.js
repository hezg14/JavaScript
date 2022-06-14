/**
 * 代理模式：为对象提供一个代用品或者占位符，控制它的一个访问；（客户不方便直接访问某个对象时，可以通过一个替身对象来控制对这个对象的访问）
 * JavaScript中最常用的两种代理的模式：
 * 虚拟代理：把一些开销很大的对象，延迟到真正需要它的时候再去创建。
 * 缓存代理：为一些开销大的运算结果提供暂时的存储，在下一次运算时，如果传递进来的参数和之前的一致，则直接返回前面存储的运算结果。
 * 
 * 余下的一些代理变种：
 * 保护代理：由替身对象来过滤一些操作；（JavaScript中实现保护代理比较困难，因为我们无法判断谁访问了某个对象）
 * 防火墙代理：控制网络资源的访问
 * 远程代理：为一个对象在不同的地址空间提供局部代表；
 * 保护代理：用于对象应该有不同的访问权限
 * 单一职责：一个类（包括对象和函数），应该只有一个引起他变化的的原因。面向对象设计，鼓励将行为分布到细粒度的对象中，如果一个对象承担的职责过多，就相当于将这些职责耦合到了一起，
 * 这种耦合会导致程序脆弱和低内聚，当发生变化时，设计会遭到意外的破坏。
*/

// 使用虚拟代理实现图片预加载（loading占位，获取到图片路径和相关资源之后再展示）
var myImage = (function() {
  // 创建img节点
  var imgNode = document.createElement('img');
  // img 节点的插入
  document.body.appendChild(imgNode);
  return  {
    setImgSrc: function (src) {  
      imgNode.src = src;
    }
  }
})();

// 引入代理对象，通过此代理对象，可以在图片被加载好之前显示一张占位的图片，
var proxyImage = (function() {
  var img = new Image;
  img.onload = function() {
    myImage.setImgSrc(this.src)
  }
  return {
    setImgSrc: function (src) {
      // 尚未获得图片地址时，先显示此图片
      myImage.setImgSrc('./default.jpg');
      img.src= src;
    }
  }
})();


proxyImage.setImgSrc('https://p3-passport.byteacctimg.com/img/user-avatar/e9a226fff868b828a266111f155ca7c5~300x300.image')

// 缓存代理----计算乘积
// 乘积函数
var mult = function() {
  var num = 1;
  for (var i = 0, j = arguments.length; i < j; i++) {
    num = num * arguments[i]
  }
  console.log('num', num)
  return num
}

// 缓存代理函数
var proxyMult = (function() {
  var cache = {};
  return function() {
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    // 执行mlit函数，并将计算结果和输入的数据存到cache
    return cache[args] = mult.apply(this, arguments)
  }
})();

proxyMult(1, 2, 3, 4) // num 24
proxyMult(1, 2, 3, 4) // 数据从缓存中返回（没有打印值，因为没执行mult函数）
proxyMult(4, 3, 2, 1) // num 24


// 高阶函数动态代理
var myMult = function() {
  var num = 1;
  for (var i = 0, j = arguments.length; i < j; i++) {
    num = num * arguments[i]
  }
  return num
}

// 计算求和
var plus = function () {  
  var a = 0;
  for (var i = 0, j = arguments.length; i < j; i++) {
    a = a + arguments[i];
  }
  return a
}

// 缓存代理的工厂
var createProxyFactory = function (fn) {  
  var cache = {};
  return function () {  
    var args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return cache[args] = fn.apply(this, arguments);
  }
}

let myProxyMult = createProxyFactory(myMult);
let myProxyPlus = createProxyFactory(plus);
console.log('myProxyMult', myProxyMult(2,3,4)) // myProxyMult 24
console.log('myProxyPlus', myProxyPlus(2,3,4)) // myProxyPlus 9
console.log('myProxyMult', myProxyMult(2,3,4)) // myProxyMult 24 (缓存中获得)
console.log('myProxyPlus', myProxyPlus(2,3,4)) // myProxyPlus 9  (缓存中获得)


