/** 
* WebCLGLVertexFragmentProgram Object
* @class
* @constructor
*/
WebCLGLVertexFragmentProgram = function(gl, vertexSource, vertexHeader, fragmentSource, fragmentHeader) { 
	this.gl = gl;
	var highPrecisionSupport = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.HIGH_FLOAT);
	this.precision = (highPrecisionSupport.precision != 0) ? 'precision highp float;\n\nprecision highp int;\n\n' : 'precision lowp float;\n\nprecision lowp int;\n\n';
	
	this.utils = new WebCLGLUtils();
	
	this.vertexSource;
	this.fragmentSource;
	this.in_vertex_values = [];	
	this.in_fragment_values = [];
	
	this.vertexAttributes = []; // {location,value}
	this.vertexUniforms = []; // {location,value}
	this.fragmentSamplers = []; // {location,value}
	this.fragmentUniforms = []; // {location,value}
	
	if(vertexSource != undefined) this.setVertexSource(vertexSource, vertexHeader);
	if(fragmentSource != undefined) this.setFragmentSource(fragmentSource, fragmentHeader); 
};

/**
* Update the vertex source 
* @type Void
* @param {String} vertexSource
* @param {String} vertexHeader
*/
WebCLGLVertexFragmentProgram.prototype.setVertexSource = function(vertexSource, vertexHeader) {
	this.vertexHead =(vertexHeader!=undefined)?vertexHeader:''; 
	this.in_vertex_values = [];//{value,type,name,idPointer} 
	// value: argument value
	// type: 'buffer_float4_fromKernel'(4 packet pointer4), 'buffer_float_fromKernel'(1 packet pointer4), 'buffer_float4'(1 pointer4), 'buffer_float'(1 pointer1)
	// name: argument name
	// idPointer to: this.vertexAttributes or this.vertexUniforms (according to type)
	
	var argumentsSource = vertexSource.split(')')[0].split('(')[1].split(','); // "float* A", "float* B", "float C", "float4* D"
	//console.log(argumentsSource);
	for(var n = 0, f = argumentsSource.length; n < f; n++) {
		if(argumentsSource[n].match(/\*kernel/gm) != null) {
			if(argumentsSource[n].match(/float4/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'buffer_float4_fromKernel',
									name:argumentsSource[n].split('*kernel')[1].trim()};
			} else if(argumentsSource[n].match(/float/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'buffer_float_fromKernel',
									name:argumentsSource[n].split('*kernel')[1].trim()};
			}
		} else if(argumentsSource[n].match(/\*/gm) != null) {
			if(argumentsSource[n].match(/float4/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'buffer_float4',
									name:argumentsSource[n].split('*')[1].trim()};
			} else if(argumentsSource[n].match(/float/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'buffer_float',
									name:argumentsSource[n].split('*')[1].trim()};
			}
		} else {
			if(argumentsSource[n].match(/float4/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'float4',
									name:argumentsSource[n].split(' ')[1].trim()};
			} else if(argumentsSource[n].match(/float/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'float',
									name:argumentsSource[n].split(' ')[1].trim()};
			} else if(argumentsSource[n].match(/mat4/gm) != null) {
				this.in_vertex_values[n] = {value:undefined,
									type:'mat4',
									name:argumentsSource[n].split(' ')[1].trim()};
			}
		}
	}
	//console.log(this.in_vertex_values);
	
	//console.log('original source: '+vertexSource);
	this.vertexSource = vertexSource.replace(/\r\n/gi, '').replace(/\r/gi, '').replace(/\n/gi, '');
	this.vertexSource = this.vertexSource.replace(/^\w* \w*\([\w\s\*,]*\) {/gi, '').replace(/}(\s|\t)*$/gi, '');
	//console.log('minified source: '+this.vertexSource);
	
	this.vertexSource = this.parseVertexSource(this.vertexSource);
	
	if(this.fragmentSource != undefined) this.compileVertexFragmentSource();
};
/** @private **/
WebCLGLVertexFragmentProgram.prototype.parseVertexSource = function(source) {
	//console.log(source);
	for(var n = 0, f = this.in_vertex_values.length; n < f; n++) { // for each in_vertex_values (in argument)
		var regexp = new RegExp(this.in_vertex_values[n].name+'\\[\\w*\\]',"gm"); 
		var varMatches = source.match(regexp);// "Search current "in_vertex_values.name[xxx]" in source and store in array varMatches
		//console.log(varMatches);
		if(varMatches != null) {
			for(var nB = 0, fB = varMatches.length; nB < fB; nB++) { // for each varMatches ("A[x]", "A[x]")
				var regexpNativeGL = new RegExp('```(\s|\t)*gl.*'+varMatches[nB]+'.*```[^```(\s|\t)*gl]',"gm");
				var regexpNativeGLMatches = source.match(regexpNativeGL);
				if(regexpNativeGLMatches == null) {
					var name = varMatches[nB].split('[')[0];
					var vari = varMatches[nB].split('[')[1].split(']')[0];
					var regexp = new RegExp(name+'\\['+vari.trim()+'\\]',"gm");
					
					if(this.in_vertex_values[n].type == 'buffer_float4_fromKernel') 
						source = source.replace(regexp, 'buffer_float4_fromKernel_data('+name+'0,'+name+'1,'+name+'2,'+name+'3)');
					if(this.in_vertex_values[n].type == 'buffer_float_fromKernel') 
						source = source.replace(regexp, 'buffer_float_fromKernel_data('+name+'0)');
					if(this.in_vertex_values[n].type == 'buffer_float4') 
						source = source.replace(regexp, name);
					if(this.in_vertex_values[n].type == 'buffer_float') 
						source = source.replace(regexp, name);
				}
			}
		}
	}
	source = source.replace(/```(\s|\t)*gl/gi, "").replace(/```/gi, "");
	//console.log('%c translated source:'+source, "background-color:#000;color:#FFF");
	return source;
};
/**
* Update the fragment source 
* @type Void
* @param {String} fragmentSource
* @param {String} fragmentHeader
*/
WebCLGLVertexFragmentProgram.prototype.setFragmentSource = function(fragmentSource, fragmentHeader) {
	this.fragmentHead =(fragmentHeader!=undefined)?fragmentHeader:''; 
	this.in_fragment_values = [];//{value,type,name,idPointer} 
	// value: argument value
	// type: 'buffer_float4'(RGBA channels), 'buffer_float'(Red channel)
	// name: argument name
	// idPointer to: this.fragmentSamplers or this.fragmentUniforms (according to type)
	
	var argumentsSource = fragmentSource.split(')')[0].split('(')[1].split(','); // "float* A", "float* B", "float C", "float4* D"
	//console.log(argumentsSource);
	for(var n = 0, f = argumentsSource.length; n < f; n++) {
		if(argumentsSource[n].match(/\*/gm) != null) {
			if(argumentsSource[n].match(/float4/gm) != null) {
				this.in_fragment_values[n] = {value:undefined,
						type:'buffer_float4',
						name:argumentsSource[n].split('*')[1].trim()};
			} else if(argumentsSource[n].match(/float/gm) != null) {
				this.in_fragment_values[n] = {value:undefined,
									type:'buffer_float',
									name:argumentsSource[n].split('*')[1].trim()};
			}
		} else {
			if(argumentsSource[n].match(/float4/gm) != null) {
				this.in_fragment_values[n] = {value:undefined,
									type:'float4',
									name:argumentsSource[n].split(' ')[1].trim()};
			} else if(argumentsSource[n].match(/float/gm) != null) {
				this.in_fragment_values[n] = {value:undefined,
						type:'float',
						name:argumentsSource[n].split(' ')[1].trim()};
			} else if(argumentsSource[n].match(/mat4/gm) != null) {
				this.in_fragment_values[n] = {value:undefined,
									type:'mat4',
									name:argumentsSource[n].split(' ')[1].trim()};
			}
		}
	}
	//console.log(this.in_fragment_values);
	
	//console.log('original source: '+source);
	this.fragmentSource = fragmentSource.replace(/\r\n/gi, '').replace(/\r/gi, '').replace(/\n/gi, '');
	this.fragmentSource = this.fragmentSource.replace(/^\w* \w*\([\w\s\*,]*\) {/gi, '').replace(/}(\s|\t)*$/gi, '');
	//console.log('minified source: '+this.fragmentSource);
	
	this.fragmentSource = this.parseFragmentSource(this.fragmentSource);
	
	if(this.vertexSource != undefined) this.compileVertexFragmentSource();
};
/** @private **/
WebCLGLVertexFragmentProgram.prototype.parseFragmentSource = function(source) {
	//console.log(source);
	for(var n = 0, f = this.in_fragment_values.length; n < f; n++) { // for each in_fragment_values (in argument)
		var regexp = new RegExp(this.in_fragment_values[n].name+'\\[\\w*\\]',"gm"); 
		var varMatches = source.match(regexp);// "Search current "in_fragment_values.name[xxx]" in source and store in array varMatches
		//console.log(varMatches);
		if(varMatches != null) {
			for(var nB = 0, fB = varMatches.length; nB < fB; nB++) { // for each varMatches ("A[x]", "A[x]")
				var regexpNativeGL = new RegExp('```(\s|\t)*gl.*'+varMatches[nB]+'.*```[^```(\s|\t)*gl]',"gm");
				var regexpNativeGLMatches = source.match(regexpNativeGL);
				if(regexpNativeGLMatches == null) {
					var name = varMatches[nB].split('[')[0];
					var vari = varMatches[nB].split('[')[1].split(']')[0];
					var regexp = new RegExp(name+'\\['+vari.trim()+'\\]',"gm");
					
					if(this.in_fragment_values[n].type == 'buffer_float4') 
						source = source.replace(regexp, 'buffer_float4_data('+name+','+vari+')');
					if(this.in_fragment_values[n].type == 'buffer_float') 
						source = source.replace(regexp, 'buffer_float_data('+name+','+vari+')');
				}
			}
		}
	}
	source = source.replace(/```(\s|\t)*gl/gi, "").replace(/```/gi, "");
	//console.log('%c translated source:'+source, "background-color:#000;color:#FFF");
	return source;
};














/** @private **/
WebCLGLVertexFragmentProgram.prototype.compileVertexFragmentSource = function() {
	lines_vertex_attrs = (function() {
		str = '';
		for(var n = 0, f = this.in_vertex_values.length; n < f; n++) {
			if(this.in_vertex_values[n].type == 'buffer_float4_fromKernel') {
				str += 'attribute vec4 '+this.in_vertex_values[n].name+'0;\n';
				str += 'attribute vec4 '+this.in_vertex_values[n].name+'1;\n';
				str += 'attribute vec4 '+this.in_vertex_values[n].name+'2;\n';
				str += 'attribute vec4 '+this.in_vertex_values[n].name+'3;\n';
			} else if(this.in_vertex_values[n].type == 'buffer_float_fromKernel') {
				str += 'attribute vec4 '+this.in_vertex_values[n].name+'0;\n';
			} else if(this.in_vertex_values[n].type == 'buffer_float4') {
				str += 'attribute vec4 '+this.in_vertex_values[n].name+';\n';
			} else if(this.in_vertex_values[n].type == 'buffer_float') {
				str += 'attribute float '+this.in_vertex_values[n].name+';\n';
			} else if(this.in_vertex_values[n].type == 'float') {
				str += 'uniform float '+this.in_vertex_values[n].name+';\n';
			} else if(this.in_vertex_values[n].type == 'float4') {
				str += 'uniform vec4 '+this.in_vertex_values[n].name+';\n';
			} else if(this.in_vertex_values[n].type == 'mat4') {
				str += 'uniform mat4 '+this.in_vertex_values[n].name+';\n';
			}
		}
		return str;
	}).bind(this);
	
	lines_fragment_attrs = (function() {
		str = '';
		for(var n = 0, f = this.in_fragment_values.length; n < f; n++) {
			if(this.in_fragment_values[n].type == 'buffer_float4' || this.in_fragment_values[n].type == 'buffer_float') {
				str += 'uniform sampler2D '+this.in_fragment_values[n].name+';\n';
			} else if(this.in_fragment_values[n].type == 'float') {
				str += 'uniform float '+this.in_fragment_values[n].name+';\n';
			} else if(this.in_fragment_values[n].type == 'float4') {
				str += 'uniform vec4 '+this.in_fragment_values[n].name+';\n';
			} else if(this.in_fragment_values[n].type == 'mat4') {
				str += 'uniform mat4 '+this.in_fragment_values[n].name+';\n';
			}
		}
		return str;
	}).bind(this);
	
	
	var sourceVertex = 	this.precision+
		'uniform float uOffset;\n'+
		
		lines_vertex_attrs()+
		
		this.utils.unpackGLSLFunctionString()+ 
		
		'vec4 buffer_float4_fromKernel_data(vec4 arg0, vec4 arg1, vec4 arg2, vec4 arg3) {\n'+
			'float argX = (unpack(arg0)*(uOffset*2.0))-uOffset;\n'+  
			'float argY = (unpack(arg1)*(uOffset*2.0))-uOffset;\n'+  
			'float argZ = (unpack(arg2)*(uOffset*2.0))-uOffset;\n'+
			'float argW = (unpack(arg3)*(uOffset*2.0))-uOffset;\n'+
		
			'return vec4(argX, argY, argZ, argW);\n'+
		'}\n'+
		'float buffer_float_fromKernel_data(vec4 arg0) {\n'+
			'float argX = (unpack(arg0)*(uOffset*2.0))-uOffset;\n'+ 
			
			'return argX;\n'+
		'}\n'+
	
		'vec2 get_global_id() {\n'+
			'return vec2(0.0, 0.0);\n'+
		'}\n'+
	
		this.vertexHead+
		
		'void main(void) {\n'+
		
			this.vertexSource+

		'}\n';
	//console.log(sourceVertex);	
	var sourceFragment = this.precision+
		
		lines_fragment_attrs()+
		
		'vec4 buffer_float4_data(sampler2D arg, vec2 coord) {\n'+
			'vec4 textureColor = texture2D(arg, coord);\n'+
			'return textureColor;\n'+
		'}\n'+
		'float buffer_float_data(sampler2D arg, vec2 coord) {\n'+
			'vec4 textureColor = texture2D(arg, coord);\n'+
			'return textureColor.x;\n'+
		'}\n'+
		
		'vec2 get_global_id() {\n'+
			'return vec2(0.0, 0.0);\n'+
		'}\n'+
		
		this.fragmentHead+
		
		'void main(void) {\n'+
			
			this.fragmentSource+
			
		'}\n';
	//console.log(sourceFragment);	
	
	this.vertexFragmentProgram = this.gl.createProgram();
	this.utils.createShader(this.gl, "WEBCLGL VERTEX FRAGMENT PROGRAM", sourceVertex, sourceFragment, this.vertexFragmentProgram);
	
	
	this.vertexAttributes = []; // {location,value}
	this.vertexUniforms = []; // {location,value}
	this.fragmentSamplers = []; // {location,value}
	this.fragmentUniforms = []; // {location,value}
	
	this.uOffset = this.gl.getUniformLocation(this.vertexFragmentProgram, "uOffset");
	
	// vertexAttributes & vertexUniforms
	for(var n = 0, f = this.in_vertex_values.length; n < f; n++) {
		if(	this.in_vertex_values[n].type == 'buffer_float4_fromKernel') {
			this.vertexAttributes.push({location:[this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name+"0"),
			                                      this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name+"1"),
			                                      this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name+"2"),
			                                      this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name+"3")],
										value:this.in_vertex_values[n].value,
										type: this.in_vertex_values[n].type});
			
			this.in_vertex_values[n].idPointer = this.vertexAttributes.length-1;
		} else if(this.in_vertex_values[n].type == 'buffer_float_fromKernel') {
			this.vertexAttributes.push({location:[this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name+"0")],
										value:this.in_vertex_values[n].value,
										type: this.in_vertex_values[n].type});
			
			this.in_vertex_values[n].idPointer = this.vertexAttributes.length-1;
		} else if(this.in_vertex_values[n].type == 'buffer_float4' || this.in_vertex_values[n].type == 'buffer_float') {
			this.vertexAttributes.push({location:[this.gl.getAttribLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name)],
										value:this.in_vertex_values[n].value,
										type: this.in_vertex_values[n].type});
			
			this.in_vertex_values[n].idPointer = this.vertexAttributes.length-1;
		} else if(this.in_vertex_values[n].type == 'float' || this.in_vertex_values[n].type == 'float4' || this.in_vertex_values[n].type == 'mat4') {
			this.vertexUniforms.push({location:[this.gl.getUniformLocation(this.vertexFragmentProgram, this.in_vertex_values[n].name)],
										value:this.in_vertex_values[n].value,
										type: this.in_vertex_values[n].type});

			this.in_vertex_values[n].idPointer = this.vertexUniforms.length-1;	
		}
	}
	
	// fragmentSamplers & fragmentUniforms
	for(var n = 0, f = this.in_fragment_values.length; n < f; n++) {
		if(this.in_fragment_values[n].type == 'buffer_float4' || this.in_fragment_values[n].type == 'buffer_float') {
			this.fragmentSamplers.push({location:[this.gl.getUniformLocation(this.vertexFragmentProgram, this.in_fragment_values[n].name)],
										value:this.in_fragment_values[n].value,
										type: this.in_fragment_values[n].type});
			
			this.in_fragment_values[n].idPointer = this.fragmentSamplers.length-1;
		} else if(this.in_fragment_values[n].type == 'float' || this.in_fragment_values[n].type == 'float4' || this.in_fragment_values[n].type == 'mat4') {
			this.fragmentUniforms.push({location:[this.gl.getUniformLocation(this.vertexFragmentProgram, this.in_fragment_values[n].name)],
										value:this.in_fragment_values[n].value,
										type: this.in_fragment_values[n].type});
			
			this.in_fragment_values[n].idPointer = this.fragmentUniforms.length-1;
		}
	}
	
	
	return true;
};

/**
* Bind float, mat4 or a WebCLGLBuffer to a vertex argument
* @type Void
* @param {Int|String} argument Id of argument or name of this
* @param {Float|Int|WebCLGLBuffer} data
*/
WebCLGLVertexFragmentProgram.prototype.setVertexArg = function(argument, data) {
	if(data == undefined) alert("Error: setVertexArg("+argument+", undefined)"); 
	
	var numArg;
	if(typeof argument != "string") {
		numArg = argument;
	} else {
		for(var n=0, fn = this.in_vertex_values.length; n < fn; n++) {
			if(this.in_vertex_values[n].name == argument) {
				numArg = n;
				break;
			}
		}
	}
	
	if(this.in_vertex_values[numArg] == undefined) {
		console.log("argument "+argument+" not exist in this vertex program");
		return;
	}
	this.in_vertex_values[numArg].value = data;
	
	if(	this.in_vertex_values[numArg].type == 'buffer_float4_fromKernel' ||
		this.in_vertex_values[numArg].type == 'buffer_float_fromKernel' ||
		this.in_vertex_values[numArg].type == 'buffer_float4' ||
		this.in_vertex_values[numArg].type == 'buffer_float') {
		this.vertexAttributes[this.in_vertex_values[numArg].idPointer].value = this.in_vertex_values[numArg].value;
	} else if(this.in_vertex_values[numArg].type == 'float' || this.in_vertex_values[numArg].type == 'float4' || this.in_vertex_values[numArg].type == 'mat4') {
		this.vertexUniforms[this.in_vertex_values[numArg].idPointer].value = this.in_vertex_values[numArg].value;	
	}
};
/**
* Bind float or a WebCLGLBuffer to a fragment argument
* @type Void
* @param {Int|String} argument Id of argument or name of this
* @param {Float|Int|WebCLGLBuffer} data
*/
WebCLGLVertexFragmentProgram.prototype.setFragmentArg = function(argument, data) {
	if(data == undefined) alert("Error: setFragmentArg("+argument+", undefined)"); 
	
	var numArg;
	if(typeof argument != "string") {
		numArg = argument;
	} else {
		for(var n=0, fn = this.in_fragment_values.length; n < fn; n++) {
			if(this.in_fragment_values[n].name == argument) {
				numArg = n;
				break;
			}
		}
	}
	
	if(this.in_fragment_values[numArg] == undefined) {
		console.log("argument "+argument+" not exist in this fragment program");
		return;
	}
	this.in_fragment_values[numArg].value = data;
	
	if(this.in_fragment_values[numArg].type == 'buffer_float4' || this.in_fragment_values[numArg].type == 'buffer_float') {
		this.fragmentSamplers[this.in_fragment_values[numArg].idPointer].value = this.in_fragment_values[numArg].value;
	} else if(this.in_fragment_values[numArg].type == 'float' || this.in_fragment_values[numArg].type == 'float4' || this.in_fragment_values[numArg].type == 'mat4') {
		this.fragmentUniforms[this.in_fragment_values[numArg].idPointer].value = this.in_fragment_values[numArg].value;			
	}
};
