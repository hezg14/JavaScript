/*
  闭包的形成主要依赖于变量的作用域和变量的生存周期；
    1、变量的作用域
    2、变量的生存周期

  闭包的定义：
    可以在内层函数中访问到外层函数的作用域；（1、嵌套函数，2、访问到外部变量的值）
  闭包存在的一些问题：
    使用闭包的时候比较容易形成循环引用，闭包的作用域链中保存着一些DOM节点，这时候可能造成了内存泄露。  （在不使用变量时赋值为null即可）；
    垃圾回收采用的引用计数的垃圾回收机制，存在循环引用时两个对象都无法被回收，但设置为null之后就切断了变量和此前引用值的连接关系，
    下次垃圾回收时就会将这些值回收然后释放对应的内存；
*/

/*
1、变量的作用域
    变量的有效范围，在函数中声明一个变量当没用var关键字时这个变量就会成为全局变量，在函数内用var声明的关键字属于局部变量，只有在函数内部才可以访问，在函数外部是无法访问的。
    在JavaScript中函数可以用来创造函数作用域，此时函数像一层半透明玻璃，函数内部可以用到外部的变量，但是函数外部无法使用函数内部的变量。
*/ 
var name = '麻婆豆腐';
var func1 = function () {
  var age = 12;
  var func2 = function () { 
    var price = 999999;
    console.log('age', age) // age 12
    console.log('name', name) // name 麻婆豆腐
  }
  func2();
  // console.log('price', price) // Uncaught ReferenceError: price is not defined
}
func1();



/*
2、变量的生存周期
    对于全局变量来说，全局变量的生存周期是永久的，除非主动销毁这个全局变量；而用var声明的局部变量来说，当退出函数时这些局部变量就会随着函数调用的结束而被销毁。
*/ 
var func3 = function () { 
  var num = 1;
  return function () { 
    num++;
    console.log('num', num)
  }
}
var f = func3(); 
/*
  f返回了一个匿名函数的引用，可以访问到func3()被调用时产生的环境，而局部变量a一直处于环境里，
  局部变量所在的环境还能被外界访问，这个局部变量就有了不被销毁的理由，从而产生了一个闭包的结构，局部变量的生命周期得到了延续。
*/ 
f() // num 2
f() // num 3
f() // num 4
f() // num 5


// 闭包的应用,点击5个button,依次打印出下标
var btnNodes = document.getElementsByTagName('button');
console.log('btnNodes', btnNodes)
// onclick事假是异步触发的。此时for循环结束i的值为5，所以总是输出5；
// for (var i = 0; i < btnNodes.length; i++) {
//   btnNodes[i].onclick = function () { 
//     console.log('i', i) // 55555
//   }
// }

// 修改方案，
/*
  1、将var关键字改为let;
    var 声明的变量存在变量提升的问题，
    let 声明的变量不存在变量提升；存在暂存死缓区域；再同一块级作用域不能重复声明变量；
    const 定义的变量保有let的各类特点，还多了一个定义之后不能被修改（即const声明的是一个常量，但是const声明的变量其内部的内容是可以修改的）；参考如下：
    const name = 'hanhan';
    name = 'zhuzhu'; // 会报错Uncaught TypeError: Assignment to constant variable.
    const obj = {name: 'xxx', age: 18};
    obj.age = 20;
    console.log(obj.age) // 20
    var 变量可以重复声明，而在同一个块级作用域，let 变量不能重新声明，const 变量不能修改
*/

// 2、使用闭包将i值封闭起来，事件函数会顺着作用域链从内到位查找变量i，
for (var i = 0; i < btnNodes.length; i++) {
  (function (i) { 
    btnNodes[i].onclick = function () { 
      console.log('i', i)
    }
   })(i)
}


