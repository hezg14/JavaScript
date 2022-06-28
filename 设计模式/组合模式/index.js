/**
 * 组合模式用小的对象来构建更大的对象，这些小的对象可能是由更多的子孙对象所组成的
 * 子节点是叶对象时，叶对象自身会处理这些请求，子节点是组合对象时，请求会继续向下传递；
 * 叶对象下面不会再有其他的子节点，一个叶对象就是树的这条枝叶的尽头，组合对象下面还可能会有其他的子节点；
 * 请求传递方向：从上到下，沿着树进行传递，直到树的尽头，只要请求这个组合对象，请求就会沿着树往下传递，一次到达所有的叶对象；
 * 
 * 优点：
 *    通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性；
 * 缺点：
 *    由于动态类型语言对象的多态性，无需编译器检查变量的类型，所以缺乏一些严谨性，代码算不上安全，但是能更快速和自由的开发；
 *    系统中每个对象和其他对象看起来差不多，只有系统运行起来才能看出各个对象的区别，代码理解成本变高，创建太多组合对象系统也可能负担不起；
 * 
 * 注意事项：
 * 1、组合模式不是父子关系；组合模式是一种聚合关系，组合对象把请求委托给它所包含的叶对象，它能够合作的关键在于拥有一些相同的接口；
 * 2、对一组叶对象的操作必须保持一致性；
 * 3、双向映射关系；
 * 4、用职责链模式可以提高组合模式性能；让请求顺着联调从父传到子对象，获取反过来从子往父传递，直到遇到可以处理该请求的对象为止；
 * 
 * 
 * 组合模式适用场景：
 * 1、表示对象的部分-整体层次结构，开发期间不知道这棵树到底有多少层时，使用组合模式可以便于增加，删除树节点，并且符合开闭原则；
 * 2、希望统一处理树中的所有对象，不用关注当前处理的对象是组合对象还是叶对象，无需写if...else来分别处理他们，组合对象和叶对象会做各自正确的事；
 * */

// 万能遥控器示例：（更强大的宏命令）
const MacroCommand = function () {
  return {
    commandList: [],
    add: function (command) {
      this.commandList.push(command)
    },
    execute: function () {
      for (let i = 0, command; command = this.commandList[i++];) {
        command.execute();
      }
    }
  }
}

const openDoor = {
  execute: function () {
    console.log('开门~')
  }
}

const closeDoor = {
  execute: function () {
    console.log('关门~')
  }
}

// 将开门关门用一个宏命令组合起来
const macroCommand1 = MacroCommand();
macroCommand1.add(openDoor);
macroCommand1.add(closeDoor);

const openTv = {
  execute: function () {
    console.log('打开电视~')
  }
}

const openPc = {
  execute: function () {
    console.log('打开电脑~')
  },
  add: function () {
    throw new Error('叶对象不能添加子节点~')
  }
}

const openSound = {
  execute: function () {
    console.log('打开音响~')
  }
}

const openAc = {
  execute: function () {
    console.log('打开空调')
  }
}

const openMassageChair = {
  execute: function () {
    console.log('打开按摩椅~')
  }
}

// 将开门，关门，开音响，空调组合成一个命令
var macroCommand2 = MacroCommand();
macroCommand2.add(openTv);
macroCommand2.add(openPc);
macroCommand2.add(openSound);
macroCommand2.add(openAc);

// 将所有命令组合成一个超级命令
const macroCommand = MacroCommand();
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);
macroCommand.add(openMassageChair);

// test 开门~ 关门~ 打开电视~ 打开电脑~ 打开音响~ 打开空调 打开按摩椅~
const btnHandle = document.getElementById('remoteControl');
btnHandle.addEventListener('click', function () {
  macroCommand.execute();
})

// 组合对象可以有子节点，但是叶对象下面没子节点，所以需要在叶对象上绑定相应报错提示
// openPc.add(macroCommand2) //  Uncaught Error: 叶对象不能添加子节点~


// 组合模式开发实例：扫描文件夹
const Folder = function (name) {
  this.name = name;
  this.parent = null;
  this.files = [];
}

Folder.prototype.add = function (file) {
  file.parent = this; // 设置父对象
  this.files.push(file);
}

Folder.prototype.scan = function () {
  console.log(`开始扫描文件夹${this.name}`)
  for (let i = 0, file, files = this.files; file = files[i++];) {
    file.scan();
  }
}

// 添加移除文件夹的方法
Folder.prototype.remove = function () {
  // 根节点或者游离的节点
  if (!this.parent) {
    return
  }
  for (let files = this.parent.files, j = files.length - 1; j >= 0; j--) {
    let file = files[j];
    if (file === this) {
      files.splice(j, 1)
    }
  }
}

// File 实现代码
const File = function (name) {
  this.name = name;
  this.parent = null;
}

File.prototype.add = function () {
  throw new Error('不能添加在文件下面~')
}

File.prototype.scan = function () {
  console.log(`开始扫描文件${this.name}`)
}

File.prototype.remove = function () {
  if (!this.parent) {
    return;
  }
  for (let files = this.parent.files, j = files.length - 1; j >= 0; j--) {
    let file = files[j];
    if (file === this) {
      files.splice(j, 1);
    }
  }
}

const folder = new Folder('学习资料');
const folder1 = new Folder('JavaScript');
const file1 = new Folder('底层逻辑');
folder.add(new File('认知觉醒'));
folder.add(folder1);
folder.add(file1);
folder1.remove(); // 移除某文件
folder.scan();
