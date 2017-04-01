var gameLogic = require('GameLogic');
var FlyingObject = require('FlyingObject');

// 开火间隔（秒）
var FIRE_GAP = 0.3;

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: {
            default: 'PlayerPlane',
            override: true
        },

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
        _lastFireTimePassed: 0,

        // 键盘相关记录（0=抬起，1=按下）
        _keyLeftPress: 0,
        _keyRightPress: 0,
        _keyUpPress: 0,
        _keyDownPress: 0,

        // 触摸相关记录
        _currTouchPos: null,

        // 上一帧位置
        _lastX: 0,
        _lastY: 0,

        // 飞机图集
        _atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        _currAtlasFrame: null,
    },

    // use this for initialization
    doOnLoad: function () {
        // 暂存图集，用于切换
        var self = this;
        cc.loader.loadRes("MyPlane/player01", cc.SpriteAtlas, function (err, atlas) {
            self._atlas = atlas;
        });
        this._currAtlasFrame = 'player01_01';

        // 初始化一些属性
        this.setSpeed(0, 0);
        this.setLiveLimit(0);
        this.setPosition(this.node.x, this.node.y);
        this.setMoveRect(-350, -647, 700, 1300);

        // 注册键盘事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // 注册Touch事件
        var canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.TOUCH_END,  this.onTouchEnd, this);
    },

    beforeDoUpdate: function(dt){
        // 记录上一帧位置
        this._lastX = this._x;
        this._lastY = this._y;

        // 移动到Touch点（如果有）
        this.moveToTouchPoint();
    },

    // called every frame, uncomment this function to activate update callback
    doUpdate: function (dt) {
        if(!gameLogic.isPlaying()) return;

        // 判断x移动方向
        if(this._lastX > this._x){
            // 往左移动
            this._changePlaneSprite('player01_04');
            this.node.scaleX = -1;
        }else if(this._lastX < this._x){
            // 往右移动
            this._changePlaneSprite('player01_04');
            this.node.scaleX = 1;
        }else{
            // 没有左右移动
            this._changePlaneSprite('player01_01');
            this.node.scaleX = 1;
        }

        // 开火
        if(this._isFiring && this._lastFireTimePassed >= FIRE_GAP){
            this.fire();
        }else{
            this._lastFireTimePassed += dt;
        }
    },

    onKeyDown: function(event){
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._keyLeftPress = 1;
                this.updteSpeed();
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._keyRightPress = 1;
                this.updteSpeed();
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this._keyUpPress = 1;
                this.updteSpeed();
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this._keyDownPress = 1;
                this.updteSpeed();
                break;
        }
    },

    onKeyUp: function(event){
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._keyLeftPress = 0;
                this.updteSpeed();
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._keyRightPress = 0;
                this.updteSpeed();
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this._keyUpPress = 0;
                this.updteSpeed();
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this._keyDownPress = 0;
                this.updteSpeed();
                break;
        }
    },

    onTouchStart: function(event){
        this._currTouchPos = event.getTouches()[0].getLocation();
    },

    onTouchMove: function(event){
        this._currTouchPos = event.getTouches()[0].getLocation();
    },

    onTouchEnd: function(event){
        this._currTouchPos = null;
        this.setSpeed(0, 0);
    },

    moveToTouchPoint: function(){
        if(this._currTouchPos){
            var xSpeed = (this._currTouchPos.x - 375 - this.node.x) / 10;
            var ySpeed = (this._currTouchPos.y - 667 - this.node.y) / 10;

            this.setSpeed(
                xSpeed,
                ySpeed
            );
        }
    },

    // 更新速度
    updteSpeed: function(){
        // x direction
        if(this._keyLeftPress){
            if(this._keyRightPress){
                this.setSpeed(0);
            }else{
                this.setSpeed(-10)
            }
        }else{
            if(this._keyRightPress){
                this.setSpeed(10);
            }else{
                this.setSpeed(0)
            }
        }

        // y direction
        if(this._keyUpPress){
            if(this._keyDownPress){
                this.setSpeed(undefined, 0);
            }else{
                this.setSpeed(undefined, 10)
            }
        }else{
            if(this._keyDownPress){
                this.setSpeed(undefined, -10);
            }else{
                this.setSpeed(undefined, 0)
            }
        }
    },

    // 开火
    fire: function(){

        // 一条命时，3发散射，其余单发
        if(gameLogic.getLife() == 1){
            for(var i=0; i<3; i++){
                var bulletInst = cc.instantiate(this.bullet);
                var bullet = bulletInst.getComponent('Bullet');
                bulletInst.parent = this.bulletContainer;
                bullet.setPosition(this.node.x + i * 10 - 10, this.node.y + 40);
                bullet.setSpeed(i * 10 - 10, 15);
                bullet.setLiveLimit(3);
                this._lastFireTimePassed = 0;
            }
        }else{
            var bulletInst = cc.instantiate(this.bullet);
            var bullet = bulletInst.getComponent('Bullet');
            bulletInst.parent = this.bulletContainer;
            bullet.setPosition(this.node.x, this.node.y + 40);
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
    onCollisionEnter: function (other, self) {
        var flyingObj = other.getComponent('FlyingObject');
        var otherTypeTag = flyingObj.typeTag;

        if(otherTypeTag == 'Enermy'){
            gameLogic.reduceLife(1);
            flyingObj.doDestory();
        }
    },

    // 切换飞机图片
    _changePlaneSprite: function(frameName){
        if(this._currAtlasFrame == frameName || !this._atlas) return;
        var frame = this._atlas.getSpriteFrame(frameName);
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = frame;
        this._currAtlasFrame = frameName;
    }

});
