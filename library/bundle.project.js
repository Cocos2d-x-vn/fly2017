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
        _y: 0,
        // 限制移动范围
        _moveRect: null
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
        if (this._speedX != 0 || this._speedY != 0) {
            if (!this._moveRect) {
                this._x += this._speedX;
                this._y += this._speedY;
            } else {
                this._x = Math.min(Math.max(this._moveRect.x, this._x + this._speedX), this._moveRect.xMax);
                this._y = Math.min(Math.max(this._moveRect.y, this._y + this._speedY), this._moveRect.yMax);
                cc.log('Plane (%s, %s)', this._x, this._y);
            }

            this.updatePosition();
        }

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

    // 设置限制移动范围
    setMoveRect: function setMoveRect(x, y, w, h) {
        this._moveRect = cc.rect(x, y, w, h);
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
        this.setMoveRect(-350, -647, 700, 1300);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9TY3JpcHQvQnVsbGV0LmpzIiwiYXNzZXRzL1NjcmlwdC9FbmVybXkuanMiLCJhc3NldHMvU2NyaXB0L0ZseWluZ09iamVjdC5qcyIsImFzc2V0cy9TY3JpcHQvR2FtZUxvZ2ljLmpzIiwiYXNzZXRzL1NjcmlwdC9HYW1lLmpzIiwiYXNzZXRzL1NjcmlwdC9QbGF5ZXJQbGFuZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFEUTs7QUFJWjtBQUNJO0FBQ0g7O0FBRUQ7QUFDSTtBQUNIOztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBNUJJOzs7Ozs7Ozs7O0FDSFQ7O0FBRUE7QUFDSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBTlE7O0FBU1o7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7O0FBRUE7QUFDQTs7QUFFQTtBQUVJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7Ozs7O0FBS0E7O0FBbkRLOzs7Ozs7Ozs7O0FDRFQ7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZlE7O0FBa0JaO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBRUk7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNIOztBQUVEO0FBQ0E7QUFDSDs7QUFFRDtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTtBQUNIOztBQW5ISTs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRDtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDSTs7QUFFQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0g7QUFDSjs7QUF0SFc7O0FBMEhoQjs7Ozs7Ozs7OztBQzVIQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFGSTs7QUFLUjtBQUNBO0FBQ0k7QUFDQTtBQUZhOztBQUtqQjtBQUNBO0FBQ0k7QUFDQTtBQUZFOztBQUtOO0FBQ0E7QUFDSTtBQUNBO0FBRkc7O0FBS1A7QUFDQTtBQUNJO0FBQ0E7QUFGRTs7QUFLTjtBQUNBO0FBQ0k7QUFDQTtBQUZXO0FBaENQOztBQXNDWjtBQUNBO0FBQ0k7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSDtBQUVMO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7QUFFRDtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0g7QUFDRztBQUNIO0FBQ0o7O0FBcEhJOzs7Ozs7Ozs7O0FDRlQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUZJOztBQUtSO0FBQ0E7QUFDSTtBQUNBO0FBRmE7O0FBS2pCO0FBQ0E7QUFDQTtBQUNBO0FBbEJROztBQXFCWjtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7O0FBRUQ7QUFDQTtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNKOztBQUVEO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNKO0FBQ0E7QUFDSTtBQUNBO0FBQ0o7QUFDQTtBQUNJO0FBQ0E7QUFDSjtBQUNBO0FBQ0k7QUFDQTtBQWhCUjtBQWtCSDs7QUFFRDtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBWlI7QUFjSDs7QUFFRDtBQUNBOztBQUVJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjtBQUNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDSjs7QUExSEkiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ2FtZUxvZ2ljID0gcmVxdWlyZSgnR2FtZUxvZ2ljJyk7XG52YXIgRmx5aW5nT2JqZWN0ID0gcmVxdWlyZSgnRmx5aW5nT2JqZWN0Jyk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBGbHlpbmdPYmplY3QsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHR5cGVUYWc6ICdCdWxsZXQnXG4gICAgfSxcblxuICAgIGRvT25Mb2FkOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyBjYy5sb2coJ2J1bGxldCBzcGVlZCAtIG9uTG9hZDogKCVzLCAlcyknLCB0aGlzLl9zcGVlZFgsIHRoaXMuX3NwZWVkWSk7XG4gICAgfSxcblxuICAgIGRvVXBkYXRlOiBmdW5jdGlvbihkdCl7XG4gICAgICAgIC8vIGNjLmxvZygnQnVsbGV0LmRvVXBkYXRlKCVzKScsIGR0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5b2T56Kw5pKe5Lqn55Sf55qE5pe25YCZ6LCD55SoXG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IG90aGVyIOS6p+eUn+eisOaSnueahOWPpuS4gOS4queisOaSnue7hOS7tlxuICAgICAqIEBwYXJhbSAge0NvbGxpZGVyfSBzZWxmICDkuqfnlJ/norDmkp7nmoToh6rouqvnmoTnorDmkp7nu4Tku7ZcbiAgICAgKi9cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiAob3RoZXIsIHNlbGYpIHtcbiAgICAgICAgdmFyIGZseWluZ09iaiA9IG90aGVyLmdldENvbXBvbmVudCgnRmx5aW5nT2JqZWN0Jyk7XG4gICAgICAgIHZhciBvdGhlclR5cGVUYWcgPSBmbHlpbmdPYmoudHlwZVRhZztcblxuICAgICAgICBpZihvdGhlclR5cGVUYWcgPT0gJ0VuZXJteScpe1xuICAgICAgICAgICAgZ2FtZUxvZ2ljLmFkZFNjb3JlKDEwKTtcbiAgICAgICAgICAgIGZseWluZ09iai5kb0Rlc3RvcnkoKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwidmFyIEZseWluZ09iamVjdCA9IHJlcXVpcmUoJ0ZseWluZ09iamVjdCcpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogRmx5aW5nT2JqZWN0LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0eXBlVGFnOiAnRW5lcm15JyxcblxuICAgICAgICAvLyDlop7liqDkuIDkupvotqPlkbPvvIzmpoLnjofliIboo4JcbiAgICAgICAgX3NwbGl0RW5hYmxlOiB0cnVlLFxuICAgICAgICBfc3BsaXRSYXRlOiAwLjgsXG4gICAgICAgIF9zcGxpdFk6IG51bGwsXG4gICAgfSxcbiAgICBcbiAgICBkb09uTG9hZDogZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gY2MubG9nKCdFbmVybXkgc3BlZWQgLSBvbkxvYWQ6ICglcywgJXMpJywgdGhpcy5fc3BlZWRYLCB0aGlzLl9zcGVlZFkpO1xuICAgICAgICBpZih0aGlzLl9zcGxpdEVuYWJsZSAmJiBNYXRoLnJhbmRvbSgpIDwgdGhpcy5fc3BsaXRSYXRlKXtcbiAgICAgICAgICAgIHRoaXMuX3NwbGl0WSA9IHRoaXMuX3kgLSBNYXRoLnJhbmRvbSgpICogMzAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRvVXBkYXRlOiBmdW5jdGlvbihkdCl7XG4gICAgICAgIC8vIGNjLmxvZygnRW5lcm15LmRvVXBkYXRlKCVzKScsIGR0KTtcbiAgICAgICAgLy8g5YiG6KOCXG4gICAgICAgIGlmKHRoaXMuX3NwbGl0RW5hYmxlICYmIHRoaXMuX3NwbGl0WSAhPSBudWxsICYmIHRoaXMuX3kgPCB0aGlzLl9zcGxpdFkpe1xuICAgICAgICAgICAgdGhpcy5fc3BsaXRZID0gbnVsbDtcblxuICAgICAgICAgICAgdmFyIHggPSB0aGlzLm5vZGUueDtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5ub2RlLnk7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPDM7IGkrKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RW5lcm15Tm9kZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubm9kZSk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0VuZXJteSA9IG5ld0VuZXJteU5vZGUuZ2V0Q29tcG9uZW50KCdFbmVybXknKTtcblxuICAgICAgICAgICAgICAgIG5ld0VuZXJteU5vZGUucGFyZW50ID0gdGhpcy5ub2RlLnBhcmVudDtcbiAgICAgICAgICAgICAgICBuZXdFbmVybXkuc2V0U3BsaXRFbmFibGUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIG5ld0VuZXJteS5zZXRQb3NpdGlvbih0aGlzLm5vZGUueCArIGkgKiAxMCAtIDEwLCB0aGlzLm5vZGUueSk7XG4gICAgICAgICAgICAgICAgbmV3RW5lcm15LnNldFNwZWVkKGkgKiAxMCAtIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDorr7nva7mmK/lkKblj6/ku6XliIboo4JcbiAgICBzZXRTcGxpdEVuYWJsZTogZnVuY3Rpb24oZW5hYmxlKXtcbiAgICAgICAgdGhpcy5fc3BsaXRFbmFibGUgPSBlbmFibGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOW9k+eisOaSnuS6p+eUn+eahOaXtuWAmeiwg+eUqFxuICAgICAqIEBwYXJhbSAge0NvbGxpZGVyfSBvdGhlciDkuqfnlJ/norDmkp7nmoTlj6bkuIDkuKrnorDmkp7nu4Tku7ZcbiAgICAgKiBAcGFyYW0gIHtDb2xsaWRlcn0gc2VsZiAg5Lqn55Sf56Kw5pKe55qE6Ieq6Lqr55qE56Kw5pKe57uE5Lu2XG4gICAgICovXG4gICAgb25Db2xsaXNpb25FbnRlcjogZnVuY3Rpb24gKG90aGVyLCBzZWxmKSB7XG5cbiAgICB9XG4gICAgXG59KTtcbiIsIlxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g5qCH562+77yM55So5LqO57G75Z6L5Yik5patXG4gICAgICAgIHR5cGVUYWc6ICdGbHlpbmdPYmplY3QnLFxuXG4gICAgICAgIC8vIOW9k+WJjeWtmOa0u+aXtumXtCjnp5IpXG4gICAgICAgIF9saXZlVGltZTogMCxcbiAgICAgICAgLy8g5a2Y5rS75pe26Ze06ZmQ5Yi277yI56eS77yJ77yM5Yiw6L6+6K+l5YC85pe26Ieq5Yqo6ZSA5q+B77yM5Li6MOihqOekuuawuOS5heWtmOWcqFxuICAgICAgICBfbGl2ZVRpbWVMaW1pdDogMCxcbiAgICAgICAgLy8g6YCf5bqmXG4gICAgICAgIF9zcGVlZFg6IDAsXG4gICAgICAgIF9zcGVlZFk6IDAsXG4gICAgICAgIC8vIOS9jee9rlxuICAgICAgICBfeDogMCxcbiAgICAgICAgX3k6IDAsXG4gICAgICAgIC8vIOmZkOWItuenu+WKqOiMg+WbtFxuICAgICAgICBfbW92ZVJlY3Q6IG51bGxcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgLy8gbG9naWMgb25Mb2FkXG4gICAgICAgIHRoaXMuZG9PbkxvYWQoKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICBpZiAoICFjYy5pc1ZhbGlkKHRoaXMubm9kZSkgKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOWtmOa0u+ajgOa1i1xuICAgICAgICB0aGlzLl9saXZlVGltZSArPSBkdDtcbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLmNoZWNrTGl2ZUxpbWl0KCkpe1xuICAgICAgICAgICAgdGhpcy5kb0Rlc3RvcnkoKTsgICAgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb3ZlXG4gICAgICAgIGlmKHRoaXMuX3NwZWVkWCAhPSAwIHx8IHRoaXMuX3NwZWVkWSAhPSAwKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZighdGhpcy5fbW92ZVJlY3Qpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3ggKz0gdGhpcy5fc3BlZWRYO1xuICAgICAgICAgICAgICAgIHRoaXMuX3kgKz0gdGhpcy5fc3BlZWRZO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5feCA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMuX21vdmVSZWN0LngsIHRoaXMuX3ggKyB0aGlzLl9zcGVlZFgpLCB0aGlzLl9tb3ZlUmVjdC54TWF4KTtcbiAgICAgICAgICAgICAgICB0aGlzLl95ID0gTWF0aC5taW4oTWF0aC5tYXgodGhpcy5fbW92ZVJlY3QueSwgdGhpcy5feSArIHRoaXMuX3NwZWVkWSksIHRoaXMuX21vdmVSZWN0LnlNYXgpO1xuICAgICAgICAgICAgICAgIGNjLmxvZygnUGxhbmUgKCVzLCAlcyknLCB0aGlzLl94LCB0aGlzLl95KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBsb2dpYyB1cGRhdGVcbiAgICAgICAgdGhpcy5kb1VwZGF0ZShkdCk7XG4gICAgfSxcblxuICAgIGRvT25Mb2FkOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyDkuIDoiKznlLHlrZDnsbvlrp7njrDlhbfkvZPpgLvovpFcbiAgICB9LFxuXG4gICAgLy8g5omn6KGM5q+P5bindXBkYXRl5pON5L2c77yM5LiA6Iis5a2Q57G76KaG55uW5q2k5pa55rOVXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uKGR0KXtcbiAgICAgICAgLy8g5LiA6Iis55Sx5a2Q57G75a6e546w5YW35L2T6YC76L6RXG4gICAgICAgIC8vIGNjLmxvZygnRmx5YWluZ09iamVjdC5kb1VwZGF0ZSglcyknLCBkdCk7XG4gICAgfSxcblxuICAgIC8vIOmUgOavgVxuICAgIGRvRGVzdG9yeTogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCBjYy5pc1ZhbGlkKHRoaXMubm9kZSkgKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiuvue9ruWtmOa0u+mZkOWItuaXtumXtO+8iOenku+8ie+8jDDkuLrml6DpmZBcbiAgICBzZXRMaXZlTGltaXQ6IGZ1bmN0aW9uKHRpbWUpe1xuICAgICAgICB0aGlzLl9saXZlVGltZUxpbWl0ID0gdGltZTtcbiAgICB9LFxuXG4gICAgLy8g6K6+572u6YCf5bqmXG4gICAgc2V0U3BlZWQ6IGZ1bmN0aW9uKHhTcGVlZCwgeVNwZWVkKXtcbiAgICAgICAgaWYoeFNwZWVkICE9IHVuZGVmaW5lZCkgdGhpcy5fc3BlZWRYID0geFNwZWVkO1xuICAgICAgICBpZih5U3BlZWQgIT0gdW5kZWZpbmVkKSB0aGlzLl9zcGVlZFkgPSB5U3BlZWQ7XG4gICAgfSxcblxuICAgIC8vIOiuvuWumuS9jee9rlxuICAgIHNldFBvc2l0aW9uOiBmdW5jdGlvbih4LCB5KXtcbiAgICAgICAgdGhpcy5feCA9IHg7XG4gICAgICAgIHRoaXMuX3kgPSB5O1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfSxcblxuICAgIC8vIOiuvue9rumZkOWItuenu+WKqOiMg+WbtFxuICAgIHNldE1vdmVSZWN0OiBmdW5jdGlvbih4LCB5LCB3LCBoKXtcbiAgICAgICAgdGhpcy5fbW92ZVJlY3QgPSBjYy5yZWN0KHgsIHksIHcsIGgpO1xuICAgIH0sXG5cbiAgICAvLyDmm7TmlrDkvY3nva5cbiAgICB1cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYodGhpcy5ub2RlKXtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5feDtcbiAgICAgICAgICAgIHRoaXMubm9kZS55ID0gdGhpcy5feTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBjYy53YXJuKCdGbHlpbmdPYmplY3QuanM6IHVwZGF0ZVBvc2l0aW9uIGJ1dCBbdGhpcy5ub2RlXSBpcyBudWxsLicpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOajgOafpeWtmOa0u+mZkOWItu+8jOi/lOWbnuaYr+WQpuWtmOa0u1xuICAgIGNoZWNrTGl2ZUxpbWl0OiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbGl2ZVRpbWVMaW1pdCA8PSAwIHx8IHRoaXMuX2xpdmVUaW1lIDwgdGhpcy5fbGl2ZVRpbWVMaW1pdDtcbiAgICB9XG5cbn0pO1xuIiwiXG4vLyDmuLjmiI/moLjlv4PpgLvovpFcbnZhciBnYW1lTG9naWMgPSB7XG4gICAgLy8g5ri45oiP5pe26Ze0XG4gICAgX2dhbWVUaW1lOiAwLFxuICAgIF9tYXhHYW1lVGltZTogNjAsXG4gICAgLy8g5ri45oiP56ev5YiGXG4gICAgX3Njb3JlOiAwLFxuICAgIC8vIOeUn+WRveWAvFxuICAgIF9saWZlOiAxLFxuICAgIF9tYXhMaWZlOiAxLFxuICAgIC8vIOaVjOS6uuaVsOe7hFxuICAgIF9lbmVybXlMaXN0OiBbXSxcbiAgICAvLyDlrZDlvLnmlbDnu4RcbiAgICBfYnVsbGV0TGlzdDogW10sXG4gICAgLy8g5Yi35oCq5ZGo5pyf77yI56eS77yJXG4gICAgX3Nwd2FuVGltZUdhcDogMC41LFxuICAgIC8vIOS4iuasoeWIt+aAquaXtumXtFxuICAgIF9sYXN0U3B3YW5FbmVybXlUaW1lOiAwLFxuICAgIC8vIOWIt+aAquWbnuiwg1xuICAgIF9zcHdhbkVuZXJteUNhbGxiYWNrOiBudWxsLFxuICAgIC8vIOa4uOaIj+e7k+adn+Wbnuiwg1xuICAgIF9nYW1lT3ZlckNhbGxiYWNrOiBudWxsLFxuICAgIF9pc1BsYXlpbmc6IGZhbHNlLFxuXG4gICAgLy8g5Yid5aeL5YyWXG4gICAgaW5pdDogZnVuY3Rpb24obWF4R2FtZVRpbWUsIG1heExpZmUsIHNwd2FuRW5lcm15Q2FsbGJhY2ssIGdhbWVPdmVyQ2FsbGJhY2spe1xuICAgICAgICB0aGlzLl9tYXhHYW1lVGltZSA9IG1heEdhbWVUaW1lO1xuICAgICAgICB0aGlzLl9saWZlID0gdGhpcy5fbWF4TGlmZSA9IG1heExpZmU7XG4gICAgICAgIHRoaXMuX3Nwd2FuRW5lcm15Q2FsbGJhY2sgPSBzcHdhbkVuZXJteUNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9nYW1lT3ZlckNhbGxiYWNrID0gZ2FtZU92ZXJDYWxsYmFjaztcbiAgICB9LFxuXG4gICAgLy8g5byA5aeL5ri45oiPXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuX3Njb3JlID0gMDtcbiAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8g5bqU5b2T5q+P5bin6LCD55So5q2k5pa55rOVXG4gICAgdXBkYXRlOiBmdW5jdGlvbihkdCl7XG4gICAgICAgIGlmKCF0aGlzLl9pc1BsYXlpbmcpIHJldHVybjtcblxuICAgICAgICAvLyDliankvZnml7bpl7RcbiAgICAgICAgaWYodGhpcy5nZXRHYW1lTGVmdFRpbWUoKSA9PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOe0r+WKoOaXtumXtO+8jOWIpOaWreaYr+WQpuimgeWIt+aAqlxuICAgICAgICB0aGlzLl9nYW1lVGltZSArPSBkdDtcblxuICAgICAgICBpZih0aGlzLl9nYW1lVGltZSA+IHRoaXMuX2xhc3RTcHdhbkVuZXJteVRpbWUgKyB0aGlzLl9zcHdhblRpbWVHYXApe1xuICAgICAgICAgICAgdGhpcy5zd3BhbkVuZXJteSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWIt+aAqlxuICAgIHN3cGFuRW5lcm15OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9sYXN0U3B3YW5FbmVybXlUaW1lID0gdGhpcy5fZ2FtZVRpbWU7XG5cbiAgICAgICAgaWYodGhpcy5fc3B3YW5FbmVybXlDYWxsYmFjayl7XG4gICAgICAgICAgICB0aGlzLl9zcHdhbkVuZXJteUNhbGxiYWNrKHRoaXMuX2dhbWVUaW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDmmK/lkKbmraPlnKjmuLjmiI9cbiAgICBpc1BsYXlpbmc6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BsYXlpbmc7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlua4uOaIj+aXtumXtFxuICAgIGdldEdhbWVUaW1lOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2FtZVRpbWU7XG4gICAgfSxcblxuICAgIC8vIOiOt+WPlua4uOaIj+WJqeS9meaXtumXtFxuICAgIGdldEdhbWVMZWZ0VGltZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIHRoaXMuX21heEdhbWVUaW1lIC0gdGhpcy5fZ2FtZVRpbWUpO1xuICAgIH0sXG5cbiAgICAvLyDojrflj5bmuLjmiI/np6/liIZcbiAgICBnZXRTY29yZTogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njb3JlO1xuICAgIH0sXG5cbiAgICAvLyDojrflj5bnlJ/lkb3lgLxcbiAgICBnZXRMaWZlOiBmdW5jdGlvbigpe1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlmZTtcbiAgICB9LFxuXG4gICAgLy8g5aKe5Yqg55Sf5ZG95YC8XG4gICAgYWRkTGlmZTogZnVuY3Rpb24oY250KXtcbiAgICAgICAgdGhpcy5fbGlmZSAgPSBNYXRoLm1pbih0aGlzLl9tYXhMaWZlLCB0aGlzLl9saWZlICsgY250KTtcbiAgICB9LFxuXG4gICAgLy8g5YeP5bCR55Sf5ZG95YC8XG4gICAgcmVkdWNlTGlmZTogZnVuY3Rpb24oY250KXtcbiAgICAgICAgdGhpcy5fbGlmZSAgPSBNYXRoLm1heCgwLCB0aGlzLl9saWZlIC0gY250KTtcbiAgICAgICAgaWYodGhpcy5fbGlmZSA9PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDlop7liqDnp6/liIZcbiAgICBhZGRTY29yZTogZnVuY3Rpb24oY250KXtcbiAgICAgICAgdGhpcy5fc2NvcmUgKz0gY250O1xuICAgIH0sXG5cbiAgICAvLyDlh4/lsJHnp6/liIZcbiAgICByZWR1Y2VTY29yZTogZnVuY3Rpb24oY250KXtcbiAgICAgICAgdGhpcy5fc2NvcmUgPSBNYXRoLm1heCgwLCB0aGlzLl9zY29yZSAtIGNudCk7XG4gICAgfSxcblxuICAgIC8vIOa4uOaIj+e7k+adn1xuICAgIGdhbWVPdmVyOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYodGhpcy5fZ2FtZU92ZXJDYWxsYmFjayl7XG4gICAgICAgICAgICB0aGlzLl9nYW1lT3ZlckNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnYW1lTG9naWM7IiwidmFyIGdhbWVMb2dpYyA9IHJlcXVpcmUoJ0dhbWVMb2dpYycpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDmlYzkurrpooTliLbku7ZcbiAgICAgICAgZW5lcm15OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g5pWM5Lq65a655ZmoXG4gICAgICAgIGVuZXJteUNvbnRhaW5lcjoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDmuLjmiI/ml7bpl7RcbiAgICAgICAgdGltZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g5ri45oiP56ev5YiGXG4gICAgICAgIHNjb3JlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDnlJ/lkb3lgLxcbiAgICAgICAgbGlmZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZU92ZXJcbiAgICAgICAgZ2FtZU92ZXJMYWJlbDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWQr+eUqOeisOaSnlxuICAgICAgICB2YXIgbWFuYWdlciA9IGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKTtcbiAgICAgICAgbWFuYWdlci5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB2YXIgZ2FtZSA9IHRoaXM7XG4gICAgICAgIC8vIOWIneWni+WMllxuICAgICAgICBnYW1lTG9naWMuaW5pdChcbiAgICAgICAgICAgIC8vIOa4uOaIj+aXtumXtFxuICAgICAgICAgICAgMzAsXG4gICAgICAgICAgICAvLyDmnIDlpKfnlJ/lkb3lgLxcbiAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAvLyDliLfmgKrlrp7njrBcbiAgICAgICAgICAgIGZ1bmN0aW9uKGdhbWVUaW1lKXtcbiAgICAgICAgICAgICAgICBnYW1lLnNwd2FuKGdhbWVUaW1lKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyDnu5PmnZ/muLjmiI/lrp7njrBcbiAgICAgICAgICAgIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgZ2FtZS5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAvLyDlkK/liqjmuLjmiI9cbiAgICAgICAgZ2FtZUxvZ2ljLnN0YXJ0KCk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgaWYoIWdhbWVMb2dpYy5pc1BsYXlpbmcoKSkgcmV0dXJuO1xuXG4gICAgICAgIGdhbWVMb2dpYy51cGRhdGUoZHQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTY29yZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZUxpZmUoKTtcbiAgICB9LFxuXG4gICAgLy8g5Yi35oCq5YW35L2T5a6e546wXG4gICAgc3B3YW46IGZ1bmN0aW9uKGdhbWVUaW1lKXtcbiAgICAgICAgdmFyIGluc3QgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmVuZXJteSk7XG4gICAgICAgIHZhciBlbmVybXkgPSBpbnN0LmdldENvbXBvbmVudCgnRW5lcm15Jyk7XG4gICAgICAgIGluc3QucGFyZW50ID0gdGhpcy5lbmVybXlDb250YWluZXI7XG4gICAgICAgIC8vIOWIt+aAquiMg+WbtCB4IC0zNTAgfiAzNTAsIHkgNzAwIH4gODAwXG4gICAgICAgIGVuZXJteS5zZXRQb3NpdGlvbihNYXRoLnJhbmRvbSgpICogNzAwIC0gMzUwLCBNYXRoLnJhbmRvbSgpICogMTAwICsgNzAwKTtcbiAgICAgICAgLy8g6YCf5bqmIOebtOe6v+WQkeS4i++8jHkgLTUgfiAtMzBcbiAgICAgICAgZW5lcm15LnNldFNwZWVkKDAsIE1hdGgucmFuZG9tKCkgKiAyNSAtIDMwKTtcbiAgICAgICAgLy8g55Sf5ZG95ZGo5pyfIDVzXG4gICAgICAgIGVuZXJteS5zZXRMaXZlTGltaXQoNSk7XG4gICAgfSxcblxuICAgIC8vIOabtOaWsOaXtumXtExhYmVsXG4gICAgdXBkYXRlVGltZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy50aW1lLnN0cmluZyA9ICfliankvZnml7bpl7Q6ICcgKyBnYW1lTG9naWMuZ2V0R2FtZUxlZnRUaW1lKCkudG9GaXhlZCgyKTtcbiAgICB9LCBcblxuICAgIC8vIOabtOaWsOenr+WIhlxuICAgIHVwZGF0ZVNjb3JlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnNjb3JlLnN0cmluZyA9ICflvZPliY3np6/liIY6ICcgKyBnYW1lTG9naWMuZ2V0U2NvcmUoKTtcbiAgICB9LFxuICAgIFxuICAgIC8vIOabtOaWsOeUn+WRvVxuICAgIHVwZGF0ZUxpZmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMubGlmZS5zdHJpbmcgPSAn5b2T5YmN55Sf5ZG9OiAnICsgZ2FtZUxvZ2ljLmdldExpZmUoKTtcbiAgICB9LFxuXG4gICAgLy8g5ri45oiP57uT5p2f5YW35L2T5a6e546wXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMudXBkYXRlVGltZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlmZSgpO1xuXG4gICAgICAgIGlmKGdhbWVMb2dpYy5nZXRHYW1lTGVmdFRpbWUoKSA8PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXJMYWJlbC5zdHJpbmcgPSAnWW91IFdpbiFcXG7pqprlubTlj6/ku6XnmoQnO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXJMYWJlbC5zdHJpbmcgPSAnR2FtZSBPdmVyIVxcbuWkquiPnOS6hic7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuIiwidmFyIGdhbWVMb2dpYyA9IHJlcXVpcmUoJ0dhbWVMb2dpYycpO1xudmFyIEZseWluZ09iamVjdCA9IHJlcXVpcmUoJ0ZseWluZ09iamVjdCcpO1xuXG4vLyDlvIDngavpl7TpmpTvvIjnp5LvvIlcbnZhciBGSVJFX0dBUCA9IDAuMztcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IEZseWluZ09iamVjdCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZVRhZzogJ1BsYXllclBsYW5lJyxcblxuICAgICAgICAvLyDlrZDlvLnpooTliLbku7ZcbiAgICAgICAgYnVsbGV0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g5a2Q5by55a655ZmoTm9kZVxuICAgICAgICBidWxsZXRDb250YWluZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g5piv5ZCm5q2j5Zyo5byA54GrXG4gICAgICAgIF9pc0ZpcmluZzogdHJ1ZSxcbiAgICAgICAgLy8g5LiK5qyh5byA54Gr6Iez5LuK5pe26Ze0XG4gICAgICAgIF9sYXN0RmlyZVRpbWVQYXNzZWQ6IDAsXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIGRvT25Mb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc2V0U3BlZWQoMCwgMCk7XG4gICAgICAgIHRoaXMuc2V0TGl2ZUxpbWl0KDApO1xuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSk7XG4gICAgICAgIHRoaXMuc2V0TW92ZVJlY3QoLTM1MCwgLTY0NywgNzAwLCAxMzAwKTtcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLCB0aGlzLm9uS2V5RG93biwgdGhpcyk7XG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgZG9VcGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuICAgICAgICBpZighZ2FtZUxvZ2ljLmlzUGxheWluZygpKSByZXR1cm47XG5cbiAgICAgICAgLy8g5byA54GrXG4gICAgICAgIGlmKHRoaXMuX2lzRmlyaW5nICYmIHRoaXMuX2xhc3RGaXJlVGltZVBhc3NlZCA+PSBGSVJFX0dBUCl7XG4gICAgICAgICAgICB0aGlzLmZpcmUoKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgKz0gZHQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25LZXlEb3duOiBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHN3aXRjaChldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNwZWVkKC0xMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkucmlnaHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZCgxMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkudXA6XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTcGVlZCh1bmRlZmluZWQsIDEwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnM6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5kb3duOlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWQodW5kZWZpbmVkLCAtMTApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uS2V5VXA6IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgc3dpdGNoKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3BlZWQoMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS53OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkudXA6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5zOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZG93bjpcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNwZWVkKHVuZGVmaW5lZCwgMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5byA54GrXG4gICAgZmlyZTogZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyDkuIDmnaHlkb3ml7bvvIwz5Y+R5pWj5bCE77yM5YW25L2Z5Y2V5Y+RXG4gICAgICAgIGlmKGdhbWVMb2dpYy5nZXRMaWZlKCkgPT0gMSl7XG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTwzOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBidWxsZXRJbnN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xuICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSBidWxsZXRJbnN0LmdldENvbXBvbmVudCgnQnVsbGV0Jyk7XG4gICAgICAgICAgICAgICAgYnVsbGV0SW5zdC5wYXJlbnQgPSB0aGlzLmJ1bGxldENvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICBidWxsZXQuc2V0UG9zaXRpb24odGhpcy5ub2RlLnggKyBpICogMTAgLSAxMCwgdGhpcy5ub2RlLnkgKyAzMCk7XG4gICAgICAgICAgICAgICAgYnVsbGV0LnNldFNwZWVkKGkgKiAxMCAtIDEwLCAxNSk7XG4gICAgICAgICAgICAgICAgYnVsbGV0LnNldExpdmVMaW1pdCgzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHZhciBidWxsZXRJbnN0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5idWxsZXQpO1xuICAgICAgICAgICAgdmFyIGJ1bGxldCA9IGJ1bGxldEluc3QuZ2V0Q29tcG9uZW50KCdCdWxsZXQnKTtcbiAgICAgICAgICAgIGJ1bGxldEluc3QucGFyZW50ID0gdGhpcy5idWxsZXRDb250YWluZXI7XG4gICAgICAgICAgICBidWxsZXQuc2V0UG9zaXRpb24odGhpcy5ub2RlLngsIHRoaXMubm9kZS55ICsgMzApO1xuICAgICAgICAgICAgYnVsbGV0LnNldFNwZWVkKDAsIDE1KTtcbiAgICAgICAgICAgIGJ1bGxldC5zZXRMaXZlTGltaXQoMyk7XG4gICAgICAgICAgICB0aGlzLl9sYXN0RmlyZVRpbWVQYXNzZWQgPSAwO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiDlvZPnorDmkp7kuqfnlJ/nmoTml7blgJnosIPnlKhcbiAgICAgKiBAcGFyYW0gIHtDb2xsaWRlcn0gb3RoZXIg5Lqn55Sf56Kw5pKe55qE5Y+m5LiA5Liq56Kw5pKe57uE5Lu2XG4gICAgICogQHBhcmFtICB7Q29sbGlkZXJ9IHNlbGYgIOS6p+eUn+eisOaSnueahOiHqui6q+eahOeisOaSnue7hOS7tlxuICAgICAqL1xuICAgIG9uQ29sbGlzaW9uRW50ZXI6IGZ1bmN0aW9uIChvdGhlciwgc2VsZikge1xuICAgICAgICB2YXIgZmx5aW5nT2JqID0gb3RoZXIuZ2V0Q29tcG9uZW50KCdGbHlpbmdPYmplY3QnKTtcbiAgICAgICAgdmFyIG90aGVyVHlwZVRhZyA9IGZseWluZ09iai50eXBlVGFnO1xuXG4gICAgICAgIGlmKG90aGVyVHlwZVRhZyA9PSAnRW5lcm15Jyl7XG4gICAgICAgICAgICBnYW1lTG9naWMucmVkdWNlTGlmZSgxKTtcbiAgICAgICAgICAgIGZseWluZ09iai5kb0Rlc3RvcnkoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9