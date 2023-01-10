/* NUMBER 7: COMBO of motor2+sem2 (letter controls and incorrect gravity)
    combination of letter control keys and incorrect gravity (motor2sem2)
*/

// variables
var player;
var ground;
var numPlatforms;
var platforms;
var ladder;
var starkey;
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
var instructionsField;
var timer;
var timePassed = 0;


window.addEventListener("load", init7);

function init7() {
    startButton = document.getElementById("startButton");
    player = {
        x: 200,
        y: 300,
        x_v: 0,
        y_v: 0,
        jump: true,
        climb: false,
        height: 25,
        width: 25
    };

    ladder = {
        x: 65,
        y: 130,
        width: 100,
        height: 25
    }

    starkey = {
        x: 30,
        y: 170,
        spikes: 5, 
        outerRadius: 20,
        innerRadius: 10,
        collected: false
    };

    door = {
        x: 85,
        y: 340,
        width: 40, 
        height: 30,
        unlocked: false
    };

    ground = {
        x: 250,
        y: 0,
        width: 50,
        height: 440
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
    timer = document.getElementById("timer");
    playAgainButton = document.getElementById("playAgain");
    successOneButton = document.getElementById("successOne");

}

// render canvas
function renderCanvas7() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 450);
}

// render player
function renderPlayer7() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder7() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey7() {
    if (!starkey.collected) {
        var rot = Math.PI / 2 * 3;
        var pointX = starkey.x;
        var pointY = starkey.y;
        var step = Math.PI / starkey.spikes;

        ctx.strokeSyle = "#000";
        ctx.beginPath();
        ctx.moveTo(pointX, pointY - starkey.outerRadius)
        for (i = 0; i < starkey.spikes; i++) {
            pointX = starkey.x + Math.cos(rot) * starkey.outerRadius;
            pointY = starkey.y + Math.sin(rot) * starkey.outerRadius;
            ctx.lineTo(pointX, pointY);
            rot += step;

            pointX = starkey.x + Math.cos(rot) * starkey.innerRadius;
            pointY = starkey.y + Math.sin(rot) * starkey.innerRadius;
            ctx.lineTo(pointX, pointY);
            rot += step;
        }
        ctx.lineTo(pointX, pointY - starkey.outerRadius)
        ctx.closePath();
        ctx.lineWidth=5;
        ctx.strokeStyle="gold";
        ctx.stroke();
        ctx.fillStyle="gold";
        ctx.fill();
    }

}

// render door
function renderDoor7() {
    ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);
}

// create spikes
function createSpikes7() {
    // spike on first platform
    spikes.push({x: 200, y: 230, width: 25, height: 20});

    // spike on starkey platform
    spikes.push({x: 50, y: 215, width: 25, height: 20});
}

// render spikes
function renderSpikes7() {
    for (ctr=0; ctr<spikes.length; ctr++) {
        ctx.strokeSyle = "#000";
        ctx.beginPath();
        ctx.moveTo(spikes[ctr].x, spikes[ctr].y);
        ctx.lineTo(spikes[ctr].x-spikes[ctr].width, spikes[ctr].y+(spikes[ctr].width/2));
        ctx.lineTo(spikes[ctr].x, spikes[ctr].y+spikes[ctr].width);
        ctx.lineTo(spikes[ctr].x, spikes[ctr].y);
        ctx.closePath();
        ctx.lineWidth=5;
        ctx.strokeStyle="silver";
        ctx.stroke();
        ctx.fillStyle = "silver";
        ctx.fill();
    }
}

// render enemy


// render ground
function renderGround7() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms7() {
    // first platform
    platforms.push({x: 200, y: 200, width: 15, height: 110, color: "steelblue"});

    // second platform
    platforms.push({x: 150, y: 45, width: 15, height: 110, color: "steelblue"});

    // third platform
    platforms.push({x: 50, y: 125, width: 15, height: 110, color: "steelblue"});

    // fourth platform
    platforms.push({x: 125, y: 300, width: 15, height: 110, color: "steelblue"});
}

// render platforms
function renderPlatforms7() {
    //ctx.fillStyle = "#45597E";
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
}

// function for when a key is pressed
function keyDown7(e) {
    // left arrow key = 37
    // change to "l" key = 76
    if (e.keyCode == 76) {
        keys.left = true;
    }

    // up arrow key = 38
    // change to "u" key = 85
    if (e.keyCode == 85) {
        if (!player.jump) {
            player.x_v = -10; 
        }

        if (player.climb) {
            keys.up = true;
        }
    }

    // down arrow key
    // change to "d" key = 68
    if (e.keyCode == 68) {
        if (player.climb) {
            keys.down = true;
        }
    }

    // right arrow key = 39
    // change to "r" key = 82
    if (e.keyCode == 82) {
        keys.right = true;
    }
}

// function for when a key is released
function keyUp7(e) {
    // left arrow key
    // change to l
    if (e.keyCode == 76) {
        keys.left = false;
    }

    // up arrow key
    // change to u
    if (e.keyCode == 85) {
        if (player.x_v > 2 && !player.climb) {
            player.x_v = 3; 
        }
        if (player.climb) {
            player.x_v = 0;
            keys.up = false;
        }
    }

    // down arrow key
    // change to d
    if (e.keyCode == 68) {
        if (player.climb) {
            player.x_v = 0;
            keys.down = false;
        }
    }

    // right arrow key
    // change to r 
    if (e.keyCode == 82) {
        keys.right = false;
    }
}

// function to check for collisions
function checkCollisions7() {
    ans = false;
    index = -1;

    for (ctr=0; ctr<numPlatforms; ctr++) {
        if (platforms[ctr].x < player.x && player.x <= platforms[ctr].x + platforms[ctr].width &&
            platforms[ctr].y < player.y && player.y < platforms[ctr].y + platforms[ctr].height){
                ans = true;
                index = ctr;
                break;
        }
    }

    if (ans) {
        player.jump = false;
        player.x = platforms[index].x;
    }

    else if (ground.x < player.x && player.x < ground.x+ground.width) {
        player.jump = false;
        player.x = ground.x;
    }
}

// function for climbing the ladder
function checkLadderClimb7() {
    if (ladder.x < player.x && player.x < ladder.x + ladder.width &&
        ladder.y < player.y && player.y < ladder.y + ladder.height) {
            player.climb = true;
            player.jump = false;
            if (keys.up) player.x -= 2.5;
            if (keys.down) player.x += 2.5;
        }

    else player.climb = false;
}

// function for collecting the starkey
function checkKeyCollection7() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            door.unlocked = true;
        }
}

// function to check if door is reached
function openDoor7() {
    if (door.x < player.x && player.x < door.x + door.width &&
        door.y < player.y && player.y < door.y + door.height &&
        door.unlocked) {
            victoryCondition = true;
        }
}

// function to check if player died
function playerAlive7() {
    hazardCollided = false;
    index = 0;

    // test for enemy collision

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
        if (((spikes[ctr].y < player.y && player.y-player.height < spikes[ctr].y) || 
            (spikes[ctr].y+spikes[ctr].height > player.y-player.height && player.y > spikes[ctr].y+spikes[ctr].height)) &&
            spikes[ctr].x-spikes[ctr].width < player.x && player.x <= spikes[ctr].x) {
                hazardCollided = true;
                index = ctr;
                break;
            }
    }

    isPlayerAlive = !hazardCollided;
}

// function to check win condition
function isWin7() {
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
function endScreenSurvey7() {
    renderCanvas7();
    //playAgainButton.style.visibility = "visible";

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        playAgainButton.hidden = false;
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);
}



// ok here we go with the actual game
function startSurvey7() {
    init7();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 450;
    ctx.canvas.width = 550;
    createPlatforms7();
    createSpikes7();
    document.addEventListener("keydown",keyDown7);
    document.addEventListener("keyup",keyUp7);
    timePassed = 0;

    window.requestAnimationFrame(gameLoopSurvey7);
}

/*function startAgain() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas();
    //window.requestAnimationFrame(gameLoop7);
}*/

function gameLoopSurvey7(timeStamp) {
    // render everything
    renderCanvas7();
    renderLadder7();
    renderPlayer7();
    renderStarKey7();
    renderDoor7();
    renderGround7();
    renderSpikes7();
    renderPlatforms7();
    checkLadderClimb7();
    timePassed += Math.round(timeStamp / 1000);
    timer.innerHTML = "Timer: " + timePassed;

    // if player is not jumping, apply friction. otherwise apply gravity
    if (player.jump == false) {
        player.y_v *= friction;
    }

    else if (!player.climb) {
        player.x_v += gravity; // effect of falling
    }
    if (!player.climb) player.jump = true;
    if (player.climb) player.x_v = 0;

    // if left or right key is pressed, change velocity
    if (keys.left) {
        player.y_v = 2.5;
    }

    if (keys.right) {
        player.y_v = -2.5;
    }

    // update player's coordinates
    player.x += player.x_v;
    player.y += player.y_v;

    // check for collisions with platform
    checkCollisions7();
    checkKeyCollection7();
    playerAlive7();

    // if win condition is met, end game
    //isWin();
    openDoor7();

    if (victoryCondition || !isPlayerAlive || isOver) gameOverSurvey7();

    else window.requestAnimationFrame(gameLoopSurvey7);
}

function gameOverSurvey7() {
    cancelAnimationFrame(gameLoopSurvey7);
    endScreenSurvey7();
    init7();
}


var comboMotor2Sem2Survey = { // need start, render, gameloop?, end
    type: jsPsychGameSurvey,
    start: startSurvey7,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "comboM2S2",
    questions: [
        {prompt:"Insert instructions here.", rows: 10}
    ]
}
