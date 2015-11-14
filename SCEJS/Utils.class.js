// ALIAS
function alias(object, name) {
    var fn = object ? object[name] : null;
    if (typeof fn == 'undefined') return function () {}
    return function () {
        return fn.apply(object, arguments)
    }
}
DGE = alias(document, 'getElementById');
DCE = alias(document, 'createElement'); 
D$ = alias(document, 'querySelector');
D$$ = alias(document, 'querySelectorAll');


window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(callback){
				window.setTimeout(callback, 1000 / 60);
			};
})();

/**
* @class
* @constructor
*/
Utils = function() {
	
};

/**
* Get HTMLCanvasElement from Uint8Array
* @returns {HTMLCanvasElement}
* @param {Uint8Array} array
* @param {Int} width
* @param {Int} height
*/
Utils.prototype.getCanvasFromUint8Array = function(uint8arr, width, height) {
	var e = document.createElement('canvas');
	e.width = width;
	e.height = height;
	var ctx2D = e.getContext("2d");		
	var image = ctx2D.createImageData(width,height);
	for(var i=0; i<image.data.length; i++)image.data[i] = uint8arr[i];
	ctx2D.putImageData(image,0,0);

    return e;
};

/**
* Get HTMLImageElement from canvas
* @returns {HTMLImageElement}
* @param {HTMLCanvasElement} canvasElement
*/
Utils.prototype.getImageFromCanvas = function(oldCanvas) {
	var imagen = document.createElement('img');
	imagen.src = oldCanvas.toDataURL();

    return imagen;
};

/**
* Get Uint8Array from HTMLImageElement
* @returns {Uint8Array}
* @param {HTMLImageElement} imageElement
*/
Utils.prototype.getUint8ArrayFromHTMLImageElement = function(imageElement) {
	var e = document.createElement('canvas');
	e.width = imageElement.width;
	e.height = imageElement.height;
	var ctx2D_tex = e.getContext("2d");		
	ctx2D_tex.drawImage(imageElement, 0, 0);
	var arrayTex = ctx2D_tex.getImageData(0, 0, imageElement.width, imageElement.height);

    return arrayTex.data;
};

/**
* Get random vector from vecNormal with deviation in degrees
* @returns {StormV3}
* @param {StormV3} normalVector
* @param {Float} degrees
*/
Utils.prototype.getVector = function(vecNormal, degrees) {
	var ob = this.cartesianToSpherical(vecNormal);
	var angleLat = ob.lat;
	var angleLng = ob.lng;
			
	var desvLat = (Math.random()*180.0)-90.0;
	var desvLng = (Math.random()*360.0)-180.0;
	angleLat += (degrees*desvLat);
	angleLng += (degrees*desvLng);

	return this.sphericalToCartesian(1.0, angleLat, angleLng);
};

/**
 * @param {StormV3} vec
 * @returns {Object}
 * @example
 * $V3([1,0,0])  return {radius: 1, lat: 90, lng: 0}
 * $V3([0,0,1])  return {radius: 1, lat: 90, lng: 90}
 * $V3([-1,0,0]) return {radius: 1, lat: 90, lng: 180}
 * $V3([0,0,-1]) return {radius: 1, lat: 90, lng: -90}
 */
Utils.prototype.cartesianToSpherical = function(vec) {
	var r = Math.sqrt(vec.e[0]*vec.e[0] + vec.e[1]*vec.e[1] + vec.e[2]*vec.e[2]);
	
	var angleLat = this.radToDeg(Math.acos(vec.e[1]/r));
	var angleLng = this.radToDeg(Math.atan2(vec.e[2], vec.e[0]));
	
	return {"radius": r,
			"lat": angleLat,
			"lng": angleLng};
}	

/**
 * @param {Float} radius
 * @param {Float} lat Lat in degrees
 * @param {Float} lng Lng in degrees
 * @returns {StormV3}
 * @example
 * (1.0, 90.0, 0.0).e) return $V3([1,0,0])
 * (1.0, 90.0, 90.0).e) return $V3([0,0,1])
 * (1.0, 90.0, 180.0).e) return $V3([-1,0,0])
 * (1.0, 90.0, -90.0).e) return $V3([0,0,-1])
 **/
Utils.prototype.sphericalToCartesian = function(radius, lat, lng) {	
	var r = radius;
	var angleLat = this.degToRad(lat); 
	var angleLng = this.degToRad(lng);
	
	var x = r*Math.sin(angleLat)*Math.cos(angleLng);
	var z = r*Math.sin(angleLat)*Math.sin(angleLng);
	var y = r*Math.cos(angleLat);
	
	return new $V3([x,y,z]);
}

/**
* Refract
* @returns {StormV3}
* @param {StormV3} V
* @param {StormV3} N
* @param {Float} n1 Refract index way 1
* @param {Float} n2 Refract index way 2
*/
Utils.prototype.refract = function(V, N, n1, n2) {
	var refrIndex = n1/n2;
	var cosI = N.dot(V)*-1.0;
	var cosT2 = 1.0 - refrIndex * refrIndex * (1.0 - cosI * cosI);
	var vv = V.x(refrIndex);
	return  vv.add( N.x(refrIndex * cosI - Math.sqrt(cosT2)) );
};

/**
* Degrees to radians. Full circle = 360 degrees.
* @returns {Float}
* @param {Float} degrees
*/
Utils.prototype.degToRad = function(deg) {
	return (deg*3.14159)/180;
};

/**
* Radians to degrees
* @returns {Float}
* @param {Float} radians
*/
Utils.prototype.radToDeg = function(rad) {
	return rad*(180/3.14159);
};

/**
 * 
 * @param {String} hex
 * @returns  {Array<Float>} rgb values from 0 to 255
 */
Utils.prototype.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
/**
 * @param {Array<Float>} rgb values from 0 to 255
 * @returns {String}
 */
Utils.prototype.rgbToHex = function(rgb) {
    var rgbVal = rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
    return '#' + (0x1000000 + rgbVal).toString(16).slice(1);
}

/**
* Inverse sqrt
* @returns {Float}
* @param {Float} value
*/
Utils.prototype.invsqrt = function(value) {
	return 1.0/value;
};

/**
* Smoothstep
* @returns {Float}
* @param {Float} edge0
* @param {Float} edge1
* @param {Float} current
*/
Utils.prototype.smoothstep = function(edge0, edge1, x) {
    if (x < edge0) return 0;
    if (x >= edge1) return 1;
    if (edge0 == edge1) return -1;
    var p = (x - edge0) / (edge1 - edge0);
	
    return (p * p * (3 - 2 * p));
};

/**
* Dot product vector4float
* @param {Array<Float>} vector Vector a
* @param {Array<Float>} vector Vector b
*/
Utils.prototype.dot4 = function(vector4A,vector4B) {
	return vector4A[0]*vector4B[0] + vector4A[1]*vector4B[1] + vector4A[2]*vector4B[2] + vector4A[3]*vector4B[3];
};

/**
* Compute the fractional part of the argument. Example: fract(pi)=0.14159265...
* @param {Float} value
*/
Utils.prototype.fract = function(number) {
	return number - Math.floor(number);
};

/**
 * Angle between two vectors viewing from top
 * @returns {Float}
 * @param {StormV3} vectorA
 * @param {StormV3} vectorB
 
Utils.prototype.angle = function(vA, vB) {
	var vAA = vA.normalize();
	var vBB = vB.normalize();
	
	var escalarProduct = Math.acos((vAA.e[0]*vBB.e[0])+(vAA.e[1]*vBB.e[1])+(vAA.e[2]*vBB.e[2]));
	
	var vCC = vAA.cross(vBB);
	//console.log(vCC.e[0]+" "+vCC.e[1]+" "+vCC.e[2]);
	
	if(vCC.e[1] == 1) {
		escalarProduct = (Math.PI+escalarProduct);
	}

	return escalarProduct;
};*/

/**
* Pack 1float (0.0-1.0) to 4float rgba (0.0-1.0, 0.0-1.0, 0.0-1.0, 0.0-1.0)
* @returns {Array<Float>}
* @param {Float} value
*/
Utils.prototype.pack = function(v) {
	var bias = [1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0];

	var r = v;
	var g = this.fract(r * 255.0);
	var b = this.fract(g * 255.0);
	var a = this.fract(b * 255.0);
	var colour = [r, g, b, a];
	
	var dd = [colour[1]*bias[0],colour[2]*bias[1],colour[3]*bias[2],colour[3]*bias[3]];
	
	return [colour[0]-dd[0],colour[1]-dd[1],colour[2]-dd[2],colour[3]-dd[3] ];
};
/**
* Unpack 4float rgba (0.0-1.0, 0.0-1.0, 0.0-1.0, 0.0-1.0) to 1float (0.0-1.0)
* @returns {Float}
* @param {Array<Float>} value
*/
Utils.prototype.unpack = function(colour) {
	var bitShifts = [1.0, 1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0)];
	return this.dot4(colour, bitShifts);
};
/**
* Get pack GLSL function string
* @returns {String}
*/
Utils.prototype.packGLSLFunctionString = function() {
	return 'vec4 pack (float depth) {'+
				'const vec4 bias = vec4( 1.0 / 255.0,'+
										'1.0 / 255.0,'+
										'1.0 / 255.0,'+
										'0.0);'+

				'float r = depth;'+
				'float g = fract(r * 255.0);'+
				'float b = fract(g * 255.0);'+
				'float a = fract(b * 255.0);'+
				'vec4 colour = vec4(r, g, b, a);'+
				
				'return colour - (colour.yzww * bias);'+
			'}';
};
/**
* Get unpack GLSL function string
* @returns {String}
*/
Utils.prototype.unpackGLSLFunctionString = function() {
	return 'float unpack (vec4 colour) {'+
				'const vec4 bitShifts = vec4(1.0,'+
											'1.0 / 255.0,'+
											'1.0 / (255.0 * 255.0),'+
											'1.0 / (255.0 * 255.0 * 255.0));'+
				'return dot(colour, bitShifts);'+
			'}';
};
/** @private  */
Utils.prototype.isPowerOfTwo = function(x) {
    return (x & (x - 1)) == 0;
};
/** @private  */
Utils.prototype.nextHighestPowerOfTwo = function(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }
    return x + 1;
};
/** @private */
Utils.prototype.getElementPosition = function(element) {
	var elem=element, tagname="", x=0, y=0;
   
	while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
	   y += elem.offsetTop;
	   x += elem.offsetLeft;
	   tagname = elem.tagName.toUpperCase();

	   if(tagname == "BODY")
		  elem=0;

	   if(typeof(elem) == "object") {
		  if(typeof(elem.offsetParent) == "object")
			 elem = elem.offsetParent;
	   }
	}

	return {x: x, y: y};
};
/** @private */
Utils.prototype.getWebGLContextFromCanvas = function(canvas, ctxOpt) {
	var gl;
	try {
		if(ctxOpt == undefined) gl = canvas.getContext("webgl");
		else gl = canvas.getContext("webgl", ctxOpt);
	} catch(e) {
		gl = null;
    }
	if(gl == null) {
		try {
			if(ctxOpt == undefined) gl = canvas.getContext("experimental-webgl");
			else gl = canvas.getContext("experimental-webgl", ctxOpt);
		} catch(e) {
			gl = null;
		}
	}
	if(gl == null) gl = false;
	return gl;
};
/** @private */
Utils.prototype.fullScreen = function() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}; 
/*
var arrayPick = new Uint8Array((this.viewportWidth * this.viewportHeight) * 4); 
this.gl.readPixels(0, 0, this.viewportWidth, this.viewportHeight, this.gl.RGBA, this.gl.UNSIGNED_BYTE, arrayPick);

var ctx2DS = document.getElementById('stormCanvasS').getContext("2d");
cd = ctx2DS.getImageData(0, 0, this.viewportWidth, this.viewportHeight);
for (var row = 0; row < this.viewportHeight; row++) {
		for (var col = 0; col < this.viewportWidth; col++) {
			var idx = ((row * this.viewportWidth) + col);
			var idxData = idx*4;
			cd.data[idxData+0] = arrayPick[idxData];
			cd.data[idxData+1] = arrayPick[idxData+1];
			cd.data[idxData+2] = arrayPick[idxData+2];
			cd.data[idxData+3] = 255;
		}
	}
	
ctx2DS.putImageData(cd, 0, 0);
*/
	
/*
var img = document.getElementById('stormCanvas').toDataURL("image/jpeg");
$('#gg').html("<img src=\"" + img + "\" width=\"320\" height=\"480\"/>");
*/
