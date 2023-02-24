/* NUMBER 8: COMBO of sem1+task2 (reversed semantics and dif key win)
    * combination of reversed semantics and different key win (sem1task2)
*/

// variables
var player;
var ground;
var numPlatforms;
var platforms;
var ladder;
var starkey;
//const ghost = new Image();
var door;
var keys;
var spikes;
var enemy;
var friction;
var gravity;
var winSequence;
var currentSequence;
var isPlayerAlive;
var isOver;
var victoryCondition;
var playAgainButton;
var successOneButton;
var hintButton;
var hintGif;
var hintUsed = false;
var instructionsField;
var numberOfDeaths = 0;
var initialTimeCollected = false;
var startTime = 0;


window.addEventListener("load", init8);

function init8() {
    //startButton = document.getElementById("startButton");
    player = {
        x: 300,
        y: 200,
        x_v: 0,
        y_v: 0,
        jump: true,
        climb: false,
        height: 25,
        width: 25
    };

    ladder = {
        x: 130,
        y: 55,
        width: 25,
        height: 110
    }

    ghost.src = "images/ghost.png";
    starkey = {
        image: ghost,
        x: 150, 
        y: 15,
        width: 30,
        height: 30,
        collected: false
    }

    door = {// now a spike
        x: 340, 
        y: 125, 
        width: 20, 
        height: 10,
        unlocked: false
    }

    ground = {
        x: 0,
        y: 250,
        width: 440,
        height: 50
    };

    keys = {
        right: false,
        left: false,
        up: false
    };

    winSequence = [2,1,0,3];
    currentSequence = [];

    spikes = [];
    numPlatforms = 4;
    platforms = [];
    friction = 0.1;
    gravity = 0.6;
    isPlayerAlive = true;
    isOver = false;
    victoryCondition = false;
    // timer = document.getElementById("timer");
    playAgainButton = document.getElementById("playAgain");
    successOneButton = document.getElementById("successOne");

    hintButton = document.getElementById("hint");
    hintGif = document.getElementById("hintAnimation");
    hintGif.src = "hints/sem1task2.gif";

}

// render canvas
function renderCanvas8() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 300);
}

// render player
function renderPlayer8() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder8() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey8() {
    // png attempt 2
    ctx.drawImage(starkey.image, starkey.x, starkey.y, starkey.width, starkey.height);
}

// render door
function renderDoor8() {
    /*ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);*/
    ctx.beginPath(); // first spike
        ctx.moveTo(door.x, door.y); //starting point
        ctx.lineTo(door.x+(door.width/6), door.y-door.height);
        ctx.lineTo(door.x+(door.width/3), door.y); 
        ctx.lineTo(door.x, door.y);
        ctx.closePath();
        ctx.lineWidth=5;
        ctx.strokeStyle="silver";
        ctx.stroke();
        ctx.fillStyle = "silver";
        ctx.fill();

        ctx.beginPath(); // second spike
        ctx.moveTo(door.x+(door.width/3), door.y); //starting point
        ctx.lineTo(door.x+(door.width/2), door.y-door.height);
        ctx.lineTo(door.x+(2*door.width/3), door.y); 
        ctx.lineTo(door.x+(door.width/3), door.y);
        ctx.closePath();;
        ctx.stroke();
        ctx.fill();

        ctx.beginPath(); // third spike
        ctx.moveTo(door.x+(2*door.width/3), door.y); //starting point
        ctx.lineTo(door.x+(5*door.width/6), door.y-door.height);
        ctx.lineTo(door.x+(door.width), door.y); 
        ctx.lineTo(door.x+(2*door.width/3), door.y);
        ctx.closePath();;
        ctx.stroke();
        ctx.fill();
}

// create spikes
function createSpikes8() {
    /* original
    // spike on first platform
    spikes.push({x: 230, y: 200, width: 20, height: 25});

    // spike on starkey platform
    spikes.push({x: 215, y: 50, width: 20, height: 25});*/

    // spikes are now stars
    spikes.push({x: 230, y: 180, spokes: 5, outerRadius: 15,innerRadius: 7.5, collected: false})

    spikes.push({x: 215, y: 30, spokes: 5, outerRadius: 15, innerRadius: 7.5, collected: false})

}

// render spikes
function renderSpikes8() {
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / 5;

    for (ctr=0; ctr<spikes.length; ctr++) {
        if (!spikes[ctr].destroyed) {
            pointX = spikes[ctr].x;
            pointY = spikes[ctr].y;

            ctx.strokeSyle = "#000";
            ctx.beginPath();
            ctx.moveTo(pointX, pointY - spikes[ctr].outerRadius)
            for (i = 0; i < spikes[ctr].spokes; i++) {
                pointX = spikes[ctr].x + Math.cos(rot) * spikes[ctr].outerRadius;
                pointY = spikes[ctr].y + Math.sin(rot) * spikes[ctr].outerRadius;
                ctx.lineTo(pointX, pointY);
                rot += step;

                pointX = spikes[ctr].x + Math.cos(rot) * spikes[ctr].innerRadius;
                pointY = spikes[ctr].y + Math.sin(rot) * spikes[ctr].innerRadius;
                ctx.lineTo(pointX, pointY);
                rot += step;
            }
            ctx.lineTo(pointX, pointY - spikes[ctr].outerRadius)
            ctx.closePath();
            ctx.lineWidth=5;
            ctx.strokeStyle="gold";
            ctx.stroke();
            ctx.fillStyle="gold";
            ctx.fill();
        }
    }
}

// render enemy


// render ground
function renderGround8() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms8() {
    // first platform
    platforms.push({x: 200, y: 200, width: 110, height: 15, color: "steelblue"});

    // second platform
    platforms.push({x: 45, y: 150, width: 110, height: 15, color: "steelblue"});

    // third platform
    platforms.push({x: 125, y: 50, width: 110, height: 15, color: "steelblue"});

    // fourth platform
    platforms.push({x: 300, y: 125, width: 110, height: 15, color: "steelblue"});
}

// render platforms
function renderPlatforms8() {
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
}

// function for when a key is pressed
function keyDown8(e) {
    // left arrow key = 37
    if (e.keyCode == 37) {
        keys.left = true;
    }

    // up arrow key = 38
    if (e.keyCode == 38) {
        if (!player.jump) {
            player.y_v = -10; 
        }

        if (player.climb) {
            keys.up = true;
        }
    }

    // down arrow key
    if (e.keyCode == 40) {
        if (player.climb) {
            keys.down = true;
        }
    }

    // right arrow key = 39
    if (e.keyCode == 39) {
        keys.right = true;
    }
}

// function for when a key is released
function keyUp8(e) {
    // left arrow key
    if (e.keyCode == 37) {
        keys.left = false;
    }

    // up arrow key
    if (e.keyCode == 38) {
        if (player.y_v < -2 && !player.climb) {
            player.y_v = -3; 
        }
        if (player.climb) {
            player.y_v = 0;
            keys.up = false;
        }
    }

    // down arrow key
    if (e.keyCode == 40) {
        if (player.climb) {
            player.y_v = 0;
            keys.down = false;
        }
    }

    // right arrow key
    if (e.keyCode == 39) {
        keys.right = false;
    }
}

// function to check for collisions
function checkCollisions8() {
    ans = false;
    index = -1;

    for (ctr=0; ctr<numPlatforms; ctr++) {
        if (platforms[ctr].x < player.x && player.x-player.width <= platforms[ctr].x + platforms[ctr].width &&
            platforms[ctr].y < player.y && player.y < platforms[ctr].y + platforms[ctr].height){
                ans = true;
                index = ctr;
                break;
        }
    }

    if (ans) {
        player.jump = false;
        player.y = platforms[index].y;
    }

    else if (ground.y < player.y && player.y < ground.y+ground.height) {
        player.jump = false;
        player.y = ground.y;
    }

    if (player.x-player.width <= 0) player.x = player.width;
    if (player.x >= ground.width) player.x = ground.width;
}

// function for climbing the ladder
function checkLadderClimb8() {
    if (ladder.x < player.x && player.x < ladder.x + ladder.width &&
        ladder.y < player.y && player.y < ladder.y + ladder.height) {
            player.climb = true;
            player.jump = false;
            if (keys.up) player.y -= 2.5;
            if (keys.down) player.y += 2.5;
        }

    else player.climb = false;
}

// function for collecting the starkey
function checkKeyCollection8() {
    /*if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            //door.unlocked = true;
        }*/

        if (((starkey.x < player.x && player.x-player.width < starkey.x) || 
        (starkey.x+starkey.width > player.x-player.width && player.x > starkey.x+starkey.width)) &&
        starkey.y <= player.y && player.y-player.height <= starkey.y+starkey.height) {
            starkey.collected = true;
            door.unlocked = true;
        }
}

// function to check if door is reached
function openDoor8() {
    if (door.unlocked && ((door.x < player.x && player.x-player.width < door.x) || 
    (door.x+door.width > player.x-player.width && player.x > door.x+door.width)) &&
    door.y-door.height < player.y && player.y <= door.y) { // if player reaches door AND door is unlocked
            victoryCondition = true; // you win!
        }
    /*if (((door.x < player.x && player.x-player.width < door.x) || 
        (door.x+door.width > player.x-player.width && player.x > door.x+door.width)) &&
        door.y-door.height < player.y && player.y <= door.y &&
        door.unlocked) {
            victoryCondition = true;
        }*/
}

// function to check if player died
function playerAlive8() {
    hazardCollided = false;
    index = 0;

    // test for enemy collision

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
        if (spikes[ctr].x < player.x && player.x < spikes[ctr].x+(spikes[ctr].outerRadius*2) &&
            spikes[ctr].y < player.y && player.y < spikes[ctr].y+(spikes[ctr].outerRadius*2)) {
                hazardCollided = true;
                if (starkey.collected) spikes[ctr].destroyed = true;
                break;
            }
    }

    if (!starkey.collected) isPlayerAlive = !hazardCollided;

    // is door unlocked?
    ans = true;
    for (ctr=0; ctr<spikes.length; ctr++) { // check if spikes are all gone
        ans = spikes[ctr].destroyed && ans;
    }
    door.unlocked = ans;
}

// function to check win condition
function isWin8() {
    ans = true;
    if (currentSequence.length == winSequence.length) {
        isOver = true;

        for (ctr=0; ctr<currentSequence.length; ctr++) {
            if (currentSequence[ctr] != winSequence[ctr]) {
                ans = false;
                break;
            }
        }
        victoryCondition = ans;
    }
}

// function to display end screen
function endScreen8() {
    renderCanvas8();
    //playAgainButton.style.visibility = "visible";

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        successOneButton.hidden = false;

        hintButton.hidden = true;
        hintAnimation = document.getElementById("hintAnimation");
        hintAnimation.style.display = "none";

        document.removeEventListener("keydown",keyDown);
        document.removeEventListener("keyup",keyUp);

        jsPsych.data.get().addToAll({deaths: numberOfDeaths});
        jsPsych.data.get().addToAll({hintNeeded: hintUsed});
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
        numberOfDeaths += 1;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);
}



// ok here we go with the actual game
function start8() {
    init8();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 300;
    ctx.canvas.width = 550;
    createPlatforms8();
    createSpikes8();
    document.addEventListener("keydown",keyDown8);
    document.addEventListener("keyup",keyUp8);
    // timePassed = 0;

    window.requestAnimationFrame(gameLoop8);
}

/*function startAgain() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas();
    //window.requestAnimationFrame(gameLoop);
}*/

function gameLoop8(timeStamp) {
    // render everything
    renderCanvas8();
    //renderLadder8();
    renderPlayer8();
    renderDoor8();
    renderGround8();
    renderSpikes8();
    renderPlatforms8();
    if (!starkey.collected) renderStarKey8();

    if (!initialTimeCollected) {
        initialTimeCollected = true;
        startTime = timeStamp;
    }

    // if player is not jumping, apply friction. otherwise apply gravity
    if (player.jump == false) {
        player.x_v *= friction;
    }

    else if (!player.climb) {
        player.y_v += gravity; // effect of falling
    }
    if (!player.climb) player.jump = true;
    if (player.climb) player.y_v = 0;

    // if left or right key is pressed, change velocity
    if (keys.left) {
        player.x_v = -2.5;
    }

    if (keys.right) {
        player.x_v = 2.5;
    }

    // update player's coordinates
    player.x += player.x_v;
    if (player.y_v >= 10) player.y_v = 10;
    player.y += player.y_v;

    // check for collisions with platform
    checkCollisions8();
    checkKeyCollection8();
    playerAlive8();

    // if win condition is met, end game
    //isWin8();
    openDoor8();

    if ((timeStamp - startTime) >= 240000 && !hintUsed) {
        hintButton.hidden = false;
        hintUsed = true;
    } 

    if (victoryCondition || !isPlayerAlive || isOver) gameOver8();

    else window.requestAnimationFrame(gameLoop8);
}

function gameOver8() {
    cancelAnimationFrame(gameLoop8);
    endScreen8();
    init8();
}



var comboSem1Task2 = { // need start, render, gameloop?, end
    type: jsPsychGame,
    start: start8,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "comboS1T2"
}
