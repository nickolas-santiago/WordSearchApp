"use strict";
var app = app||{};
var canvas;
var canvas_context;

window.onload = function()
{
    canvas = document.querySelector('#canvas');
    canvas_context = canvas.getContext('2d');
    
    app.Game_Grid_Object.init(canvas_context);
}