/*
  柯里化
*/ 

// 未使用柯里化的函数
var cost = (function() {
  var args = [];
  return function() {
      if (arguments.length === 0) {
          var money = 0;
          for (var i = 0; i < args.length; i++) {
              money += args[i]
          }
          return money;
      } else {
          [].push.apply(args, arguments);
      }
  }
})();
cost(100);
cost(200);
cost(300);
console.log('cost', cost()); // cost 600


// 柯里化用法
var curryIng = function (fn) { 
  var args = [];
  return function () { 
    if (arguments.length !== 0) {
      [].push.apply(args, arguments);
      return arguments.callee;
    } else {
      return fn.apply(this, args);
    }
  }
}

var curCost = (function () { 
  var money = 0;
  return function () {
    for (var i = 0; i < arguments.length; i++) {
      money += arguments[i];
    }
    return money;
  }
})();
var curCost = curryIng(curCost);

curCost(100);
curCost(200);
curCost(300);
console.log('curCost', curCost()); // curCost 600

// JavaScript中我们调用某个对象的方法时，不用去关心该对象是否拥有这个方法，这是动态语言的特点（借用其他对象的方法）；
// 示例：类数组对象借用数组的push方法
(function () {
  Array.prototype.push.call( arguments, 4 );
  console.log('类数组借用push方法返回的值~', arguments) // 类数组借用push方法返回的值~ Arguments(4) [1, 2, 3, 4, callee: ƒ, Symbol(Symbol.iterator): ƒ]
})(1,2,3);

// 提取泛化this的过程 uncurrying,实现方式
Function.prototype.uncurrying = function () { 
  // 此时self为.uncurrying之前的那个函数，如下面的Array.prototype.push方法
  var self = this;
  return function () {
    // 实现形式一
    // 截去arguments对象的第一个元素，
    var obj = Array.prototype.shift.call(arguments);
    // 相当于Array.prototype.push.apply(obj, 4);
    return self.apply(obj, arguments);
    // 实现形式二
    // return Function.prototype.call.apply(self, arguments);
  }
}

// 通过uncurrying方法，将Array.prototype.push.call变成一个通用的push函数。（myPush作用和原来的push保持一致，但是不仅仅只作用于array对象）
var myPush = Array.prototype.push.uncurrying();
(function () { 
  myPush(arguments, 4);
  console.log('myPush', arguments) // myPush Arguments(4) [1, 2, 3, 4, callee: ƒ, Symbol(Symbol.iterator): ƒ]
})(1,2,3);

