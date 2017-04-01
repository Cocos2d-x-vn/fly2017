require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Bullet":[function(require,module,exports){
"use strict";
cc._RFpush(module, '924a3Y6oZFCf4hPST/NPGGJ', 'Bullet');
// Script/Bullet.js

'use strict';

var gameLogic = require('GameLogic');
var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: 'Bullet'
    },

    doOnLoad: function doOnLoad() {
        // cc.log('bullet speed - onLoad: (%s, %s)', this._speedX, this._speedY);
    },

    doUpdate: function doUpdate(dt) {
        // cc.log('Bullet.doUpdate(%s)', dt);
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other, self) {
        var flyingObj = other.getComponent('FlyingObject');
        var otherTypeTag = flyingObj.typeTag;

        if (otherTypeTag == 'Enermy') {
            gameLogic.addScore(10);
            flyingObj.doDestory();
        }
    }
});

cc._RFpop();
},{"FlyingObject":"FlyingObject","GameLogic":"GameLogic"}],"Enermy":[function(require,module,exports){
"use strict";
cc._RFpush(module, '24f0ei6fE1KMb8zb89kRKO8', 'Enermy');
// Script/Enermy.js

'use strict';

var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: 'Enermy',

        // 增加一些趣味，概率分裂
        _splitEnable: true,
        _splitRate: 0.8,
        _splitY: null
    },

    doOnLoad: function doOnLoad() {
        // cc.log('Enermy speed - onLoad: (%s, %s)', this._speedX, this._speedY);
        if (this._splitEnable && Math.random() < this._splitRate) {
            this._splitY = this._y - Math.random() * 300;
        }
    },

    doUpdate: function doUpdate(dt) {
        // cc.log('Enermy.doUpdate(%s)', dt);
        // 分裂
        if (this._splitEnable && this._splitY != null && this._y < this._splitY) {
            this._splitY = null;

            var x = this.node.x;
            var y = this.node.y;

            for (var i = 0; i < 3; i++) {
                var newEnermyNode = cc.instantiate(this.node);
                var newEnermy = newEnermyNode.getComponent('Enermy');

                newEnermyNode.parent = this.node.parent;
                newEnermy.setSplitEnable(false);
                newEnermy.setPosition(this.node.x + i * 10 - 10, this.node.y);
                newEnermy.setSpeed(i * 10 - 10);
            }
        }
    },

    // 设置是否可以分裂
    setSplitEnable: function setSplitEnable(enable) {
        this._splitEnable = enable;
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other, self) {}

});

cc._RFpop();
},{"FlyingObject":"FlyingObject"}],"FlyingObject":[function(require,module,exports){
"use strict";
cc._RFpush(module, '591d51hDzFMioCDzuCt2GXz', 'FlyingObject');
// Script/FlyingObject.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // 标签，用于类型判断
        typeTag: 'FlyingObject',

        // 当前存活时间(秒)
        _liveTime: 0,
        // 存活时间限制（秒），到达该值时自动销毁，为0表示永久存在
        _liveTimeLimit: 0,
        // 速度
        _speedX: 0,
        _speedY: 0,
        // 位置
        _x: 0,
        _y: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.updatePosition();
        // logic onLoad
        this.doOnLoad();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (!cc.isValid(this.node)) {
            this.enabled = false;
            return;
        }

        // 存活检测
        this._liveTime += dt;

        if (!this.checkLiveLimit()) {
            this.doDestory();
            return;
        }

        // move
        this._x += this._speedX;
        this._y += this._speedY;

        this.updatePosition();

        // logic update
        this.doUpdate(dt);
    },

    doOnLoad: function doOnLoad() {
        // 一般由子类实现具体逻辑
    },

    // 执行每帧update操作，一般子类覆盖此方法
    doUpdate: function doUpdate(dt) {
        // 一般由子类实现具体逻辑
        // cc.log('FlyaingObject.doUpdate(%s)', dt);
    },

    // 销毁
    doDestory: function doDestory() {
        if (cc.isValid(this.node)) {
            this.node.destroy();
        }
    },

    // 设置存活限制时间（秒），0为无限
    setLiveLimit: function setLiveLimit(time) {
        this._liveTimeLimit = time;
    },

    // 设置速度
    setSpeed: function setSpeed(xSpeed, ySpeed) {
        if (xSpeed != undefined) this._speedX = xSpeed;
        if (ySpeed != undefined) this._speedY = ySpeed;
    },

    // 设定位置
    setPosition: function setPosition(x, y) {
        this._x = x;
        this._y = y;
        this.updatePosition();
    },

    // 更新位置
    updatePosition: function updatePosition() {
        if (this.node) {
            this.node.x = this._x;
            this.node.y = this._y;
        } else {
            cc.warn('FlyingObject.js: updatePosition but [this.node] is null.');
        }
    },

    // 检查存活限制，返回是否存活
    checkLiveLimit: function checkLiveLimit() {
        return this._liveTimeLimit <= 0 || this._liveTime < this._liveTimeLimit;
    }

});

cc._RFpop();
},{}],"GameLogic":[function(require,module,exports){
"use strict";
cc._RFpush(module, '632082h2n9LcagACQwyyy+I', 'GameLogic');
// Script/GameLogic.js

"use strict";

// 游戏核心逻辑
var gameLogic = {
    // 游戏时间
    _gameTime: 0,
    _maxGameTime: 60,
    // 游戏积分
    _score: 0,
    // 生命值
    _life: 1,
    _maxLife: 1,
    // 敌人数组
    _enermyList: [],
    // 子弹数组
    _bulletList: [],
    // 刷怪周期（秒）
    _spwanTimeGap: 0.5,
    // 上次刷怪时间
    _lastSpwanEnermyTime: 0,
    // 刷怪回调
    _spwanEnermyCallback: null,
    // 游戏结束回调
    _gameOverCallback: null,
    _isPlaying: false,

    // 初始化
    init: function init(maxGameTime, maxLife, spwanEnermyCallback, gameOverCallback) {
        this._maxGameTime = maxGameTime;
        this._life = this._maxLife = maxLife;
        this._spwanEnermyCallback = spwanEnermyCallback;
        this._gameOverCallback = gameOverCallback;
    },

    // 开始游戏
    start: function start() {
        this._score = 0;
        this._isPlaying = true;
    },

    // 应当每帧调用此方法
    update: function update(dt) {
        if (!this._isPlaying) return;

        // 剩余时间
        if (this.getGameLeftTime() == 0) {
            this.gameOver();
            return;
        }

        // 累加时间，判断是否要刷怪
        this._gameTime += dt;

        if (this._gameTime > this._lastSpwanEnermyTime + this._spwanTimeGap) {
            this.swpanEnermy();
        }
    },

    // 刷怪
    swpanEnermy: function swpanEnermy() {
        this._lastSpwanEnermyTime = this._gameTime;

        if (this._spwanEnermyCallback) {
            this._spwanEnermyCallback(this._gameTime);
        }
    },

    // 是否正在游戏
    isPlaying: function isPlaying() {
        return this._isPlaying;
    },

    // 获取游戏时间
    getGameTime: function getGameTime() {
        return this._gameTime;
    },

    // 获取游戏剩余时间
    getGameLeftTime: function getGameLeftTime() {
        return Math.max(0, this._maxGameTime - this._gameTime);
    },

    // 获取游戏积分
    getScore: function getScore() {
        return this._score;
    },

    // 获取生命值
    getLife: function getLife() {
        return this._life;
    },

    // 增加生命值
    addLife: function addLife(cnt) {
        this._life = Math.min(this._maxLife, this._life + cnt);
    },

    // 减少生命值
    reduceLife: function reduceLife(cnt) {
        this._life = Math.max(0, this._life - cnt);
        if (this._life == 0) {
            this.gameOver();
        }
    },

    // 增加积分
    addScore: function addScore(cnt) {
        this._score += cnt;
    },

    // 减少积分
    reduceScore: function reduceScore(cnt) {
        this._score = Math.max(0, this._score - cnt);
    },

    // 游戏结束
    gameOver: function gameOver() {
        this._isPlaying = false;
        if (this._gameOverCallback) {
            this._gameOverCallback();
        }
    }

};

module.exports = gameLogic;

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'eb04dZdk01NKpwWQ0EE9BX7', 'Game');
// Script/Game.js

'use strict';

var gameLogic = require('GameLogic');

cc.Class({
    extends: cc.Component,

    properties: {
        // 敌人预制件
        enermy: {
            default: null,
            type: cc.Prefab
        },

        // 敌人容器
        enermyContainer: {
            default: null,
            type: cc.Node
        },

        // 游戏时间
        time: {
            default: null,
            type: cc.Label
        },

        // 游戏积分
        score: {
            default: null,
            type: cc.Label
        },

        // 生命值
        life: {
            default: null,
            type: cc.Label
        },

        // GameOver
        gameOverLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // 启用碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;

        var game = this;
        // 初始化
        gameLogic.init(
        // 游戏时间
        30,
        // 最大生命值
        3,
        // 刷怪实现
        function (gameTime) {
            game.spwan(gameTime);
        },
        // 结束游戏实现
        function () {
            game.gameOver();
        });
        // 启动游戏
        gameLogic.start();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (!gameLogic.isPlaying()) return;

        gameLogic.update(dt);
        this.updateTime();
        this.updateScore();
        this.updateLife();
    },

    // 刷怪具体实现
    spwan: function spwan(gameTime) {
        var inst = cc.instantiate(this.enermy);
        var enermy = inst.getComponent('Enermy');
        inst.parent = this.enermyContainer;
        // 刷怪范围 x -350 ~ 350, y 700 ~ 800
        enermy.setPosition(Math.random() * 700 - 350, Math.random() * 100 + 700);
        // 速度 直线向下，y -5 ~ -30
        enermy.setSpeed(0, Math.random() * 25 - 30);
        // 生命周期 5s
        enermy.setLiveLimit(5);
    },

    // 更新时间Label
    updateTime: function updateTime() {
        this.time.string = '剩余时间: ' + gameLogic.getGameLeftTime().toFixed(2);
    },

    // 更新积分
    updateScore: function updateScore() {
        this.score.string = '当前积分: ' + gameLogic.getScore();
    },

    // 更新生命
    updateLife: function updateLife() {
        this.life.string = '当前生命: ' + gameLogic.getLife();
    },

    // 游戏结束具体实现
    gameOver: function gameOver() {
        this.updateTime();
        this.updateScore();
        this.updateLife();

        if (gameLogic.getGameLeftTime() <= 0) {
            this.gameOverLabel.string = 'You Win!\n骚年可以的';
        } else {
            this.gameOverLabel.string = 'Game Over!\n太菜了';
        }
    }

});

cc._RFpop();
},{"GameLogic":"GameLogic"}],"PlayerPlane":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd8a6ehXGsFG3qDpDTXW5gCn', 'PlayerPlane');
// Script/PlayerPlane.js

'use strict';

var gameLogic = require('GameLogic');
var FlyingObject = require('FlyingObject');

// 开火间隔（秒）
var FIRE_GAP = 0.3;

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: 'PlayerPlane',

        // 子弹预制件
        bullet: {
            default: null,
            type: cc.Prefab
        },

        // 子弹容器Node
        bulletContainer: {
            default: null,
            type: cc.Node
        },

        // 是否正在开火
        _isFiring: true,
        // 上次开火至今时间
        _lastFireTimePassed: 0
    },

    // use this for initialization
    doOnLoad: function doOnLoad() {
        this.setSpeed(0, 0);
        this.setLiveLimit(0);
        this.setPosition(this.node.x, this.node.y);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    // called every frame, uncomment this function to activate update callback
    doUpdate: function doUpdate(dt) {
        if (!gameLogic.isPlaying()) return;

        // 开火
        if (this._isFiring && this._lastFireTimePassed >= FIRE_GAP) {
            this.fire();
        } else {
            this._lastFireTimePassed += dt;
        }
    },

    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.setSpeed(-10);
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.setSpeed(10);
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this.setSpeed(undefined, 10);
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this.setSpeed(undefined, -10);
                break;
        }
    },

    onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.setSpeed(0);
                break;
            case cc.KEY.w:
            case cc.KEY.up:
            case cc.KEY.s:
            case cc.KEY.down:
                this.setSpeed(undefined, 0);
                break;
        }
    },

    // 开火
    fire: function fire() {

        // 一条命时，3发散射，其余单发
        if (gameLogic.getLife() == 1) {
            for (var i = 0; i < 3; i++) {
                var bulletInst = cc.instantiate(this.bullet);
                var bullet = bulletInst.getComponent('Bullet');
                bulletInst.parent = this.bulletContainer;
                bullet.setPosition(this.node.x + i * 10 - 10, this.node.y + 30);
                bullet.setSpeed(i * 10 - 10, 15);
                bullet.setLiveLimit(3);
                this._lastFireTimePassed = 0;
            }
        } else {
            var bulletInst = cc.instantiate(this.bullet);
            var bullet = bulletInst.getComponent('Bullet');
            bulletInst.parent = this.bulletContainer;
            bullet.setPosition(this.node.x, this.node.y + 30);
            bullet.setSpeed(0, 15);
            bullet.setLiveLimit(3);
            this._lastFireTimePassed = 0;
        }
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other, self) {
        var flyingObj = other.getComponent('FlyingObject');
        var otherTypeTag = flyingObj.typeTag;

        if (otherTypeTag == 'Enermy') {
            gameLogic.reduceLife(1);
            flyingObj.doDestory();
        }
    }

});

cc._RFpop();
},{"FlyingObject":"FlyingObject","GameLogic":"GameLogic"}]},{},["Bullet","Enermy","FlyingObject","Game","GameLogic","PlayerPlane"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQnVsbGV0LmpzIiwiYXNzZXRzL1NjcmlwdC9FbmVybXkuanMiLCJhc3NldHMvU2NyaXB0L0ZseWluZ09iamVjdC5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZUxvZ2ljLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9QbGF5ZXJQbGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFEUTs7QUFJWjtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBNUJJOzs7Ozs7Ozs7O0FDSFQ7O0FBRUE7QUFDSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBTlE7O0FBU1o7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7O0FBbkRLOzs7Ozs7Ozs7O0FDRFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFiUTs7QUFnQlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFuR0k7Ozs7Ozs7Ozs7QUNBVDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0o7O0FBdEhXOztBQTBIaEI7Ozs7Ozs7Ozs7QUM1SEE7O0FBRUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRkk7O0FBS1I7QUFDQTtBQUNJO0FBQ0E7QUFGYTs7QUFLakI7QUFDQTtBQUNJO0FBQ0E7QUFGRTs7QUFLTjtBQUNBO0FBQ0k7QUFDQTtBQUZHOztBQUtQO0FBQ0E7QUFDSTtBQUNBO0FBRkU7O0FBS047QUFDQTtBQUNJO0FBQ0E7QUFGVztBQWhDUDs7QUFzQ1o7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQUNJO0FBQ0g7QUFFTDtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQXBISTs7Ozs7Ozs7OztBQ0ZUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNBO0FBQ0k7QUFDQTtBQUZhOztBQUtqQjtBQUNBO0FBQ0E7QUFDQTtBQWxCUTs7QUFxQlo7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7O0FBRUQ7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBaEJSO0FBa0JIOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFaUjtBQWNIOztBQUVEO0FBQ0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNKOztBQXpISSIsInNvdXJjZXNDb250ZW50IjpbInZhciBnYW1lTG9naWMgPSByZXF1aXJlKCdHYW1lTG9naWMnKTtcbnZhciBGbHlpbmdPYmplY3QgPSByZXF1aXJlKCdGbHlpbmdPYmplY3QnKTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEZseWluZ09iamVjdCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZVRhZzogJ0J1bGxldCdcbiAgICB9LFxuXG4gICAgZG9PbkxvYWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIGNjLmxvZygnYnVsbGV0IHNwZWVkIC0gb25Mb2FkOiAoJXMsICVzKScsIHRoaXMuX3NwZWVkWCwgdGhpcy5fc3BlZWRZKTtcbiAgICB9LFxuXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uKGR0KXtcbiAgICAgICAgLy8gY2MubG9nKCdCdWxsZXQuZG9VcGRhdGUoJXMpJywgZHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlvZPnorDmkp7kuqfnlJ/nmoTml7blgJnosIPnlKhcbiAgICAgKiBAcGFyYW0gIHtDb2xsaWRlcn0gb3RoZXIg5Lqn55Sf56Kw5pKe55qE5Y+m5LiA5Liq56Kw5pKe57uE5Lu2XG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IHNlbGYgIOS6p+eUn+eisOaSnueahOiHqui6q+eahOeisOaSnue7hOS7tlxuICAgICAqL1xuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIChvdGhlciwgc2VsZikge1xuICAgICAgICB2YXIgZmx5aW5nT2JqID0gb3RoZXIuZ2V0Q29tcG9uZW50KCdGbHlpbmdPYmplY3QnKTtcbiAgICAgICAgdmFyIG90aGVyVHlwZVRhZyA9IGZseWluZ09iai50eXBlVGFnO1xuXG4gICAgICAgIGlmKG90aGVyVHlwZVRhZyA9PSAnRW5lcm15Jyl7XG4gICAgICAgICAgICBnYW1lTG9naWMuYWRkU2NvcmUoMTApO1xuICAgICAgICAgICAgZmx5aW5nT2JqLmRvRGVzdG9yeSgpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJ2YXIgRmx5aW5nT2JqZWN0ID0gcmVxdWlyZSgnRmx5aW5nT2JqZWN0Jyk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBGbHlpbmdPYmplY3QsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGVUYWc6ICdFbmVybXknLFxuXG4gICAgICAgIC8vIOWinuWKoOS4gOS6m+i2o+WRs++8jOamgueOh+WIhuijglxuICAgICAgICBfc3BsaXRFbmFibGU6IHRydWUsXG4gICAgICAgIF9zcGxpdFJhdGU6IDAuOCxcbiAgICAgICAgX3NwbGl0WTogbnVsbCxcbiAgICB9LFxuICAgIFxuICAgIGRvT25Mb2FkOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyBjYy5sb2coJ0VuZXJteSBzcGVlZCAtIG9uTG9hZDogKCVzLCAlcyknLCB0aGlzLl9zcGVlZFgsIHRoaXMuX3NwZWVkWSk7XG4gICAgICAgIGlmKHRoaXMuX3NwbGl0RW5hYmxlICYmIE1hdGgucmFuZG9tKCkgPCB0aGlzLl9zcGxpdFJhdGUpe1xuICAgICAgICAgICAgdGhpcy5fc3BsaXRZID0gdGhpcy5feSAtIE1hdGgucmFuZG9tKCkgKiAzMDA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uKGR0KXtcbiAgICAgICAgLy8gY2MubG9nKCdFbmVybXkuZG9VcGRhdGUoJXMpJywgZHQpO1xuICAgICAgICAvLyDliIboo4JcbiAgICAgICAgaWYodGhpcy5fc3BsaXRFbmFibGUgJiYgdGhpcy5fc3BsaXRZICE9IG51bGwgJiYgdGhpcy5feSA8IHRoaXMuX3NwbGl0WSl7XG4gICAgICAgICAgICB0aGlzLl9zcGxpdFkgPSBudWxsO1xuXG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMubm9kZS54O1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLm5vZGUueTtcblxuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8MzsgaSsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBuZXdFbmVybXlOb2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5ub2RlKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RW5lcm15ID0gbmV3RW5lcm15Tm9kZS5nZXRDb21wb25lbnQoJ0VuZXJteScpO1xuXG4gICAgICAgICAgICAgICAgbmV3RW5lcm15Tm9kZS5wYXJlbnQgPSB0aGlzLm5vZGUucGFyZW50O1xuICAgICAgICAgICAgICAgIG5ld0VuZXJteS5zZXRTcGxpdEVuYWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgbmV3RW5lcm15LnNldFBvc2l0aW9uKHRoaXMubm9kZS54ICsgaSAqIDEwIC0gMTAsIHRoaXMubm9kZS55KTtcbiAgICAgICAgICAgICAgICBuZXdFbmVybXkuc2V0U3BlZWQoaSAqIDEwIC0gMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiuvue9ruaYr+WQpuWPr+S7peWIhuijglxuICAgIHNldFNwbGl0RW5hYmxlOiBmdW5jdGlvbihlbmFibGUpe1xuICAgICAgICB0aGlzLl9zcGxpdEVuYWJsZSA9IGVuYWJsZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5b2T56Kw5pKe5Lqn55Sf55qE5pe25YCZ6LCD55SoXG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IG90aGVyIOS6p+eUn+eisOaSnueahOWPpuS4gOS4queisOaSnue7hOS7tlxuICAgICAqIEBwYXJhbSAge0NvbGxpZGVyfSBzZWxmICDkuqfnlJ/norDmkp7nmoToh6rouqvnmoTnorDmkp7nu4Tku7ZcbiAgICAgKi9cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcblxuICAgIH1cbiAgICBcbn0pO1xuIiwiXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDmoIfnrb7vvIznlKjkuo7nsbvlnovliKTmlq1cbiAgICAgICAgdHlwZVRhZzogJ0ZseWluZ09iamVjdCcsXG5cbiAgICAgICAgLy8g5b2T5YmN5a2Y5rS75pe26Ze0KOenkilcbiAgICAgICAgX2xpdmVUaW1lOiAwLFxuICAgICAgICAvLyDlrZjmtLvml7bpl7TpmZDliLbvvIjnp5LvvInvvIzliLDovr7or6XlgLzml7boh6rliqjplIDmr4HvvIzkuLow6KGo56S65rC45LmF5a2Y5ZyoXG4gICAgICAgIF9saXZlVGltZUxpbWl0OiAwLFxuICAgICAgICAvLyDpgJ/luqZcbiAgICAgICAgX3NwZWVkWDogMCxcbiAgICAgICAgX3NwZWVkWTogMCxcbiAgICAgICAgLy8g5L2N572uXG4gICAgICAgIF94OiAwLFxuICAgICAgICBfeTogMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICAvLyBsb2dpYyBvbkxvYWRcbiAgICAgICAgdGhpcy5kb09uTG9hZCgpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIGlmICggIWNjLmlzVmFsaWQodGhpcy5ub2RlKSApIHtcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5a2Y5rS75qOA5rWLXG4gICAgICAgIHRoaXMuX2xpdmVUaW1lICs9IGR0O1xuICAgICAgICBcbiAgICAgICAgaWYoIXRoaXMuY2hlY2tMaXZlTGltaXQoKSl7XG4gICAgICAgICAgICB0aGlzLmRvRGVzdG9yeSgpOyAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vdmVcbiAgICAgICAgdGhpcy5feCArPSB0aGlzLl9zcGVlZFg7XG4gICAgICAgIHRoaXMuX3kgKz0gdGhpcy5fc3BlZWRZO1xuXG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICAvLyBsb2dpYyB1cGRhdGVcbiAgICAgICAgdGhpcy5kb1VwZGF0ZShkdCk7XG4gICAgfSxcblxuICAgIGRvT25Mb2FkOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyDkuIDoiKznlLHlrZDnsbvlrp7njrDlhbfkvZPpgLvovpFcbiAgICB9LFxuXG4gICAgLy8g5omn6KGM5q+P5bindXBkYXRl5pON5L2c77yM5LiA6Iis5a2Q57G76KaG55uW5q2k5pa55rOVXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uKGR0KXtcbiAgICAgICAgLy8g5LiA6Iis55Sx5a2Q57G75a6e546w5YW35L2T6YC76L6RXG4gICAgICAgIC8vIGNjLmxvZygnRmx5YWluZ09iamVjdC5kb1VwZGF0ZSglcyknLCBkdCk7XG4gICAgfSxcblxuICAgIC8vIOmUgOavgVxuICAgIGRvRGVzdG9yeTogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCBjYy5pc1ZhbGlkKHRoaXMubm9kZSkgKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiuvue9ruWtmOa0u+mZkOWItuaXtumXtO+8iOenku+8ie+8jDDkuLrml6DpmZBcbiAgICBzZXRMaXZlTGltaXQ6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICB0aGlzLl9saXZlVGltZUxpbWl0ID0gdGltZTtcbiAgICB9LFxuXG4gICAgLy8g6K6+572u6YCf5bqmXG4gICAgc2V0U3BlZWQ6IGZ1bmN0aW9uKHhTcGVlZCwgeVNwZWVkKXtcbiAgICAgICAgaWYoeFNwZWVkICE9IHVuZGVmaW5lZCkgdGhpcy5fc3BlZWRYID0geFNwZWVkO1xuICAgICAgICBpZih5U3BlZWQgIT0gdW5kZWZpbmVkKSB0aGlzLl9zcGVlZFkgPSB5U3BlZWQ7XG4gICAgfSxcblxuICAgIC8vIOiuvuWumuS9jee9rlxuICAgIHNldFBvc2l0aW9uOiBmdW5jdGlvbih4LCB5KXtcbiAgICAgICAgdGhpcy5feCA9IHg7XG4gICAgICAgIHRoaXMuX3kgPSB5O1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfSxcblxuICAgIC8vIOabtOaWsOS9jee9rlxuICAgIHVwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICBpZih0aGlzLm5vZGUpe1xuICAgICAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLl94O1xuICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSB0aGlzLl95O1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNjLndhcm4oJ0ZseWluZ09iamVjdC5qczogdXBkYXRlUG9zaXRpb24gYnV0IFt0aGlzLm5vZGVdIGlzIG51bGwuJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5qOA5p+l5a2Y5rS76ZmQ5Yi277yM6L+U5Zue5piv5ZCm5a2Y5rS7XG4gICAgY2hlY2tMaXZlTGltaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXZlVGltZUxpbWl0IDw9IDAgfHwgdGhpcy5fbGl2ZVRpbWUgPCB0aGlzLl9saXZlVGltZUxpbWl0O1xuICAgIH1cblxufSk7XG4iLCJcbi8vIOa4uOaIj+aguOW/g+mAu+i+kVxudmFyIGdhbWVMb2dpYyA9IHtcbiAgICAvLyDmuLjmiI/ml7bpl7RcbiAgICBfZ2FtZVRpbWU6IDAsXG4gICAgX21heEdhbWVUaW1lOiA2MCxcbiAgICAvLyDmuLjmiI/np6/liIZcbiAgICBfc2NvcmU6IDAsXG4gICAgLy8g55Sf5ZG95YC8XG4gICAgX2xpZmU6IDEsXG4gICAgX21heExpZmU6IDEsXG4gICAgLy8g5pWM5Lq65pWw57uEXG4gICAgX2VuZXJteUxpc3Q6IFtdLFxuICAgIC8vIOWtkOW8ueaVsOe7hFxuICAgIF9idWxsZXRMaXN0OiBbXSxcbiAgICAvLyDliLfmgKrlkajmnJ/vvIjnp5LvvIlcbiAgICBfc3B3YW5UaW1lR2FwOiAwLjUsXG4gICAgLy8g5LiK5qyh5Yi35oCq5pe26Ze0XG4gICAgX2xhc3RTcHdhbkVuZXJteVRpbWU6IDAsXG4gICAgLy8g5Yi35oCq5Zue6LCDXG4gICAgX3Nwd2FuRW5lcm15Q2FsbGJhY2s6IG51bGwsXG4gICAgLy8g5ri45oiP57uT5p2f5Zue6LCDXG4gICAgX2dhbWVPdmVyQ2FsbGJhY2s6IG51bGwsXG4gICAgX2lzUGxheWluZzogZmFsc2UsXG5cbiAgICAvLyDliJ3lp4vljJZcbiAgICBpbml0OiBmdW5jdGlvbihtYXhHYW1lVGltZSwgbWF4TGlmZSwgc3B3YW5FbmVybXlDYWxsYmFjaywgZ2FtZU92ZXJDYWxsYmFjayl7XG4gICAgICAgIHRoaXMuX21heEdhbWVUaW1lID0gbWF4R2FtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xpZmUgPSB0aGlzLl9tYXhMaWZlID0gbWF4TGlmZTtcbiAgICAgICAgdGhpcy5fc3B3YW5FbmVybXlDYWxsYmFjayA9IHNwd2FuRW5lcm15Q2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX2dhbWVPdmVyQ2FsbGJhY2sgPSBnYW1lT3ZlckNhbGxiYWNrO1xuICAgIH0sXG5cbiAgICAvLyDlvIDlp4vmuLjmiI9cbiAgICBzdGFydDogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5fc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyDlupTlvZPmr4/luKfosIPnlKjmraTmlrnms5VcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKGR0KXtcbiAgICAgICAgaWYoIXRoaXMuX2lzUGxheWluZykgcmV0dXJuO1xuXG4gICAgICAgIC8vIOWJqeS9meaXtumXtFxuICAgICAgICBpZih0aGlzLmdldEdhbWVMZWZ0VGltZSgpID09IDApe1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g57Sv5Yqg5pe26Ze077yM5Yik5pat5piv5ZCm6KaB5Yi35oCqXG4gICAgICAgIHRoaXMuX2dhbWVUaW1lICs9IGR0O1xuXG4gICAgICAgIGlmKHRoaXMuX2dhbWVUaW1lID4gdGhpcy5fbGFzdFNwd2FuRW5lcm15VGltZSArIHRoaXMuX3Nwd2FuVGltZUdhcCl7XG4gICAgICAgICAgICB0aGlzLnN3cGFuRW5lcm15KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Yi35oCqXG4gICAgc3dwYW5FbmVybXk6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX2xhc3RTcHdhbkVuZXJteVRpbWUgPSB0aGlzLl9nYW1lVGltZTtcblxuICAgICAgICBpZih0aGlzLl9zcHdhbkVuZXJteUNhbGxiYWNrKXtcbiAgICAgICAgICAgIHRoaXMuX3Nwd2FuRW5lcm15Q2FsbGJhY2sodGhpcy5fZ2FtZVRpbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOaYr+WQpuato+WcqOa4uOaIj1xuICAgIGlzUGxheWluZzogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUGxheWluZztcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5ri45oiP5pe26Ze0XG4gICAgZ2V0R2FtZVRpbWU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9nYW1lVGltZTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5ri45oiP5Ymp5L2Z5pe26Ze0XG4gICAgZ2V0R2FtZUxlZnRUaW1lOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgdGhpcy5fbWF4R2FtZVRpbWUgLSB0aGlzLl9nYW1lVGltZSk7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlua4uOaIj+enr+WIhlxuICAgIGdldFNjb3JlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NvcmU7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlueUn+WRveWAvFxuICAgIGdldExpZmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9saWZlO1xuICAgIH0sXG5cbiAgICAvLyDlop7liqDnlJ/lkb3lgLxcbiAgICBhZGRMaWZlOiBmdW5jdGlvbihjbnQpe1xuICAgICAgICB0aGlzLl9saWZlICA9IE1hdGgubWluKHRoaXMuX21heExpZmUsIHRoaXMuX2xpZmUgKyBjbnQpO1xuICAgIH0sXG5cbiAgICAvLyDlh4/lsJHnlJ/lkb3lgLxcbiAgICByZWR1Y2VMaWZlOiBmdW5jdGlvbihjbnQpe1xuICAgICAgICB0aGlzLl9saWZlICA9IE1hdGgubWF4KDAsIHRoaXMuX2xpZmUgLSBjbnQpO1xuICAgICAgICBpZih0aGlzLl9saWZlID09IDApe1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWinuWKoOenr+WIhlxuICAgIGFkZFNjb3JlOiBmdW5jdGlvbihjbnQpe1xuICAgICAgICB0aGlzLl9zY29yZSArPSBjbnQ7XG4gICAgfSxcblxuICAgIC8vIOWHj+Wwkeenr+WIhlxuICAgIHJlZHVjZVNjb3JlOiBmdW5jdGlvbihjbnQpe1xuICAgICAgICB0aGlzLl9zY29yZSA9IE1hdGgubWF4KDAsIHRoaXMuX3Njb3JlIC0gY250KTtcbiAgICB9LFxuXG4gICAgLy8g5ri45oiP57uT5p2fXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICBpZih0aGlzLl9nYW1lT3ZlckNhbGxiYWNrKXtcbiAgICAgICAgICAgIHRoaXMuX2dhbWVPdmVyQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdhbWVMb2dpYzsiLCJ2YXIgZ2FtZUxvZ2ljID0gcmVxdWlyZSgnR2FtZUxvZ2ljJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIOaVjOS6uumihOWItuS7tlxuICAgICAgICBlbmVybXk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDmlYzkurrlrrnlmahcbiAgICAgICAgZW5lcm15Q29udGFpbmVyOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOa4uOaIj+aXtumXtFxuICAgICAgICB0aW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDmuLjmiI/np6/liIZcbiAgICAgICAgc2NvcmU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOeUn+WRveWAvFxuICAgICAgICBsaWZlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBHYW1lT3ZlclxuICAgICAgICBnYW1lT3ZlckxhYmVsOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5ZCv55So56Kw5pKeXG4gICAgICAgIHZhciBtYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICBtYW5hZ2VyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHZhciBnYW1lID0gdGhpcztcbiAgICAgICAgLy8g5Yid5aeL5YyWXG4gICAgICAgIGdhbWVMb2dpYy5pbml0KFxuICAgICAgICAgICAgLy8g5ri45oiP5pe26Ze0XG4gICAgICAgICAgICAzMCxcbiAgICAgICAgICAgIC8vIOacgOWkp+eUn+WRveWAvFxuICAgICAgICAgICAgMyxcbiAgICAgICAgICAgIC8vIOWIt+aAquWunueOsFxuICAgICAgICAgICAgZnVuY3Rpb24oZ2FtZVRpbWUpe1xuICAgICAgICAgICAgICAgIGdhbWUuc3B3YW4oZ2FtZVRpbWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIOe7k+adn+a4uOaIj+WunueOsFxuICAgICAgICAgICAgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBnYW1lLmdhbWVPdmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIC8vIOWQr+WKqOa4uOaIj1xuICAgICAgICBnYW1lTG9naWMuc3RhcnQoKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICBpZighZ2FtZUxvZ2ljLmlzUGxheWluZygpKSByZXR1cm47XG5cbiAgICAgICAgZ2FtZUxvZ2ljLnVwZGF0ZShkdCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlmZSgpO1xuICAgIH0sXG5cbiAgICAvLyDliLfmgKrlhbfkvZPlrp7njrBcbiAgICBzcHdhbjogZnVuY3Rpb24oZ2FtZVRpbWUpe1xuICAgICAgICB2YXIgaW5zdCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZW5lcm15KTtcbiAgICAgICAgdmFyIGVuZXJteSA9IGluc3QuZ2V0Q29tcG9uZW50KCdFbmVybXknKTtcbiAgICAgICAgaW5zdC5wYXJlbnQgPSB0aGlzLmVuZXJteUNvbnRhaW5lcjtcbiAgICAgICAgLy8g5Yi35oCq6IyD5Zu0IHggLTM1MCB+IDM1MCwgeSA3MDAgfiA4MDBcbiAgICAgICAgZW5lcm15LnNldFBvc2l0aW9uKE1hdGgucmFuZG9tKCkgKiA3MDAgLSAzNTAsIE1hdGgucmFuZG9tKCkgKiAxMDAgKyA3MDApO1xuICAgICAgICAvLyDpgJ/luqYg55u057q/5ZCR5LiL77yMeSAtNSB+IC0zMFxuICAgICAgICBlbmVybXkuc2V0U3BlZWQoMCwgTWF0aC5yYW5kb20oKSAqIDI1IC0gMzApO1xuICAgICAgICAvLyDnlJ/lkb3lkajmnJ8gNXNcbiAgICAgICAgZW5lcm15LnNldExpdmVMaW1pdCg1KTtcbiAgICB9LFxuXG4gICAgLy8g5pu05paw5pe26Ze0TGFiZWxcbiAgICB1cGRhdGVUaW1lOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnRpbWUuc3RyaW5nID0gJ+WJqeS9meaXtumXtDogJyArIGdhbWVMb2dpYy5nZXRHYW1lTGVmdFRpbWUoKS50b0ZpeGVkKDIpO1xuICAgIH0sIFxuXG4gICAgLy8g5pu05paw56ev5YiGXG4gICAgdXBkYXRlU2NvcmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc2NvcmUuc3RyaW5nID0gJ+W9k+WJjeenr+WIhjogJyArIGdhbWVMb2dpYy5nZXRTY29yZSgpO1xuICAgIH0sXG4gICAgXG4gICAgLy8g5pu05paw55Sf5ZG9XG4gICAgdXBkYXRlTGlmZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5saWZlLnN0cmluZyA9ICflvZPliY3nlJ/lkb06ICcgKyBnYW1lTG9naWMuZ2V0TGlmZSgpO1xuICAgIH0sXG5cbiAgICAvLyDmuLjmiI/nu5PmnZ/lhbfkvZPlrp7njrBcbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2NvcmUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVMaWZlKCk7XG5cbiAgICAgICAgaWYoZ2FtZUxvZ2ljLmdldEdhbWVMZWZ0VGltZSgpIDw9IDApe1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckxhYmVsLnN0cmluZyA9ICdZb3UgV2luIVxcbumqmuW5tOWPr+S7peeahCc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckxhYmVsLnN0cmluZyA9ICdHYW1lIE92ZXIhXFxu5aSq6I+c5LqGJztcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4iLCJ2YXIgZ2FtZUxvZ2ljID0gcmVxdWlyZSgnR2FtZUxvZ2ljJyk7XG52YXIgRmx5aW5nT2JqZWN0ID0gcmVxdWlyZSgnRmx5aW5nT2JqZWN0Jyk7XG5cbi8vIOW8gOeBq+mXtOmalO+8iOenku+8iVxudmFyIEZJUkVfR0FQID0gMC4zO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogRmx5aW5nT2JqZWN0LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0eXBlVGFnOiAnUGxheWVyUGxhbmUnLFxuXG4gICAgICAgIC8vIOWtkOW8uemihOWItuS7tlxuICAgICAgICBidWxsZXQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDlrZDlvLnlrrnlmahOb2RlXG4gICAgICAgIGJ1bGxldENvbnRhaW5lcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDmmK/lkKbmraPlnKjlvIDngatcbiAgICAgICAgX2lzRmlyaW5nOiB0cnVlLFxuICAgICAgICAvLyDkuIrmrKHlvIDngavoh7Pku4rml7bpl7RcbiAgICAgICAgX2xhc3RGaXJlVGltZVBhc3NlZDogMCxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgZG9PbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zZXRTcGVlZCgwLCAwKTtcbiAgICAgICAgdGhpcy5zZXRMaXZlTGltaXQoMCk7XG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICBpZighZ2FtZUxvZ2ljLmlzUGxheWluZygpKSByZXR1cm47XG5cbiAgICAgICAgLy8g5byA54GrXG4gICAgICAgIGlmKHRoaXMuX2lzRmlyaW5nICYmIHRoaXMuX2xhc3RGaXJlVGltZVBhc3NlZCA+PSBGSVJFX0dBUCl7XG4gICAgICAgICAgICB0aGlzLmZpcmUoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgKz0gZHQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25LZXlEb3duOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNwZWVkKC0xMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkucmlnaHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZCgxMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkudXA6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZCh1bmRlZmluZWQsIDEwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnM6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kb3duOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWQodW5kZWZpbmVkLCAtMTApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uS2V5VXA6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWQoMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkudXA6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5zOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZG93bjpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNwZWVkKHVuZGVmaW5lZCwgMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5byA54GrXG4gICAgZmlyZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyDkuIDmnaHlkb3ml7bvvIwz5Y+R5pWj5bCE77yM5YW25L2Z5Y2V5Y+RXG4gICAgICAgIGlmKGdhbWVMb2dpYy5nZXRMaWZlKCkgPT0gMSl7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTwzOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBidWxsZXRJbnN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xuICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSBidWxsZXRJbnN0LmdldENvbXBvbmVudCgnQnVsbGV0Jyk7XG4gICAgICAgICAgICAgICAgYnVsbGV0SW5zdC5wYXJlbnQgPSB0aGlzLmJ1bGxldENvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICBidWxsZXQuc2V0UG9zaXRpb24odGhpcy5ub2RlLnggKyBpICogMTAgLSAxMCwgdGhpcy5ub2RlLnkgKyAzMCk7XG4gICAgICAgICAgICAgICAgYnVsbGV0LnNldFNwZWVkKGkgKiAxMCAtIDEwLCAxNSk7XG4gICAgICAgICAgICAgICAgYnVsbGV0LnNldExpdmVMaW1pdCgzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHZhciBidWxsZXRJbnN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xuICAgICAgICAgICAgdmFyIGJ1bGxldCA9IGJ1bGxldEluc3QuZ2V0Q29tcG9uZW50KCdCdWxsZXQnKTtcbiAgICAgICAgICAgIGJ1bGxldEluc3QucGFyZW50ID0gdGhpcy5idWxsZXRDb250YWluZXI7XG4gICAgICAgICAgICBidWxsZXQuc2V0UG9zaXRpb24odGhpcy5ub2RlLngsIHRoaXMubm9kZS55ICsgMzApO1xuICAgICAgICAgICAgYnVsbGV0LnNldFNwZWVkKDAsIDE1KTtcbiAgICAgICAgICAgIGJ1bGxldC5zZXRMaXZlTGltaXQoMyk7XG4gICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgPSAwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiDlvZPnorDmkp7kuqfnlJ/nmoTml7blgJnosIPnlKhcbiAgICAgKiBAcGFyYW0gIHtDb2xsaWRlcn0gb3RoZXIg5Lqn55Sf56Kw5pKe55qE5Y+m5LiA5Liq56Kw5pKe57uE5Lu2XG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IHNlbGYgIOS6p+eUn+eisOaSnueahOiHqui6q+eahOeisOaSnue7hOS7tlxuICAgICAqL1xuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIChvdGhlciwgc2VsZikge1xuICAgICAgICB2YXIgZmx5aW5nT2JqID0gb3RoZXIuZ2V0Q29tcG9uZW50KCdGbHlpbmdPYmplY3QnKTtcbiAgICAgICAgdmFyIG90aGVyVHlwZVRhZyA9IGZseWluZ09iai50eXBlVGFnO1xuXG4gICAgICAgIGlmKG90aGVyVHlwZVRhZyA9PSAnRW5lcm15Jyl7XG4gICAgICAgICAgICBnYW1lTG9naWMucmVkdWNlTGlmZSgxKTtcbiAgICAgICAgICAgIGZseWluZ09iai5kb0Rlc3RvcnkoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9