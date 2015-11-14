/**
* @class
* @constructor
*/
SystemEvents = function(project, target) {
	"use strict";
	
	var _project = project;
	var _target = target;
	
	/**
	 * initialize
	 */
	this.initialize = function() {
		document.body.addEventListener("keydown", keydownListener);		
		document.body.addEventListener("keyup", keyupListener);		
		_target.addEventListener("mousewheel", mousewheelListener);
		
		document.body.addEventListener("mouseup", mouseupListener, false);
		document.body.addEventListener("touchend", mouseupListener, false);
		_target.addEventListener("mousedown", mousedownListener, false);
		_target.addEventListener("touchstart", mousedownListener, false);
		document.body.addEventListener("mousemove", mousemoveListener, false); 
		document.body.addEventListener("touchmove", mousemoveListener, false); 
	};
	
	/**
	 * @param {Int} COMPONENT_TYPES
	 * @param {Int} EVENT_TYPES
	 * @param {Event} evt
	 * @private
	 */
	var callComponentEvent = (function(componentType, eventType, evt) {
		if(_project != undefined) {
			var stage = _project.getActiveStage();
			for(var n=0, fn = stage.nodes.length; n < fn; n++) {
				for(var key in stage.nodes[n].getComponents()) {
					var component = stage.nodes[n].getComponent(key);
					
					if(component.type == componentType) {
						if(eventType == Constants.EVENT_TYPES.KEY_DOWN && component.onkeydown != undefined)
							component.onkeydown(evt);
						
						if(eventType == Constants.EVENT_TYPES.KEY_UP && component.onkeyup != undefined)
							component.onkeyup(evt);
						
						if(eventType == Constants.EVENT_TYPES.MOUSE_DOWN && component.onmousedown != undefined)
							component.onmousedown(evt);
						
						if(eventType == Constants.EVENT_TYPES.MOUSE_UP && component.onmouseup != undefined)
							component.onmouseup(evt);
						
						if(eventType == Constants.EVENT_TYPES.MOUSE_MOVE && component.onmousemove != undefined)
							component.onmousemove(evt);
						
						if(eventType == Constants.EVENT_TYPES.MOUSE_WHEEL && component.onmousewheel != undefined)
							component.onmousewheel(evt);
					}
				}
			}
		}
	}).bind(this);
	
	var keydownListener = (function(evt) {
		callComponentEvent(Constants.COMPONENT_TYPES.KEYBOARD_EVENTS, Constants.EVENT_TYPES.KEY_DOWN, evt);
	}).bind(this);
	
	var keyupListener = (function(evt) {
		callComponentEvent(Constants.COMPONENT_TYPES.KEYBOARD_EVENTS, Constants.EVENT_TYPES.KEY_UP, evt);
	}).bind(this);
	
	var mousedownListener = (function(evt) {
		callComponentEvent(Constants.COMPONENT_TYPES.MOUSE_EVENTS, Constants.EVENT_TYPES.MOUSE_DOWN, evt);
	}).bind(this);
	
	var mouseupListener = (function(evt) {
		callComponentEvent(Constants.COMPONENT_TYPES.MOUSE_EVENTS, Constants.EVENT_TYPES.MOUSE_UP, evt);
	}).bind(this);
	
	var mousemoveListener = (function(evt) {
		callComponentEvent(Constants.COMPONENT_TYPES.MOUSE_EVENTS, Constants.EVENT_TYPES.MOUSE_MOVE, evt);
	}).bind(this);
	
	var mousewheelListener = (function(evt) {
		evt.preventDefault();
		
		callComponentEvent(Constants.COMPONENT_TYPES.MOUSE_EVENTS, Constants.EVENT_TYPES.MOUSE_WHEEL, evt);
	}).bind(this);
};