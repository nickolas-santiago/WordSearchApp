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
    render: function(){
        return (
            <div id="container">
                <canvas id="canvas" width="540" height="540">
                    This app uses the HTML canvas tag. To enjoy the full experience, please use a browser that supports
                    the HTML canvas tag.
                </canvas>
                <button id="playbutton" className="title_screen_button">PLAY</button>
                <button id="directionsbutton" className="title_screen_button">DIRECTIONS</button>
                <button id="backbutton">BACK</button>
                <button id="main_menu_button">MAIN MENU</button>
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
    document.getElementById('header_component')
);