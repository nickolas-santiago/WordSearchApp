"use strict";
var app = app||{};

app.Game_Grid_Object = {
    //---PROPERTIES---//
    total_number_of_segments: undefined,
    segment_array: [],
    lines_array: [],
    word_bank: [],
    word_locations: [],
    found_words: [],
    dragging: false,
    
    //---METHODS---//
    init: function(canvas_context, total_number_of_segments, word_bank)
    {
        this.total_number_of_segments = (total_number_of_segments * total_number_of_segments);
        this.word_bank = word_bank;
        this.found_words.splice(0, this.found_words.length);
        this.createGrid();
    },
    
    createGrid: function()
    {
        this.segment_array.splice(0, this.segment_array.length);
        this.word_locations.splice(0, this.word_locations.length);
        this.lines_array.splice(0, this.lines_array.length);
       
        this.initSegments();
        this.initGrid();
        if(this.dragging == true)
        {
            this.dragging = false;
        }
        
        for(var found_word = 0; found_word < this.found_words.length; found_word++)
        {
            var found_word_line = {};
            found_word_line.line_points = [];
            for(var pp = 0; pp < this.word_locations[this.found_words[found_word]].length; pp++)
            {
                var a_point = {};
                a_point.index = this.word_locations[this.found_words[found_word]][pp];
                a_point.x = (this.segment_array[a_point.index].xpos + (this.segment_array[a_point.index].width/2));
                a_point.y = (this.segment_array[a_point.index].ypos + (this.segment_array[a_point.index].height/2));
                found_word_line.line_points.push(a_point);
            }
            found_word_line.opacity = 1;
            this.lines_array.push(found_word_line);
        }
    },
    
    initSegments: function()
    {
        var grid_row = 0;
        var grid_column = 0;
        for(var i = 0; i < this.total_number_of_segments; i++)
        {
            var segment = {};
            segment.width = canvas.width/Math.sqrt(this.total_number_of_segments);
            segment.height = canvas.height/Math.sqrt(this.total_number_of_segments);
            if((i != 0) && (i % Math.sqrt(this.total_number_of_segments) == 0))
            {
                grid_row++;
                grid_column = 0;
            }
            segment.row = grid_row;
            segment.column = grid_column;
            grid_column++;
            segment.xpos = segment.width * segment.column;
            segment.ypos = segment.height * segment.row;
            segment.letter = "";
            segment.is_hovered = false;
            segment.index = i;
            this.segment_array.push(segment);
        }
    },
    
    initGrid: function()
    {
        var all_word_location_possibilities = [];   
        for(var word = 0; word < this.word_bank.length; word++)
        {
            //---for each word in the grid's word bank, find the length
            var length_of_word = this.word_bank[word].length;
            //---for each segment on the grid, see if the word will fit in any of the 8 directions
            var word_location_possibilities = [];
            this.findWordLocationPossibilities(this.segment_array.length, length_of_word, word_location_possibilities);
            //---add all the possibilities into an array
            all_word_location_possibilities.push(word_location_possibilities);
        }
        for(var word = 0; word < this.word_bank.length; word++)
        {
            //---for each word in the grid's word bank, choose a random location selection, assign the word's location
            var split_word = this.word_bank[word].split("");
            var chosen_word_location;
            this.assignWordLocation(all_word_location_possibilities, word, split_word);
        }
        
        for(var segment = 0; segment < this.segment_array.length; segment++)
        {
            //render all the letters
            if(this.segment_array[segment].letter == "")
            {
                this.segment_array[segment].letter = this.generateRandomLetter();
            }
        }
    },
    
    findWordLocationPossibilities: function(segment_array_length, length_of_word, word_location_possibilities)
    {
        for(var segment = 0; segment < segment_array_length; segment++)
        {
            //---check the directions
            // (1) forward
            if((this.segment_array[segment].column + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) -1))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment+w);
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (2) diagaonal-down left-to-right
            if(((this.segment_array[segment].column + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) -1)) && ((this.segment_array[segment].row + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) - 1)))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment + ((Math.sqrt(this.total_number_of_segments) + 1) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (3) down
            if((this.segment_array[segment].row + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) - 1))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment + (Math.sqrt(this.total_number_of_segments) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (4) diagaonal-down right-to-left
            if(((this.segment_array[segment].column - (length_of_word - 1)) >= 0) && ((this.segment_array[segment].row + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) - 1)))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment + ((Math.sqrt(this.total_number_of_segments) -1) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (5) backwards
            if((this.segment_array[segment].column - (length_of_word - 1)) >= 0)
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment - w);
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (6) diagonal-up right-to-left
            if(((this.segment_array[segment].column - (length_of_word - 1)) >= 0) && ((this.segment_array[segment].row - (length_of_word - 1)) >= 0))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment - ((Math.sqrt(this.total_number_of_segments) + 1) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (7) up
            if((this.segment_array[segment].row - (length_of_word - 1)) >= 0)
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment - (Math.sqrt(this.total_number_of_segments) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
            // (8) diagonal-up left-to-right
            if(((this.segment_array[segment].row - (length_of_word - 1)) >= 0) && ((this.segment_array[segment].column + (length_of_word - 1)) <= (Math.sqrt(this.total_number_of_segments) -1)))
            {
                var possible_arrangement = [];
                for(var w = 0; w < length_of_word; w++)
                {
                    possible_arrangement.push(segment - ((Math.sqrt(this.total_number_of_segments) - 1) * w));
                }
                word_location_possibilities.push(possible_arrangement);
            }
        }
    },
    
    assignWordLocation: function(all_word_location_possibilities, current_word, current_word_split)
    {
        var word_loc = Math.floor(Math.random() * (all_word_location_possibilities[current_word].length));
        
        for(var segment = 0; segment < all_word_location_possibilities[current_word][word_loc].length; segment++)
        {
            //---For each segment the current word will use, check if that segment already has a letter. If that letter is equal 
            //   to the one currently being assigned, then just move on. If not, then the function has to be restarted
            var segment_index = all_word_location_possibilities[current_word][word_loc][segment];
            if(this.segment_array[segment_index].letter != "")
            {
                if(this.segment_array[segment_index].letter == current_word_split[segment])
                {
                    continue;
                }
                else
                {
                    this.assignWordLocation(all_word_location_possibilities, current_word, current_word_split);
                    return;
                }
            }
        }
        for(var segment = 0; segment < all_word_location_possibilities[current_word][word_loc].length; segment++)
        {
            var segment_index = all_word_location_possibilities[current_word][word_loc][segment];
            this.segment_array[segment_index].letter = current_word_split[segment];
        }
        this.word_locations.push(all_word_location_possibilities[current_word][word_loc]);
    },
    
    generateRandomLetter: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        text = possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    
    initEventListeners: function()
    {
        var self = this;
        //---references for event listeners
        var mouse_pos;
        var is_hovering = false;
        var hover_segment;
        var lastanchor = "";
        
        //---event listeners
        canvas.addEventListener('mousemove', function(evt)
        {
            if(app.Game_Object.current_game_state == app.Game_Object.game_states.PLAYING)
            {
                mouse_pos = getMouse(canvas, evt);
                for(var segment = 0; segment < self.segment_array.length; segment++)
                {
                    if((mouse_pos.x > (self.segment_array[segment].xpos + ((self.segment_array[segment].width/2) - ((canvas_context.measureText(self.segment_array[segment].letter).width)/2)))) &&
                    (mouse_pos.y > (self.segment_array[segment].ypos + ((self.segment_array[segment].height/2) - (20/2)))) &&
                    (mouse_pos.x < ((self.segment_array[segment].xpos + (self.segment_array[segment].width/2) + ((canvas_context.measureText(self.segment_array[segment].letter).width)/2)))) &&
                    (mouse_pos.y < ((self.segment_array[segment].ypos + (self.segment_array[segment].height/2) + 10))))
                    {
                        self.segment_array[segment].is_hovered = true;
                        hover_segment = self.segment_array[segment];
                        if(self.dragging == true && self.segment_array[segment] != lastanchor)
                        {
                            var a_point = {};
                            var current_line = (self.lines_array.length - 1);
                            var current_line_last_point = (self.lines_array[current_line].line_points.length - 1);
                            a_point.x = (self.segment_array[segment].xpos + (self.segment_array[segment].width/2));
                            a_point.y = (self.segment_array[segment].ypos + (self.segment_array[segment].height/2));
                            a_point.index = self.segment_array[segment].index;
                            self.lines_array[current_line].line_points.splice(current_line_last_point, 0, a_point);
                            lastanchor = self.segment_array[segment];
                        }
                        return;
                    }
                    else
                    {
                        self.segment_array[segment].is_hovered = false;
                    }
                }
                if(self.dragging == true)
                {
                    var current_line = (self.lines_array.length - 1);
                    var current_line_last_point = (self.lines_array[current_line].line_points.length - 1);
                    var mouse = {};
                    mouse.x = mouse_pos.x;
                    mouse.y = mouse_pos.y;
                    self.lines_array[current_line].line_points.splice(current_line_last_point, 1, mouse);
                }
            }
        },false);
        canvas.addEventListener('mousedown', function(evt)
        {
            //---mousedown is the event that starts to create the line.
            if(app.Game_Object.current_game_state == app.Game_Object.game_states.PLAYING)
            {
                self.dragging = true;
                var line = {};
                line.line_points = [];
                var point = mouse_pos;
                if(hover_segment != "")
                {
                    point.x = (hover_segment.xpos + (hover_segment.width/2));
                    point.y = (hover_segment.ypos + (hover_segment.height/2));
                    point.i = hover_segment.index;
                }
                line.line_points.push(point);
                line.opacity = 1;
                self.lines_array.push(line);
            }
        },false);
        canvas.addEventListener('mouseup', function(evt)
        {
            //---mouseup is the event that ends the line, and begins the function that checks if the line stays
            if(app.Game_Object.current_game_state == app.Game_Object.game_states.PLAYING)
            {
                if(self.dragging == true)
                {
                    self.dragging = false;
                    lastanchor = "";
                    self.checkLine(self.lines_array, self.word_locations, self.found_words);
                };
            }
        },false);
        canvas.addEventListener('mouseout', function(evt)
        {
            //---leaving the game grid also ends the line and begins the function that checks if the line stays
            if(app.Game_Object.current_game_state == app.Game_Object.game_states.PLAYING)
            {
                if(self.dragging == true)
                {
                    self.dragging = false;
                    lastanchor = "";
                    self.checkLine(self.lines_array, self.word_locations, self.found_words);
                };
            }
        },false);
    },
    
    checkLine: function(grid_lines_array, locc, found_words)
    {
        var current_line = (grid_lines_array.length - 1);
        var current_line_last_point = (grid_lines_array[current_line].line_points.length - 1);
        var current_line_last_anchor_point = (grid_lines_array[current_line].line_points.length - 2);
        grid_lines_array[current_line].line_points.splice(current_line_last_point, 1);
        
        //---check line
        var keep_line = false;
        if(grid_lines_array[current_line].line_points.length == 0)
        {
            grid_lines_array.splice(current_line, 1);
        }
        else
        {
            for(var current_word = 0; current_word < locc.length; current_word++)
            {
                var current_word_last_letter = locc[current_word].length - 1;
                if(((grid_lines_array[current_line].line_points[0].index == locc[current_word][0]) && (grid_lines_array[current_line].line_points[current_line_last_anchor_point].index == locc[current_word][current_word_last_letter])) || ((grid_lines_array[current_line].line_points[0].index == locc[current_word][current_word_last_letter]) && (grid_lines_array[current_line].line_points[current_line_last_anchor_point].index == locc[current_word][0])))
                {
                    keep_line = true;
                    for(var i = 0; i < grid_lines_array[current_line].line_points.length; i++)
                    {
                        keep_line = locc[current_word].some(function(letter_index)
                        {
                            return letter_index == grid_lines_array[current_line].line_points[i].index;
                        });
                        if(keep_line == true)
                        {
                            continue;
                        }
                        else
                        {
                            this.fadeLines(grid_lines_array, current_line);
                            return;
                        }
                    }
                    var w = found_words.some(function(nnn)
                    {
                        return nnn == current_word;
                    });
                    if(w == true)
                    {
                        this.fadeLines(grid_lines_array, current_line);
                        return;
                    }
                    else
                    {
                        found_words.push(current_word);
                        $("#level_word_flip_card_" + current_word).find(".front").html("<p class='level_word_found'>" + this.word_bank[current_word] + "</p>");
                        $("#level_word_flip_card_" + current_word).height($("#level_word_flip_card_" + current_word).css('fontSize'));
                        $("#level_word_flip_card_" + current_word).flip('toggle');
                    }
                }
            }
            if(keep_line == false)
            {
                this.fadeLines(grid_lines_array, current_line);
                return;
            }
        }
    },
    
    renderGrid: function()
    {
        canvas_context.save();
            canvas_context.fillStyle = "black";
            canvas_context.textAlign = "center"; 
            canvas_context.textBaseline = "middle"; 
            for(var segment = 0; segment < this.segment_array.length; segment++)
            {
                //render all the letters
                if(this.segment_array[segment].is_hovered == true)
                {
                    var afont = ((canvas.height/Math.sqrt(this.total_number_of_segments)) * 0.55);
                    canvas_context.font = afont + "px Georgia";
                    canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2)));
                }
                else if(this.segment_array[segment].is_hovered == false)
                {
                    var afont = ((canvas.height/Math.sqrt(this.total_number_of_segments)) * 0.3);
                    canvas_context.font = afont + "px Georgia";
                    canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2)));
                }
            }
        canvas_context.restore();
    },
    
    renderLines: function()
    {
        for(var line = 0; line < this.lines_array.length; line++)
        {
            canvas_context.save();
                canvas_context.strokeStyle = "rgba(356,86,84," + this.lines_array[line].opacity + ")";
                canvas_context.lineWidth = 5;
                canvas_context.lineCap = "round";
                
                canvas_context.beginPath();
                canvas_context.moveTo(this.lines_array[line].line_points[0].x, this.lines_array[line].line_points[0].y);
                if(this.lines_array[line].line_points.length > 1)
                {
                    for(var line_point = 1; line_point < this.lines_array[line].line_points.length; line_point++)
                    {
                        canvas_context.lineTo(this.lines_array[line].line_points[line_point].x, this.lines_array[line].line_points[line_point].y);
                    }
                }
                canvas_context.stroke();
            canvas_context.restore();
        }
    },
    
    fadeLines: function(grid_lines_array, current_line)
    {
        var fade_interval = setInterval(function()
        {
            grid_lines_array[current_line].opacity -= 0.05;
            if(grid_lines_array[current_line].opacity <= 0)
            {
                grid_lines_array.splice(current_line, 1);
                clearInterval(fade_interval);
            }
        },27);
    },
    
    checkIfWon: function()
    {
        if(this.found_words.length == this.word_bank.length)
        {
            cancelAnimationFrame(this.animationID);
            clearInterval(app.Game_Object.game_timer);
            $(".level_word_flip_card").each(function()
            {
                if($(this).data("flip-model").isFlipped == true)
                {
                    $(this).find(".front").html("");
                    $(this).flip('toggle');
                }
                else
                {
                    $(this).find(".back").html("");
                    $(this).flip('toggle', function()
                    {
                        $("#words_container").html("");
                    });
                }
            });
            this.segment_array.splice(0, this.segment_array.length);
            this.word_locations.splice(0, this.word_locations.length);
            this.lines_array.splice(0, this.lines_array.length);
            if(app.Game_Object.current_level == (app.Game_Object.num_of_levels - 1))
            {
                app.Game_Screens.renderWinScreen();
            }
            else
            {
                app.Game_Object.current_level += 1;
                app.Game_Screens.renderTransitionScreen_Ready();
            }
        }
    },
    
    update: function()
    {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        this.renderLines();
        this.renderGrid();
        this.checkIfWon();
    }
};