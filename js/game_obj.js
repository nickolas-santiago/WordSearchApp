"use strict";
var app = app||{};

app.Game_Object = {
    //---PROPERTIES---//
    game_states: {
        TITLE_SCREEN: 0,
        PLAYING: 1,
        LETTERS_FADING: 2,
        TRANSITION_SCREEN: 3,
        GAME_LOST: 4,
        GAME_WON: 5
    },
    current_game_state: undefined,
    word_bank: ["NOHO", "SOHO", "ASTORIA", "FLUSHING", "HARLEM", "HIGHBRIDGE", "KINGSBRIDGE", "WOODLAWN", "BAYCHESTER", "GREENPOINT",
                "CHELSEA", "BUSHWICK", "FLATBUSH", "CANARSIE", "ELMHURST", "GLENDALE", "TRIBECA", "NOLITA", "INWOOD", "MELROSE"],
    num_of_levels: 3,
    levels: [],
    current_level: undefined,
    current_game_time: undefined,
    game_timer: undefined,
    
    init: function()
    {
        this.initLevels();
        this.current_level = 0;
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
    
    loadLevel: function(current_level)
    {
        var self = this;
        app.Game_Grid_Object.init(canvas_context, this.levels[current_level].num_of_segments_sqrd, this.levels[current_level].level_word_bank);
        this.current_game_state = this.game_states.PLAYING;
        this.game_timer = setInterval(function()
        {
            self.current_game_time -= 1;
            if($("#game_timer_flip_card").data("flip-model").isFlipped == true)
            {
                $("#game_timer_flip_card").find(".back").html(self.current_game_time);
            }
            else
            {
                $("#game_timer_flip_card").find(".front").html(self.current_game_time);
            }
            
            var max_chance_to_change = 0.05;
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
                var fade_leters_out_interval = setInterval(function()
                {
                    for(var segment = 0; segment < app.Game_Grid_Object.segment_array.length; segment++)
                    {
                        app.Game_Grid_Object.segment_array[segment].opacity -= 0.05;
                        if(app.Game_Grid_Object.segment_array[segment].opacity <= 0)
                        {
                            if(segment == (app.Game_Grid_Object.segment_array.length - 1))
                            {
                                app.Game_Grid_Object.createGrid();
                            }
                            clearInterval(fade_leters_out_interval);
                        }
                    }
                }, 30);
            }
            if(self.current_game_time == 0)
            {
                cancelAnimationFrame(app.Game_Grid_Object.animationID);
                self.current_game_state = self.game_states.GAME_LOST;
                app.Game_Screens.renderLoseScreen();
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
                clearInterval(self.game_timer);
            }
        }, 1000);
        app.Game_Grid_Object.update();
    },
    
    renderLevelWords: function()
    {
        var self = this;
        var word_container_html = "";
        var max_words_per_row = 3;
        var num_of_rows = Math.ceil(this.levels[this.current_level].level_word_bank.length/max_words_per_row);
        var current_word_flip_card = 0;
        
        for(var current_row = 0; current_row < num_of_rows; current_row++)
        {
            for(var current_word_row_index = 0; current_word_row_index < max_words_per_row; current_word_row_index++)
            {
                var current_word = ((current_row * max_words_per_row) + current_word_row_index);
                if(current_word > (this.levels[this.current_level].level_word_bank.length - 1))
                {
                    continue;
                }
                var current_word_html = "";
                current_word_html += "<div class='level_word_flip_card' id='level_word_flip_card_" + current_word + "'>";
                current_word_html += "<div class='front'></div>";
                current_word_html += "<div class='back'>";
                current_word_html += "<p class='level_word' id='level_word_" + current_word + "'>" + this.levels[this.current_level].level_word_bank[current_word] + "</p>";
                current_word_html += "</div></div>";
                word_container_html  += current_word_html;
            }
        }
        $("#words_container").html(word_container_html);
        
        $(".level_word_flip_card").each(function(index)
        {
            $(this).flip({trigger: "manual", axis: "x", speed: 450});
            $(this).height($(this).css('fontSize'));
            $(this).width(canvas.width/max_words_per_row);
            if((self.levels[self.current_level].level_word_bank.length%max_words_per_row != 0) && ((index + 1) > (max_words_per_row * (Math.floor(self.levels[self.current_level].level_word_bank.length/max_words_per_row)))))
            {
                $(this).width(canvas.width/(self.levels[self.current_level].level_word_bank.length - (max_words_per_row * (Math.floor(self.levels[self.current_level].level_word_bank.length/max_words_per_row)))));
            }
            $(this).css({position: "absolute", top: (7 + ((Math.floor(index/max_words_per_row)) * 27)), left: ($(this).width() * (index%max_words_per_row))});
        }); 
        
        var flip_level_word_cards_timer_interval = setInterval(function()
        {
            if(self.current_level != 0)
            {
                self.current_game_time += 10;
                if($("#game_timer_flip_card").data("flip-model").isFlipped == true)
                {
                    $("#game_timer_flip_card").find(".front").html(self.current_game_time);
                    $("#game_timer_flip_card").flip('toggle');
                }
                else
                {
                    $("#game_timer_flip_card").find(".back").html(self.current_game_time);
                    $("#game_timer_flip_card").flip('toggle');
                }
            }
            
            if(current_word_flip_card >= (self.levels[self.current_level].level_word_bank.length - 1))
            {
                $("#level_word_flip_card_" + current_word_flip_card).flip('toggle', function()
                {
                    app.Game_Screens.renderTransitionScreen_Go();
                });
                clearInterval(flip_level_word_cards_timer_interval);
            }
            else
            {
                $("#level_word_flip_card_" + current_word_flip_card).flip('toggle');
                current_word_flip_card += 1;
            }
        }, 450);
    }
};