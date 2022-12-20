// Loads jsPsych
var jsPsych = initJsPsych({});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

// Captures info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id
});

//var levelVersion = [basic];

// line to randomly choose what version a subject gets 
//var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1)[0];

// will add version number to data frame
/*jsPsych.data.addProperties({
    version: versionNum,
});*/

var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome to the experiment! Press any key to begin."
};

timeline.push(welcome);


/* RUNNING THE EXPERIMENT */
// Instructions
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>In this experiment, you will be presented with a basic platformer level. Your goal is to win the level as quickly as possible.</p><p>Once you have completed the level one time, you will be prompted to produce instructions on how to win the level. Imagine you are trying to explain how to play and win the level to someone who has never seen or played the level before. You will be allowed to replay the level as much as you’d like until you submit your instructions.</p><p>To begin the experiment, hit the space bar.</p>",
    choice: [" "],
};

timeline.push(instructions);

var trial = {
    type: jsPsychGame,
    start: basicLevel.start,
    gameWon: basicLevel.gameWon
}

/*attempt at normal version
var trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        var stim = "<div id='game'><script type='text/javascript' src='platformer_basic.js'></script><div id='intro'><button type='button' id='startButton' onclick='start()'>START</button></div><div id='timer'> Timer: 0</div><div id='end'><button type='button' id='playAgain' onclick='start()' hidden>TRY AGAIN</button></div><canvas id='canvas'></canvas></div>";
        return stim;
    }
}*/

timeline.push(trial);

var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>You have completed the experiment. Thank you!</p>`,
    choices: [" "]//,
    /*on_finish: function () {
      document.querySelector("html").classList.remove("hide-cursor");
    },*/

    // save to a json?
    /*on_start: function () {
      jsPsych.data
        .get()
        .localSave("json", "sample.json");
        //.localSave("json", `subject-${subject_id}-behavioral.json`);
    },*/
  };
  
  timeline.push(debrief_block);
  

// run the timeline
jsPsych.run(timeline);