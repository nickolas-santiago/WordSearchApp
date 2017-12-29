"use strict";
var app = app||{};

// returns mouse position in local coordinate system of element
function getMouse(canvas, evt)
{
	var canvas_bounding_box = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - canvas_bounding_box.left,
        y: evt.clientY - canvas_bounding_box.top
    };
}