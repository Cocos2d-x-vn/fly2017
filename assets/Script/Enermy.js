var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: {
            default: 'Enermy',
            override: true
        },

        // 增加一些趣味，概率分裂
        _splitEnable: true,
        _splitRate: 0.8,
        _splitY: null,
    },
    
    doOnLoad: function(){
        // 自动显示随机图片
        var self = this;
        cc.loader.loadRes("Enermy/stones", cc.SpriteAtlas, function (err, atlas) {
            // 有可能还没创建就被摧毁了
            if(!cc.isValid(self)) return;
            var frameName = 'yunshi-0' + (Math.round(Math.random() * 4) + 1).toString();
            var frame = atlas.getSpriteFrame(frameName);
            var sprite = self.getComponent(cc.Sprite);
            sprite.spriteFrame = frame;
        });

        // 随机缩放尺寸 (0.5~2)
        this.node.scaleX = this.node.scaleY = Math.random() * 1.5 + 0.5;

        // 计算是否要触发分裂
        if(this._splitEnable && Math.random() < this._splitRate){
            this._splitY = this._y - Math.random() * 300;
        }
    },

    doUpdate: function(dt){
        // cc.log('Enermy.doUpdate(%s)', dt);
        // 分裂
        if(this._splitEnable && this._splitY != null && this._y < this._splitY){
            this._splitY = null;

            var x = this.node.x;
            var y = this.node.y;

            for(var i=0; i<3; i++)
            {
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
    setSplitEnable: function(enable){
        this._splitEnable = enable;
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {

    }
    
});
