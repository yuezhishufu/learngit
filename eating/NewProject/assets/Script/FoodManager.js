 // Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        //-2400,1000//4200,1947
        xMin:-2400,
        xMax:2400,
        yMin:-1000,
        yMax:1000,
        beans:{
            default: [],
            type: cc.Prefab
        },
        beens:{
            default:null,
            type:cc.Node
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //  this.xMin=-4200;
        //  this.xMax=4200;
        //  this.yMin=-1947;
        //  this.yMax=1947;
     },

    start () {
        this.schedule(function() {
            // 这里的 this 指向 component
            this.scFood();
        }, 0.05);
    },

     update (dt) {
        // this.scFood();
     },
    scFood:function(){ 
       var num=Math.floor(Math.random()*this.beans.length); 
       var x=Math.floor(cc.randomMinus1To1()*this.xMax);
       var y=Math.floor(cc.randomMinus1To1()*this.yMax);
        var bean=cc.instantiate(this.beans[num]);
        bean.parent=this.beens;
        bean.setPosition(x,y);
    }
});
