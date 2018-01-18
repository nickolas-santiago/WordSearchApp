"use strict";
var app = app||{};

app.Game_Screens = {
    renderTitleScreen: function()
    {
        var self = this;
        var game_title_image = new Image();
        game_title_image.src = "images/game_logo.png";
        var game_title_image_width = 520;
        var game_title_image_height = 127;
        var button_font_size = (canvas.height/25);
        var button_height = button_font_size + 0;
        var y_offset = 100;
        app.Game_Object.current_game_state =  app.Game_Object.game_states.TITLE_SCREEN;
        
        $(".title_screen_button").toggle();
        $("#game_timer_flip_card").flip({trigger: "manual", axis: "x", speed: 300});
        $("#game_timer_flip_card").height($("#game_timer_flip_card").css('fontSize'));
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(game_title_image, ((canvas.width/2) - (game_title_image_width/2)), y_offset, game_title_image_width, game_title_image_height);
        y_offset += ((game_title_image_height * 1.5) + (canvas.height * 0.037));

        $(".title_screen_button").height(button_height);
        $(".title_screen_button").css({fontSize: button_font_size + "px"});
        $(".title_screen_button").each(function()
        {
            var button_width = $(this).width();
            $(this).css({top: y_offset, left: (canvas.width/2) - ((button_width)/2)});
            y_offset += button_height + (canvas.height * 0.037);
        });
        
        document.querySelector("#playbutton").onclick = function()
        {
            $(".title_screen_button").toggle();
            app.Game_Object.current_game_time = 60;
            $("#game_clock").html(app.Game_Object.current_game_time);
            $("#game_timer_flip_card").flip('toggle');
            $("#words_container_header_flip_card").flip('toggle');
            app.Game_Object.init();
            self.renderTransitionScreen_Ready();
        }
        document.querySelector("#directionsbutton").onclick = function()
        {
            $(".title_screen_button").toggle();
            self.renderDirections();
        }
    },
    
    renderDirections: function()
    {
        var self = this;
        var directions_header_img = new Image();
        directions_header_img.src = document.querySelector("#directions_header_image").src;
        var directions_header_img_width = 266.7925;
        var directions_header_img_height = 35;
        var text_boxes = ["Can you find all 20 of the Creamline words in time?",
                          "Click and drag your mouse across the grid to select a word. But act fast - the word might not be there long."];
        var font_size = (canvas.height/28);
        var line_height = 20;
        var max_text_box_width = (canvas.width * 0.8);
        var button_font_size = (canvas.height/25);
        var button_height = button_font_size + 20;
        var y_offset = 45;
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(directions_header_img, ((canvas.width/2) - (directions_header_img_width/2)), y_offset, directions_header_img_width, directions_header_img_height);
        y_offset += directions_header_img_height + (canvas.height * 0.074);
        
        canvas_context.fillStyle = "black";
        canvas_context.font = "bold " + font_size + "px Montserrat";
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
            y_offset += line_height + (canvas.height * 0.0556);
        }
        
        $("#backbutton").toggle();
        $("#backbutton").height(button_height);
        $("#backbutton").css({fontSize: button_font_size + "px"});
        $("#backbutton").each(function()
        {
            var button_width = $(this).width();
            $(this).css({top: y_offset, left: (canvas.width/2) - ((button_width)/2)});
        });
        
        document.querySelector("#backbutton").onclick = function()
        {
            $("#backbutton").toggle();
            self.renderTitleScreen();
        }
    },
    
    renderTransitionScreen_Ready: function()
    {
        var self = this;
        var ready_screen_image = new Image();
        ready_screen_image.src = document.querySelector("#ready_screen_image").src;
        var ready_screen_image_width = 257;
        var ready_screen_image_height = 47;
        var font_size = (canvas.height/17);
        var button_font_size = (canvas.height/25);
        var button_height = button_font_size + 0;
        var button_width = $("#playbutton").width();
        var y_offset = (canvas.height * 0.213);
        app.Game_Object.current_game_state =  app.Game_Object.game_states.TRANSITION_SCREEN;
        $("#words").html = app.Game_Object.levels[app.Game_Object.current_level];
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(ready_screen_image, ((canvas.width/2) - (ready_screen_image_width/2)), y_offset, ready_screen_image_width, ready_screen_image_height);
        y_offset += (ready_screen_image_height + (canvas.height * 0.0741));
        
        canvas_context.fillStyle = "black";
        canvas_context.font = "bold " + font_size + "px Montserrat";
        canvas_context.textAlign = "center"; 
        canvas_context.textBaseline = "middle"; 
        canvas_context.fillText(("ROUND " + (app.Game_Object.current_level + 1)), (canvas.width/2), y_offset);
        y_offset += (canvas.height * 0.0741);
        canvas_context.fillText((app.Game_Object.levels[app.Game_Object.current_level].num_of_words + " WORDS"), (canvas.width/2), y_offset);
        y_offset += (canvas.height * 0.1481);
        
        $("#playbutton").toggle();
        $("#playbutton").height(button_height);
        $("#playbutton").css({fontSize: button_font_size + "px", top: y_offset, left: (canvas.width/2) - ((button_width)/2)});
        
        document.querySelector("#playbutton").onclick = function()
        {
            $("#playbutton").toggle();
            app.Game_Object.renderLevelWords();
        }
    },
    
    renderTransitionScreen_Go: function()
    {
        var self = this;
        var go_screen_image = new Image();
        go_screen_image.src = document.querySelector("#go_screen_image").src;
        var go_screen_image_width = 115;
        var go_screen_image_height = 47;
            
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(go_screen_image, ((canvas.width/2) - (go_screen_image_width/2)), ((canvas.height/2) - (go_screen_image_height/2)), go_screen_image_width, go_screen_image_height);
    
        setTimeout(function()
        {
            app.Game_Object.loadLevel(app.Game_Object.current_level);
        }, 1000);
    },
    
    renderLoseScreen: function()
    {
        var self = this;
        var lose_screen_image = new Image();
        lose_screen_image.src = document.querySelector("#game_lost_image").src;
        var lose_screen_image_width = 165;
        var lose_screen_image_height = 102;
        var button_font_size = (canvas.height/25);
        var button_height = button_font_size + 0;
        var y_offset = 0;
        app.Game_Object.current_game_state =  app.Game_Object.game_states.END;
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(lose_screen_image, ((canvas.width/2) - (lose_screen_image_width/2)), ((canvas.height * (1/4)) - (lose_screen_image_height/2)), lose_screen_image_width, lose_screen_image_height);
        y_offset += ((canvas.height * (1/4)) + (lose_screen_image_height/2) + (canvas.height * 0.0926));
        
        canvas_context.fillStyle = "black";
        canvas_context.font = "bold " + button_font_size + "px Montserrat";
        canvas_context.textAlign = "center"; 
        canvas_context.textBaseline = "middle";
        canvas_context.fillText("Sorry, you could not find all the words in time.", (canvas.width/2), y_offset);
        y_offset += button_font_size;
        canvas_context.fillText("Why don't you try again?", (canvas.width/2), y_offset);
        y_offset += button_font_size + (canvas.height * 0.0926);
        
        $("#main_menu_button").toggle();
        $("#main_menu_button").height(button_height);
        $("#main_menu_button").css({fontSize: button_font_size + "px", top: y_offset, left: ((canvas.width/2) - ($("#main_menu_button").width()/2))});
        
        document.querySelector("#main_menu_button").onclick = function()
        {
            $("#main_menu_button").toggle();
            $("#game_timer_flip_card").flip('toggle');
            $("#words_container_header_flip_card").flip('toggle');
            self.renderTitleScreen();
        }
    },
    
    renderWinScreen: function()
    {
        var self = this;
        var win_screen_image = new Image();
        win_screen_image.src = document.querySelector("#game_won_image").src;
        var win_screen_image_width = 299;
        var win_screen_image_height = 47;
        var text_boxes = ["Congratulations - you have found all 20 words! Did you enjoy the experience? Shoot me an email and let's make some more!"];
        var font_size = (canvas.height/28);
        var line_height = 20;
        var max_text_box_width = (canvas.width * 0.8);
        var button_font_size = (canvas.height/25);
        var button_height = button_font_size + 0;
        var y_offset = 0;
        app.Game_Object.current_game_state =  app.Game_Object.game_states.END;
        
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        canvas_context.drawImage(win_screen_image, ((canvas.width/2) - (win_screen_image_width/2)), ((canvas.height * (1/4)) - (win_screen_image_height/2)), win_screen_image_width, win_screen_image_height);
        y_offset += ((canvas.height * (1/4)) + (win_screen_image_height/2) + 50);
        
        canvas_context.fillStyle = "black";
        canvas_context.font = "bold " + font_size + "px Montserrat";
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
        
        $("#main_menu_button").toggle();
        $("#main_menu_button").height(button_height);
        $("#main_menu_button").css({fontSize: button_font_size + "px", top: y_offset, left: ((canvas.width/2) - ($("#main_menu_button").width()/2))});
        
        document.querySelector("#main_menu_button").onclick = function()
        {
            $("#main_menu_button").toggle();
            $("#game_timer_flip_card").flip('toggle');
            $("#words_container_header_flip_card").flip('toggle');
            self.renderTitleScreen();
        }
    }
};