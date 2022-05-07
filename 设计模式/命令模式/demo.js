/*
  命令模式：将请求封装为对象，分离请求的发起者和执行者的耦合关系；
*/ 

// 将执行者封装在闭包形成的环境中
var playBall = {
  transport: function () { 
    console.log('运球推进~')
  },
  pass: function () { 
    console.log('传球给队友~')
  },
  meet: function () { 
    console.log('接住队友的球~')
  },
  shoot: function () {
    console.log('瞄准投篮~')
  }
}

var createAthlete = function (param) { 
  var transport = function () { 
    return param.transport(); // 执行运球的动作
  };
  var pass = function () { 
    return param.pass();
  }
  var meet = function () { 
    return param.meet();
  }
  var shoot = function () { 
    return param.shoot();
  }
  return {
    transport: transport,
    pass: pass,
    meet: meet,
    shoot: shoot
  }
};

var setAthlete = function (param) { 
  document.getElementById('transport').onclick = function () { 
    param.transport();
  }
  document.getElementById('pass').onclick = function () { 
    param.pass();
  }
  document.getElementById('meet').onclick = function () { 
    param.meet();
  }
  document.getElementById('shoot').onclick = function () { 
    param.shoot();
  }
}

// 调用函数
setAthlete(createAthlete(playBall))