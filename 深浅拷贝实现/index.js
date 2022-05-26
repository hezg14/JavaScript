/*
  对于原始数据来说不存在深浅拷贝一说，深浅拷贝是相对引用数据类型而言；

  浅拷贝：
    只复制一层对象，当对象的属性是引用类型时，复制的是其引用，引用值改变时这个值也会改变；
    拷贝的第一层如果是引用类型，则其拷贝的是一个指针(地址值)，所以拷贝对象改变会影响原对象

  深拷贝：
    新开辟一块内存，内容和原来的一样，更改原对象，拷贝的这个不会发生改变；
*/ 

// 浅拷贝实现
const shallowCopy = function (param) {  
  // 判断是否为对象类型的数据（拷贝只针对于引用类型的数据）
  if (typeof param !== 'object') {
    throw new Error('param is not reference type data')
  }
  // 正确的判断对象的类型
  let curObj = param instanceof Array ? [] : {};
  for (let k in param) {
    // 检测是否有特殊的自身属性 ,只复制本身的属性（非继承而来的属性）
    if (param.hasOwnProperty(k)) {
        curObj[k] = param[k];
      }
  }
  // 抛出拷贝的的值
  return curObj;
}

// test shallowCopy
let oldUserInfos = {
  name: '四喜丸子',
  price: 50,
  introduce: {
    history: 1000,
    address: '扬州'
  }
}

let curUserInfos = shallowCopy(oldUserInfos);
// 原对象的值改变
oldUserInfos.price = 66; // 原对象改变不会影响已经浅拷贝的对象
curUserInfos.name = '水煮鱼'; // 不会改变原对象
curUserInfos.introduce.history = '999'; // 第一层为引用类型，拷贝的是一个指针（地址值），此时拷贝的对象改变会影响原对象
console.log('oldUserInfos', oldUserInfos) // oldUserInfos  {name: '四喜丸子', price: 66, introduce: {…}} ---> introduce: {history: '999', address: '扬州'}
console.log('curUserInfos', curUserInfos) // curUserInfos  {name: '水煮鱼', price: 50, introduce: {…}} ---> introduce: {history: '999', address: '扬州'} 


// 可以使用以下方法实现浅拷贝 
// Object.assign(target, source) 适合对象,
let obj1 = {name: 'hanhan'}
console.log(Object.assign({age: 18}, obj1)) // {age: 18, name: 'hanhan'}

// Es6扩展运算符 ...obj，
let obj2 = {like: 'basketball'};
let obj3 = {...obj2};
obj3.like = 'eat'
console.log('obj2', obj2) // obj2 {like: 'basketball'}
console.log('obj3', obj3) // obj3 {like: 'eat'}

// slice()适合数组，来实现浅拷贝
let arr = [1,2,3]
let curArr = arr.slice();
curArr[1] = 4;
console.log('arr', arr) // arr (3) [1, 2, 3]
console.log('curArr',curArr) // curArr (3) [1, 4, 3]



// 校验的方法
const isObject = (target) => (
  typeof target === 'object' || typeof target === 'function'
) && target !== null;

// 深拷贝实现
const deepCopy = function (target, map = new WeakMap()) { 
    if (map.get(target)) {
        return target;
    }
    // 获取构造器
    let constructor = target.constructor;
    // 检测是否匹配正则，日期格式和对象 (RegExp、Error对象，JSON序列化的结果将只得到空对象)
    if (/^(RegExp|Date)$/i.test(constructor.name)) {
      return new constructor(target);
    }
    // 判断是否为符合规范的对象类型
    if (isObject(target)) {
      map.set(target, true);
      const cloneTarget = Array.isArray(target) ? [] : {};
      for (let k in target) {
        if (target.hasOwnProperty(k)) {
            cloneTarget[k] = deepCopy(target[k], map)
        }
      }
      return cloneTarget;
    } else {
      return target;
    }
}


// test deepCopy
let myInfos = {
  name: '王五',
  age: 99,
  other: {
    price: 0
  }
}

let youInfos = deepCopy(myInfos);
youInfos.name = '李四';
youInfos.other.price = 99999999999;  // 改变原对象拷贝的对象不会发生变化
console.log('myInfos', myInfos)  // myInfos {name: '王五', age: 99, other: {…}} ---> other: {price: 0}
console.log('youInfos', youInfos)  // youInfos {name: '李四', age: 99, other: {…}} ---> other: {price: 99999999999}


// JSON.parse(JSON.stringify())
let usr = {id: 1, num: 3};
let curUsr = JSON.parse(JSON.stringify(usr))
curUsr.id = 2;
console.log('usr', usr)  // usr {id: 1, num: 3}
console.log('curUsr', curUsr)  // curUsr {id: 2, num: 3}
