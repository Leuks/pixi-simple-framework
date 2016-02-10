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