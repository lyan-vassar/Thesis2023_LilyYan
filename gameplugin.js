/* TO DO:

    * make it work lol (v)
    * implement try again button (v)
    * collect and display data 
    * make it work for all 10 versions --> next step

    * create second plugin that puts up the html plugin side by side
    * combine the two???? 

    for later (aka prolific stuff)
    * check if need to use cog sci research server?
    * check what is needed to launch on prolific

*/

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
     * (for my thesis)
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
            <div id="intro">
                <!--<button type="button" id="startButton">START</button>-->
            </div>
            <!--<div id="timer"> Timer: 0</div>-->
            <div id="end">
                <button type="button" id="playAgain" hidden>TRY AGAIN</button>
                <button type="button" id="successOne" hidden>CONTINUE</button>
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

            //stick this inside a requestAnimationFrame loop
            /*window.requestAnimationFrame(() => {
                this.checkDone(trial);
            });*/

        }

        /*checkDone(trial) {
            //stick this inside a requestAnimationFrame loop
            if (trial.gameWon()) {
                // data saving
                var trial_data = {
                    //parameter_name: "parameter value",
                    success: trial.victoryCondition,
                    timePassed: trial.timePassed
                };
                // end trial
                this.jsPsych.finishTrial(trial_data);
                
                //FOR DEVELOPMENT TESTING PURPOSES ONLY
                //this.jsPsych.data.get().localSave('csv','mydata.csv');
                this.jsPsych.data.displayData();
                console.log("hi");
            } else {
                window.requestAnimationFrame(() => {
                    this.checkDone(trial);
                });
            }
            
        }*/

        
    }
    GamePlugin.info = info;

    return GamePlugin;
})(jsPsychModule);