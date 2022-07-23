/**
 * 单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点；(有一些对象，我们往往只需要一个，此时可以考虑单例模式)
 * 
 * 用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象
 * 
 * 
 */


/**
 * 通用的惰性单例：将逻辑拆分，符合单一职责原则
 * 简单例子:浮窗(点击多次登录按钮，但是浮窗只会被创建一次)，这种场景就适合单例模式来创建
 * 进入页面时先不创建弹窗的DOM，点击按钮时再创建，节省创建DOM节点但是未使用到时造成资源浪费；
 */

let createIframe = (function () {
  let iframe;
  return function () {
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    return iframe;
  }
})();


let getSingle = function (fn) {  
  let result;
  return function () {  
    return result || (result = fn.apply(this, arguments));
  }
}

let createLoginLayer = function () {
  let div = document.createElement('div');
  div.innerHTML = '登录的弹窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}

let createSingleLoginLayer = getSingle(createLoginLayer);

document.getElementById('loginBtn').onclick = function () {
  let loginLayer = createLoginLayer();
  loginLayer.style.display = 'block';
}

// 创建iframe动态加载第三方页面
let createSingleIframe = getSingle(function () {  
  let iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  return iframe;
})

document.getElementById('iframeBtn').onclick = function () {
  let iframeLayer = createSingleIframe();
  iframeLayer.style.display = 'block';
}
