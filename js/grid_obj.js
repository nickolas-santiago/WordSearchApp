"use strict";
var app = app||{};

app.Game_Grid_Object = {
    //---PROPERTIES---//
    total_number_of_segments: undefined,
    segment_array: [],
    word_bank: "DAIRY",
    
    //---METHODS---//
    init: function(canvas_context)
    {
        this.total_number_of_segments = 49;
        this.init_segments();
        
        //---for each wprd in the grid's word bank, find the length
        //------right now, just one word
        var length_of_word = this.word_bank.length;
        //---for each segment on the grid, see if the word will fit in any of the 8 directions
        //---add all the possibilities into an array
        //---choose a random selection, render the word, then render all random letters        
        var word_location_possibilities = [];
        this.find_word_location_possibilities(this.segment_array.length, length_of_word, word_location_possibilities);
            
        
        var chosen_selection = Math.floor(Math.random() * (word_location_possibilities.length));
        var word_letters = this.word_bank.split("");
        
        for(var f = 0; f < word_location_possibilities[chosen_selection].length; f++)
        {
            this.segment_array[word_location_possibilities[chosen_selection][f]].letter = word_letters[f];
        }
        
        for(var segment = 0; segment < this.segment_array.length; segment++)
        {
            if(this.segment_array[segment].letter == "")
            {
                this.segment_array[segment].letter = this.generate_random_letter();
            }
            canvas_context.font="20px Georgia";
            canvas_context.fillText(this.segment_array[segment].letter, (this.segment_array[segment].xpos + (this.segment_array[segment].width/2) - ((canvas_context.measureText(this.segment_array[segment].letter).width)/2)), (this.segment_array[segment].ypos + (this.segment_array[segment].height/2) + 10));
        }
        
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
    
    generate_random_letter: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        text = possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
};