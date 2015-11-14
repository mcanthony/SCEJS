/**
* @class
* @constructor
*/
ComponentTransformTarget = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.TRANSFORM_TARGET;
	this.node = null;
	var gl = null;
	
	
	var mModelMatrix = $M16([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
	
	var positionGoal = $V3([0, 0, 5]);
	var positionTarget = $V3([0, 0, 0]);
	var targetDistance = 5.0; 
	
	
	/**
	 * initialize
	 * @param {Node} nod
	 * @param {WebGLRenderingContext} glCtx.
	 * @override
	 */
	this.initialize = function(nod, glCtx) {
		node = nod;
		gl = glCtx;
		
		performMatrix();
	};	
	
	/**
	 * getMatrix
	 * @returns {StormM16}
	 */
	this.getMatrix = function() {
		return mModelMatrix;
	};
	
	/**
	 * setTargetDistance
	 * @param {Float} distance
	 */
	this.setTargetDistance = function(distance) {
		targetDistance = distance;
	};
	
	/**
	 * getTargetDistance
	 * @returns {Float}
	 */
	this.getTargetDistance = function() {
		return targetDistance;
	};
	
	/** 
	 * setPositionGoal
	 * @param {StormV3} position
	 */
	this.setPositionGoal = function(position) {
		positionGoal = position;
		performMatrix();
	};
	
	/** 
	 * getPositionGoal
	 * @returns {StormV3}
	 */
	this.getPositionGoal = function() {
		return positionGoal;
	};
	
	/**
	 * setPositionTarget
	 * @param {StormV3} position
	 */
	this.setPositionTarget = function(position) {
		positionTarget = position;		
		performMatrix();
	};
	
	/**
	 * getPositionTarget
	 * @returns {StormV3}
	 */
	this.getPositionTarget = function() {
		return positionTarget;
	};
	
	
	
	/**
	 * yaw
	 * @param {Float} angle
	 */
	this.yaw = function(angle) {
		var dir = this.getPositionGoal().subtract(this.getPositionTarget());
		
		var sphericalCoords = new Utils().cartesianToSpherical(dir.normalize());
		var cartesianCoords = new Utils().sphericalToCartesian(sphericalCoords.radius, sphericalCoords.lat, sphericalCoords.lng+angle);
		
		this.setPositionGoal(this.getPositionTarget().add(cartesianCoords.x(this.getTargetDistance())));
	};
	
	/**
	 * pitch
	 * @param {Float} angle
	 */
	this.pitch = function(angle) {
		var dir = this.getPositionGoal().subtract(this.getPositionTarget());
		
		var sphericalCoords = new Utils().cartesianToSpherical(dir.normalize());
		var cartesianCoords = new Utils().sphericalToCartesian(sphericalCoords.radius, sphericalCoords.lat+angle, sphericalCoords.lng);
		
		this.setPositionGoal(this.getPositionTarget().add(cartesianCoords.x(this.getTargetDistance()))); 
	};
	
	/**
	 * performMatrix
	 * @private
	 */
	var performMatrix = (function() {
		mModelMatrix = $M16().makeLookAt(	this.getPositionGoal().e[0], this.getPositionGoal().e[1], this.getPositionGoal().e[2],
												this.getPositionTarget().e[0], this.getPositionTarget().e[1], this.getPositionTarget().e[2],
								    			0, 1, 0);
	}).bind(this);	
};
ComponentTransformTarget.prototype = Object.create(Component.prototype);
ComponentTransformTarget.prototype.constructor = ComponentTransformTarget;