var AppComponent_Header = React.createClass({
    render: function(){
        return (
            <div>
                <img src="images/game_header.png" id="app_header" />
                <div id="game_timer_flip_card">
                    <div className="front">
                    </div>
                    <div className="back">
                        <p id="game_clock">--</p>
                    </div>
                </div>
                <img src="images/game_logo.png" id="title_image" />
                <img src="images/directions_header.png" id="directions_header_image" />
                <img src="images/ready_screen_image.png" id="ready_screen_image" />
                <img src="images/go_screen_image.png" id="go_screen_image" />
                <img src="images/game_lost.png" id="game_lost_image" />
                <img src="images/game_won.png" id="game_won_image" />
            </div>
        );
    }
});
var GameComponent = React.createClass({
    componentDidMount: function()
    {
        canvas = document.querySelector('#canvas');
        canvas_context = canvas.getContext('2d');
        app.Game_Screens.renderTitleScreen();
        app.Game_Grid_Object.initEventListeners();
    },
    
    //---Button Events
    playButtonEvent: function()
    {
        if(app.Game_Object.current_game_state == app.Game_Object.game_states.TITLE_SCREEN)
        {
            $(".title_screen_button").toggle();
            $("#quit_game_button").toggle();
            app.Game_Object.current_game_time = 2000;
            $("#game_clock").html(app.Game_Object.current_game_time);
            $("#game_timer_flip_card").flip('toggle');
            $("#words_container_header_flip_card").flip('toggle');
            app.Game_Object.init();
            app.Game_Screens.renderTransitionScreen_Ready();
        }
        else if(app.Game_Object.current_game_state == app.Game_Object.game_states.TRANSITION_SCREEN)
        {
            $("#playbutton").toggle();
            app.Game_Object.renderLevelWords();
        }
    },
    directionsButtonEvent: function()
    {
        $(".title_screen_button").toggle();
        app.Game_Screens.renderDirections();
    },
    backButtonEvent: function()
    {
        $("#backbutton").toggle();
        app.Game_Screens.renderTitleScreen();
    },
    mainMenuButtonEvent: function()
    {
        $("#main_menu_button").toggle();
        $("#game_timer_flip_card").flip('toggle');
        $("#words_container_header_flip_card").flip('toggle');
        app.Game_Object.levels.splice(0, app.Game_Object.levels.length);
        if(app.Game_Object.current_game_state == app.Game_Object.game_states.GAME_LOST)
        {
            app.Game_Screens.renderTitleScreen();
        }
        else if(app.Game_Object.current_game_state == app.Game_Object.game_states.GAME_WON)
        {
            app.Game_Screens.renderTitleScreen();
        }
    },
    
    render: function(){
        return (
            <div id="container">
                <canvas id="canvas" width="700" height="700">
                    This app uses the HTML canvas tag. To enjoy the full experience, please use a browser that supports
                    the HTML canvas tag.
                </canvas>
                <button id="playbutton" className="title_screen_button" onClick={this.playButtonEvent}>PLAY</button>
                <button id="directionsbutton" className="title_screen_button" onClick={this.directionsButtonEvent}>DIRECTIONS</button>
                <button id="backbutton" onClick={this.backButtonEvent}>BACK</button>
                <button id="main_menu_button" onClick={this.mainMenuButtonEvent}>MAIN MENU</button>
                <p id="current_time">oo</p>
            </div>
        );
    }
});
var WordsContainerComponent = React.createClass({
    componentDidMount: function()
    {
        $("#words_container_component").width(canvas.width);
        $("#game_timer_flip_card").width(canvas.width);
        $("#words_container_header_flip_card").flip({trigger: "manual", axis: "x", speed: 300});
        $("#words_container_header_flip_card").height($("#words_container_header_flip_card").css('fontSize'));
    },
    render: function(){
        return (
            <div id="words_container_component">
                <div id="words_container_header_flip_card">
                    <div className="front"></div>
                    <div className="back">
                        <p id="words_container_header"><b>WORDS</b></p>
                    </div>
                </div>
                <div id="words_container">
                </div>
            </div>
        );
    }
});

var AppComponent = React.createClass({
    render: function(){
        return(
            <div>
                <AppComponent_Header />
                <GameComponent />
                <WordsContainerComponent />
            </div>
        );
    }
});

React.render(
    <AppComponent />,
    document.getElementById('wordsearch_app')
);