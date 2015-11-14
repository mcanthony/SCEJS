/*
StormM16.rotation
Copyright (C) 2007 James Coglan Sylvester.js

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

/*
StormM16.inverse
Copyright (C) 2004 - Geotechnical Software Services
 
This code is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public 
License as published by the Free Software Foundation; either 
version 2.1 of the License, or (at your option) any later version.

This code is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public 
License along with this program; if not, write to the Free 
Software Foundation, Inc., 59 Temple Place - Suite 330, Boston, 
MA  02111-1307, USA.
*/

/**
* @class
* @constructor

* @property {Float32Array} e Array with 16 values
*/
StormM16 = function(elements) {
	if(elements != undefined) this.e = new Float32Array(elements);
	else this.e = new Float32Array([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);
};
/**
* Perform a * b and get the matrix
* @returns {StormM16}
* @param {StormM16|StormV3} value Value b (Vector|Matrix)
*/
StormM16.prototype.x = function(stormM16) {
	if(stormM16 instanceof StormM16) {
		var mx = function asm(stdlib,f) {
			"use asm";
			return [	(f[0][0]*f[1][0]) + (f[0][1]*f[1][4]) + (f[0][2]*f[1][8]) + (f[0][3]*f[1][12]),
					  (f[0][0]*f[1][1]) + (f[0][1]*f[1][5]) + (f[0][2]*f[1][9]) + (f[0][3]*f[1][13]),
					  (f[0][0]*f[1][2]) + (f[0][1]*f[1][6]) + (f[0][2]*f[1][10]) + (f[0][3]*f[1][14]),
					  (f[0][0]*f[1][3]) + (f[0][1]*f[1][7]) + (f[0][2]*f[1][11]) + (f[0][3]*f[1][15]),

					  (f[0][4]*f[1][0]) + (f[0][5]*f[1][4]) + (f[0][6]*f[1][8]) + (f[0][7]*f[1][12]),
					  (f[0][4]*f[1][1]) + (f[0][5]*f[1][5]) + (f[0][6]*f[1][9]) + (f[0][7]*f[1][13]),
					  (f[0][4]*f[1][2]) + (f[0][5]*f[1][6]) + (f[0][6]*f[1][10]) + (f[0][7]*f[1][14]),
					  (f[0][4]*f[1][3]) + (f[0][5]*f[1][7]) + (f[0][6]*f[1][11]) + (f[0][7]*f[1][15]),

					  (f[0][8]*f[1][0]) + (f[0][9]*f[1][4]) + (f[0][10]*f[1][8]) + (f[0][11]*f[1][12]),
					  (f[0][8]*f[1][1]) + (f[0][9]*f[1][5]) + (f[0][10]*f[1][9]) + (f[0][11]*f[1][13]),
					  (f[0][8]*f[1][2]) + (f[0][9]*f[1][6]) + (f[0][10]*f[1][10]) + (f[0][11]*f[1][14]),
					  (f[0][8]*f[1][3]) + (f[0][9]*f[1][7]) + (f[0][10]*f[1][11]) + (f[0][11]*f[1][15]),

					  (f[0][12]*f[1][0]) + (f[0][13]*f[1][4]) + (f[0][14]*f[1][8]) + (f[0][15]*f[1][12]),
					  (f[0][12]*f[1][1]) + (f[0][13]*f[1][5]) + (f[0][14]*f[1][9]) + (f[0][15]*f[1][13]),
					  (f[0][12]*f[1][2]) + (f[0][13]*f[1][6]) + (f[0][14]*f[1][10]) + (f[0][15]*f[1][14]),
					  (f[0][12]*f[1][3]) + (f[0][13]*f[1][7]) + (f[0][14]*f[1][11]) + (f[0][15]*f[1][15])	];
		}(undefined,[this.e, stormM16.e]);
		
		return $M16([	mx[0],mx[1],mx[2],mx[3],
						mx[4],mx[5],mx[6],mx[7],
						mx[8],mx[9],mx[10],mx[11],
						mx[12],mx[13],mx[14],mx[15]	]); 
	} else {
		var mx = function asm(stdlib,f) {
			"use asm";
			return [	0.0,
						0.0,
						0.0,
						(f[0][0]*f[1][0]) + (f[0][1]*f[1][1]) + (f[0][2]*f[1][2]),

						0.0,
						0.0,
						0.0,
						(f[0][4]*f[1][0]) + (f[0][5]*f[1][1]) + (f[0][6]*f[1][2]),

						0.0,
						0.0,
						0.0,
						(f[0][8]*f[1][0]) + (f[0][9]*f[1][1]) + (f[0][10]*f[1][2]),

						0.0,
						0.0,
						0.0,
						(f[0][12]*f[1][0]) + (f[0][13]*f[1][1]) + (f[0][14]*f[1][2])	];
		}(undefined,[this.e, stormM16.e]);
		
		return $M16([	mx[0],mx[1],mx[2],mx[3],
						mx[4],mx[5],mx[6],mx[7],
						mx[8],mx[9],mx[10],mx[11],
						mx[12],mx[13],mx[14],mx[15]	]);
	}
};
/**
* Get matrix transposed
* @returns {StormM16}
*/
StormM16.prototype.transpose = function() {
	return $M16([	this.e[0], this.e[4], this.e[8], this.e[12],
					this.e[1], this.e[5], this.e[9], this.e[13],
					this.e[2], this.e[6], this.e[10], this.e[14],
					this.e[3], this.e[7], this.e[11], this.e[15]	]);
};
/**
* Get matrix inverted
* @returns {StormM16}
*/
StormM16.prototype.inverse = function() {
	var mx = function asm(stdlib,f) {
			"use asm";
		var src = new Float32Array([f[0][0], f[0][4], f[0][8], f[0][12],
									f[0][1], f[0][5], f[0][9], f[0][13],
									f[0][2], f[0][6], f[0][10], f[0][14],
									f[0][3], f[0][7], f[0][11], f[0][15]	]); // transpose
		var tmp = new Float32Array(12);
		var dst = new Float32Array(16);
		// Calculate pairs for first 8 elements (cofactors) 
		tmp[0] = src[10] * src[15];
		tmp[1] = src[11] * src[14];
		tmp[2] = src[9]  * src[15];
		tmp[3] = src[11] * src[13];
		tmp[4] = src[9]  * src[14];
		tmp[5] = src[10] * src[13];
		tmp[6] = src[8]  * src[15];
		tmp[7] = src[11] * src[12];
		tmp[8] = src[8]  * src[14];
		tmp[9] = src[10] * src[12];
		tmp[10] = src[8] * src[13];
		tmp[11] = src[9] * src[12];
		
		// Calculate first 8 elements (cofactors)
		dst[0]  = tmp[0]*src[5] + tmp[3]*src[6] + tmp[4]*src[7];
		dst[0] -= tmp[1]*src[5] + tmp[2]*src[6] + tmp[5]*src[7];
		dst[1]  = tmp[1]*src[4] + tmp[6]*src[6] + tmp[9]*src[7];
		dst[1] -= tmp[0]*src[4] + tmp[7]*src[6] + tmp[8]*src[7];
		dst[2]  = tmp[2]*src[4] + tmp[7]*src[5] + tmp[10]*src[7];
		dst[2] -= tmp[3]*src[4] + tmp[6]*src[5] + tmp[11]*src[7];
		dst[3]  = tmp[5]*src[4] + tmp[8]*src[5] + tmp[11]*src[6];
		dst[3] -= tmp[4]*src[4] + tmp[9]*src[5] + tmp[10]*src[6];
		dst[4]  = tmp[1]*src[1] + tmp[2]*src[2] + tmp[5]*src[3];
		dst[4] -= tmp[0]*src[1] + tmp[3]*src[2] + tmp[4]*src[3];
		dst[5]  = tmp[0]*src[0] + tmp[7]*src[2] + tmp[8]*src[3];
		dst[5] -= tmp[1]*src[0] + tmp[6]*src[2] + tmp[9]*src[3];
		dst[6]  = tmp[3]*src[0] + tmp[6]*src[1] + tmp[11]*src[3];
		dst[6] -= tmp[2]*src[0] + tmp[7]*src[1] + tmp[10]*src[3];
		dst[7]  = tmp[4]*src[0] + tmp[9]*src[1] + tmp[10]*src[2];
		dst[7] -= tmp[5]*src[0] + tmp[8]*src[1] + tmp[11]*src[2];
		
		// Calculate pairs for second 8 elements (cofactors)
		tmp[0]  = src[2]*src[7];
		tmp[1]  = src[3]*src[6];
		tmp[2]  = src[1]*src[7];
		tmp[3]  = src[3]*src[5];
		tmp[4]  = src[1]*src[6];
		tmp[5]  = src[2]*src[5];
		tmp[6]  = src[0]*src[7];
		tmp[7]  = src[3]*src[4];
		tmp[8]  = src[0]*src[6];
		tmp[9]  = src[2]*src[4];
		tmp[10] = src[0]*src[5];
		tmp[11] = src[1]*src[4];

		// Calculate second 8 elements (cofactors)
		dst[8]   = tmp[0] * src[13]  + tmp[3] * src[14]  + tmp[4] * src[15];
		dst[8]  -= tmp[1] * src[13]  + tmp[2] * src[14]  + tmp[5] * src[15];
		dst[9]   = tmp[1] * src[12]  + tmp[6] * src[14]  + tmp[9] * src[15];
		dst[9]  -= tmp[0] * src[12]  + tmp[7] * src[14]  + tmp[8] * src[15];
		dst[10]  = tmp[2] * src[12]  + tmp[7] * src[13]  + tmp[10]* src[15];
		dst[10] -= tmp[3] * src[12]  + tmp[6] * src[13]  + tmp[11]* src[15];
		dst[11]  = tmp[5] * src[12]  + tmp[8] * src[13]  + tmp[11]* src[14];
		dst[11] -= tmp[4] * src[12]  + tmp[9] * src[13]  + tmp[10]* src[14];
		dst[12]  = tmp[2] * src[10]  + tmp[5] * src[11]  + tmp[1] * src[9];
		dst[12] -= tmp[4] * src[11]  + tmp[0] * src[9]   + tmp[3] * src[10];
		dst[13]  = tmp[8] * src[11]  + tmp[0] * src[8]   + tmp[7] * src[10];
		dst[13] -= tmp[6] * src[10]  + tmp[9] * src[11]  + tmp[1] * src[8];
		dst[14]  = tmp[6] * src[9]   + tmp[11]* src[11]  + tmp[3] * src[8];
		dst[14] -= tmp[10]* src[11] + tmp[2] * src[8]   + tmp[7] * src[9];
		dst[15]  = tmp[10]* src[10]  + tmp[4] * src[8]   + tmp[9] * src[9];
		dst[15] -= tmp[8] * src[9]   + tmp[11]* src[10]  + tmp[5] * src[8];
		
		var det = src[0]*dst[0] + src[1]*dst[1] + src[2]*dst[2] + src[3]*dst[3];
		return [	dst[0] * det, dst[1] * det, dst[2] * det, dst[3] * det,
					dst[4] * det, dst[5] * det, dst[6] * det, dst[7] * det,
					dst[8] * det, dst[9] * det, dst[10] * det, dst[11] * det,
					dst[12] * det, dst[13] * det, dst[14] * det, dst[15] * det	];
	}(undefined,[this.e]);

	return $M16([	mx[0],mx[1],mx[2],mx[3],
					mx[4],mx[5],mx[6],mx[7],
					mx[8],mx[9],mx[10],mx[11],
					mx[12],mx[13],mx[14],mx[15]	]);
};
/**
* Get vector left
* @returns {StormV3}
*/
StormM16.prototype.getLeft = function() {
	return $V3([this.e[0],this.e[4],this.e[8]]).normalize();
};
/**
* Get vector up
* @returns {StormV3}
*/
StormM16.prototype.getUp = function() {
	return $V3([this.e[1],this.e[5],this.e[9]]).normalize();
};
/**
* Get vector forward
* @returns {StormV3}
*/
StormM16.prototype.getForward = function() {
	return $V3([this.e[2],this.e[6],this.e[10]]).normalize();  
};
/**
* Set rotation in axis
* @returns {StormM16}
* @param {Float} radians Radians
* @param {String} [relative=true] false for absolute rotation
* @param {StormV3} [axis=$V3([0.0,1.0,0.0])]
*/
StormM16.prototype.setRotation = function(radians, relative, axis) { 
	if(axis != undefined && axis.e[0]) {
		if(relative == undefined || relative == true)
			return this.x($M16([	1.0,	0.0,				0.0, 				0.0,
									0.0,	Math.cos(radians),	-Math.sin(radians),	0.0,
									0.0,	Math.sin(radians),	Math.cos(radians),	0.0,
									0.0, 	0.0, 				0.0,	 			1.0])); 
		else
			return $M16([	1.0,	0.0,				0.0, 				0.0,
							0.0,	Math.cos(radians),	-Math.sin(radians),	0.0,
							0.0,	Math.sin(radians),	Math.cos(radians),	0.0,
							0.0, 	0.0, 				0.0, 				1.0]); 
	}
	if(axis == undefined || axis.e[1]) {
		if(relative == undefined || relative == true)
			return this.x($M16([	Math.cos(radians),	0.0,	Math.sin(radians), 	0.0,
									0.0,				1.0,	0.0,				0.0,
									-Math.sin(radians),	0.0,	Math.cos(radians),	0.0,
									0.0, 				0.0, 	0.0, 				1.0])); 		
		else
			return $M16([	Math.cos(radians),	0.0,	Math.sin(radians), 	0.0,
							0.0,				1.0,	0.0,				0.0,
							-Math.sin(radians),	0.0,	Math.cos(radians),	0.0,
							0.0, 				0.0, 	0.0, 				1.0]); 
	}
	if(axis != undefined && axis.e[2]) { 
		if(relative == undefined || relative == true)
			return this.x($M16([	Math.cos(radians),	-Math.sin(radians),	0.0, 	0.0,
									Math.sin(radians),	Math.cos(radians),	0.0,	0.0,
									0.0,				0.0,				1.0,	0.0,
									0.0, 				0.0, 				0.0, 	1.0])); 	
		else
			return $M16([	Math.cos(radians),	-Math.sin(radians),	0.0, 	0.0,
							Math.sin(radians),	Math.cos(radians),	0.0,	0.0,
							0.0,				0.0,				1.0,	0.0,
							0.0, 				0.0, 				0.0, 	1.0]); 
	}
};
/**
* Set rotation x
* @returns {StormM16}
* @param {Float} radians Radians
* @param {String} [relative=true] false for absolute rotation
*/
StormM16.prototype.setRotationX = function(radians, relative) { 
	return this.setRotation(radians, relative, $V3([1.0,0.0,0.0]));
};
/**
* Set rotation y
* @returns {StormM16}
* @param {Float} radians Radians
* @param {String} [relative=true] false for absolute rotation
*/
StormM16.prototype.setRotationY = function(radians, relative) {
	return this.setRotation(radians, relative, $V3([0.0,1.0,0.0]));
};
/**
* Set rotation z
* @returns {StormM16}
* @param {Float} radians Radians
* @param {String}[relative=true] false for absolute rotation
*/
StormM16.prototype.setRotationZ = function(radians, relative) {
	return this.setRotation(radians, relative, $V3([0.0,0.0,1.0]));
};
/**
* Set scale in axis
* @returns {StormM16}
* @param {Float} scale Scale
* @param {String} [relative=true] false for absolute scale
* @param {StormV3} [axis=$V3([0.0,1.0,0.0])]
*/
StormM16.prototype.setScale = function(scale, relative, axis) { 
	if(axis != undefined && axis.e[0]) {
		if(relative == undefined || relative == true)
			return this.x($M16([	scale,	0.0,	0.0, 	0.0,
									0.0,	1.0,	0.0,	0.0,
									0.0,	0.0,	1.0,	0.0,
									0.0, 	0.0, 	0.0,	1.0])); 
		else
			return $M16([	scale,	0.0,	0.0, 	0.0,
							0.0,	1.0,	0.0,	0.0,
							0.0,	0.0,	1.0,	0.0,
							0.0, 	0.0, 	0.0, 	1.0]); 
	}
	if(axis == undefined || axis.e[1]) {
		if(relative == undefined || relative == true)
			return this.x($M16([	1.0,	0.0,	0.0, 	0.0,
									0.0,	scale,	0.0,	0.0,
									0.0,	0.0,	1.0,	0.0,
									0.0, 	0.0, 	0.0,	1.0])); 	
		else
			return $M16([	1.0,	0.0,	0.0, 	0.0,
							0.0,	scale,	0.0,	0.0,
							0.0,	0.0,	1.0,	0.0,
							0.0, 	0.0, 	0.0, 	1.0]); 
	}
	if(axis != undefined && axis.e[2]) { 
		if(relative == undefined || relative == true)
			return this.x($M16([	1.0,	0.0,	0.0, 	0.0,
									0.0,	1.0,	0.0,	0.0,
									0.0,	0.0,	scale,	0.0,
									0.0, 	0.0, 	0.0,	1.0])); 
		else
			return $M16([	1.0,	0.0,	0.0, 	0.0,
							0.0,	1.0,	0.0,	0.0,
							0.0,	0.0,	scale,	0.0,
							0.0, 	0.0, 	0.0, 	1.0]); 
	}
};
/**
* Set scale x
* @returns {StormM16}
* @param {Float} scale Scale
* @param {String} [relative=true] false for absolute scale
*/
StormM16.prototype.setScaleX = function(scale, relative) { 
	return this.setScale(scale, relative, $V3([1.0,0.0,0.0]));
};
/**
* Set scale y
* @returns {StormM16}
* @param {Float} scale Scale
* @param {String} [relative=true] false for absolute scale
*/
StormM16.prototype.setScaleY = function(scale, relative) {
	return this.setScale(scale, relative, $V3([0.0,1.0,0.0]));
};
/**
* Set scale z
* @returns {StormM16}
* @param {Float} scale Scale
* @param {String}[relative=true] false for absolute scale
*/
StormM16.prototype.setScaleZ = function(scale, relative) {
	return this.setScale(scale, relative, $V3([0.0,0.0,1.0]));
};
/**
* Get the position vector
* @returns {StormV3}
*/
StormM16.prototype.getPosition = function() {// return V3
	return $V3([this.e[3],this.e[7],this.e[11]]);  
};
/**
* Set the position vector
* @returns {StormM16}
* @param {StormV3} vector Position vector
*/
StormM16.prototype.setPosition = function(vec) {// return M16
	this.e[3] = vec.e[0];
	this.e[7] = vec.e[1];
	this.e[11] = vec.e[2];
	return this;  
};
/**
* Look at
* @returns {StormM16}
* @param {Float} ex Eye x
* @param {Float} ey Eye y
* @param {Float} ez Eye z
* @param {Float} cx Center x
* @param {Float} cy Center y
* @param {Float} cz Center z
* @param {Float} ux Up axis x
* @param {Float} uy Up axis y
* @param {Float} uz Up axis z
*/
StormM16.prototype.makeLookAt = function(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
	var eye = $V3([ex, ey, ez]);
	var center = $V3([cx, cy, cz]);
	var up = $V3([ux, uy, uz]);

	var mag;

	var z = eye.subtract(center).normalize();
	var x = up.cross(z).normalize();
	var y = z.cross(x).normalize();

	var m = $M16([x.e[0], x.e[1], x.e[2], 0,
	              y.e[0], y.e[1], y.e[2], 0,
	              z.e[0], z.e[1], z.e[2], 0,
	              0, 0, 0, 1]);

	var t = $M16([1, 0, 0, -ex,
	              0, 1, 0, -ey,
	              0, 0, 1, -ez,
	              0, 0, 0, 1]);
	return m.x(t);
};
/**
 * @private 
 */
StormM16.prototype.setPerspectiveProjection = function(fovy, aspect, znear, zfar) { 
	var top = Math.tan(fovy * Math.PI / 360) * znear;
    var bottom = -top;
    var left = aspect * bottom;
    var right = aspect * top;
	
	var X = 2*znear/(right-left);
	var Y = 2*znear/(top-bottom);
	var A = (right+left)/(right-left);
	var B = (top+bottom)/(top-bottom);
	var C = -(zfar+znear)/(zfar-znear);
	var D = -2*zfar*znear/(zfar-znear);

	return $M16([
	                 X, 0, A, 0,
	                 0, Y, B, 0,
	                 0, 0, C, D,
	                 0, 0, -1, 0
	                 ]);
};
/**
 * @private 
 */
StormM16.prototype.setOrthographicProjection = function(left, right, bottom, top, znear, zfar) {
	var tx = - (right + left) / (right - left);
	var ty = - (top + bottom) / (top - bottom);
	var tz = - (zfar + znear) / (zfar - znear);

	return $M16([
	                      2 / (right - left), 0, 0, tx,
		                 0, 2 / (top - bottom), 0, ty,
		                 0, 0, -2 / (zfar - znear), tz,
		                 0, 0, 0, 1
	                 ]); 
};
/**
* @returns {StormM16}
* @param {Array<Float>} e Array with 16 values
*/
$M16 = function(elements) {
	return new StormM16(elements);
};



/**
* @class
* @constructor

* @property {Float32Array} e Array with 3 values
*/
StormV3 = function(elements) {
	this.e = new Float32Array(elements);
};
/**
* Perform a + b and get the vector
* @returns {StormV3}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.add = function(stormV3) {
	var add = function asm(stdlib,f) {
		"use asm";
		return [f[0][0]+f[1][0],f[0][1]+f[1][1],f[0][2]+f[1][2]];
	}(undefined,[this.e, stormV3.e]);
	
    return $V3([ add[0], add[1], add[2] ]); 
};
/**
* Perform a cross b and get the vector
* @returns {StormV3}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.cross = function(stormV3) {
	var cross = function asm(stdlib,f) {
		"use asm";
		return [f[0][1] * f[1][2] - f[0][2] * f[1][1], f[0][2] * f[1][0] - f[0][0] * f[1][2], f[0][0] * f[1][1] - f[0][1] * f[1][0]];
	}(undefined,[this.e, stormV3.e]);
	
    return $V3([ cross[0], cross[1], cross[2] ]); 
};
/**
* Get the distance between a and b
* @returns {Float}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.distance = function(stormV3) {
	var distance = function asm(stdlib,f) {
		"use asm";
		return stdlib( (f[0][0] - f[1][0]) * (f[0][0] - f[1][0]) + (f[0][1] - f[1][1]) * (f[0][1] - f[1][1]) + (f[0][2] - f[1][2]) * (f[0][2] - f[1][2]) );
	}(Math.sqrt,[this.e, stormV3.e]);
	
    return distance;  
};
/**
* Get the dot product between a and b
* @returns {Float}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.dot = function(stormV3) {
	var dot = function asm(stdlib,f) {
		"use asm";
		return (f[0][0]*f[1][0] + f[0][1]*f[1][1] + f[0][2]*f[1][2]);
	}(undefined,[this.e, stormV3.e]);
	
    return dot;
};
/**
* Check if a and b have the same values
* @returns {Bool}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.equal = function(stormV3) {
	return (this.e[0] == stormV3.e[0])&&(this.e[1] == stormV3.e[1])&&(this.e[2] == stormV3.e[2]);
};
/**
* Get the length of the vector
* @returns {Float}
*/
StormV3.prototype.modulus = function() {
	var sq = function asm(stdlib,f) {
		"use asm";
		var c = [f[0][0]*f[0][0], f[0][1]*f[0][1], f[0][2]*f[0][2]];// sqrComponents
		var sc = c[0]+c[1]+c[2];//sumComponentSqrs
		return stdlib(sc);
	}(Math.sqrt,[this.e]);
	
    return sq; 
};
/**
* Perform a * b and get the vector
* @returns {StormV3}
* @param {StormV3|StormM16|Float} value Value b (Vector|Matrix|Float)
*/
StormV3.prototype.x = function(value) {
	var typeVector = value instanceof StormV3;
	var typeMatrix = value instanceof StormM16;
	if(typeVector) {
		return $V3([this.e[0] * value.e[0], this.e[1] * value.e[1], this.e[2] * value.e[2]]);
	} else if(typeMatrix) {
		var thisV3 = $M16([	1.0,0.0,0.0,this.e[0],
							0.0,1.0,0.0,this.e[1],
							0.0,0.0,1.0,this.e[2],
							0.0,0.0,0.0,1.0]);
		return $M16([
					  (thisV3.e[0]) + (0.0) + (0.0) + (0.0),
					  (0.0) + (thisV3.e[1]) + (0.0) + (0.0),
					  (0.0) + (0.0) + (thisV3.e[2]) + (0.0),
					  (thisV3.e[0]*value.e[0]) + (thisV3.e[1]*value.e[1]) + (thisV3.e[2]*value.e[2]) + (thisV3.e[3]),

					  (thisV3.e[4]) + (0.0) + (0.0) + (0.0),
					  (0.0) + (thisV3.e[5]) + (0.0) + (0.0),
					  (0.0) + (0.0) + (thisV3.e[6]) + (0.0),
					  (thisV3.e[4]*value.e[0]) + (thisV3.e[5]*value.e[1]) + (thisV3.e[6]*value.e[2]) + (thisV3.e[7]),

					  (thisV3.e[8]) + (0.0) + (0.0) + (0.0),
					  (0.0) + (thisV3.e[9]) + (0.0) + (0.0),
					  (0.0) + (0.0) + (thisV3.e[10]) + (0.0),
					  (thisV3.e[8]*value.e[0]) + (thisV3.e[9]*value.e[1]) + (thisV3.e[10]*value.e[2]) + (thisV3.e[11]),

					  (thisV3.e[12]) + (0.0) + (0.0) + (0.0),
					  (0.0) + (thisV3.e[13]) + (0.0) + (0.0),
					  (0.0) + (0.0) + (thisV3.e[14]) + (0.0),
					  (thisV3.e[12]*value.e[0]) + (thisV3.e[13]*value.e[1]) + (thisV3.e[14]*value.e[2]) + (thisV3.e[15]*value.e[15])
					 ]);
	} else {
		return $V3([this.e[0] * value, this.e[1] * value, this.e[2] * value]);
	}
};
/**
* Get the reflected vector with b
* @returns {StormV3}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.reflect = function(stormV3) {
	var I = $V3([this.e[0], this.e[1], this.e[2]]);
	var N = $V3([stormV3.e[0], stormV3.e[1], stormV3.e[2]]);
	
	var vec = N.x(this.dot(N, I));
	vec = vec.x(2.0);
	vec = I.subtract(vec);
	

	return vec;
};
/**
* Perform a - b and get the vector
* @returns {StormV3}
* @param {StormV3} vector Vector b
*/
StormV3.prototype.subtract = function(stormV3) {
	var sub = function asm(stdlib,f) {
		"use asm";
		return [f[0][0]-f[1][0],f[0][1]-f[1][1],f[0][2]-f[1][2]];
	}(undefined,[this.e, stormV3.e]);
	
    return $V3([ sub[0], sub[1], sub[2] ]); 
};
/**
* Get the vector normalized
* @returns {StormV3}
*/
StormV3.prototype.normalize = function() {
	var inverse = 1.0 / this.modulus();
	
	return $V3([this.e[0] * inverse, this.e[1] * inverse, this.e[2] * inverse]);
};
/**
* @returns {StormV3}
* @param {Array<Float>} e Array with 3 values
*/
$V3 = function(elements) {
	return new StormV3(elements);
};






