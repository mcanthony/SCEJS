/**
* @class
* @constructor
*/
Component = function() {
	"use strict";
	
	this.type = null;
	this.node = null;
	
	/**
	 * initialize
	 * @param {Node} nod
	 */
	this.initialize = null;
	
	/**
	 * tick
	 * @param {Float} delta
	 */
	this.tick = null;
};