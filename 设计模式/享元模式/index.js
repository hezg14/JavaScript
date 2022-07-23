/**
 * 享元模式：运用共享技术来支持大量细粒度的对象；用时间换空间的优化模式；
 * 
 * 作用：
 *    1、性能优化：当系统中存在大量类似的对象导致内存占用过高时，对象中的大部分状态可以转换为外部状态，可以使用享元模式来优化；
 * 
 * 
 * 要求：
 *    将对象的属性划分为内部状态和外部状态，目标是尽量减少共享对象的数量；
 * 
 * 如何划分内部和外部状态：
 *    1、内部状态存储于对象内部，可以被一些对象共享，独立于具体的场景，通常不会改变；
 *    2、外部状态取决于具体的业务场景，会根据场景变化外部状态不能被共享；
 * 
 * */

// 示例：生产N件衣服,模特穿上衣服并拍照，使用享元模式，只需创建两个模特对象
let Model = function (sex) {
  this.sex = sex;
}

Model.prototype.takePhoto = function () {
  console.log(`sex=${this.sex}underwear=${this.underwear}`);
}

// 创建男女模特
let menModel = new Model('Jack'),
  woMenModel = new Model('Julie');

// 给男女模特穿上服装并拍照
for (let i = 0; i < 50; i++) {
  menModel.underwear = `underwear${i}`;
  menModel.takePhoto();
}

for (let i = 0; i < 50; i++) {
  woMenModel.underwear = `underwear${i}`;
  woMenModel.takePhoto();
}


/**
 * 文件上传实例，同时上传多个文件时，会创建很多个对象出来；
 * 
 * 明确uploadType之后，无论我们用什么方式上传，这个上传对象都是可以被共享的是一个内部状态；
 * fileName和fileSize没有办法共享，因此划分为外部状态；
 * */
let id = 0;
window.startUpload = function (uploadType, files) {
  // uploadType用来区分控件类型
  for (let i = 0, file; file = files[i++];) {
    let uploadObj = new uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
  }
}

// 明确了 uploadType 作为内部状态之后，我们再把其他的外部状态从构造函数中抽离出来，Upload 构造函数中只保留 uploadType 参数：
let Upload = function (uploadType) {
  this.uploadType = uploadType;
}


Upload.prototype.delFile = function (id) {
  // 把当前 id 对应的对象的外部状态都组装到共享对象中;
  uploadManager.setExternalState(id, this)
  // 文件大小小于3000KB时无需提示直接删除
  if (this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }
  // 超过3000KB时，提示
  if (window.confirm(`确定要删除${this.fileName}文件吗？`)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
}

// 工厂进行对象实例化
let UploadFactory = (function () {
  let createdFlyWeightObjs = {};
  return {
    create: function (uploadType) {
      if (createdFlyWeightObjs[uploadType]) {
        return createdFlyWeightObjs[uploadType];
      }
      return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
    }
  }
})();

// 管理器封装外部状态
let uploadManager = (function () {
    let uploadDatabase = {};
    return {
      add: function (id, uploadType, fileName, fileSize) {  
        let flyWeightObj = UploadFactory.create(uploadType);
        let dom = document.createElement('div');
        dom.innerHTML =
          '<span>文件名称:' + fileName + ',文件大小：' + fileSize + '</span>' +
          '<button class="delFile">删除</button>';
          dom.querySelector('.delFile').onclick = function () {
            flyWeightObj.delFile(id);
          }
        document.body.appendChild(dom);
        uploadDatabase[id] = {
          fileName: fileName,
          fileSize: fileSize,
          dom: dom
        }
        return flyWeightObj;
      },
      setExternalState: function (id, flyWeightObj) {  
        let uploadData = uploadDatabase[id];
        for (let i in uploadData) {
          flyWeightObj[i] = uploadData[i];
        }
      }
    }
})()

// 创建3个插件上传对象和Flash上传对象
startUpload('plugin', [{
  fileName: '1.txt',
  fileSize: 1000
}, {
  fileName: '2.txt',
  fileSize: 3000
}, {
  fileName: '3.html',
  fileSize: 5000
}])

startUpload('flash', [{
  fileName: '4.txt',
  fileSize: 1000
}, {
  fileName: '5.txt',
  fileSize: 6000
}, {
  fileName: '6.html',
  fileSize: 2000
}])