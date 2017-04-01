var gameLogic = require('GameLogic');
var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: 'Bullet'
    },

    doOnLoad: function(){
        // cc.log('bullet speed - onLoad: (%s, %s)', this._speedX, this._speedY);
    },

    doUpdate: function(dt){
        // cc.log('Bullet.doUpdate(%s)', dt);
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
            gameLogic.addScore(10);
            flyingObj.doDestory();
        }
    }
});
