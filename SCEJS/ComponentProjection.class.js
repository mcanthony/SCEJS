/**
* @class
* @constructor
*/
ComponentProjection = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.PROJECTION;
	this.node = null;
	var gl = null;
	
	
	var mProjectionMatrix = $M16([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
	
	var proy = 1; // projection type 1=perspective 2=ortho
	var width = 512;	
	var height = 512;
	var fov = 45;
	var fovOrtho = 20;	
	var near = 0.1;
	var far = 200;
	
	
	/**
	 * initialize
	 * @param {Node} nod
	 * @param {WebGLRenderingContext} glCtx.
	 * @override
	 */
	this.initialize = function(nod, glCtx) {
		node = nod;
		gl = glCtx;
		
		updateProjectionMatrix();
	};	
	
	/**
	 * getMatrix
	 * @returns {StormM16}
	 */
	this.getMatrix = function() {
		return mProjectionMatrix;
	};
	
	/**
	 * @param {Int} projection
	 */
	this.setProjection = function(projection) {
		proy = projection;
		updateProjectionMatrix();
	};	
	/**
	 * @param {Int} width
	 * @param {Int} height
	 */
	this.setResolution = function(width, height) {
		width = width;
		height = height;
		updateProjectionMatrix();
		
		//nodeTarget.glScreenBuffers.updateGLScreenBuffers();
	};
	/**
	 * getResolution
	 * @returns {Object}
	 */
	this.getResolution = function() {
		return {"width": width,
				"height": height};
	};
	/**
	 * @param {Float} fov
	 */
	this.setFov = function(fov) {
		if(proy == 1) fov = fov;
		else fovOrtho = fov;
		
		updateProjectionMatrix();
	};
	/**
	 * @returns {Float}
	 */
	this.getFov = function() {
		if(proy == 1) return fov;
		else return fovOrtho;
	};
	/**
	 * @param {Float} near
	 */
	this.setNear = function(near) {
		near = near;
		updateProjectionMatrix();
	};
	/**
	 * @returns {Float}
	 */
	this.getNear = function() {
		return near;
	};
	/**
	 * @param {Float} far
	 */
	this.setFar = function(far) {
		far = far;
		updateProjectionMatrix();
	};
	/**
	 * @returns {Float}
	 */
	this.getFar = function() {
		return far;
	};
	/**
	 * updateProjectionMatrix
	 */
	var updateProjectionMatrix = (function() {		
		var fovy = (proy == 1) ? fov : fovOrtho;
		var aspect = width / height;
		
		if(proy == 1) mProjectionMatrix = $M16().setPerspectiveProjection(fovy, aspect, near, far);
		else mProjectionMatrix = $M16().setOrthographicProjection(-aspect*fovy, aspect*fovy, -fovy, fovy, near, far);
			
		//if(proy == 1) Matrix.perspectiveM(mProjectionMatrix, 0, fovy, aspect, near, far);
		//else Matrix.orthoM(mProjectionMatrix, 0, -aspect*fovy, aspect*fovy, -fovy, fovy, near, far);
	}).bind(this);
};
ComponentProjection.prototype = Object.create(Component.prototype);
ComponentProjection.prototype.constructor = ComponentProjection;