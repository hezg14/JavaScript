/**
 * 命令模式：将请求封装为对象，分离请求的发起者和执行者的耦合关系；
 * 命令模式的应用场景：需要向某些对象发送请求，但并不知道请求的接收者是谁，也不知道被请求的操作是什么。
 * 
 * 
 */

// 将执行者封装在闭包形成的环境中
var playBall = {
  transport: function () {
    console.log('运球推进~')
  },
  pass: function () {
    console.log('传球给队友~')
  },
  meet: function () {
    console.log('接住队友的球~')
  },
  shoot: function () {
    console.log('瞄准投篮~')
  }
}

var createAthlete = function (param) {
  var transport = function () {
    return param.transport(); // 执行运球的动作
  };
  var pass = function () {
    return param.pass();
  }
  var meet = function () {
    return param.meet();
  }
  var shoot = function () {
    return param.shoot();
  }
  return {
    transport: transport,
    pass: pass,
    meet: meet,
    shoot: shoot
  }
};

var setAthlete = function (param) {
  document.getElementById('transport').onclick = function () {
    param.transport();
  }
  document.getElementById('pass').onclick = function () {
    param.pass();
  }
  document.getElementById('meet').onclick = function () {
    param.meet();
  }
  document.getElementById('shoot').onclick = function () {
    param.shoot();
  }
}

// 调用函数
setAthlete(createAthlete(playBall))


// javaScript命令模式实例：存在多个按钮，每个按钮执行的方法未知，如何绑定点击事件
let btnNode1 = document.getElementById('button1');
let btnNode2 = document.getElementById('button2');
let btnNode3 = document.getElementById('button3');
let btnNode4 = document.getElementById('button4');

const btnHandle = function (button, func) {
  button.onclick = func;
}

let menuBar = {
  refresh: function () {
    console.log('刷新菜单页面的具体方法~')
  }
}

let subMenu = {
  add: function () {
    console.log('增加子菜单的具体方法~')
  },
  del: function () {
    console.log('删除子菜单的具体方法~')
  },
  alert: function () {
    alert('显示弹窗')
  }
}

// test 测试按钮的各个方法
btnHandle(button1, menuBar.refresh)
btnHandle(button2, subMenu.add)
btnHandle(button3, subMenu.del)
btnHandle(button4, subMenu.alert)

// 命令队列

// 宏命令，一组命令的集合，通过执行宏命令的方式可以一次执行一批命令。
const openDoorCommand = {
  execute: function () {
    console.log('开门~')
  }
}

const closeDoorCommand = {
  execute: function () {
    console.log('关门~')
  }
}

const cookRice = {
  execute: function () {  
    console.log('开始做饭~')
  }
}

const eatDinner = {
  execute: function () {  
    console.log('吃饭~')
  }
}

/**
 * 定义宏命令：(命令模式和组合模式的产物)
 * 将子命令添加进宏命令对象，调用宏命令对象的execute方法时，迭代这一组子命令对象，并依次执行他们的execute方法；
 * 
 * macroCommand表现得像命令，实际是一组真正命令的"代理"，但他并非真正的代理，虽然结构相似，但macroCommand只负责传递请求给叶子对象，
 * 他的目的不在于控制叶对象的访问；
 * 
 * */ 
const MacroCommand = function () {  
  return {
    commandsList: [],
    add: function (command) {  
      this.commandsList.push(command)
    },
    execute: function () {  
      for (let i = 0; command = this.commandsList[i++];) {
        command.execute();
      }
    }
  }
}

var macroCommand = MacroCommand();
macroCommand.add(openDoorCommand);
macroCommand.add(closeDoorCommand);
macroCommand.add(cookRice);
macroCommand.add(eatDinner);

macroCommand.execute();