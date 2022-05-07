/*
  * 策略模式：
  *   1、以类为中心的传统面向对象编程：不同算法逻辑封装在各个策略类中，context将请求委托给这些策略对象，策略对象根据请求返回不同的执行结果。（体现了对象的多态性）
  *   2、除了使用类之外还可以使用函数来封装，
  *
  * 策略模式优缺点：
  * 优点
  *    避免多重条件选择语句
  *    支持开闭原则，算法封装到策略类中，易于理解和扩展
  *    可复用在系统其它地方，避免许多重复的复制粘贴工作
  *    利用组合和委托来让context拥有执行算法的能力，属于继承更轻便的替代方案
  *  缺点
  *    会增加很多策略类或者策略对象，
  *    必须了解所有的strategy（策略），违反了最少知识原则
  * */


  // 计算奖金实例
  // 定义策略类 （模拟传统面向对象语法的实现）
  let strategies = {
    'S': function (salary) {
        return salary * 4;
    },
    'A': function (salary) {
        return salary * 3;
    },
    'B': function (salary) {
        return salary * 2;
    },
    'C': function (salary) {
        return salary * 1.5;
    }
};
// JavaScript下使用函数的形式实现策略模式，
// let S = function (salary) {
//         return salary * 4;
// };
// let calculateBonus = function (func, salary) {
//     return func(salary);
// }

// 执行环境类 (传统面向对象)
let calculateBonus = function (level, salary) {
    return strategies[level](salary);
}
// 计算年终奖金
console.log(calculateBonus('S', 10000)) // 40000


// 小球运动实例
const Animate = function (dom) {
    this.dom = dom;
    this.startTime = 0;
    this.startPos = 0;
    this.endPos = 0;
    this.protpertyName = null;
    this.easing = null;
    this.duration = null;
}
// 接收4个参数，properName 左右上下移动，endPos: 小球运动目标，duration: 动画持续时间， easing: 缓动算法
Animate.prototype.start = function (protpertyName, endPos, duration, easing) {
    // 动画的启动时间
    this.startTime = +new Date;
    // dom初始位置
    this.startPos = this.dom.getBoundingClientRect()[protpertyName];
    // dom 节点需要被改变的css属性名
    this.protpertyName = protpertyName;
    // dom 节点目标位置
    this.endPos = endPos;
    // 动画持续时间
    this.duration = duration;
    // 缓动算法
    this.easing = easing;
    let self = this;
    let timeId = setInterval(() => {
        if (self.step() === false) {
            clearInterval(timeId);
        }
    }, 3000)
}
// 小球每一帧要做的事情
Animate.prototype.step = function () {
    let t = +new Date;
    if (t >= this.startTime + this.duration) {
        this.update(this.endPos);
        return false;
    }
    let pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
    this.update(pos);
}
// 更新小球css属性值的方法
Animate.prototype.update = function (pos) {
    this.dom.style[this.protpertyName] = `${pos}px`;
}
// test
let dom =document.getElementById('ball');
let animate = new Animate(dom)
animate.start('left', 1000, 500, 'strongEaseOut');
// animate.start('top', 600, 500, 'strongEaseInt');
// 表单验证通过策略模式实现
// 策略对象
const strategyRules = {
    isNonEmpty: function (value, errorMsg) {
        if (!value) {
            return errorMsg
        }
    },
    minLength: function (value, length, errorMsg) {
        if (value.length  < length) {
            return errorMsg
        }
    },
    maxLength: function (value, length, errorMsg) {
        if (value.length  > length) {
            return errorMsg
        }
    },
    isMobile: function (value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg
        }
    }
}
// 实现Validator类
let Validator = function () {
    // 保存各类校验规则
    this.cache = [];
};
// 校验的方法
Validator.prototype.add = function (dom, rules) {
    let self = this;
    for (let i = 0, rule; rule = rules[i++];) {
        (function (rule) {
            let strategyAry = rule.strategy.split(':');
            let errorMsg = rule.errorMsg;
            self.cache.push(function () {
                let strategy = strategyAry.shift();
                // input的value添加到参数列表中
                strategyAry.unshift(dom.value);
                // errorMsg添加到参数列表
                strategyAry.push(errorMsg);
                return strategyRules[strategy].apply(dom, strategyAry);
            })
        })(rule)
    }
}
// 启动校验
Validator.prototype.start = function () {
    for (let i = 0, validationFunc; validationFunc = this.cache[i++];) {
        let msg = validationFunc();
        if (msg) {
            return msg
        }
    }
}
// 实际开发中需要校验到的数据，定义验证的规则；
let validationFunc = function () {
    let validator = new Validator();
    // 一个文本框多个校验规则
    validator.add(registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空~'
    }, {
                strategy: 'minLength:3',
                errorMsg: '用户名最小长度不能少于3位~'
            }
        ]);
    validator.add(registerForm.password, [{
        strategy: 'isNonEmpty',
        errorMsg: '密码不能为空~'
    }, {
        strategy: 'maxLength:10',
        errorMsg: '密码最大长度不能大于10位~'}
        ]);
    validator.add(registerForm.mobile, [{
        strategy: 'isNonEmpty',
        errorMsg: '手机号码不能为空~'
    }, {
        strategy: 'isMobile',
        errorMsg: '手机号码格式错误~'}
    ]);
    let errorMsg = validator.start();
    return errorMsg;
}
// 验证表单提交
const registerForm = document.getElementById('registerForm');
  registerForm.onsubmit = function () {
    // 有返回值则表明报错了
    let errorMsg = validationFunc();
    if (errorMsg) {
        alert(errorMsg);
        return false;
  }
}