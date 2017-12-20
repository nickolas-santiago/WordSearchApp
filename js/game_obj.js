"use strict";
var app = app||{};

app.Game_Object = {
    //---PROPERTIES---//
    game_states: {
        TITLE_SCREEN: 0,
        PLAYING: 1,
        TRANSITION_SCREEN: 2,
        END: 3
    },
    current_game_state: undefined,
    word_bank: ["DAIRY", "COW", "MEAT", "CHICKEN", "MILK", "SHAKE", "BURGER", "CREAMLINE", "LOCAL", "NEWYORK",
                   "CHELSEA", "MARKET", "BEEF", "EGGNOG", "STRAWBERRY", "VANILLA", "FUDGE", "SOUP", "RAW", "GRILL"],
    num_of_levels: 3,
    levels: [],
    current_level: undefined,
    current_game_time: undefined,
    game_timer: undefined,
    
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
        var self = this;
        app.Game_Grid_Object.init(canvas_context, this.levels[current_level].num_of_segments_sqrd, this.levels[current_level].level_word_bank);
        this.current_game_state = this.game_states.PLAYING;
        this.game_timer = setInterval(function()
        {
            self.current_game_time -= 1;
            var max_chance_to_change = 0.3;
            var chance_to_change = Math.random();
            if(self.current_level == (self.num_of_levels - 1))
            {
                if(self.current_game_time < 10)
                {
                    chance_to_change += 0.5;
                }
                if(app.Game_Grid_Object.found_words.length > (self.levels[self.current_level].num_of_words * 0.65))
                {
                    chance_to_change += 0.5;
                }
            }
            if(chance_to_change < (max_chance_to_change * ((self.current_level + 1)/self.num_of_levels)))
            {
                app.Game_Grid_Object.createGrid();
            }
            if(self.current_game_time == 0)
            {
                cancelAnimationFrame(app.Game_Grid_Object.animationID);
                self.current_game_state = self.game_states.END;
                app.Game_Screens.renderLoseScreen();
                clearInterval(self.game_timer);
            }
        }, 1000);
        app.Game_Grid_Object.update();
    }
};