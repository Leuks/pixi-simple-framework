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