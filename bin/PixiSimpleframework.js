'use strict'
/**
 *Create an Action.
 *
 *@param name : The Sprite's name the action will bind with.
 *@param action : The action to execute.
 *@param x : The Sprite's lookfor position on X axe.
 *@param y : The Sprite's lookfor position on Y axe.
 */
var Action = function(name, action, x, y){
    this.name = name;
    this.action = action;
    this.x = x;
    this.y = y;
};
/**
 *Create a Platform 
 *
 *@param color : The color of the stage
 *@param color : The color of the stage
 */
var Platform  = function(color, clickEnabled, adaptBackgroundSize, xRendererSize, yRendererSize) {
    this.stage = new PIXI.DisplayObjectContainer();
    this.renderer = PIXI.autoDetectRenderer(xRendererSize, yRendererSize,{backgroundColor : color});
    this.textures = {};
    this.sprites = {};
    this.actions = {};
    this.actionsHisto = {};
    this.adaptBackgroundSize = adaptBackgroundSize;
};

/**
 *Add a ZoomListener for the node.
 *
 *@param node : The DOM node to listening.
 */
Platform.prototype.addZoomListener = function(node){
    var self = this;
    let scale = this.stage.scale.x;
};

/**
 *Setting up the zoom of the Platform's stage.
 *
 *@param scale : The stage's scale.
 */
Platform.prototype.setZoom = function(scale){
    this.stage.scale.x=scale;
    this.stage.scale.y=scale;
};

/**
 *Setting up the texture of the Platform's background.
 *
 *@param path : The texture's background path.
 */
Platform.prototype.setBackground = function(path){
    var self = this;
    let textureLoader = PIXI.loader;
    textureLoader.add("background", path);
    textureLoader.once('complete', function(texture) {
        let bgrdTexture = PIXI.Texture.fromImage(path);
        self.textures["background"] = bgrdTexture;
        self.addSprite("background", "background");
        self.configureSprite("background",0,0,0,0,1,1);
        self.stage.addChildAt(self.sprites["background"],0);
        
        self.adaptScreen();
    });

    textureLoader.load();
};

/**
 *Setting up the zoom of the Platform's stage.
 *
 *@param scale : The stage's scale.
 */
Platform.prototype.adaptScreen = function(){
    var self = this;
    let bgrdTexture = this.textures["background"];
    if(self.adaptBackgroundSize){
            if("background" in self.textures){
                self.renderer.resize(bgrdTexture.width*self.stage.scale.x,bgrdTexture.height*self.stage.scale.y);
            }
        }
};

/**
 *Add a texture to the Platform.
 *
 *@param name : The texture's name.
 *@param path : The texture's path.
 */
Platform.prototype.addTexture = function(name, path){
    this.textures[name] = PIXI.Texture.fromImage(path);
};

/**
 *Add a sprite to the Platform.
 *
 *@param name : The Sprite's name.
 *@param path : The texture's name to bind with the Sprite.
 */
Platform.prototype.addSprite = function(name, textureName){
    this.sprites[name] = new PIXI.Sprite(this.textures[textureName]);
}; 

/**
 *Configure a Sprite of the Platform
 *
 *@param name : The Sprite's name.
 *@param anchorX : The Sprite's anchor on X axe.
 *@param anchorY : The Sprite's anchor on Y axe.
 *@param posX : The Sprite's pos on X axe.
 *@param posY : The Sprite's pos on Y axe.
 *@param scaleX : The Sprite's scale on X axe.
 *@param scaleY : The Sprite's scale on Y axe.
 */
Platform.prototype.configureSprite = function(name, anchorX, anchorY, posX, posY, scaleX, scaleY){
    let sprite = this.sprites[name];
    sprite.anchor.x = anchorX;
    sprite.anchor.y = anchorY;
    sprite.position.x = posX;
    sprite.position.y = posY;
    sprite.scale.x = scaleX;
    sprite.scale.y = scaleY;
};

/**
 *Add an Action to the Platform.
 *
 *@param spriteName : The Sprite's name to bind Action.
 *@param action : The action to add.
 *@param x : The Sprite's lookfor position on X axe.
 *@param y : The Sprite's lookfor position on Y axe.
 */
Platform.prototype.addAction = function(spriteName, action, x, y){
    var self = this;
    let newAction = new Action(spriteName, action, x, y);
    self.actionsHisto[spriteName] = newAction;
    
    switch(action){
        case "STOP":
            this.deleteAction(spriteName);
            break;
        case "GOTO":
            self.actions[spriteName] = newAction;
            break;
    }
};

/**
 *Add an Action to the Platform.
 *Use in case of copy of an Action from a scenario into Platform
 *
 *@param action : The Action to copy into Platform
 */
Platform.prototype.addAction = function(newAction){
    var self = this;
    self.actionsHisto[newAction.name] = newAction;
    
    switch(newAction.action){
        case "STOP":
            this.deleteAction(newAction.name);
            break;
        case "GOTO":
            self.actions[newAction.name] = newAction;
            break;
    }
};

/**
 *Delete an Action to the Platform.
 *
 *@param spriteName : The Sprite's name.
 */
Platform.prototype.deleteAction = function(spriteName){
    delete this.actions[spriteName];
};

/**
 *Test if a Sprite is moving.
 *
 *@param spriteName : The Sprite's name.
 *
 *@return : Boolean
 */
Platform.prototype.isSpriteMoving = function(spriteName){
    if( spriteName in this.actions) return true;
    return false;
};

/**
 *Move a Sprite.
 *
 *@param spriteName : The Sprite's name.
 *@param axeX : The number of point for move on X axe.
 *@param axeY : The number of point for move on Y axe.
 */
Platform.prototype.moveSprite = function(name, axeX, axeY){
    let sprite = this.sprites[name];
    sprite.position.x += axeX;
    sprite.position.y += axeY;
};

/**
 *Rotate a Sprite.
 *
 *@param spriteName : The Sprite's name.
 *@param rad : The number of radians for turn Sprite.
 */
Platform.prototype.rotateSprite = function(name, rad){
    let sprite = this.sprites[name];
    sprite.rotation = rad;
};

/**
 *Excecute an Action
 *
 *@param action : The Action to execute.
 */
Platform.prototype.execute = function(action){
    let sprite = this.sprites[action.name];
    let actualPos = sprite.position;
    let posToGo = new PIXI.Point(action.x,action.y); 
    
    //If spritee is arrived ( SEE FOR DEEPEQUAL )
    if((posToGo.x === actualPos.x) && (posToGo.y === actualPos.y))  {
        this.deleteAction(action.name);
        console.log(action.name +"--> stopped");
        return;
    }
    
    //X
    if(actualPos.x>posToGo.x) this.moveSprite(action.name,-1,0);
    else if(actualPos.x === posToGo.x) {}
    else this.moveSprite(action.name,1,0);
    
    //Y
    if(actualPos.y>posToGo.y) this.moveSprite(action.name,0,-1);
    else if(actualPos.y === posToGo.y) {}
    else this.moveSprite(action.name,0,1);

    //Orientation
    if(((posToGo.x >= actualPos.x) &&  (posToGo.y >= actualPos.y))) {
        this.rotateSprite(action.name, Math.atan(((posToGo.y-actualPos.y)/(posToGo.x-actualPos.x))));
    }
    else if(((posToGo.x >= actualPos.x) &&  (posToGo.y <= actualPos.y))){
        this.rotateSprite(action.name, -Math.atan((-(posToGo.y-actualPos.y)/(posToGo.x-actualPos.x))));
    }
    else if(((posToGo.x <= actualPos.x) &&  (posToGo.y >= actualPos.y))) {
        this.rotateSprite(action.name, Math.PI+Math.atan(((posToGo.y-actualPos.y)/(posToGo.x-actualPos.x))));
    }
    else{
        this.rotateSprite(action.name, Math.PI-Math.atan((-(posToGo.y-actualPos.y)/(posToGo.x-actualPos.x))));
    }
};

/**
 *Excecute all the Platform's Actions.
 */
Platform.prototype.moveAll = function(){
    var self = this;
    Object.keys(self.actions).forEach(function(key){
        self.execute(self.actions[key]);
    });
};

/**
 *Initialise the Platform
 */
Platform.prototype.init = function(){
    var self = this;
    Object.keys(self.sprites).forEach(function(key){
        self.stage.addChild(self.sprites[key]);
    });
};

/**
 *Launch the Platform
 */
Platform.prototype.start = function(){
    var self = this;
    self.init();
    requestAnimationFrame(function(){self.animate();});
};

/**
 *Enable the Platform's animation.
 */
Platform.prototype.animate = function(){
    var self = this;
    requestAnimationFrame(function(){self.animate();});
    self.moveAll();
    self.adaptScreen();
    self.renderer.render(self.stage);
};
'use strict'
/**
 *Create a Scenario.
 *
 *@param name : The Scenario's name.
 */
var Scenario = function(name){
    this.name = name;
    this.actions = [];
    this.isRunning = false;
};

/**
 *Add an Action to the Scenario.
 *
 *@param name : The Scenario's name.
 */
Scenario.prototype.addAction = function(action){
    this.actions.push(action);
};

/**
 *Delete an Action from the Scenario.
 *
 *@param spriteName : The Sprite's name which is binded with the Action to delete.
 */
Scenario.prototype.deleteAction = function(spriteName){
    let ind = -1;
    for(var i=0;i<this.actions.length;i++){
        if(this.actions[i].name === spriteName){
            ind = i;   
        }
    }
    if(ind > 0) this.actions.slice(ind,1);
};

/**
 *Launch the  Scenario.
 *
 *@param plateform : The Plateform for the Simulation.
 */
Scenario.prototype.start = function(platform){
    var self = this;
    var sprite_actions = {};
    var inds = {};
    var endeds = {};
    self.isRunning = true;
    
    for(var i=0;i<self.actions.length;i++){
        let action = self.actions[i];
         if(!(action.name in sprite_actions)) {
            let actions = [];
            actions.push(action);
            sprite_actions[action.name] = actions;
            inds[action.name] = 0;
            endeds[action.name] = false;
         }
        else{
            sprite_actions[action.name].push(action);
        }
    }
    
    var scenarioStop = false; //Attente de la dernière action avant fin de scénario
    var interval = setInterval(function(){
        Object.keys(sprite_actions).forEach(function(spriteName) {
            if(!platform.isSpriteMoving(spriteName)) {
    
                let stop = true;
                for(var i in endeds) {
                    if(!endeds[i]) stop = false;
                }
                
                if(stop){
                    if(scenarioStop){
                        self.isRunning  = false;
                        clearInterval(interval);
                    }
                    else{
                        scenarioStop = true;
                    }

                }
            
                if(inds[spriteName] < sprite_actions[spriteName].length){
                    platform.addAction(sprite_actions[spriteName][inds[spriteName]]);
                    inds[spriteName]++;
                }
                else{
                    endeds[spriteName] = true; 
                }
            
            }   
        });
    },1);
};
'use strict'
/**
 *Create a Simulation.
 *
 *@param plateform : The Plateform for the Simulation.
 */
var Simulation = function(platform){
    this.platform = platform;
    this.scenarios = [];
};

/**
 *Add a Scenario to the Simulation.
 *
 *@param scenario : The Scenario.
 */
Simulation.prototype.addScenario = function(scenario){
    this.scenarios.push(scenario);
};

/**
 *Delete a Scenario to the Simulation.
 *
 *@param scenario : The Scenario's name.
 */
Simulation.prototype.deleteScenario = function(scenarioName){
    let ind = -1;
    for(var i=0;i<this.scenarios.length;i++){
        if(this.scenarios[i].name === scenarioName){
            ind = i;   
        }
    }
    if(ind > 0) this.scenarios.slice(ind,1);
};

/**
 *Launch the Simulation
 */
Simulation.prototype.start = function(){
    var self = this;
    let ind = 0;

    
    let scenario = self.scenarios[ind];
    var interval = setInterval(function(){

            if(!scenario.isRunning){
                scenario = self.scenarios[ind];
                console.log("Lancement du scénario "+scenario.name);
                scenario.start(self.platform);
                
                if(ind === self.scenarios.length -1) clearInterval(interval);

                ind++;
            }
    },100);
};
