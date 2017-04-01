var FlyingObject = require('FlyingObject');

/**
 * 具有生命值的飞行物
 */
cc.Class({
    extends: FlyingObject,

    properties: {
        // 生命
        life: {
            get: function(){
                return this._life;
            },
            set: function(value){
                var oriLife = this._life;
                this._life = value;
                this.onLifeChanged(oriLife, value);
            }
        },
        // 最大生命
        maxLife: {
            get: function(){
                return this._maxLife;
            },
            set: function(value){
                var oriMaxLife = this._maxLife;
                this._maxLife = value;
                this.onMaxLifeChanged(oriMaxLife, value);
            }
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    /**
     * 当生命值变化后触发
     * @param {int} oriLife 变化前的生命值
     * @param {int} newLife 变化后的生命值
     */
    onLifeChanged: function(oriLife, newLife){
        // 由子类具体实现
    },

    /**
     * 当最大生命值变化后触发
     * @param {int} oriMaxLife 变化前的生命值
     * @param {int} newMaxLife 变化后的生命值
     */
    onMaxLifeChanged: function(oriMaxLife, newMaxLife){
        // 由子类具体实现
    }
});
