/**
* @class
* @constructor
*/
Project = function() {
	"use strict";
	
	var stages = [];	
	var activeStage = null; 
	var gl = null;
	
	/**
	* setActiveStage
	* @param {Stage} stage.
	*/
	this.setActiveStage = function(stage) {
		activeStage = stage;
		
		activeStage.setWebGLContext(gl);
	};
	
	/**
	* getActiveStage
	* @returns {Stage}.
	*/
	this.getActiveStage = function() {
		return activeStage;
	};
	
	/**
	* addStage
	* @param {Stage} stage.
	*/
	this.addStage = function(stage) {
		stages.push(stage);
	};
	
	/**
	* setWebGLContext
	* @param {WebGLRenderingContext} glCtx.
	* @private
	*/
	this.setWebGLContext = function(glCtx) {
		gl = glCtx;
	};
};


