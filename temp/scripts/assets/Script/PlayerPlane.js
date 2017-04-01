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