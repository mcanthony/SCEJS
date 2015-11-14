/**
* @class
* @constructor
*/
Stage = function() {
	"use strict";
	
	this.nodes = [];
	var activeCamera = null;
	var gl = null;
	
	/**
	 * setActiveCamera
	 * @param {Node} node
	 */
	this.setActiveCamera = function(node) {
		activeCamera = node;
	};
	
	/**
	 * getActiveCamera
	 * @returns {Node}
	 */
	this.getActiveCamera = function() {
		return activeCamera;
	};
	
	/**
	* addNode
	* @param {Node} node.
	*/
	this.addNode = function(node) {
		this.nodes.push(node);
		
		node.setWebGLContext(gl);
	};
	
	/**
	* initialize
	*/
	this.render = function() {
		tick();
	};
	
	/**
	* setWebGLContext
	* @param {WebGLRenderingContext} glCtx.
	* @private
	*/
	this.setWebGLContext = function(glCtx) {
		gl = glCtx;
	};
	
	/**
	 * tick
	 * @private
	 */
	var tick = (function() {
		if(activeCamera != null) {
			gl.viewport(0, 0, 512, 512);
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clearDepth(1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
			
			for(var n=0, fn = this.nodes.length; n < fn; n++) {
				for(var key in this.nodes[n].getComponents()) {
					var component = this.nodes[n].getComponent(key);
					
					if(component.tick != null && component.type != Constants.COMPONENT_TYPES.SCREEN_EFFECTS)
						component.tick(activeCamera);
				}
				
				if(this.nodes[n].onTick != null)  this.nodes[n].onTick();
			}
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
			
			if(activeCamera.getComponent(Constants.COMPONENT_TYPES.SCREEN_EFFECTS) != undefined)
				activeCamera.getComponent(Constants.COMPONENT_TYPES.SCREEN_EFFECTS).tick();
		}
		window.requestAnimFrame(tick);
	}).bind(this);
};

