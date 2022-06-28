/**
 * 迭代器模式：提供一种方法顺序访问一个聚合对象中的各个元素，无需暴露该对象的内部表示；
 * 作用：将迭代的过程从业务逻辑中抽离，（无需关注对象内部的构造，也可按顺序访问其中的每个元素）
 * 
 * */ 

// jQuery中的迭代器：$.each
// $.each(['name', 'age', 'price'], function (i, n) {
//   console.log(`当前值为：${n}`)
//   console.log(`当前下标为：${i}`)
// })

/**
 * 实现自己的迭代器
 * 两个参数：
 * @param {Array} arr
 * @param {Function} callback
 * */ 
let myEach = function (arr, callback) { 
  for (let i = 0, j = arr.length; i < j; i++) {
    // 将下标和元素作为参数传给callback
    callback.call(arr[i], i, arr[i])
  }
}

// test myEach 
myEach(['test', 'age', 'price'], function (i, n) {  
  console.log(`当前值为:${n}`, `当前的下标为:${i}`) // 当前值为:test 当前的下标为:0....
})


/**
 * 迭代器分类：
 * 
 * 内部迭代器，myEach属于内部迭代器，内部已经定义好迭代规则，
 * 优点：完全接手整个迭代过程，外部只需要一次初始调用，调用方便；
 * 缺点：无法同时迭代两个数组；
 * 
 * 外部迭代器：必须显示的请求迭代下一个元素
 * 缺点：调用的复杂度有所提升，
 * 优点：迭代器的灵活性得到了增强 
 * 
 * 倒叙迭代器
 * 中止迭代器
 * */ 

// 外部迭代器示例：
let externalIterator = function (obj) {  
  let current = 0;
  let next = () => { current += 1; }
  let isDone = () => { return current >= obj.length }
  let getCurrItem = () => { return obj[current] }
  return {
    next: next,
    isDone: isDone,
    getCurrItem: getCurrItem
  }
}

let compare = (arr1, arr2) => {
  while(!arr1.isDone() && !arr2.isDone()) {
    if (arr1.getCurrItem() !== arr2.getCurrItem()) {
      throw new Error('arr1和arr2不相等~')
    }
    arr1.next();
    arr2.next();
  }
  console.log('arr1和arr2相等~')
}

const interator1 = externalIterator([1,2,3])
const interator2 = externalIterator([1,2,3])
compare(interator1, interator2)

// 应用场景，能执行第一级方法就执行第一级，没有就往后依次类推，直到最后默认的方法；在此用下拉框选择做示例
// test
let btnHandle = document.getElementById('btnHandle');
let select = document.getElementById('status');
let selected = '';
btnHandle.addEventListener('click', function() {
  selected = select.value;
  console.log('selected', selected)
  iteratorFun(fun0, fun1, fun2)
})

const fun0 = () => {
  if (selected === '0') {
    console.log('执行迭代模式0的方法')
  } else {
    return false
  }
}

const fun1 = () => {
  if (selected === '1') {
    console.log('执行迭代模式1的方法')
  } else {
    return false
  }
}

const fun2 = () => {
  if (selected === '2') {
    console.log('执行迭代模式2的方法')
  } else {
    return false
  }
}

const fun4 = () => {
  console.log('上面的都不满足，最终就执行fun4')
}

const iteratorFun =function () {
  for (let i = 0, fn; fn = arguments[i++];) {
    let excute = fn();
    if (excute) {
      return excute;
    }
  }
}




