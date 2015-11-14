/*
The MIT License (MIT)

Copyright (c) <2010> <Roberto Gonzalez. http://stormcolour.appspot.com/>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
	
// includes
var sceDirectory = document.querySelector('script[src$="SCE.class.js"]').getAttribute('src');
var page = sceDirectory.split('/').pop(); 
sceDirectory = sceDirectory.replace('/'+page,"");

var includesF = [//'/ActionHelpers.class.js',
                 //'/StormMathMin.class.js',
                '/StormMath.class.js',
                '/Utils.class.js',
				/*'/WebCLGL_2.0.Min.class.js',*/
				'/WebCLGLUtils.class.js',
				'/WebCLGLBuffer.class.js',
				'/WebCLGLBufferItem.class.js',
				'/WebCLGLKernel.class.js',
				'/WebCLGLKernelProgram.class.js',
				'/WebCLGLVertexFragmentProgram.class.js',
				'/WebCLGLWork.class.js', 
				'/WebCLGL.class.js',
				'/VFP.class.js',
				'/VFP_RGB.class.js',
				'/SE.class.js',
				'/SE_RGB.class.js',
                '/Mesh.class.js',
                '/Constants.js',
                '/SystemEvents.class.js',
				'/Component.class.js',
				'/ComponentTransform.class.js',
				'/ComponentTransformTarget.class.js',
				'/ComponentControllerTransformTarget.class.js',
				'/ComponentProjection.class.js',
				'/ComponentRenderer.class.js',
				'/ComponentScreenEffects.class.js',
				'/ComponentKeyboardEvents.class.js',
				'/ComponentMouseEvents.class.js',
				'/Node.class.js',
				'/Stage.class.js',
				'/Project.class.js'];
for(var n = 0, f = includesF.length; n < f; n++) document.write('<script type="text/javascript" src="'+sceDirectory+includesF[n]+'"></script>');


/**
* Engine contructor
* @class
* @constructor
*/
SCE = function() {	
	"use strict";
			
	var target;
	var project;		
	var gl;
	
	/**
	* Init WebGL Context
	* @type Void
	* @param {Object} jsonIn
	* 	@param {HTMLCanvasElement} jsonIn.target
	*/
	this.initialize = function(jsonIn) {
		target = (jsonIn != undefined && jsonIn.target != undefined) ? jsonIn.target : undefined;
			
		if(target != undefined) {
			if(!(gl = new Utils().getWebGLContextFromCanvas(target))) {
				alert("No WebGLRenderingContext");
				return false; 
			}
		} else {
			alert('Target canvas required');
		}
	};
	
	/**
	 * loadProject 
	 * @param {Project} prj
	 */
	this.loadProject = function(prj) {
		project = prj; 
		project.setWebGLContext(gl);
		
		new SystemEvents(project, target).initialize();
	};
	
	/**
	 * getLoadedProject 
	 * @returns {Project}
	 */
	this.getLoadedProject = function() {
		return project;
	};
};



