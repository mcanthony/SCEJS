/**
* @class
* @constructor
*/
ComponentScreenEffects = function() { Component.call(this);
	"use strict";
	
	this.type = Constants.COMPONENT_TYPES.SCREEN_EFFECTS;
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
	 * @param {SE} se
	 */
	this.addSE = function(se) {
		var source = se.getSrc();
		var kernel = webCLGL.createKernel(); 
		kernel.setKernelSource(source[1][0], source[0][0]);				
		clglWork.addKernel(kernel, undefined); // undefined=output to principal buffer
		
		for(var n=0, fn=se.dependencies.length; n < fn; n++) {
			var w = node.getComponent(Constants.COMPONENT_TYPES.PROJECTION).getResolution().width;
			var h = node.getComponent(Constants.COMPONENT_TYPES.PROJECTION).getResolution().height;
			this.setArg(se.dependencies[n], function(){return new Float32Array(w*h*4);});
		}
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
	 * getBuffers
	 * @returns {Array<WebCLGLBuffer>}
	 */
	this.getBuffers = function() {
		return clglWork.buffers;
	};
	
	/**
	 * tick
	 * @override
	 * @private
	 */
	this.tick = function() {
		for(var key in args) {
			if(args[key].updatable == true) {
				clglWork.setArg(key, args[key].fnvalue());
			}
		}
		clglWork.enqueueNDRangeKernel();
	};	
};
ComponentScreenEffects.prototype = Object.create(Component.prototype);
ComponentScreenEffects.prototype.constructor = ComponentScreenEffects;