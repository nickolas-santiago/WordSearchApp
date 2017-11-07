"use strict";
var app = app||{};

app.Game_Grid_Object = {
    //---PROPERTIES---//
    total_number_of_segments: undefined,
    segment_array: [],
    word_bank: ["DAIRY", "MEAT", "COW"],
    word_locations: [],
    
    //---METHODS---//
    init: function(canvas_context)
    {
        var mouse_pos;
        this.total_number_of_segments = 49;
        this.init_segments();
        var all_word_location_possibilities = [];
        
        for(var word = 0; word < this.word_bank.length; word++)
        {
            //---for each word in the grid's word bank, find the length
            var length_of_word = this.word_bank[word].length;
            //---for each segment on the grid, see if the word will fit in any of the 8 directions
            var word_location_possibilities = [];
            this.find_word_location_possibilities(this.segment_array.length, length_of_word, word_location_possibilities);
            //---add all the possibilities into an array
            all_word_location_possibilities.push(word_location_possibilities);
        }
        
        for(var word = 0; word < this.word_bank.length; word++)
        {
            //---for each word in the grid's word bank, choose a random location selection, assign the word's location, then...
            var split_word = this.word_bank[word].split("");
            this.assign_word_location(all_word_location_possibilities, word, split_word);
        }
        
        //...render it all.
        var ss = this.segment_array;
        
        canvas.addEventListener('mousemove', function(evt)
        {
            mouse_pos = getMouse(canvas, evt);
            for(var segment = 0; segment < ss.length; segment++)
            {
                if((mouse_pos.x > (ss[segment].xpos + ((ss[segment].width/2) - ((canvas_context.measureText(ss[segment].letter).width)/2)))) &&
                   (mouse_pos.y > (ss[segment].ypos + ((ss[segment].height/2) - (20/2)))) &&
                   (mouse_pos.x < ((ss[segment].xpos + (ss[segment].width/2) + ((canvas_context.measureText(ss[segment].letter).width)/2)))) &&
                   (mouse_pos.y < ((ss[segment].ypos + (ss[segment].height/2) + 10))))
                {
                    console.log(ss[segment]);
                }
            }
            
        });
        
        for(var segment = 0; segment < this.segment_array.length; segment++)
        {
            canvas_context.fillRect((this.segment_array[segment].xpos + ((this.segment_array[segment].width/2) - ((canvas_context.measureText(this.segment_array[segment].letter).width)/2))),
                                    (this.segment_array[segment].ypos + ((this.segment_array[segment].height/2) - (20/2))),
                                    ((this.segment_array[segment].xpos + this.segment_array[segment].width) - ((this.segment_array[segment].width/2) + ((canvas_context.measureText(this.segment_array[segment].letter).width)/2))),
                                    ((this.segment_array[segment].ypos + this.segment_array[segment].height) - ((this.segment_array[segment].height/2) + (20/2))));
        }
        
        this.update(mouse_pos);
    },
    
    init_segments: function()
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
            this.segment_array.push(segment);
        }
    },
    
    find_word_location_possibilities: function(segment_array_length, length_of_word, word_location_possibilities)
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
    
    assign_word_location: function(all_word_location_possibilities, current_word, current_word_split)
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
                    this.assign_word_location(all_word_location_possibilities, current_word, current_word_split);
                    return;
                }
            }
        }
        
        for(var segment = 0; segment < all_word_location_possibilities[current_word][word_loc].length; segment++)
        {
            var segment_index = all_word_location_possibilities[current_word][word_loc][segment];
            this.segment_array[segment_index].letter = current_word_split[segment];
            canvas_context.fillStyle = "#b7f1ff";
            canvas_context.fillRect(this.segment_array[segment_index].xpos, this.segment_array[segment_index].ypos, this.segment_array[segment_index].width, this.segment_array[segment_index].height);
        }
    },
    
    generate_random_letter: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        text = possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    
    render_grid: function()
    {
        canvas_context.fillStyle = "white";
        canvas_context.fillRect(0, 0, canvas.width, canvas.height);
        
        for(var segment = 0; segment < this.segment_array.length; segment++)
        {
            //...render all the letters
            if(this.segment_array[segment].letter == "")
            {
                this.segment_array[segment].letter = this.generate_random_letter();
            }
            canvas_context.font="20px Georgia";
            canvas_context.fillStyle = "black";
            canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2) - ((canvas_context.measureText(this.segment_array[segment].letter).width)/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2) + 10));
            
            canvas_context.strokeRect((this.segment_array[segment].xpos + ((this.segment_array[segment].width/2)) - ((canvas_context.measureText(this.segment_array[segment].letter).width)/2)), 
                                      (this.segment_array[segment].ypos + ((this.segment_array[segment].height/2) - (10/2))), 
                                      ((canvas_context.measureText(this.segment_array[segment].letter).width)), 
                                       20);
        }
    },
    
    update: function(mouse_pos)
    {
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        this.render_grid();
    }
};