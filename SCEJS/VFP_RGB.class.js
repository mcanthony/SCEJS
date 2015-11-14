/** @private **/
function VFP_RGB(textureUnitCount) { VFP.call(this);
	this.getSrc = function() {
		var lineArgument_samplers = function() {
			var str = 'float4* texAlbedo,';
			return str;
		};
		var str_vfp = [
		    // vertex head
			['varying vec4 vVN;\n'+
			 'varying vec4 vVT;\n'+
			 'varying float vVTU;\n'],
			
			// vertex source
			['void main(float4* vertexPos,'+
						'float4* vertexNormal,'+
						'float4* vertexTexture,'+
						'float* vertexTextureUnit,'+
						'mat4 PMatrix,'+
						'mat4 cameraWMatrix,'+
						'mat4 nodeWMatrix) {'+
							'vec2 x = get_global_id();'+
					
							'vec4 vp = vertexPos[x];\n'+
							'vec4 vn = vertexNormal[x];\n'+
							'vec4 vt = vertexTexture[x];\n'+
							'float vtu = vertexTextureUnit[x];\n'+
							
							'vVN = vn;'+
							'vVT = vt;'+
							'vVTU = vtu;'+
											
							'gl_Position = PMatrix * cameraWMatrix * nodeWMatrix * vp;\n'+
			'}'],
			
			// fragment head
			['varying vec4 vVN;\n'+
			 'varying vec4 vVT;\n'+
			 'varying float vVTU;\n'],
			 
			[// fragment source
			 'void main('+lineArgument_samplers()+
			 			'float nodesSize) {'+
						 	'vec2 x = get_global_id();'+
						 	'vec4 textureColor = texture2D(texAlbedo, vVT.xy);\n'+
						 	// diffuse
							'gl_FragColor = textureColor;\n'+
			 '}']];
		
		return str_vfp;
	};
};
VFP_RGB.prototype = Object.create(VFP.prototype);
VFP_RGB.prototype.constructor = VFP_RGB;