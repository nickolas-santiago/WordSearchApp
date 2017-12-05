"use strict";
var app = app||{};

app.Game_Grid_Object = {
    //---PROPERTIES---//
    total_number_of_segments: undefined,
    segment_array: [],
    lines_array: [],
    word_bank: ["DAIRY", "MEAT", "COW"],
    word_locations: [],
    
    //---METHODS---//
    init: function(canvas_context)
    {
        var mouse_pos;
        this.total_number_of_segments = 49;
        this.initSegments();
        var all_word_location_possibilities = [];
        var is_mousedown_true = false;
        var is_hovering = false;
        var hover_segment;
        
        //---references for event listeners
        var grid_segment_array = this.segment_array;
        var grid_lines_array = this.lines_array;
        var lastanchor = "";
        var locc = this.word_locations;
        
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
        
        //---event listeners
        canvas.addEventListener('mousemove', function(evt)
        {
            mouse_pos = getMouse(canvas, evt);
            for(var segment = 0; segment < grid_segment_array.length; segment++)
            {
                if((mouse_pos.x > (grid_segment_array[segment].xpos + ((grid_segment_array[segment].width/2) - ((canvas_context.measureText(grid_segment_array[segment].letter).width)/2)))) &&
                (mouse_pos.y > (grid_segment_array[segment].ypos + ((grid_segment_array[segment].height/2) - (20/2)))) &&
                (mouse_pos.x < ((grid_segment_array[segment].xpos + (grid_segment_array[segment].width/2) + ((canvas_context.measureText(grid_segment_array[segment].letter).width)/2)))) &&
                (mouse_pos.y < ((grid_segment_array[segment].ypos + (grid_segment_array[segment].height/2) + 10))))
                {
                    grid_segment_array[segment].is_hovered = true;
                    hover_segment = grid_segment_array[segment];
                    if(is_mousedown_true == true && grid_segment_array[segment] != lastanchor)
                    {
                        var a_point = {};
                        var current_line = (grid_lines_array.length - 1);
                        var current_line_last_point = (grid_lines_array[current_line].line_points.length - 1);
                        a_point.x = (grid_segment_array[segment].xpos + (grid_segment_array[segment].width/2));
                        a_point.y = (grid_segment_array[segment].ypos + (grid_segment_array[segment].height/2));
                        a_point.index = grid_segment_array[segment].index;
                        grid_lines_array[current_line].line_points.splice(current_line_last_point, 0, a_point);
                        lastanchor = grid_segment_array[segment];
                    }
                    return;
                }
                else
                {
                    grid_segment_array[segment].is_hovered = false;
                }
            }
            if(is_mousedown_true == true)
            {
                var current_line = (grid_lines_array.length - 1);
                var current_line_last_point = (grid_lines_array[current_line].line_points.length - 1);
                var mouse = {};
                mouse.x = mouse_pos.x;
                mouse.y = mouse_pos.y;
                grid_lines_array[current_line].line_points.splice(current_line_last_point, 1, mouse);
                
            }
        },false);
        canvas.addEventListener('mousedown', function(evt)
        {
            is_mousedown_true = true;
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
            grid_lines_array.push(line);
        },false);
        canvas.addEventListener('mouseup', function(evt)
        {
            is_mousedown_true = false;
            lastanchor = "";
            
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
                    console.log(locc[current_word]);
                    var current_word_last_letter = locc[current_word].length - 1;
                    if(((grid_lines_array[current_line].line_points[0].index == locc[current_word][0]) && (grid_lines_array[current_line].line_points[current_line_last_anchor_point].index == locc[current_word][current_word_last_letter])) || ((grid_lines_array[current_line].line_points[0].index == locc[current_word][current_word_last_letter]) && (grid_lines_array[current_line].line_points[current_line_last_anchor_point].index == locc[current_word][0])))
                    {
                        keep_line = true;
                        for(var i = 0; i < grid_lines_array[current_line].line_points.length; i++)
                        {
                            keep_line = locc[current_word].some(function(age)
                            {
                                return age == grid_lines_array[current_line].line_points[i].index;
                            });
                            if(keep_line == true)
                            {
                                continue;
                            }
                            else
                            {
                                grid_lines_array.splice(current_line, 1);
                                return;
                            }
                            
                        }
                    }
                }
                if(keep_line == false)
                {
                    grid_lines_array.splice(current_line, 1);
                }
            }
        },false);
        
        //---render everything
        this.update();
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
    
    renderGrid: function()
    {
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        
        canvas_context.fillStyle = "black";
        canvas_context.textAlign = "center"; 
        canvas_context.textBaseline = "middle"; 
        for(var segment = 0; segment < this.segment_array.length; segment++)
        {
            //...render all the letters
            if(this.segment_array[segment].letter == "")
            {
                this.segment_array[segment].letter = this.generateRandomLetter();
            }            
            if(this.segment_array[segment].is_hovered == true)
            {
                canvas_context.font="40px Georgia";
                canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2)));
            }
            else if(this.segment_array[segment].is_hovered == false)
            {
                canvas_context.font="20px Georgia";
                canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2)));
            }
            canvas_context.strokeStyle = "black";
            canvas_context.strokeRect(this.segment_array[segment].xpos, this.segment_array[segment].ypos, this.segment_array[segment].width, this.segment_array[segment].height);
        }
    },
    
    renderLines: function()
    {
        for(var line = 0; line < this.lines_array.length; line++)
        {
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
        }
    },
    
    update: function()
    {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.renderGrid();
        this.renderLines();
    }
};