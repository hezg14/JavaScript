/**
 * 状态模式：
 *    将状态封装成独立的类，并将请求委托给当前的状态对象，当对象的内部状态改变时，会带来不同的行为变化；
 *    使用的对象，在不同的状态下具有截然不同的行为，这个对象看起来是从不同的类中实例化而来的，实际上这是使用了委托的效果；
 * 优点：
 *    可以使每一种状态和对应的行为之间的关系局部化，行为被封装在各自状态的内部，便于阅读管理；
 *    状态之间的切换分布在状态类内部，减少条件分支语句(if...else) 来控制状态之间的转换； 
 *    当新增一个状态时，只需要新增一个状态的类，然后再对应的构造函数内新增一个对象就行；
 *    用对象代替字符串来记录当前状态，使得状态的切换更加一目了然
 * 
 * 
 * 缺点：
 *    会定义许多的状态类，系统中也会因此增加不少对象；
 *    逻辑分散在状态类中，造成逻辑分散的问题；无法在一个地方看出整个状态机的逻辑；
 * 
 * 
 * 性能优化；
 *    管理state对象的创建销毁：
 *    1、是仅当 state 对象被需要时才创建并随后销毁，(state比较庞大时使用)
 *    2、是一开始就创建好所有的状态对象，并且始终不销毁它们, (状态频繁改变时适宜)
 *    
 * 策略模式和状态模式的相同点：
 *    它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行；
 * 
 * 策略模式和状态模式的区别：
 *    策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；
 *    在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事情发生在状态模式内部，
 * 
 * 将事物的每种状态都封装为单独的类，跟此种状态有关的所有行为都封装在这个类内部；
 * 
 */

// 示例，灯泡状态控制；
let State = function () {};
State.prototype.buttonWasPressed = function () {
  throw new Error('父类的buttonWasPressed方法必须被重写~')
}

let OffLightState = function (light) {
  this.light = light;
}

OffLightState.prototype.buttonWasPressed = function () {
  // offLightState对应的行为
  console.log('弱光~');
  // 切换状态到weakLightState
  this.light.setState(this.light.weakLightState);
}

// WeakLightState
let WeakLightState = function (light) {
  this.light = light;
}

WeakLightState.prototype.buttonWasPressed = function () {
  // weakLightState对应的行为
  console.log('强光~');
  // 切换状态到strongLightState
  this.light.setState(this.light.strongLightState);
}

// StrongLightState
let StrongLightState = function (light) {
  this.light = light;
}

StrongLightState.prototype.buttonWasPressed = function () {
  // strongLightState 对应的行为
  console.log('超强光~');
  // 切换状态到superStrongLightState
  this.light.setState(this.light.superStrongLightState);
}


// SuperStrongLightState
let SuperStrongLightState = function (light) {
  this.light = light;
}

// // 继承抽象父类
// SuperStrongLightState.prototype = new State();
// // test SuperStrongLightState没重写buttonWasPressed时就会报错
// SuperStrongLightState.prototype.func = function() {
//   console.log('测试这个时需要注释下面的SuperStrongLightState.prototype.buttonWasPressed')
// }

SuperStrongLightState.prototype.buttonWasPressed = function () {
  console.log('关灯~')
  // 切换到下一个状态offLightState
  this.light.setState(this.light.offLightState);
}


/**
 * 定义Light类（上下文Context），在Light的每个状态类里面创建一个状态对象，可以明显知道电灯有多少种状态；
 * 持有这些状态对象的引用，以便把请求委托给状态对象
 * */
let Light = function () {
  // 创建每个类的实例对象
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.superStrongLightState = new SuperStrongLightState(this);
  this.button = null;
}

// 按钮按下的事假全部通过self.currState.buttonWasPressed()将请求委托给当前对象持有的状态进行操作；
Light.prototype.init = function () {
  let button = document.createElement('button'),
    self = this;
  this.button = document.body.appendChild(button);
  this.button.innerHTML = '开关';
  // 设置当前的状态
  this.currState = this.offLightState;
  // 用户的具体动作
  this.button.onclick = function () {
    self.currState.buttonWasPressed();
  }
}

// 切换Light对象的状态
Light.prototype.setState = function (newState) {
  this.currState = newState;
}

// test
let light = new Light();
light.init();


// JavaScript版本状态机实现(面向对象&闭包)
let delegate = function (client, delegation) {
  return {
    buttonWasPressed: function () { // 将客户的操作委托给 delegation 对象
      return delegation.buttonWasPressed.apply(client, arguments);
    }
  }
};
let FSM = {
  off: {
    buttonWasPressed: function () {
      console.log('关灯');
      this.newButton.innerHTML = '下一次按我是开灯';
      this.currState = this.onState;
    }
  },
  on: {
    buttonWasPressed: function () {
      console.log('开灯');
      this.newButton.innerHTML = '下一次按我是关灯';
      this.currState = this.offState;
    }
  }
};
let newLight = function () {
  this.offState = delegate(this, FSM.off);
  this.onState = delegate(this, FSM.on);
  this.currState = this.offState; // 设置初始状态为关闭状态
  this.newButton = null;
};
newLight.prototype.init = function () {
  var newButton = document.createElement('button'),
    self = this;
  newButton.innerHTML = '已关灯';
  this.newButton = document.body.appendChild(newButton);
  this.newButton.onclick = function () {
    self.currState.buttonWasPressed();
  }
};
let testLight = new newLight();
testLight.init();