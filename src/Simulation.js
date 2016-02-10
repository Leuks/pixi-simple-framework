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
