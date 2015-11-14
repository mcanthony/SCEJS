/**
* @class
* @constructor
*/
ComponentMouseEvents = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.MOUSE_EVENTS;
	this.node = null;
	var gl = null;
	
	
	this.onmousedown;	
	this.onmouseup;	
	this.onmousemove;	
	this.onmousewheel;
	
	
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
ComponentMouseEvents.prototype = Object.create(Component.prototype);
ComponentMouseEvents.prototype.constructor = ComponentMouseEvents;