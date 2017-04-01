var FlyingObject = require('FlyingObject');

cc.Class({
    extends: FlyingObject,

    properties: {
        typeTag: {
            default: 'Enermy',
            override: true
        },

        // 爆炸预制件
        bomb: {
            default: null,
            type: cc.Prefab
        },

        // 正在爆炸
        _isBomb: 0,

        // 爆炸实例
        _bombInstance: {
            default: null,
            type: cc.Node
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

    // 销毁(override)
    doDestory: function(){
        if(!cc.isValid(this.node) || this._isBomb) return;
        this._isBomb = 1;

        // 创建爆炸
        this._bombInstance = cc.instantiate(this.bomb);
        var anim = this._bombInstance.getComponent(cc.Animation);

        this._bombInstance.parent = this.node.parent;
        this._bombInstance.x = this.node.x;
        this._bombInstance.y = this.node.y;
        this._bombInstance.scaleX = this.node.scaleX;
        this._bombInstance.scaleY = this.node.scaleY;

        anim.on('finished', this.onBombFinish, this);
        anim.play('bomb');

        // 隐藏自己
        this.node.active = false;
    },

    // 爆炸结束
    onBombFinish: function(event){
        // 销毁爆炸特效和自己
        if ( cc.isValid( this._bombInstance) ) {
            this._bombInstance.destroy();
        }

        if ( cc.isValid(this.node) ) {
            this.node.destroy();
        }
    }
    
});
