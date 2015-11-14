/**
* @class
* @constructor
*/
ComponentRenderer = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.RENDERER;
	this.node = null;
	var gl = null;
	
	var webCLGL;
	var clglWork;
	
	var args = {};
	
	/**
	 * initialize
	 * @param {Node} nod
	 * @param {WebGLRenderingContext} glCtx.
	 * @override
	 * @private
	 */
	this.initialize = function(nod, glCtx) {
		node = nod;
		gl = glCtx;
		
		webCLGL = new WebCLGL(gl);
		var offset = 1000.0;
		clglWork = webCLGL.createWork(offset);	
	};
	
	/**
	 * @param {VFP} vfp
	 */
	this.addVFP = function(vfp) {
		var arg = vfp.getSrc();
		var vfProgram = webCLGL.createVertexFragmentProgram();
		vfProgram.setVertexSource(arg[1][0], arg[0][0]);
		vfProgram.setFragmentSource(arg[3][0], arg[2][0]);
		clglWork.addVertexFragmentProgram(vfProgram, vfp.constructor.name);
		
		vfProgram.argBufferDestination = vfp.constructor.name;
	};
	
	/**
	* @param {String} argument Argument to set
	* @param {Function} fnvalue
	* @param {Array<Float>} [splits=[array.length]]
	*/
	this.setArg = function(argument, fnvalue, splits) {
		clglWork.setArg(argument, fnvalue(), splits);
		args[argument] = {	"fnvalue": fnvalue,
							"updatable": null};
	};
	
	/**
	* @param {String} argument Argument to set
	* @param {Bool} value
	*/
	this.setArgUpdatable = function(argument, value) {
		args[argument].updatable = value;
	};
	
	/**
	* @param {Function} fnvalue 
	* @param {Array<Float>} [splits=[array.length]]
	*/
	this.setIndices = function(fnvalue, splits) {
		clglWork.setIndices(fnvalue(), splits); 
	};
	
	/**
	 * tick
	 * @param {Node} [activeCamera=undefined]
	 * @override
	 * @private
	 */
	this.tick = function(activeCamera) {
		for(var key in args) {
			if(args[key].updatable == true) {
				clglWork.setArg(key, args[key].fnvalue());
			}
		}
		for(var key in clglWork.vertexFragmentPrograms) {
			var destArg = null;
			var comp_screenEffects = activeCamera.getComponent(Constants.COMPONENT_TYPES.SCREEN_EFFECTS);
			if(comp_screenEffects != undefined) {
				destArg = comp_screenEffects.getBuffers()[clglWork.vertexFragmentPrograms[key].argBufferDestination];
			} else console.log("ComponentScreenEffects not exists in camera"); 
			
			gl.bindFramebuffer(gl.FRAMEBUFFER, destArg.items[0].fBuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, destArg.items[0].textureData, 0);			
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
			
			clglWork.enqueueVertexFragmentProgram(undefined, key, (function() {}).bind(this), 4);
		}
	};	
};
ComponentRenderer.prototype = Object.create(Component.prototype);
ComponentRenderer.prototype.constructor = ComponentRenderer;