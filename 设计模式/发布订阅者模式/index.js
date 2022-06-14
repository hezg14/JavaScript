/**
* 发布订阅者模式；让两个对象松耦合的联系在一起，虽然不太清楚彼此的细节，但不影响彼此相互通信。
* 优点：
*     时间上的解耦，对象之间的解耦。
* 缺点：
*     弱化对象之间的联系（模块之间的联系被隐藏，导致维护和跟踪成本提升），创建订阅者占用一定的内存，无论订阅的消息最后是否发生，订阅者会一直存在于内存中
**/ 

// method one
const Event = (function(){
  let clientlist = {},
      listen,
      trigger,
      remove;
  listen = function (key, fn) {
    // 未订阅过此类消息时给该类消息创建一个缓存列表
    if (!clientlist[key]) {
        clientlist[key] = [];
    }
    // 订阅消息的缓存列表
    clientlist[key].push(fn)
  };
  // 发布消息
  trigger = function () {
    // 取出消息类型
    var k = Array.prototype.shift.call(arguments);
    // 取出消息对应的回调函数集合
    fns = clientlist[k];
    // 如果没有订阅消息则返回，
    if (!fns || fns.length === 0) {
      return false
    }
    for (var i = 0, fn; fn = fns[i++];) {
      // arguments是trigger时带的参数
      fn.apply(this, arguments);
    }
  };
  // 取消订阅事件
  remove = function (key, fn) {  
    var fns = clientlist[key];
    if (!fns) {
      // k对应的消息没有被人订阅，直接返回
      return false;
    }
    // 如果传入对应的回调函数，则表示需要取消k对应的消息的所有订阅
    if (!fn) {
      fns && (fns.length = 0);
    } else {
      // 反向遍历订阅的回调函数列表
      for (var l = fns.length - 1; l >= 0; l--) {
        var _fn = fns[l];
        if (_fn === fn) {
          // 删除订阅者的回调函数
          fns.splice(l, 1);
        }
      }
    }
  };
  // 抛出相关事件
  return {
    listen: listen,
    trigger: trigger,
    remove: remove
  }
})();

// 订阅消息
Event.listen('facet', function (price) {  
  console.log(`一碗重庆小面价格:${price}`)
}) 

// 发布消息
Event.trigger('facet', 12)


// method two
class EventEmitter {
  constructor() {
    this.cache = {};
  }
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn)
    } else {
      this.cache[name] = [fn]
    }
  }
  off (name, fn) {
    let tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex(f => f === fn || f.callback === fn)
      if (index >= 0) {
        tasks.splice(index, 1)
      }
    }
  }
  emit(name, once = false, ...args) {
    if (this.cache[name]) {
      let tasks = this.cache[name].slice();
      for (let fn  of tasks) {
        fn(...args)
      }
      if (once) {
        delete this.cache[name]
      }
    }
  }
}

// test EvenetEmitter
let eventBus = new EventEmitter();


let fn1 = function (name, price) {  
  console.log(`${name}--->${price}`) // 一条猪儿虫--->18
}

let fn2 = function (name, age) {  
  console.log(`hello, My name is ${name}, My age is ${age}`) // hello, My name is 一条猪儿虫, My age is 18
}

eventBus.on('一条猪儿虫', fn1)
eventBus.on('一条猪儿虫', fn2)
eventBus.emit('一条猪儿虫', false, '一条猪儿虫', 18)
