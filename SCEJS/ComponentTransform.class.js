/**
* @class
* @constructor
*/
ComponentTransform = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.TRANSFORM;
	this.node = null;
	var gl = null;
	
	
	var mModelMatrix_Position = $M16([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
	var mModelMatrix_Rotation = $M16([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
	
	var rotX = 0;
	var rotY = 0;
	var rotZ = 0;
	
	
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
	
	/**
	 * getMatrixPosition
	 * @returns {StormM16}
	 */
	this.getMatrixPosition = function() {
		return mModelMatrix_Position;
	};
	
	/**
	 * getMatrixRotation
	 * @returns {StormM16}
	 */
	this.getMatrixRotation = function() {
		return mModelMatrix_Rotation;
	};
};
ComponentTransform.prototype = Object.create(Component.prototype);
ComponentTransform.prototype.constructor = ComponentTransform;