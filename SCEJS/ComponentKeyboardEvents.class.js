/**
* @class
* @constructor
*/
ComponentKeyboardEvents = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.KEYBOARD_EVENTS;
	this.node = null;
	var gl = null;
	
	
	this.onkeydown;	
	this.onkeyup;
	
	
	/**
	 * initialize
	 * @param {Node} nod
	 * @param {WebGLRenderingContext} glCtx.
	 * @override
	 */
	this.initialize = function(nod, glCtx) {
		node = nod;
		gl = glCtx;
	};	
};
ComponentKeyboardEvents.prototype = Object.create(Component.prototype);
ComponentKeyboardEvents.prototype.constructor = ComponentKeyboardEvents;