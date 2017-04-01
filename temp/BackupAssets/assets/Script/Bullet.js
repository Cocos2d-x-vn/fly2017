
var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        bulletProp: 0
    },

    // use this for initialization
    onLoad: function () {
        cc.log(this);
        cc.log('bullet speed - onLoad: (%s, %s)', this._speedX, this._speedY);

        this.updatePosition();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // }
});
