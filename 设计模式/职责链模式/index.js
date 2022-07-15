/**
 * 职责链模式：使多个对象都有机会处理请求，避免请求者和接收者之间的耦合关系，
 * 将这些对象连成一条链，沿着这条链传递请求，直到有一个对象处理它为止；
 * 
 * 优点：
 *    弱化发送者和一组接收者之间的强联系；请求发送者只需要知道链中的第一个节点，节点可拆分重组；
 *    可以手动指定起始节点，并非从第一个节点开始传递，可以跳过某一个节点；
 * 缺点：
 *    不能保证某个请求一定可以被链中的某个节点处理，所以需要在链尾增加一个保底的节点来处理这种即将离开链尾的请求；
 * */


// 示例：订单优惠券分发
const order500 = (orderType, pay, stock) => {
  if (pay && orderType === 1) {
    console.log('500元定金预购，得到100元优惠券')
  } else {
    return 'nextSuccessor'; // 不知道下一个节点是谁，往后传递就完事；
  }
}

const order200 = (orderType, pay, stock) => {
  if (pay && orderType === 2) {
    console.log('200元定金预购，得到50元优惠券')
  } else {
    return 'nextSuccessor'; // 不知道下一个节点是谁，往后传递就完事；
  }
}

const orderNormal = (orderType, pay, stock) => {
  if (stock > 0) {
    console.log('普通购买，无任何优惠券~')
  } else {
    console.log('手机库存不足~')
  }
}

// 定义构造函数将函数包装进职责链节点；
const Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function (successor) {
  return this.successor = successor;
}

Chain.prototype.passRequest = function () {
  let ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
}

// 手动传递请求到下一个节点，处理异步类型的节点函数
Chain.prototype.next = function () {
  return this.successor && this.successor.passRequest.apply(this.successor, arguments);
}

// 将3个订单函数包装成责任链的节点
const chainOrder500 = new Chain(order500);
const chainOrder200 = new Chain(order200);
const chainOrderNormal = new Chain(orderNormal);

// 指定节点的顺序
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);


// test 职责链模式
chainOrder500.passRequest(1, true, 500); // 500元定金预购，得到100元优惠券
chainOrder500.passRequest(2, true, 500); // 200元定金预购，得到50元优惠券
chainOrder500.passRequest(3, true, 500); // 普通购买，无任何优惠券~
chainOrder500.passRequest(1, false, 0); // 手机库存不足~


// 异步职责链模式
const fn1 = new Chain(function () {
  console.log('fn1 result');
  return 'nextSuccessor';
});
const fn2 = new Chain(function () {
  console.log('fn2 result');
  var that = this;
  setTimeout(function () {
    console.log('执行完异步的操作，再去执行下一个节点~')
    that.next();
  }, 1000);
});
const fn3 = new Chain(function () {
  console.log('fn3 result');
});
// 节点绑定挂载
fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
// 测试异步职责链
fn1.passRequest();