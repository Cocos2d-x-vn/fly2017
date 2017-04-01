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