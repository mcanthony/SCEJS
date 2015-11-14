/**
* @class
* @constructor
* @param {Object} jsonIn
* @param {Node} jsonIn.node
*/
ComponentControllerTransformTarget = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.CONTROLLER_TRANSFORM_TARGET;
	this.node = null;
	var gl = null;
	
	
	var forward = 0;
	var backward = 0;
	var left = 0;
	var right = 0;
	
	var leftButton = 0;
	var middleButton = 0;
	var rightButton = 0;
	
	
	var lastX = 0;
	var lastY = 0;
	
	var lockRotX = false;
	var lockRotY = false;
	
	
	/**
	 * initialize
	 * @param {Node} nod
	 * @param {WebGLRenderingContext} glCtx.
	 * @override
	 */
	this.initialize = function(nod, glCtx) {
		node = nod;
		gl = glCtx;
		
		var comp_transformTarget = node.getComponent("ComponentTransformTarget");
	};	
	
	/**
	 * lockRotX
	 */
	this.lockRotX = function() {
		lockRotX = true;
	};
	/**
	 * unlockRotX
	 */
	this.unlockRotX = function() {
		lockRotX = false;
	};
	/**
	 * isLockRotX
	 * @returns {Boolean}
	 */
	this.isLockRotX = function() {
		return lockRotX;
	};
	
	/**
	 * lockRotY
	 */
	this.lockRotY = function() {
		lockRotY = true;
	};
	
	/**
	 * unlockRotY
	 */
	this.unlockRotY = function() {
		lockRotY = false;
	};
	
	/**
	 * isLockRotY
	 * @returns {Boolean}
	 */
	this.isLockRotY = function() {
		return lockRotY;
	};
	
	/**
	 * forward
	 */
	this.forward = function() {
		forward = 1;
	};
	
	/**
	 * backward
	 */
	this.backward = function() {
		backward = 1;
	};
	
	/**
	 * strafeLeft
	 */
	this.strafeLeft = function() {
		left = 1;
	};
	
	/**
	 * strafeRight
	 */
	this.strafeRight = function() {
		right = 1;
	};

	/**
	 * stop
	 */
	this.stop = function() {
		forward = 0;
		backward = 0;
		left = 0;
		right = 0;
	};

	this.mouseDown = function(event) {
		lastX = event.screenX;
		lastY = event.screenY;
		
		if(event.button == 0) // LEFT BUTTON
			leftButton = 1;
		if(event.button == 1) // MIDDLE BUTTON
			middleButton = 1;
		if(event.button == 2) // RIGHT BUTTON
			rightButton = 1;
		
		updateGoal(event);
	};

	this.mouseUp = function(event) {
		if(event.button == 0) // LEFT BUTTON
			leftButton = 0;
		if(event.button == 1) // MIDDLE BUTTON
			middleButton = 0;
		if(event.button == 2) // RIGHT BUTTON
			rightButton = 0;
	};

	this.mouseMove = function(event) {
		if(leftButton == 1 || middleButton == 1)
			updateGoal(event);
	};
	
	this.mouseWheel = function(event) {
		var weightX = 0;
		var weightY = 0;
		if(event.wheelDeltaY >= 0) { // zoom in
			weightX = (this._sec.mousePosX-(this._sec.stormGLContext.viewportWidth/2.0))*currFov*-0.0004;
			weightY = (this._sec.mousePosY-(this._sec.stormGLContext.viewportHeight/2.0))*currFov*-0.0004;
		} else { // zoom out
			weightX = (this._sec.mousePosX-(this._sec.stormGLContext.viewportWidth/2.0))*currFov*0.0004;
			weightY = (this._sec.mousePosY-(this._sec.stormGLContext.viewportHeight/2.0))*currFov*0.0004;
		} 
		var left = comp_transformTarget.getMatrix().inverse().getLeft();
		var up = comp_transformTarget.getMatrix().inverse().getUp();
		comp_transformTarget.setPositionTarget(comp_transformTarget.getPositionTarget().add(left.x(weightX*-1.0).add(up.x(weightY)))); 
		comp_transformTarget.setPositionGoal(comp_transformTarget.getPositionGoal().add(left.x(weightX*-1.0).add(up.x(weightY))));
	};

	

	/**
	* @param {Float} elapsed
	* @private  
	* @override
	*/
	this.tick = function(elapsed) {	
		var dir;
		if(forward == 1) {
			dir = comp_transformTarget.getMatrix().inverse().getForward().x(-1.0);
			comp_transformTarget.setPositionTarget(comp_transformTarget.getPositionTarget().add(dir));
			comp_transformTarget.setPositionGoal(comp_transformTarget.getPositionGoal().add(dir));
		}
		if(backward == 1) {
			dir = comp_transformTarget.getMatrix().inverse().getForward();
			comp_transformTarget.setPositionTarget(comp_transformTarget.getPositionTarget().add(dir));
			comp_transformTarget.setPositionGoal(comp_transformTarget.getPositionGoal().add(dir));
		}
		if(left == 1) {
			dir = comp_transformTarget.getMatrix().inverse().getLeft().x(-1.0);
			comp_transformTarget.setPositionTarget(comp_transformTarget.getPositionTarget().add(dir));
			comp_transformTarget.setPositionGoal(comp_transformTarget.getPositionGoal().add(dir));
		}
		if(right == 1) {
			dir = comp_transformTarget.getMatrix().inverse().getLeft();
			comp_transformTarget.setPositionTarget(comp_transformTarget.getPositionTarget().add(dir));
			comp_transformTarget.setPositionGoal(comp_transformTarget.getPositionGoal().add(dir));
		}	
	};

	/** @private */
	var updateGoal = function(event) {
		var factorRot = 0.5;
		if(lockRotY == false) {
			if(lastX > event.screenX) {
				comp_transformTarget.yaw(-(lastX - event.screenX)*factorRot);
			} else {
				comp_transformTarget.yaw((event.screenX - lastX)*factorRot);
			}
		}
		if(lockRotX == false) {
			if(lastY > event.screenY) {
				comp_transformTarget.pitch((lastY - event.screenY)*factorRot);
			} else {
				comp_transformTarget.pitch(-(event.screenY - lastY)*factorRot);
			}
		}
			
		lastX = event.screenX;
		lastY = event.screenY;
	};
};
ComponentControllerTransformTarget.prototype = Object.create(Component.prototype);
ComponentControllerTransformTarget.prototype.constructor = ComponentControllerTransformTarget;