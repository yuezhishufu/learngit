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
        cells:{
            default:[],
            type:cc.Node 
        },
       beanScore:0,
       speed:4,
       weightNum:0,
       //cellweight:[],
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        //  this.speed=4;
        //用来判断分数
        this.score=cc.Enum({
            bean_stay:'0',
            bean_polygon1:'50',
            bean_polygon2:'100',
            bean_polygon3:'150',
            bean_polygon4:'200',
            bean_polygon5:'250',
            bean_polygon6:'300',
            bean_shoot:'1000',
        });
     },

    start () {
        this.score1=cc.find("Canvas/体重/kg");
        this.毫克=cc.find("Canvas/体重/毫克");
        this.manager=cc.find("Canvas");
        this.GameOver=cc.find("Canvas/GameOver");
        this.camera=cc.find("camera");
    },
   
     update (dt) {
        
     },
      // 只在两个碰撞体开始接触时被调用一次
      onCollisionEnter: function (other, self) {
          if(other.node.group=="triangle"){
              this.beanScore=this.score.bean_polygon1;
              other.node.destroy();
              this.weight(this.beanScore);
          }else if(other.node.group=="diamond"){
            this.beanScore=this.score.bean_polygon2;
            other.node.destroy();
            this.weight(this.beanScore);
          }else if(other.node.group=='butterfly'){
            this.beanScore=this.score.bean_polygon3;
            other.node.destroy();
            this.weight(this.beanScore);
          }else if(other.node.group=='Hexagon'){
            this.beanScore=this.score.bean_polygon4;
            other.node.destroy();
            this.weight(this.beanScore);
          }else if(other.node.group=='circle'){
            this.beanScore=this.score.bean_polygon5;
            other.node.destroy();
            this.weight(this.beanScore);
          }else if(other.node.group=='square'){
            this.beanScore=this.score.bean_polygon6;
            other.node.destroy();
            this.weight(this.beanScore);
          }
          else if(other.node.group=='qiuqiu'){
            this.beanScore=this.score.bean_shoot;
            other.node.destroy();
            this.weight(this.beanScore);
          }
          else if(other.node.group=='separateqiu1'){
           var self=this;
              if(other.node.getComponent("My")){
                var num=other.node.getComponent("My").weightNum;
                var nums=parseInt(num);
                }
                other.node.destroy();
                var name=other.node.name;
                var str=name.charAt(name.length-1);
                var strnum=parseInt(str);
                //删除数组
                self.manager.getComponent("Manager").cell.splice(strnum,1); 
                var cells=self.manager.getComponent("Manager").cell;
                if(cells.length>=2){
                    for(var i=1;i<cells.length;i++){
                        cells[i].name="fenqiu"+i;
                    }
                }
                self.manager.getComponent("Manager").speatateNum-=1;
                self.node.scaleX+=other.node.scaleX;
                self.node.scaleY+=other.node.scaleY;
                if(self.speed>=0.2){
                //速度
                self.speed=12/(self.node.scaleX*10);
                }
          }else if(other.node.group=='robot'){
              if(other.node.scaleX>this.node.scaleX){
               
                var number=this.node.getComponent("My").weightNum;
                    other.node.scaleX+=this.node.scaleX;
                    other.node.scaleY+=this.node.scaleY;
              var string1=this.node.getComponent("My").score1.getComponent(cc.Label).string-this.node.getComponent("My").score1.getComponent(cc.Label).string/this.manager.getComponent("Manager").cell.length;
              this.node.getComponent("My").score1.getComponent(cc.Label).string=string1;  
              var name=this.node.name;
                var str=name.charAt(name.length-1);
                var strnum=parseInt(str);
                //删除数组
                this.manager.getComponent("Manager").cell.splice(strnum,1); 
                var cells=this.manager.getComponent("Manager").cell;
               
                if(cells.length<=0){  
                    this.毫克.getComponent(cc.Label).string=="毫克";
                    this.manager.getComponent("Manager").是否移动=false;
                    this.manager.getComponent("Joystick").stopRocker();
                    this.manager.getComponent("Joystick").destroy();
                    this.GameOver.active=true;
                    this.cameraControl=this.camera.getComponent("camera-control");
                    this.cameraControl.enabled=false;
                }  
                this.node.destroy();
              }else{
                var number=other.node.getComponent("My").weightNum;
                this.node.scaleX+=other.node.scaleX;
                this.node.scaleY+=other.node.scaleY;
                var num1=parseFloat(other.node.scaleX*1000);  
                this.eating(num1); 
                // var num2=num1+number;
                // this.node.score1.getComponent(cc.Label).string=num2.toString();
                other.node.destroy();
               
              }  
          }
          else{
            this.beanScore=this.score.bean_stay;
            this.weight(this.beanScore);
          }
    },
   
    //计算物体吃了食物的体重
    weight:function(scores){
        if(this.毫克.getComponent(cc.Label).string!="毫克"){
            var sclaeX=this.node.scaleX;
            scores=(scores/1000)/sclaeX;
            scores=Math.ceil(scores)*20;   
        }   
        this.node.scaleX=this.node.scaleX+(scores*0.00005);
        this.node.scaleY=this.node.scaleY+(scores*0.00005);
       console.log(this.node.scaleX+".."+this.node.scaleY);
        var sum=this.score1.getComponent(cc.Label).string;
        this.weightNum=sum;
        var sum1=parseInt(sum);
        var scores1=parseInt(scores);
        this.beanScore=(scores1+sum1).toString();
        var SumNum=scores1+sum1;
        this.weightNum=SumNum;
        if(this.speed>=0.2){
            //速度
            this.speed=12/(this.node.scaleX*10);
            console.log(this.speed+"speed...");
        }
        this.score1.getComponent(cc.Label).string=this.beanScore;
        if(SumNum>=10000){
            if(this.毫克.getComponent(cc.Label).string=="亿吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='百亿吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="万吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='亿吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='万吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="千克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='吨';  
            }
            else if(this.毫克.getComponent(cc.Label).string=="克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='千克';   
            }
            else if(this.毫克.getComponent(cc.Label).string=="毫克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='克';   
            }    
      }
    },
    //判断减去食物的体重
    Jweight:function(Jscore){
        if(this.毫克.getComponent(cc.Label).string!="毫克"){
            var sclaeX=this.node.scaleX;
            Jscore=(Jscore/1000)/sclaeX;
            Jscore=Math.ceil(Jscore)*20;   
        }   
      this.node.scaleX=this.node.scaleX-(Jscore*0.00005);
      this.node.scaleY=this.node.scaleY-(Jscore*0.00005);
      var sum=this.score1.getComponent(cc.Label).string;
      this.weightNum=sum;
      var sum1=parseInt(sum);
      var scores1=parseInt(Jscore);
      this.beanScore=(sum1-scores1).toString();
      var SumNum=sum1-scores1;
      this.weightNum=SumNum;
      if(this.speed>=0.2){
         //速度
        this.speed=12/(this.node.scaleX*10);
        // console.log(this.speed+"speed...");
      }
      this.score1.getComponent(cc.Label).string=this.beanScore;
      if(SumNum<=10){
          if(this.毫克.getComponent(cc.Label).string=="亿吨"){
            this.score1.getComponent(cc.Label).string=10000-Math.abs(SumNum);
            this.毫克.getComponent(cc.Label).string='万吨';  
          }
          if(this.毫克.getComponent(cc.Label).string=="万吨"){
            this.score1.getComponent(cc.Label).string=100000-Math.abs(SumNum);
            this.毫克.getComponent(cc.Label).string='吨';  
          }
         if(this.毫克.getComponent(cc.Label).string=="吨"){
            this.score1.getComponent(cc.Label).string=100000-Math.abs(SumNum);
            this.毫克.getComponent(cc.Label).string='千克';  
         }
        if(this.毫克.getComponent(cc.Label).string=="千克"){
            this.score1.getComponent(cc.Label).string=10000-Math.abs(SumNum);
            this.毫克.getComponent(cc.Label).string='克';  
        }
        else if(this.毫克.getComponent(cc.Label).string=="克"){
            this.score1.getComponent(cc.Label).string=10000-Math.abs(SumNum);
            this.毫克.getComponent(cc.Label).string='毫克';
            
        }
      }
    },
    //分离球球
    separateQiu:function(){
        this.node.scaleX=this.node.scaleX/2;
        this.node.scaleY=this.node.scaleY/2;
        this.speed=this.speed*2;
    },
    //用户相互吞食
    eating:function(scores){
        if(this.毫克.getComponent(cc.Label).string!="毫克"){
            var sclaeX=this.node.scaleX;
            scores=(scores/1000)/sclaeX;
            scores=Math.ceil(scores)*20;   
        }   
        var sum=this.score1.getComponent(cc.Label).string;
        this.weightNum=sum;
        var sum1=parseInt(sum);
        var scores1=parseInt(scores);
        this.beanScore=(scores1+sum1).toString();
        var SumNum=scores1+sum1;
        this.weightNum=SumNum;
        if(this.speed>=0.2){
            //速度
            this.speed=12/(this.node.scaleX*10);
            console.log(this.speed+"speed...");
        }
        this.score1.getComponent(cc.Label).string=this.beanScore;
        if(SumNum>=10000){
            if(this.毫克.getComponent(cc.Label).string=="亿吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='百亿吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="万吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='亿吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="吨"){
                this.score1.getComponent(cc.Label).string=1;
                this.毫克.getComponent(cc.Label).string='万吨';  
            }
            if(this.毫克.getComponent(cc.Label).string=="千克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='吨';  
            }
            else if(this.毫克.getComponent(cc.Label).string=="克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='千克';   
            }
            else if(this.毫克.getComponent(cc.Label).string=="毫克"){
                this.score1.getComponent(cc.Label).string=10;
                this.毫克.getComponent(cc.Label).string='克';   
            }    
      }
    },

});
