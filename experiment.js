// Loads jsPsych
//var jsPsych = initJsPsych({});
var jsPsych = initJsPsych({
    on_finish: function() {
      jsPsych.data.displayData();
    }
  });

window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

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

var levels = [basicLevel, invertedControlsLevel, letterControlsLevel, reversedSemLevel, gravityLevel, sequenceWinLevel, difKeyLevel, comboMotor2Sem2, comboSem1Task2, comboMotor1Task1];
var levelSurveys = [basicLevelSurvey, invertedControlsLevelSurvey, letterControlsLevelSurvey, reversedSemLevelSurvey, gravityLevelSurvey, sequenceWinLevelSurvey, difKeyLevelSurvey, comboMotor2Sem2Survey, comboSem1Task2Survey, comboMotor1Task1Survey];

// Randomly chooses version the subject gets
var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 1)[0];
//var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1], 1)[0];

// for debug purposes, comment out when done 

//var currLevel = gravityLevel;
//var levelPrompt = gravityLevelSurvey;

// comment back in for final version
var currLevel = levels[versionNum];
var levelPrompt = levelSurveys[versionNum];


// will add version number to data frame
jsPsych.data.addProperties({
    version: versionNum
});

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

var trialPt1 = {
    type: jsPsychGame,
    start: currLevel.start,
    gameWon: currLevel.gameWon,
    verName: currLevel.verName
}

var trialPt2 = {
    type: jsPsychGameSurvey,
    start: currLevel.start,
    gameWon: currLevel.gameWon,
    verName: currLevel.verName,
    questions: currLevel.questions
}

/*attempt at normal version
var trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        var stim = "<div id='game'><script type='text/javascript' src='platformer_basic.js'></script><div id='intro'><button type='button' id='startButton' onclick='start()'>START</button></div><div id='end'><button type='button' id='playAgain' onclick='start()' hidden>TRY AGAIN</button></div><canvas id='canvas'></canvas></div>";
        return stim;
    }
}*/

console.log(currLevel);
timeline.push(currLevel);

// instructions for second part
var instructionsPt2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p>Congratulations! You have successfully completed the level.</p><p>You will now be asked to write instructions for the level you have just played. As a reminder, imagine you are trying to explain how to play and win the level to someone who has never seen or played the level before. You will be allowed to replay the level as much as you’d like until you submit your instructions.</p><p>Press any key to continue.</p>",
  choice: [" "],
};

timeline.push(instructionsPt2);
timeline.push(levelPrompt);

// Saves data
/* var save_server_data = {
    type: jsPsychCallFunction,
    func: function () {
      var data = jsPsych.data.get().json();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'php/save_json.php');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ filedata: data }));
      jsPsych.data.get().localSave('csv','mydata.csv');
    },
    post_trial_gap: 1000
  }

timeline.push(save_server_data); */

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "CS7DzI5aepgd",
  filename: `${jsPsych.randomization.randomID(10)}.csv`,
  data_string: ()=>jsPsych.data.get().csv()
};

timeline.push(save_data);

var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thank you for participating in the experiment!\n If you'd like to learn more about the purpose of this experiment and what we're measuring, press 'y'.<p>Otherwise, <a href='https://app.prolific.co/submissions/complete?cc=COZ068ZS'>click here to return to Prolific and complete the study</a>.</p>"
    //choices: [" "]//,
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

  var full_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "The main question of this study is whether or not intuition in platformer games can be quantified and/or measured. Each participant is given a random platformer level that has been made unintuitive in some manner. The instructions written by participants will be analyzed to measure understanding and proficiency, to see the extent of which factors affect one’s ability to understand the level. <p><a href='https://app.prolific.co/submissions/complete?cc=COZ068ZS'>Click here to return to Prolific and complete the study</a>.</p>",
    choices: "NO_KEYS",
}

// Gives participant option of getting full debrief
var if_full_debrief = {
  timeline: [full_debrief],
  conditional_function: function () {
      // Checks which key was pressed
      var key = jsPsych.data.get().last(1).values()[0];
      if (jsPsych.pluginAPI.compareKeys(key.response, 'y')) {
          return true;
      }
      else {
          return false;
      }
  }
}

var goodbye = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "Thanks for participating! <a href='https://app.prolific.co/submissions/complete?cc=COZ068ZS'>Click here to return to Prolific and complete the study</a>."
}


timeline.push(debrief, if_full_debrief, goodbye);
  

// run the timeline
jsPsych.run(timeline);