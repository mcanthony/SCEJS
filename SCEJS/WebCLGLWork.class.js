/** 
* WebCLGLWork Object 
* @class
* @constructor
*/
WebCLGLWork = function(webCLGL, offset) {
	this.webCLGL = webCLGL;
	this.offset = (offset != undefined) ? offset : 100.0;
	
	this.kernels = [];
	this.vertexFragmentPrograms = {};
	this.buffers = {};
	this.buffers_TEMP = {};
};

/**
* Add one WebCLGLKernel to the work
* @param {WebCLGLKernel} kernel
* @param {String} [argument=undefined] Save the result in this argument or output in default framebuffer
* @type Void
 */
WebCLGLWork.prototype.addKernel = function(kernel, argument) {  
	var exists = false;
	for(var n=0; n < this.kernels.length; n++) {
		if(this.kernels[n] == kernel) {
			this.kernels[n] = {"kernel": kernel, "argumentToUpdate": argument};
			exists = true;
			break;
		}
	}
	if(exists == false) {
		this.kernels.push({"kernel": kernel, "argumentToUpdate": argument});
	}
};

/**
* Get one added WebCLGLKernel
* @param {String} argument Get assigned kernel for this argument
* @type Void
 */
WebCLGLWork.prototype.getKernel = function(argument) { 
	for(var n=0; n < this.kernels.length; n++) {
		if(this.kernels[n].argumentToUpdate == argument) {
			return this.kernels[n].kernel;
		}
	}
};

/**
* Add one WebCLGLVertexFragmentProgram to the work
* @param {WebCLGLVertexFragmentProgram} vertexFragmentProgram
* @param {String} name Name for identify this vertexFragmentProgram
* @type Void
 */
WebCLGLWork.prototype.addVertexFragmentProgram = function(vertexFragmentProgram, name) {
	var exists = false;
	for(var key in this.vertexFragmentPrograms) {
		if(this.vertexFragmentPrograms[key] == vertexFragmentProgram) {
			this.vertexFragmentPrograms[key] = vertexFragmentProgram;
			exists = true;
			break;
		}
	}
	if(exists == false) {
		this.vertexFragmentPrograms[name] = vertexFragmentProgram;
	}
};

/**
* Assign value of a argument for all added Kernels and vertexFragmentProgram
* @param {String} argument Argument to set
* @param {Array<Float>|Float32Array|Uint8Array|WebGLTexture|HTMLImageElement} value
* @param {Array<Float>} [splits=[array.length]]
* @type Void
 */
WebCLGLWork.prototype.setArg = function(argument, value, splits) {	
	var kernelPr = [];
	var vPr = [];
	var fPr = [];
	var updatedFromKernel = false;
	var type; // FLOAT or FLOAT4
	var isBuffer = false;
	var usedInVertex = false;
	var usedInFragment = false;
	var mode; // "FRAGMENT", "VERTEX", "VERTEX_INDEX", "VERTEX_FROM_KERNEL", "VERTEX_AND_FRAGMENT"
	
	for(var n=0; n < this.kernels.length; n++) {		
		for(var nb=0; nb < this.kernels[n].kernel.in_values.length; nb++) {
			var inValues = this.kernels[n].kernel.in_values[nb];
			if(inValues.name == argument) {
				if(inValues.type == "buffer_float4") {
					type = "FLOAT4";
					isBuffer = true;
				} else if(inValues.type == "buffer_float") {
					type = "FLOAT";
					isBuffer = true;
				}
					
				kernelPr.push(this.kernels[n].kernel);
				break;
			}
		}
		
		if(updatedFromKernel == false && this.kernels[n].argumentToUpdate == argument) 
			updatedFromKernel = true;
		
	}
	
	
	for(var key in this.vertexFragmentPrograms) {	
		for(var nb=0; nb < this.vertexFragmentPrograms[key].in_vertex_values.length; nb++) {
			var inValues = this.vertexFragmentPrograms[key].in_vertex_values[nb];
			if(inValues.name == argument) {
				if(inValues.type == "buffer_float4_fromKernel" || inValues.type == "buffer_float4") {
					type = "FLOAT4";
					isBuffer = true;
				} else if(inValues.type == "buffer_float_fromKernel" || inValues.type == "buffer_float") {
					type = "FLOAT";
					isBuffer = true;
				}
				
				vPr.push(this.vertexFragmentPrograms[key]);
				usedInVertex = true;
				break;
			}
		}
	
		for(var nb=0; nb < this.vertexFragmentPrograms[key].in_fragment_values.length; nb++) {
			var inValues = this.vertexFragmentPrograms[key].in_fragment_values[nb];
			if(inValues.name == argument) {
				if(inValues.type == "buffer_float4") {
					type = "FLOAT4";
					isBuffer = true;
				} else if(inValues.type == "buffer_float") {
					type = "FLOAT";
					isBuffer = true;
				}
				
				fPr.push(this.vertexFragmentPrograms[key]);
				usedInFragment = true;
				break;
			}
		}
	}
	
	if(isBuffer == true) { 
		if(updatedFromKernel == true && usedInVertex == true) {
			mode = "VERTEX_FROM_KERNEL";
		} else if(usedInVertex == true) {
			if(kernelPr.length > 0 || usedInFragment == true) {
				mode = "VERTEX_AND_FRAGMENT";
			} else {
				mode = "VERTEX";
			}
		} else {
			mode = "FRAGMENT";
		}
		
		var length = (value instanceof HTMLImageElement) ? (value.width*value.height) : ((type == "FLOAT4") ? value.length/4 : value.length);
		var spl = (splits != undefined) ? splits : [length];
		
		buff = this.webCLGL.createBuffer(length, type, this.offset, false, mode, spl);
		this.webCLGL.enqueueWriteBuffer(buff, value);
		this.buffers[argument] = buff;
		if(updatedFromKernel == true) {
			buffTMP = this.webCLGL.createBuffer(length, type, this.offset, false, mode, spl);
			this.webCLGL.enqueueWriteBuffer(buffTMP, value);
			this.buffers_TEMP[argument] = buffTMP;
		}
		
		
		for(var n=0; n < kernelPr.length; n++)
			kernelPr[n].setKernelArg(argument, this.buffers[argument]);
		
		for(var n=0; n < vPr.length; n++)
			vPr[n].setVertexArg(argument, this.buffers[argument]);
		
		for(var n=0; n < fPr.length; n++)
			fPr[n].setFragmentArg(argument, this.buffers[argument]);
	} else {
		for(var n=0; n < kernelPr.length; n++)
			kernelPr[n].setKernelArg(argument, value);
		
		for(var n=0; n < vPr.length; n++)
			vPr[n].setVertexArg(argument, value);
		
		for(var n=0; n < fPr.length; n++) 
			fPr[n].setFragmentArg(argument, value);
	}	
};

/**
* Set indices
* @param {Array<Float>} array 
* @param {Array<Float>} [splits=[array.length]]
* @type Void
 */
WebCLGLWork.prototype.setIndices = function(arr, splits) {  
	var spl = (splits != undefined) ? splits : [arr.length];
	this.CLGL_bufferIndices = this.webCLGL.createBuffer(arr.length, "FLOAT", this.offset, false, "VERTEX_INDEX", spl);
	this.webCLGL.enqueueWriteBuffer(this.CLGL_bufferIndices, arr);
};

/**
* Process kernels
* @type Void
 */
WebCLGLWork.prototype.enqueueNDRangeKernel = function() {  
	for(var n=0; n < this.kernels.length; n++) { 
		if(this.kernels[n].argumentToUpdate != undefined)
			this.webCLGL.enqueueNDRangeKernel(this.kernels[n].kernel, this.buffers_TEMP[this.kernels[n].argumentToUpdate]);
		else 
			this.webCLGL.enqueueNDRangeKernel(this.kernels[n].kernel);
	}
	for(var n=0; n < this.kernels.length; n++) {
		if(this.kernels[n].argumentToUpdate != undefined)
			this.webCLGL.copy(this.buffers_TEMP[this.kernels[n].argumentToUpdate], this.buffers[this.kernels[n].argumentToUpdate]);	
	}
	for(var key in this.vertexFragmentPrograms) {
		for(var nb=0; nb < this.vertexFragmentPrograms[key].in_vertex_values.length; nb++) {
			var inValues = this.vertexFragmentPrograms[key].in_vertex_values[nb];
			if(inValues.type == "buffer_float4_fromKernel" || inValues.type == "buffer_float_fromKernel") {
				this.webCLGL.enqueueReadBuffer_Packet4Uint8Array_Float4(this.buffers[inValues.name]); 
			}
		}
	}	
};

/**
* Process VertexFragmentProgram
* @param {String} [argument=undefined] Argument for vertices count or undefined if indices exist
* @param {String} vertexFragmentProgramName Name of vertexFragmentProgram to execute
* @param {Function} beforerender onBeforeRender function
* @param {Int} drawMode
* @type Void
 */
WebCLGLWork.prototype.enqueueVertexFragmentProgram = function(argument, vertexFragmentProgramName, beforerender, drawMode) {  
	beforerender();
	
	if(this.CLGL_bufferIndices != undefined)
		this.webCLGL.enqueueVertexFragmentProgram(this.vertexFragmentPrograms[vertexFragmentProgramName], this.CLGL_bufferIndices, drawMode); 
	else {
		var buff = this.buffers[argument];
		this.webCLGL.enqueueVertexFragmentProgram(this.vertexFragmentPrograms[vertexFragmentProgramName], buff, drawMode);
	}
};
