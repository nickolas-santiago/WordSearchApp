"use strict";
var app = app||{};

app.Game_Grid_Object = {
    //---PROPERTIES---//
    total_number_of_segments: undefined,
    segment_array: [],
    
    //---METHODS---//
    init: function(canvas_context)
    {
        this.total_number_of_segments = 49;
        this.init_segments();
        for(var i = 0; i < this.segment_array.length; i++)
        {
            this.segment_array[i].letter = this.generate_random_letter();
            canvas_context.font="20px Georgia";
            canvas_context.fillText(this.segment_array[i].letter, (this.segment_array[i].xpos + (this.segment_array[i].width/2) - ((canvas_context.measureText(this.segment_array[i].letter).width)/2)), (this.segment_array[i].ypos + (this.segment_array[i].height/2) + 10));
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
            this.segment_array.push(segment);
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