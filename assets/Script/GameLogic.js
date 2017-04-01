
// 游戏核心逻辑
var gameLogic = {
    // 游戏时间
    _gameTime: 0,
    _maxGameTime: 60,
    // 游戏积分
    _score: 0,
    // 生命值
    _life: 1,
    _maxLife: 1,
    // 敌人数组
    _enermyList: [],
    // 子弹数组
    _bulletList: [],
    // 刷怪周期（秒）
    _spwanTimeGap: 0.5,
    // 上次刷怪时间
    _lastSpwanEnermyTime: 0,
    // 刷怪回调
    _spwanEnermyCallback: null,
    // 游戏结束回调
    _gameOverCallback: null,
    _isPlaying: false,

    // 初始化
    init: function(maxGameTime, maxLife, spwanEnermyCallback, gameOverCallback){
        this._maxGameTime = maxGameTime;
        this._life = this._maxLife = maxLife;
        this._spwanEnermyCallback = spwanEnermyCallback;
        this._gameOverCallback = gameOverCallback;
    },

    // 开始游戏
    start: function(){
        this._score = 0;
        this._isPlaying = true;
    },

    // 应当每帧调用此方法
    update: function(dt){
        if(!this._isPlaying) return;

        // 剩余时间
        if(this.getGameLeftTime() == 0){
            this.gameOver();
            return;
        }

        // 累加时间，判断是否要刷怪
        this._gameTime += dt;

        if(this._gameTime > this._lastSpwanEnermyTime + this._spwanTimeGap){
            this.swpanEnermy();
        }
    },

    // 刷怪
    swpanEnermy: function(){
        this._lastSpwanEnermyTime = this._gameTime;

        if(this._spwanEnermyCallback){
            this._spwanEnermyCallback(this._gameTime);
        }
    },

    // 是否正在游戏
    isPlaying: function(){
        return this._isPlaying;
    },

    // 获取游戏时间
    getGameTime: function(){
        return this._gameTime;
    },

    // 获取游戏剩余时间
    getGameLeftTime: function(){
        return Math.max(0, this._maxGameTime - this._gameTime);
    },

    // 获取游戏积分
    getScore: function(){
        return this._score;
    },

    // 获取生命值
    getLife: function(){
        return this._life;
    },

    // 增加生命值
    addLife: function(cnt){
        this._life  = Math.min(this._maxLife, this._life + cnt);
    },

    // 减少生命值
    reduceLife: function(cnt){
        this._life  = Math.max(0, this._life - cnt);
        if(this._life == 0){
            this.gameOver();
        }
    },

    // 增加积分
    addScore: function(cnt){
        this._score += cnt;
    },

    // 减少积分
    reduceScore: function(cnt){
        this._score = Math.max(0, this._score - cnt);
    },

    // 游戏结束
    gameOver: function(){
        this._isPlaying = false;
        if(this._gameOverCallback){
            this._gameOverCallback();
        }
    }

}

module.exports = gameLogic;