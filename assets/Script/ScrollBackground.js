cc.Class({
    extends: cc.Component,

    properties: {
        bg1: {
            default: null,
            type: cc.Node
        },
        bg2: {
            default: null,
            type: cc.Node
        },
        // 滚动速度
        speed: {
            default: 0,
            type: Number,
            get: function(){
                return this._speed;
            },
            set: function(value){
                this._speed = value;
            }
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    // 滚动
    scroll: function(dt){
        this.bg1.y -= this.speed;
        this.bg2.y -= this.speed;

        if(this.bg2.y <= -1334){
            this.bg2.y = 1334;
            var tmp = this.bg1;
            this.bg1 = this.bg2;
            this.bg2 = tmp;
        }
    }
});
