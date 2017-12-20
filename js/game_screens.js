"use strict";
var app = app||{};

app.Game_Screens = {
    renderTitleScreen: function()
    {
        var self = this;
        var game_title_image = new Image();
        game_title_image.src = document.querySelector("#title_image").src;
        var game_title_image_width = 100;
        var game_title_image_height = 100;
        var button_font_size = (canvas.height/45);
        var button_height = button_font_size + 20;
        var y_offset = 100;
        
        $("#backbutton").toggle();
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(game_title_image, ((canvas.width/2) - (game_title_image_width/2)), (y_offset - (game_title_image_height/2)), game_title_image_width, game_title_image_height);
        y_offset += game_title_image_height + 50;
       
        $(".title_screen_button").height(button_height);
        $(".title_screen_button").css({fontSize: button_font_size + "px"});
        $(".title_screen_button").each(function()
        {
            var button_width = $(this).width();
            $(this).css({top: y_offset, left: (canvas.width/2) - ((button_width-12)/2)});
            y_offset += button_height + 20;
        });
        /*canvas_context.fillStyle = "black";
        canvas_context.beginPath();
        canvas_context.moveTo(canvas.width/2,0);
        canvas_context.lineTo(canvas.width/2,canvas.height);
        canvas_context.stroke();*/
        
        
        
        document.querySelector("#playbutton").onclick = function()
        {
            $(".title_screen_button").toggle();
            app.Game_Grid_Object.initEventListeners();
            app.Game_Object.init();
            app.Game_Object.current_game_time = 10;
        }
        document.querySelector("#directionsbutton").onclick = function()
        {
            $(".title_screen_button").toggle();
            $("#backbutton").toggle();
            self.renderDirections();
        }
    },
    
    renderDirections: function()
    {
        var self = this;
        var directions_header_img = new Image();
        directions_header_img.src = document.querySelector("#title_image").src;
        var directions_header_img_width = 400;
        var directions_header_img_height = 40;
        var text_boxes = ["Can you find all 20 of the Creamline words in time?",
                          "Click and drag your mouse across the grid to select a word. But act fast - the word might not be there long."];
        var font_size = (canvas.height/28);
        var line_height = 20;
        var max_text_box_width = (canvas.width * 0.8);
        var button_font_size = (canvas.height/45);
        var button_height = button_font_size + 20;
        var y_offset = 45;
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(directions_header_img, ((canvas.width/2) - (directions_header_img_width/2)), y_offset, directions_header_img_width, directions_header_img_height);
        y_offset += directions_header_img_height + 40;
        
        canvas_context.fillStyle = "black";
        canvas_context.font = font_size + "px Georgia bold";
        canvas_context.textAlign = "center"; 
        canvas_context.textBaseline = "middle"; 
        for(var text_box = 0; text_box < text_boxes.length; text_box++)
        {
            var text_box_split = text_boxes[text_box].split(' ');
            var line = '';
            for(var word = 0; word < text_box_split.length; word++)
            {
                var test_line = line + text_box_split[word] + " ";
                var metrics = canvas_context.measureText(test_line);
                var test_width = metrics.width;
                if((test_width > max_text_box_width) && (word > 0))
                {
                    canvas_context.fillText(line, (canvas.width/2), y_offset);
                    line = text_box_split[word] + " ";
                    y_offset += line_height;
                }
                else
                {
                    line = test_line;
                }
            }
            canvas_context.fillText(line, (canvas.width/2), y_offset);
            y_offset += line_height + 30;
        }
        
        $("#backbutton").height(button_height);
        $("#backbutton").css({fontSize: button_font_size + "px"});
        $("#backbutton").each(function()
        {
            var button_width = $(this).width();
            $(this).css({top: y_offset, left: (canvas.width/2) - ((button_width-12)/2)});
            y_offset += button_height + 20;
        });
        
        document.querySelector("#backbutton").onclick = function()
        {
            self.renderTitleScreen();
            $(".title_screen_button").toggle();
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