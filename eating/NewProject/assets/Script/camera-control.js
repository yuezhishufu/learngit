cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);

    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
         cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
         cc.director.getCollisionManager().detachDebugDrawFromCamera(this.camera);
    },

    // called every frame, uncomment this function to activate update callback
    
     lateUpdate: function (dt) {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        
        
    },
});