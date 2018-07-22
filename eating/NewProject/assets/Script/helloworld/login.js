// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
window.Global = {
    url:""
};
cc.Class({
    extends: cc.Component,

    properties: {
        editbox:cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        
     },

    start () {

    },
    loginning: function () {
        var num=this.editbox.string;
        console.log(num+"..");
        var remoteUrl="https://vr2045.com/app/mengdiaoyu/face/" + num + ".png";
        window.Global.url=remoteUrl;
        cc.director.loadScene("eating");
       
     }
    // update (dt) {},
});
