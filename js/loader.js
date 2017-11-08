"use strict";
var app = app||{};
var canvas;
var canvas_context;
// returns mouse position in local coordinate system of element
function getMouse(canvas, evt)
{
	var canvas_bounding_box = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - canvas_bounding_box.left,
        y: evt.clientY - canvas_bounding_box.top
    };
}

window.onload = function()
{
    canvas = document.querySelector('#canvas');
    canvas_context = canvas.getContext('2d');
    
    app.Game_Grid_Object.init(canvas_context);
}