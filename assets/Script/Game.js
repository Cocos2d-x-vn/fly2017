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

        // 生命值UI
        life: {
            default: null,
            type: cc.Label
        },

        // 背景
        bg: {
            default:null,
            type: cc.Node
        },

        // GameOver
        gameOverLabel: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        this.startGame();
    },

    // 开始游戏
    startGame: function(){
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
            function(gameTime){
                game.spwan(gameTime);
            },
            // 结束游戏实现
            function(){
                game.gameOver();
            }
        );
        // 启动游戏
        gameLogic.start();
        // 设置背景滚动速度
        this.bg.getComponent('ScrollBackground').speed = 10;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(!gameLogic.isPlaying()) return;

        // 运行游戏逻辑
        gameLogic.update(dt);

        // 更新各种UI
        this.updateTime();
        this.updateScore();
        this.updateLife();

        // 背景滚动
        this.bg.getComponent('ScrollBackground').scroll(dt);
    },

    // 刷怪具体实现
    spwan: function(gameTime){
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
    updateTime: function(){
        this.time.string = '剩余时间: ' + gameLogic.getGameLeftTime().toFixed(2);
    }, 

    // 更新积分
    updateScore: function(){
        this.score.string = '当前积分: ' + gameLogic.getScore();
    },
    
    // 更新生命
    updateLife: function(){
        this.life.string = '当前生命: ' + gameLogic.getLife();
    },

    // 游戏结束具体实现
    gameOver: function(){
        // 关闭碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = false;

        this.updateTime();
        this.updateScore();
        this.updateLife();

        if(gameLogic.getLife() > 0){
            this.gameOverLabel.string = 'You Win!\n骚年可以的';
        }else{
            this.gameOverLabel.string = 'Game Over!\n太菜了';
        }
    }

});
