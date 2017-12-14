"use strict";
var app = app||{};

app.Game_Object = {
    //---PROPERTIES---//
    word_bank: ["DAIRY", "COW", "MEAT", "CHICKEN", "MILK", "SHAKE", "BURGER", "CREAMLINE", "LOCAL", "NEWYORK",
                   "CHELSEA", "MARKET", "BEEF", "EGGNOG", "STRAWBERRY", "VANILLA", "FUDGE", "SOUP", "RAW", "GRILL"],
    num_of_levels: 3,
    levels: [],
    current_level: undefined,
    
    init: function()
    {
        this.initLevels();
        this.current_level = 0;
        this.loadLevel(this.current_level);
    },
    
    initLevels: function()
    {
        var temp_word_bank = [];
        var equal_parts = 0;
        var remainder = 0;
        for(var w = 0; w < this.word_bank.length; w++)
        {
            temp_word_bank.push(this.word_bank[w]);
        }
        for(var e = 0; e < this.num_of_levels; e++)
        {
            equal_parts += (e + 1);
        }
        remainder = this.word_bank.length % this.num_of_levels;
        
        for(var level = 0; level < this.num_of_levels; level++)
        {
            var a_level = {};
            a_level.level_word_bank = [];
            a_level.num_of_words = (Math.floor(this.word_bank.length/equal_parts) * (level + 1));
            if((this.num_of_levels - level) <= remainder)
            {
                a_level.num_of_words += 1;
            }
            
            for(var n = 0; n < a_level.num_of_words; n++)
            {
                var rand_word = Math.floor(Math.random() * temp_word_bank.length);
                a_level.level_word_bank.push(temp_word_bank[rand_word]);
                temp_word_bank.splice(rand_word, 1);
            }
            
            if(level == 0)
            {
                a_level.num_of_segments_sqrd = 10;
            }
            else
            {
                a_level.num_of_segments_sqrd = this.levels[level - 1].num_of_segments_sqrd + Math.ceil(Math.random() * 5);
            }
            this.levels.push(a_level);
        }
    },
    
    getRandomWordCount: function(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    loadLevel: function(current_level)
    {
        app.Game_Grid_Object.init(canvas_context, this.levels[current_level].num_of_segments_sqrd, this.levels[current_level].level_word_bank);
    }
};