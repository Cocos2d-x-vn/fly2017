var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
    },
    
    doOnLoad: function(){
        cc.log('Enermy speed - onLoad: (%s, %s)', this._speedX, this._speedY);
    },

    doUpdate: function(dt){
        cc.log('Enermy.doUpdate(%s)', dt);
    }
    
});
