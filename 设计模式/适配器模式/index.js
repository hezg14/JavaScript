/**
 * 适配器模式：处理两个软件实体间接口不兼容的问题，解决两个已有接口之间不匹配的问题；
 * 
 * */

// 示例，地图相关内容渲染(数据格式转换的适配器)
let getYunNanCity = function () {
  let yunnanCity = [{
    name: '昆明',
    id: 1
  }, {
    name: '曲靖',
    id: 2
  }, {
    name: '玉溪',
    id: 3
  }, {
    name: '大理',
    id: 4
  }]
  return yunnanCity;
}

let render = function (fn) {
  // 渲染云南的地图
  console.log('开始渲染云南的地图~')
  document.write(JSON.stringify(fn()));
}

// 适配器
let addressAdapter = function (oldAddressfn) {
  let address = {},
    oldAddress = oldAddressfn();
  for (let i = 0, l; l = oldAddress[i++];) {
    address[l.name] = l.id;
  }
  return function () {  
    return address;
  }
}

render(addressAdapter(getYunNanCity));