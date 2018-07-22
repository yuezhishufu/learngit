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
        my:{
            default: null,
            type: cc.Prefab
        },
        ball:{
            default: null,
            type: cc.Prefab
        },
        camera:{
            default: null,
            type: cc.Node
        },
        qiuqiu:{
            default: null,
            type: cc.Node
        },
        massFood:{
            default:[],
            type:cc.Node
        },
        spearateQiu:{
            default:null,
            type:cc.Node
        },
        cell:{
            default:[],
            type:cc.Node 
        },
       
        BspearateQiu:{
            default:null,
            type:cc.Node
        },
        spearateEnd:false,
        speatateNum:0,
        是否移动:true,

       
    },

    // LIFE-CYCLE CALLBACKS:
     onLoad () {
       
         //发射球的距离
         this.shoot1=0;
        this.director=1;
        var qiuqiu = cc.instantiate(this.my);
         qiuqiu.parent=this.qiuqiu;
         qiuqiu.name='qiu';
         //下载图片
         cc.loader.load(window.Global.url, function (err, texture) {
            console.log(err);
            if(err){
                return;
            }else{
                var sf = new cc.SpriteFrame(texture)
                qiuqiu.getComponent(cc.Sprite).spriteFrame=sf;
            }
        });
         qiuqiu.setPosition(0,0);
        this.mys=qiuqiu;
        this.cell.push(this.mys);
         this.joysticks = this.node.getComponent("Joystick");
        this.cameraControl=this.camera.getComponent("camera-control");
        this.cameraControl.target=this.mys;
        this.MyJs=this.mys.getComponent("My");
       
        //碰撞检测系统
        var manager=cc.director.getCollisionManager();
        manager.enabled=true;
        manager.enabledDebugDraw=true;
        //物理检测系统
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit
        ;
     },
     start(){
     },
      //物体移动
    Move:function(joysticks,qiuqiu){
      //判断是否按下摇杆及其类型
      switch(joysticks.rocketDirection){
        case 1:
        this.speed=this.MyJs.speed;
        for(var i=0;i<qiuqiu.length;i++){
            if(qiuqiu[i].x<=2400){
                qiuqiu[i].setPosition(qiuqiu[i].x+this.speed,qiuqiu[i].y);//向右走  
                this.director=1;
                this.shoot1=0;
            }
        }
        this.separateClose(this.mys.x,this.mys.y);
        break;
        case 2:
            this.speed=this.MyJs.speed;
            for(var i=0;i<qiuqiu.length;i++){
            if(qiuqiu[i].y<=1000){
                qiuqiu[i].setPosition(qiuqiu[i].x,qiuqiu[i].y+this.speed);//向上走 
                this.director=2;
                this.shoot1=0;
            }
        }
        this.separateClose(this.mys.x,this.mys.y);
        break;
        case 3:
        this.speed=this.MyJs.speed;
        for(var i=0;i<qiuqiu.length;i++){
        if(qiuqiu[i].x>=-2400){
           qiuqiu[i].setPosition(qiuqiu[i].x-this.speed,qiuqiu[i].y);//向左走 
           this.director=3;
           this.shoot1=0;
        } 
        }
        this.separateClose(this.mys.x,this.mys.y);
        break;
        case 4:
        this.speed=this.MyJs.speed;
        for(var i=0;i<qiuqiu.length;i++){
        if(qiuqiu[i].y>=-1000){
           qiuqiu[i].setPosition(qiuqiu[i].x,qiuqiu[i].y-this.speed);//向下走
           this.director=4;
           this.shoot1=0;
        }
       }
       this.separateClose(this.mys.x,this.mys.y);
        break;
      }
      
    },
    
     update (dt) {
    //    this.Move(this.joysticks,this.mys);
        if(this.是否移动){
            this.Move(this.joysticks,this.cell);
        } 
     },
     //分离靠近
     separateClose:function(targetX,targetY){
       if(this.cell.length>1){
           for(var i=1;i<this.cell.length;i++){
              //将分离的球向中心靠拢
              var centerX=(targetX+this.cell[i].x)/2;
              var centerY=(targetY+this.cell[i].y)/2;
              //计算移动速度
              var dist= Math.sqrt(Math.pow(centerY,2) + Math.pow(centerX,2));
              var deg=Math.atan2(centerY-targetY,centerX-targetX);
              var slowDown=1;
              if(this.separateSpeeds>=1){
                  this.separateSpeeds-=0.5;
              }
              var deltaX=this.separateSpeeds*Math.cos(deg)/slowDown;
              var deltaY=this.separateSpeeds*Math.sin(deg)/slowDown;
              var dist1= Math.sqrt(Math.pow((this.cell[i].y-targetY),2) + Math.pow((this.cell[i].x-targetX),2));
              if(dist1<(100+(this.cell[i].width/2)+(this.mys.width/2))){
                  deltaY*=dist1/(100+(this.cell[i].width/2)+(this.mys.width/2));
                  deltaX*=dist1/(100+(this.cell[i].width/2)+(this.mys.width/2));
                  if(dist1<=(this.cell[i].width/2)+(this.mys.width/2)){
                      if(!this.spearateEnd){
                        this.scheduleOnce(function() {
                          // this.cell[i].group='separateqiu1';
                            //this.cell.splice(i,1); 
                            this.spearateEnd=true;
                        }, 6);
                        return;
                      }  
                  }
              }
                this.cell[i].x-=deltaX;
                this.cell[i].y-=deltaY;

           }
       }
     },
     //分离                      
     separate:function(){
     
      this.spearateEnd=false;
      this.separateSpeeds=2;
      var scaleX=this.mys.scaleX;   
      var scaleY=this.mys.scaleY;
    //   for(var i=0;i<this.cell.length;i++){
    //     this.cell[i].getComponent("My").separateQiu();
    //   }
      this.separateNumber(this.cell.length,scaleX,scaleY);
      
    //   this.MyJs.separateQiu();
     // this.MyJs.cellweight.push(this.MyJs.weightNum);
      //复制一个球球
    //   var qiuqiu = cc.instantiate(this.my);
    //    qiuqiu.parent=this.qiuqiu;
    //    qiuqiu.setPosition(this.mys.x,this.mys.y);
    //    qiuqiu.setScale(scaleX/2,scaleY/2);
    //     this.speatateNum+=1;
    //     qiuqiu.name="fenqiu"+(this.speatateNum.toString());
    //     console.log(qiuqiu.name+"...qiuqiu.name..");
    //    qiuqiu.group="separateqiu";
    // //  var myy=qiuqiu.getComponent("My");
    // //  myy.cellweight.push(myy.weightNum);
    //    this.cell.push(qiuqiu);
    //   this.separateSpeed(qiuqiu);
     },
     //判断分离的数量
     separateNumber:function(number,scaleX,scaleY){
       for(var i=0;i<number;i++){
        if(this.cell[i].scaleX>0.5){
            this.cell[i].getComponent("My").separateQiu();
            console.log(number+"..number..");
            var qiuqiu = cc.instantiate(this.my);
            qiuqiu.parent=this.qiuqiu;
            //qiuqiu.setPosition(this.mys.x,this.mys.y);
            qiuqiu.setPosition(this.cell[i].x,this.cell[i].y);
            qiuqiu.setScale(scaleX/2,scaleY/2);
            this.speatateNum+=1;
            qiuqiu.name="fenqiu"+(this.speatateNum.toString());
            console.log(qiuqiu.name+"...qiuqiu.name..");
            qiuqiu.group="separateqiu";
            this.cell.push(qiuqiu);
            this.separateSpeed(qiuqiu);
        }
    }
     },
     separateSpeed:function(qiu){
        var width=this.mys.width*this.mys.scaleX*2;
        //判断是否按下摇杆及其类型
      switch(this.director){
        case 1:
        //qiu.setPosition(qiu.x+this.massSpeed,qiu.y);//向右走  
        if(qiu.x+width<=2400){
            var action = cc.moveTo(0.3, qiu.x+width, qiu.y);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.3, 2400, qiu.y);
            qiu.runAction(action);
        }
        
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            //qiu.group="qiuqiu";
          qiu.group='separateqiu1';
           
        }, 0.8);
        break;
        case 2:
        //qiu.setPosition(qiu.x,qiu.y+this.massSpeed);//向上走 
        if(qiu.y+width<=1000){
            var action = cc.moveTo(0.3, qiu.x, qiu.y+width);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.3, qiu.x,1000);
            qiu.runAction(action);
        }
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            // qiu.group="qiuqiu";
          qiu.group='separateqiu1';
           
        }, 0.8);
        break;
        case 3:
       // qiu.setPosition(qiu.x-this.massSpeed,qiu.y);//向左走 
       if(qiu.x-width>=-2400){
            var action = cc.moveTo(0.3, qiu.x-width, qiu.y);
            qiu.runAction(action);
       }else{
            var action = cc.moveTo(0.3, -2400, qiu.y);
            qiu.runAction(action);
       }
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            // qiu.group="qiuqiu";
            qiu.group='separateqiu1';
           
        }, 0.8);
        break;
        case 4:
        //qiu.setPosition(qiu.x,qiu.y-this.massSpeed);//向下走
        if(qiu.y-width>=-1000){
            var action = cc.moveTo(0.3, qiu.x, qiu.y-width);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.3, qiu.x, -1000);
            qiu.runAction(action);
        }
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            // qiu.group="qiuqiu";
           qiu.group='separateqiu1';
           
        }, 0.8);
        break;
      }
     },
     //发射
     shoot:function(){
       
        if(this.mys.scaleX>0.5){
            this.shooting=true;
            console.log(this.mys.scaleX+".xy."+this.mys.scaleY);
            this.MyJs.Jweight(1000);
            //复制一个球球
            var qiu = cc.instantiate(this.ball);
            qiu.parent=this.qiuqiu;
            qiu.setPosition(this.mys.x,this.mys.y);
            qiu.setScale(0.2,0.2);
            qiu.name='qiu1'
            // qiu.group="shootqiu";
            this.spearateQiu=qiu;
            this.massFood.push(qiu);
            this.shoot1+=5;
            console.log(this.shoot1+"..this.shoot1..");
            this.shootSpeed(this.spearateQiu);
        }
       
     },
     shootSpeed:function(qiu){
        if(this.shooting){
        var width=this.mys.width*this.mys.scaleX*2;
        console.log("width:"+width);
       //判断是否按下摇杆及其类型
      switch(this.director){
        case 1:
        //qiu.setPosition(qiu.x+this.massSpeed,qiu.y);//向右走  
        if(qiu.x+width-this.shoot1<=2400){
            var action = cc.moveTo(0.5, qiu.x+width-this.shoot1, qiu.y);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.5, 2400-this.shoot1, qiu.y);
            qiu.runAction(action);
        }
        console.log(qiu.x+width-this.shoot1+"..l..");
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            qiu.group="qiuqiu";
        }, 0.8);
        break;
        case 2:
        //qiu.setPosition(qiu.x,qiu.y+this.massSpeed);//向上走 
        if(qiu.y+width-this.shoot1<=1000){
            var action = cc.moveTo(0.5, qiu.x, qiu.y+width-this.shoot1);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.5, qiu.x, 1000-this.shoot1);
            qiu.runAction(action);
        }
        
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            qiu.group="qiuqiu";
        }, 0.8);
        break;
        case 3:
       // qiu.setPosition(qiu.x-this.massSpeed,qiu.y);//向左走 
       if(qiu.x-width+this.shoot1>=-2400){
            var action = cc.moveTo(0.5, qiu.x-width+this.shoot1, qiu.y);
            qiu.runAction(action);
       }else{
            var action = cc.moveTo(0.5, -2400+this.shoot1, qiu.y);
            qiu.runAction(action);
       }
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            qiu.group="qiuqiu";
        }, 0.8);
        break;
        case 4:
        //qiu.setPosition(qiu.x,qiu.y-this.massSpeed);//向下走
        if(qiu.y-width+this.shoot1>=-1000){
            var action = cc.moveTo(0.5, qiu.x, qiu.y-width+this.shoot1);
            qiu.runAction(action);
        }else{
            var action = cc.moveTo(0.5, qiu.x, -1000+this.shoot1);
            qiu.runAction(action);
        }
        this.shooting=false;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            qiu.group="qiuqiu";
        }, 0.8);
        break;
      }
    }
     },
     GameOver:function(){
        console.log("GameOver");
     },
});
