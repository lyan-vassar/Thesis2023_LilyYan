var jsPsychGame = (function (jspsych) {
    "use strict";

    const info = {
        name: "game",
        parameters: {
            start: {
                type: jspsych.ParameterType.FUNCTION,
                default: null
            },
            gameWon: {
                type: jspsych.ParameterType.FUNCTION,
                default: null
            },
            verName: {
                type: jspsych.ParameterType.STRING,
                default: ""
            }
        },
    };

    /**
     * **Game Plugin**
     *
     * (for thesis)
     *
     * @author Lily Yan
     * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
     */
    class GamePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }

        trial(display_element, trial) {

            display_element.innerHTML = `
        <div id="game">
            <div id="end">
                <button type="button" id="playAgain" class="gameButton" hidden>TRY AGAIN</button>
                <button type="button" id="successOne" class="gameButton" hidden>CONTINUE</button>
                <img id="hintAnimation" src="images/fire.png" width="550" height="300">
                <button type="button" id="hint" class="gameButton" hidden>Need a hint?</button>
            </div>
            <div id="hintOption">
            </div>
            <canvas id="canvas"></canvas>
        </div>
        `
            trial.start();

            display_element.querySelector("#playAgain").addEventListener('click', trial.start);
            display_element.querySelector("#successOne").addEventListener('click', (e) => {
                e.preventDefault();
                this.jsPsych.finishTrial();
            });
            display_element.querySelector("#hint");
            display_element.querySelector("#hint").addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('hintAnimation')
                    .style.display = "block";
 
                document.getElementById('hint').style.display = "none";
            });

        }

        
    }
    GamePlugin.info = info;

    return GamePlugin;
})(jsPsychModule);