/*
* JavaScript中不是所有类型都是对象，但是大部分数据都是对象。

  JavaScript存在一个根对象----->Object.prototype（空对象）

  我们在JavaScript中遇到的每个对象都是从Object.prototype中克隆而来的，Object.prototype是他们的原型。

  对象把请求委托给它自己的原型----->对象把请求委托给它的构造器的原型。（这需要JavaScript给对象提供的__proto__隐藏属性）

  __proto__属性默认指向它的构造器的原型对象({constructor}.prototype)，__proto__是对象和对象构造器的原型联系起来的纽带。

  原型继承的精髓：如果对象无法响应某个请求，会将它的请求委托给它构造器的原型。

  Io语言中每个对象都可以做为原型被克隆，无法响应某个请求时，会顺着它的原型链把请求传递下去，直到遇到一个可以处理该请求的对象为止。

  JavaScript的克隆与Io语言有点不一样，JavaScript中每个对象都是来自于Object.prototype对象克隆而来的，（如果是这样只能得到单一的继承关系），
  所以虽然都是由Object.prototype对象克隆而来，但是对象构造器的原型并不仅限于Object.prototype上，而是可以动态指向其他的对象，从而达到了继承的效果。

  继承总是发生在对象和对象之间。
*
*/ 

/*
* 1、原型链继承：
    原型中包含的引用类型属性将会被所有实例共享，子类在实例化的时候不能给父类构造参数传参；
*/ 
function fruits() { 
  this.colors = ['red', 'green']
}
fruits.prototype.getColor = function () {  
  return this.colors;
}
function apple() {}
apple.prototype = new fruits();
let apple1 = new apple();
apple1.colors.push('yellow');
let apple2 = new apple();
console.log('apple2.colors', apple2.colors);  // apple2.colors (3) ['red', 'green', 'yellow']


/*
  2、构造函数实现原型继承
    构造函数实现原型继承
    解决了原型链继承引用类型共享的问题以及传参问题，但是方法必须定义在构造函数内，所以导致每次创建子类实例都会继承一遍方法；
*/ 
function vergetables(name) {
  this.name = name;
  this.getName = function () {  
    return this.name;
  }
}
function potato(name) {  
  vergetables.call(this, name);
}
potato.prototype = new vergetables();
console.log('potato.name', potato.name);  // potato.name potato

/*
  3、组合继承
    原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性；
    优点: 既可以把方法定义在原型上以重用，又可以让每个实例都有自己的属性；
    缺点: 需要调用两次父类的构造函数，第一次new people的时候和第二次people.call()的时候；
*/ 
function people(name) {  
  this.name = name;
  this.likes = ['篮球', '美食', '电影']
}

people.prototype.getName = function () {  
  return this.name
}

function main(name, age) {  
  people.call(this, name)
  this.age = age;
}
main.prototype = new people();
main.prototype.constructor = main;
let oldMan = new main('Tom', 30);
oldMan.likes.push('beautiful girl');
let youngMan = new main('Jack', 18);
console.log('oldMan', oldMan);  // oldMan main {name: 'Tom', likes: Array(4), age: 30}
console.log('youngMan', youngMan);  // youngMan main {name: 'Jack', likes: Array(3), age: 18}


/*
  4、寄生式组合继承
    解决组合继承调用两次父类构造函数的问题；
    不直接调用父类构造函数给子类原型赋值，可通过创建空函数来获取父类原型的副本；
*/ 
function Meat(name) {  
  this.name = name;
  this.likes = ['牛肉', '鸡肉'];
}
Meat.prototype.getPrice = function () {  
  return this.name
}

function pork(name, price) {  
  Meat.call(this, name);
  this.price = price;
}
pork.prototype = Object.create(Meat.prototype);
pork.prototype.constructor = Meat;
let pork1 = new pork('憨憨', 29);
pork1.likes.push('鱼肉');
let pork2 = new pork('猪儿虫', 50);
console.log('pork1', pork1)  // pork1 pork {name: '憨憨', likes: Array(3), price: 29}
console.log('pork2', pork2)  // pork2 pork {name: '猪儿虫', likes: Array(2), price: 50}


/*
  5、class Es6继承
*/
class study {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
class write extends study {
  constructor(name, args) {
    super(name);
    this.args = args;
  }
}

let write1 = new write('小明', '数学');
let write2 = new write('小红', '语文');
console.log('write1', write1)  // write1 write {name: '小明', args: '数学'}
console.log('write2', write2)  // write2 write {name: '小红', args: '语文'}