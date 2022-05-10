/*
  JavaScript对象都是从某个对象上克隆而来的；原型的面向对象系统参考了Io语言：Io语言中没有类的概念，每个对象都是基于另一个对象的克隆。
  既然每个对象都是基于另一个对象的克隆，那么就需要一个根对象，而其他对象就都是来源于这个根对象，在Io中根对象为Object。

  什么是原型？ prototype?
    每个JavaScript对象(null除外)在创建时会与之关联另一个对象，这个对象就是原型，每个对象都会从原型上继承属性；
    指向关系: Parent(构造函数) ---> prototype ---> Parent.prototype (实例原型)
    每个函数都有prototype属性，(只有函数才有prototype属性)，如果A对象是从B对象克隆而来的，那么B对象就是A对象的原型；
    prototype属性指向一个对象，这个对象正是调用该构造函数而创建的实例的原型；指向的是child1和child2的原型，(__proto__)
*/ 
    function Parent() {
      console.log('我是定义的构造函数~')
    }
    // new 一个构造函数的实例
    var child1 = new Parent();
    var child2 = new Parent();
    child1.name = '水煮肉片';
    child2.name = '麻婆豆腐';
    console.log(child1.name) // 水煮肉片
    console.log(child2.name) // 麻婆豆腐

    // __proto__
    // 每个JavaScript对象(除null)以外都具有一个属性，叫__proto__，这个属性指向该对象的原型；
    console.log(Parent.prototype === child1.__proto__) // true 构造函数的显示原型 === 实例对象的隐式原型

    // constructor 构造器,构造函数可以生成多个实例；每个原型都有一个constructor属性指向关联的构造函数，参考如下
    console.log(Parent === Parent.prototype.constructor)  // true

    // Es5获得对象原型
    console.log(Object.getPrototypeOf(child2) === Parent.prototype)
    // 实例与原型
    // 读取prototype上的属性，如果没读到会查找关联的原型中的属性，还查不到就会找原型的原型，一直到最顶层；参考如下
    Parent.prototype.age = 18;
    child1.age = 23;
    console.log(child1.age) // 23
    console.log(child2.age) // 18
    delete child1.age; // 删除child1上的age属性
    console.log(child1.age) // 18，在child1上面找不到这个属性，然后会从child1的原型child1.__proto__上查找，由于child1.__proto__ === Parent.prototype，
    // 之后在prototype上查找到了age属性，然后返回 age = 18;

    // 创建一个对象, 原型对象就是通过 Object 构造函数生成
    var child3 = new Object();
    child3.name = '猪儿虫';

    // 原型链,一层一层查找找到 Object.prototype时就会停止，这时候返回null,由相互关联的原型组成的链状结构就是原型链(child1------->Parent-------->Object)
    console.log(Object.prototype.__proto__) // null
    console.log(Parent.prototype.__proto__ === Object.prototype)  // true
    console.log(Object === Object.prototype.constructor)  // true
    console.log(Object.prototype.__proto__) // null
    console.log(Object.prototype.__proto__ === Parent.prototype.__proto__)  // false

    var name = '东坡肘子';
    function setName() {
        console.log('name', name)
    }
    function getName() {
        var name = '大盘鸡'
        setName();
    }
    getName(); // 大盘鸡