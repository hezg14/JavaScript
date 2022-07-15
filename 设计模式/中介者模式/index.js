/**
 * 中介者模式：解除对象与对象之间的紧耦合关系，使网状的多对多关系变成相对简单的一对多关系；
 * 增加一个中介者对象之后所有的相关对象都是通过中介者来通信，不再直接互相引用，所以当一个对象发生改变时，只需要告知中介者就行；
 * 
 * 面向对象鼓励将行为分发到各个对象中，对象划分为更小的粒度有助于增强对象的可复用性，但是细粒度对象之间的联系激增，又可能反过来降低他们的复用性；
 * 优点：
 *    使对象之间解耦，以中介者和对象之间一对多的关系，替代对象之间的网状多对多关系；
 *    各个对象只需要关注自身功能的实现，对象间交互关系交给中介者对象来实现和维护；
 * 缺点：
 *    对象之间交互的复杂性转移到了中介者对象的复杂性，使中介者对象经常非常巨大(自身就是一个比较难维护的对象)；
 *    中介者还会占用一部分的内存；
 * 
 * 注：如果对象之间的复杂耦合导致调用和维护出现困难，而且这些耦合度随着项目的变化呈指数型增长，这时可以考虑使用中介者模式，
 *     反之模块对象之间有一些依赖是正常的，无需堆砌模式和过渡设计；
 * */

// 购物示例：
let goods = {
  'red|32G': 6,
  'red|16G': 2,
  'yellow|32G': 5,
  'yellow|16G': 1,
  'blue|32G': 3,
  'blue|16G': 1,
  'green|32G': 10,
  'green|16G': 5,
}

let colorSelect = document.getElementById('colorSelect'),
  memorySelect = document.getElementById('memorySelect'),
  numberInput = document.getElementById('numberInput'),
  colorInfo = document.getElementById('colorInfo'),
  numInfo = document.getElementById('numInfo'),
  memoryInfo = document.getElementById('memoryInfo'),
  nextBtn = document.getElementById('nextBtn');

const mediator = (function () {
  return {
    changed: function (obj) {
      let color = colorSelect.value,
        memory = memorySelect.value,
        number = numberInput.value,
        stock = goods[`${color}|${memory}`] || 0; // 颜色和内存对应的手机库存数量
      if (!obj) {
        return
      }
      switch (obj) {
        case colorSelect:
          colorInfo.innerHTML = color;
          break
        case memorySelect:
          memoryInfo.innerHTML = memory;
          break
        case numberInput:
          numInfo.innerHTML = number;
          break
        default:
          break
      }

      if (!color) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色~';
        return
      }
      if (!memory) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择内存大小~';
        return
      }
      // 购买数量为正整数
      let reg = /^\+?[1-9][0-9]*$/;
      if (!reg.test(number) || number > stock) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请输入正确的购买数量~';
        return
      }
      nextBtn.disabled = false;
      nextBtn.innerHTML = '放入购物车';
    }
  }
})()

// 具体的事件函数
colorSelect.onchange = function () {
  mediator.changed(this)
}
memorySelect.onchange = function () {
  mediator.changed(this)
}
numberInput.oninput = function () {
  mediator.changed(this)
}