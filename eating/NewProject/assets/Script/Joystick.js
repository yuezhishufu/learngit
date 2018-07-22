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
        //当前人物行走方向,用来判断精灵的朝向,精灵脸朝右还是朝左
        rocketRun:false,
         //判断控制杆方向,用来判断精灵上,下,左,右运动
        rocketDirection:-1,
        bgImg: {
            default: null,
            type: cc.Prefab
        },
        rockerImg:{
            default: null,
            type: cc.Prefab
        },  
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //用于标识摇杆与摇杆的背景
        this.tagForHRocker=cc.Enum({
            tag_rocker:'tag_rocker',
            tag_rockerBG:'tag_rockerBG',
        });
        //用于标识摇杆方向
        this.tagDirecton=cc.Enum({
            rocker_stay:0,
            rocker_right:1,
            rocker_up:2,
            rocker_left:3,
            rocker_down:4,
        });   
        this.rockerBGR=0;
        // this.rockerInit(this.rockerImg,this.bgImg,cc.p(0,0)); 
        if(cc.sys.os==cc.sys.OS_WINDOWS||cc.sys.os==cc.sys.OS_OSX||cc.sys.os==cc.sys.MOBILE_BROWSER){
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.ccTouchBegan, this, true);  
            this.node.on(cc.Node.EventType.MOUSE_UP, this.ccTouchEnded, this, true);  
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.ccTouchMoved, this, true);  
        }else{
            this.node.on(cc.Node.EventType.TOUCH_START, this.ccTouchBegan, this, true);  
            this.node.on(cc.Node.EventType.TOUCH_END, this.ccTouchEnded, this, true);  
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.ccTouchMoved, this, true);  
        }
        
     },

    start () {

    },

    // update (dt) {},
    //创建摇杆(摇杆的操作题图片资源名,摇杆背景图片资源名,起始坐标)
    rockerInit:function(rockerImageName,rockerBGImageName,position){
        var rockerImg = cc.instantiate(rockerImageName);
        rockerImg.active=false;
        this.node.addChild(rockerImg,-12,this.tagForHRocker.tag_rocker);
        //转变位置
        var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
         let point=rocker.parent.convertToNodeSpaceAR(position);
         rocker.setPosition(point);
        var rockerBgImg = cc.instantiate(rockerBGImageName);
        rockerBgImg.active=false;
        this.node.addChild(rockerBgImg,-2,this.tagForHRocker.tag_rockerBG);
          //转变位置
         var rocker1=this.node.getChildByName(this.tagForHRocker.tag_rockerBG);
         let point1=rocker1.parent.convertToNodeSpaceAR(position);
         rocker1.setPosition(point1);
         this.rockerBGPosition=point;

       // this.rockerBGPosition=position;
        //摇杆背景的半径
        this.rockerBGR=rockerBgImg.getContentSize().width*0.5;
        console.log(rockerBgImg.getContentSize().width+"pp..");
        this.rocketDirection=-1;//表示摇杆方向不变
       
    },
    //启动摇杆(显示摇杆、监听摇杆触屏事件)
     startRocker:function(_isStopOther){
       
        var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
        rocker.active=true;
        var rockerBG=this.node.getChildByName(this.tagForHRocker.tag_rockerBG);
        rockerBG.active=true;
     },

    //停止摇杆(隐藏摇杆，取消摇杆的触屏监听)
     stopRocker:function(){
         if(!this.isCanMove){return;}
         var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
         rocker.active=false;
         var rockerBG=this.node.getChildByName(this.tagForHRocker.tag_rockerBG);
         rockerBG.active=false;
     },
    
     //获取当前摇杆与用户触屏点的角度
     getRad:function(pos1,pos2){
         var px1=pos1.x;
         var py1=pos1.y;
         var px2=pos2.x;
         var py2=pos2.y;
         //得到两点x的距离
         var x=px2-px1;
         //得到两点y的距离
         var y=py1-py2;
         //算出斜边长度
         var xie=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
         //得到这个角度的余弦值(通过三角函数中的店里：角度余弦值=斜边/斜边)
         var cosAngle=x/xie;
         //通过反余弦定理获获取到角度的弧度
         var rad=Math.acos(cosAngle);
         //注意：当触屏的位置Y坐标<摇杆的Y坐标，我们要去反值-0~-180
        if (py2 < py1)
        {
            rad = -rad;
        }
        return rad;
     },
     //触屏事件
     ccTouchBegan:function(pTouch){
       
        var x=pTouch.getLocation().x;
        var y=pTouch.getLocation().y;
        var endPos=cc.p(x,y);
        this.rockerInit(this.rockerImg,this.bgImg,endPos); 
        this.startRocker(true);
         var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
         let point=rocker.parent.convertToNodeSpaceAR(endPos);
         
         if(cc.rectContainsPoint(rocker.getBoundingBoxToWorld(),endPos)){
               this.isCanMove=true;
         }else{
            console.log("da...ii..");
         }
     },
     ccTouchMoved:function(pTouch){
         if(!this.isCanMove){return;}
         var x=pTouch.getLocation().x;
         var y=pTouch.getLocation().y;
         var endPos=cc.p(x,y);
         var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
         let point=rocker.parent.convertToNodeSpaceAR(endPos);
         //得到摇杆与触屏点所形成的角度
         var angle=this.getRad(this.rockerBGPosition,point);
         //判断两个圆的圆心距是否大于摇杆背景的半径
         if (Math.sqrt(Math.pow((this.rockerBGPosition.x - point.x),2) + Math.pow((this.rockerBGPosition.y - point.y),2)) >= this.rockerBGR)
        {
        //保证内部小圆运动的长度限制
        rocker.setPosition(cc.pAdd(this.getAngelePosition(this.rockerBGR,angle),cc.p(this.rockerBGPosition.x,this.rockerBGPosition.y)));
       }else{
           //当没有超过，让摇杆跟随用户触屏点移动即可
           rocker.setPosition(point);
       }

       //判断方向
       if(angle>=-Math.PI/4&&angle<Math.PI/4){
           this.rocketDirection=this.tagDirecton.rocker_right;
           this.rocketrun=false;
       }else if(angle>=Math.PI/4&&angle<3*Math.PI/4){
           this.rocketDirection=this.tagDirecton.rocker_up;
       }else if((angle>=3*Math.PI/4&&angle<=Math.PI)||(angle>=-Math.PI&&angle<-3*Math.PI/4)){
           this.rocketDirection=this.tagDirecton.rocker_left;
           this.rocketRun=true;
       }else if(angle>=-3*Math.PI/4&&angle<-Math.PI/4){
           this.rocketDirection=this.tagDirecton.rocker_down;
       }

     },
     getAngelePosition:function(r,angle){
        return cc.p(r*Math.cos(angle),r*Math.sin(angle));
     },
     ccTouchEnded:function(pTouch){
         if(!this.isCanMove){return;}
         this.stopRocker();
         var rocker=this.node.getChildByName(this.tagForHRocker.tag_rocker);
         var rockerBG=this.node.getChildByName(this.tagForHRocker.tag_rockerBG);
         rocker.stopAllActions();
         var action=cc.moveTo(0.08,rockerBG.getPosition());
         rocker.runAction(action);
         this.isCanMove=false;
         this.rocketDirection=this.tagDirecton.rocker_stay;
     },
     
     
});
