"use strict";
var app = app||{};

app.Title_Screen = {
    renderTitleScreen: function()
    {
        canvas_context.fillStyle = "red";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        document.querySelector("#playbutton").style.display = "block";
        document.querySelector("#directionsbutton").style.display = "block";
        document.querySelector("#backbutton").style.display = "none";
        
        var self = this;
        
        document.querySelector("#playbutton").onclick = function()
        {
            document.querySelector("#playbutton").style.display = "none";
            document.querySelector("#directionsbutton").style.display = "none";
            app.Game_Grid_Object.initEventListeners();
            app.Game_Object.init();
            app.Game_Object.current_game_time = 10;
        }
        document.querySelector("#directionsbutton").onclick = function()
        {
            self.renderDirections();
        }
    },
    
    renderDirections: function()
    {
        var self = this;
        canvas_context.fillStyle = "violet";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas_context.fillStyle = "black";
        canvas_context.font="40px Georgia bold";
        canvas_context.fillText("Can you find all 20 Creamlin words in the given time?", canvas.width/2, canvas.height/2);
        
        document.querySelector("#playbutton").style.display = "none";
        document.querySelector("#directionsbutton").style.display = "none";
        document.querySelector("#backbutton").style.display = "block";
        
        document.querySelector("#backbutton").onclick = function()
        {
            self.renderTitleScreen();
        }
    },
    
    renderLevelTransitionScreen: function()
    {
        var self = this;
        canvas_context.fillStyle = "violet";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas_context.fillStyle = "black";
        canvas_context.font="40px Georgia bold";
        canvas_context.fillText("Ready?", canvas.width/2, canvas.height/2);
        
        document.querySelector("#playbutton").style.display = "block";
        document.querySelector("#playbutton").onclick = function()
        {
            document.querySelector("#playbutton").style.display = "none";
            app.Game_Object.current_level += 1;
            app.Game_Object.loadLevel(app.Game_Object.current_level);
        }
    },
    
    renderLoseScreen: function()
    {
       canvas_context.fillStyle = "green";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas_context.fillStyle = "black";
        canvas_context.font="40px Georgia bold";
        canvas_context.fillText("Ready?", canvas.width/2, canvas.height/2);
         
         console.log("you looosse");
    }
};