let arr = [
  {
    name: '水煮肉片',
    price: 20,
    history: '200'

  }, {
    name: '麻婆豆腐',
    price: 15,
    history: '1000'
  }, {
    name: '四喜丸子',
    price: 30,
    history: '1200'
  }
]


// map实现
// 1、原数组被映射成新的数组
// 2、过滤处理不能用map
// 3、map()中每个元素都要执行相应的回调函数，所以必须要有return;
Array.prototype.myMap = function(callback, args) {
  if (this === null) {
      throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== 'function') {
      throw new TypeError(`${callback} is not function`)
  }
  const obj = Object(this);
  // >>> 表示无符号右移0位，保证转换后的数为正整数
  const len = obj.length >>> 0;
  let k = 0, res = [];
  while (k < len) {
      if (k in obj) {
          res[k] = callback.call(args, obj[k], k, obj);
      }
      k++;
  }
  return res
}
// test myMap，取出history小于200的
let foodValue = [];
arr.map((item, index) => {
  if (item.history === '200') {
    item.name = '黄焖鸡'
    foodValue.push(item);
  }
})
console.log('foodValue', foodValue) // foodValue:  {name: '黄焖鸡', price: 20, history: '200year'}


/*
* forEach没有返回值，map可以return返回值
* forEach可以改变数组自身，中途不能return常规操作跳出循环，可以使用try/catch，不支持链式操作
*/ 

// forEach 实现
Array.prototype.myForEach = function (callback, args) {
  // 判断是否存在this
  if (this === null) {
      throw new TypeError('this is null or not defined');
  }
  // callback必须是一个方法
  if (typeof callback !== 'function') {
      throw new TypeError(`${callback} is not a function`)
  }
  // this 为当前的数组
  const obj = Object(this)
  // >>> 表示无符号右移0位，保证转换后的数为正整数
  const len = obj.length >>> 0
  let k = 0;
  while (k < len) {
      if (k in obj) {
          callback.call(args, obj[k], k, obj)
      }
      k++;
  }
}

// test myForEach, history都加添加year
let newArr = arr.myForEach((item, index) => {
  item.history = `${item.history}year`;
})
console.log('newArr', newArr) // newArr undefined (forEach没有返回值)
console.log('forEach___arr', arr) /*
0: {name: '水煮肉片', price: 20, history: '200year'}
1: {name: '麻婆豆腐', price: 15, history: '1000year'}
2: {name: '四喜丸子', price: 30, history: '1200year'}
*/ 


/*
* filter，过滤数组中的必要项
*
*/ 
Array.prototype.myFilter = function (callback, args) {
  if (this == null) {
      throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function')
  }
  const obj = Object(this)
  const len = obj.length >>> 0
  let k = 0, res = [];
  while (k < len) {
      if (k in obj) {
          callback.call(args, obj[k], k, obj);
          if (callback.call(args, obj[k], k, obj)) {
              res.push(obj[k])
          }
      }
      k++;
  }
  return res
}

// test myFilter，筛选出价格高于20的菜，
let targetFood = arr.myFilter(e => e.price > 20);
console.log('targetFood', targetFood) // targetFood {name: '四喜丸子', price: 30, history: '1200'}


/*
* some实现，
*
*
*/
Array.prototype.mySome = function (callback, args) {
  if (this == null) {
      throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function')
  }
  const obj = Object(this)
  const len = obj.length >>> 0
  let k = 0;
  while (k < len) {
      if (k in obj) {
          if (callback.call(args, obj[k], k, obj)) {
              return true
          }
      }
      k++;
  }
  return false
}

// test mySome, 判断price是不是都大于20
console.log(arr.mySome(e => e.price > 20)) // false (some时，所有都满足才返回true)

/*
* 实现一个myEvery函数
*/ 
Array.prototype.myEvery = function(callback, args) {
  if (this === null) {
      throw new TypeError('this is null or not defined')
  }
  if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function')
  }
  const obj = Object(this)
  const len = obj.length >>> 0;
  let k = 0;
  while (k < len) {
      if (k in obj) {
          if (!callback.call(args, obj[k], k, obj)) {
              return false
          }
      }
      k++;
  }
  return true
}

// test myEvery, 有一个大于20就可以
console.log(arr.myEvery(e => e.price > 20)) // true （有一个满足就符合）


/*
* 实现一个reduce函数
*/ 
Array.prototype.myReduce = function (callback, args) {
  if (this === null) {
      throw new Error('this is null or not defined')
  }
  if (typeof callback !== 'function') {
      throw new Error(`${callback} is not a function`)
  }
  const obj = Object(this);
  const len = obj.length >>> 0;
  let k = 0, acc;
  if (arguments.length > 1) {
      acc = args
  } else {
      while (k < len && !(k in obj)) {
          k++
      }
      if (k > len) {
          throw new TypeError('Reduce of empty array with no args value')
      }
      acc = obj[k++]
  }
  while (k < len) {
      if (k in obj) {
          acc = callback(acc, obj[k], k, obj)
      }
      k++
  }
  return acc
}

// test myReduce, 求数组中菜的总价格
let allPrice = arr.myReduce((arr, item) => {
  return arr + item.price;
}, 0)
console.log('allPrice', allPrice) // allPrice 65