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