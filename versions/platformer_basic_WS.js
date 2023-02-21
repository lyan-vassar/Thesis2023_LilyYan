/* NUMBER 0: BASIC VER

KNOWN ISSUES LIST
    * ladder glitches sometimes (will make player automatically go up) (sometimes it fixes itself? it's weird)
    * collision functions are iffy --> MUST EDIT SOON
    * spike placement on gravity levels should be better
    

    Things I'd like to clean up
    * make stars look better (have to figure out what's wrong with my render fxn)
    * make UI nicer
    * maybe replace some elements with actual images instead of just shapes
        * would i have to draw those myself??
    * slow timer down
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
var victoryCondition;
var playAgainButton;
var successOneButton;
var instructionsField;
// var timer;
// var timePassed = 0;


window.addEventListener("load", init0);

function init0() {
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

    starkey = {
        x: 170,
        y: 30,
        spikes: 5, 
        outerRadius: 20,
        innerRadius: 10,
        collected: false
    };

    door = {
        x: 340,
        y: 85,
        width: 30, 
        height: 40,
        unlocked: false
    };

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
    victoryCondition = false;
    // timer = document.getElementById("timer");
    playAgainButton = document.getElementById("playAgain");
    successOneButton = document.getElementById("successOne");

}

// render canvas
function renderCanvas0() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 450);
}

// render player
function renderPlayer0() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder0() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey0() {
    if (!starkey.collected) { // only render if starkey wasn't collected yet
        // this is a 5 point star-rendering function I found from online tutorials
        // it's not perfect; i will try to figure out why
        var rot = Math.PI / 2 * 3;
        var pointX = starkey.x;
        var pointY = starkey.y;
        var step = Math.PI / starkey.spikes;

        ctx.strokeSyle = "#000";
        ctx.beginPath;
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
function renderDoor0() {
    ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);

    // for doorknob:
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;
    var radius = 2;

    ctx.beginPath();
    ctx.arc(door.x+5, door.y+20, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// create spikes
function createSpikes0() {
    // spike on first platform
    spikes.push({x: 230, y: 200, width: 20, height: 10});

    // spike on starkey platform
    spikes.push({x: 215, y: 50, width: 20, height: 10});
}

// render spikes
function renderSpikes0() {
    for (ctr=0; ctr<spikes.length; ctr++) {
        // attempting to render it a little differently; three small spikes, not one big one
        //ctx.strokeSyle = "#000";
        ctx.beginPath(); // first spike
        ctx.moveTo(spikes[ctr].x, spikes[ctr].y); //starting point
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width/6), spikes[ctr].y-spikes[ctr].height);
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width/3), spikes[ctr].y); 
        ctx.lineTo(spikes[ctr].x, spikes[ctr].y);
        ctx.closePath();
        ctx.lineWidth=5;
        ctx.strokeStyle="silver";
        ctx.stroke();
        ctx.fillStyle = "silver";
        ctx.fill();

        ctx.beginPath(); // second spike
        ctx.moveTo(spikes[ctr].x+(spikes[ctr].width/3), spikes[ctr].y); //starting point
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width/2), spikes[ctr].y-spikes[ctr].height);
        ctx.lineTo(spikes[ctr].x+(2*spikes[ctr].width/3), spikes[ctr].y); 
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width/3), spikes[ctr].y);
        ctx.closePath();;
        ctx.stroke();
        ctx.fill();

        ctx.beginPath(); // third spike
        ctx.moveTo(spikes[ctr].x+(2*spikes[ctr].width/3), spikes[ctr].y); //starting point
        ctx.lineTo(spikes[ctr].x+(5*spikes[ctr].width/6), spikes[ctr].y-spikes[ctr].height);
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width), spikes[ctr].y); 
        ctx.lineTo(spikes[ctr].x+(2*spikes[ctr].width/3), spikes[ctr].y);
        ctx.closePath();;
        ctx.stroke();
        ctx.fill();

    }
}

// render enemy (maybe?)


// render ground
function renderGround0() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms0() {
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
function renderPlatforms0() {
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
}

// function for when a key is pressed
function keyDown(e) {
    // left arrow key = 37
    if (e.keyCode == 37) {
        keys.left = true;
    }

    // up arrow key = 38
    if (e.keyCode == 38) {
        if (!player.jump) { // if player's not already in the air 
            player.y_v = -10; // go up
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
function keyUp(e) {
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

// function to check for platform collisions
function checkCollisions0() { 
    ans = false;
    index = -1;

    for (ctr=0; ctr<numPlatforms; ctr++) {
        if (platforms[ctr].x < player.x && player.x-player.width <= platforms[ctr].x + platforms[ctr].width &&
            platforms[ctr].y < player.y && player.y < platforms[ctr].y + platforms[ctr].height){
                //ans = true;
                //index = ctr;
                player.jump = false;
                player.y = platforms[ctr].y;
                ans = true;
                break;
        }
    }

    /*if (ans) { // if player did hit a platform
        player.jump = false; // player is no longer jumping
        player.y = platforms[index].y; // keep player at same y level as platform
    }*/

    if (!ans && ground.y < player.y && player.y < ground.y+ground.height) { // if player's on the ground
        player.jump = false;
        player.y = ground.y;
    }

    // check collision with canvas walls
    if (player.x-player.width <= 0) player.x = player.width;
    if (player.x >= ground.width) player.x = ground.width;
}

// function for climbing the ladder
// not flawless
function checkLadderClimb0() {
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
function checkKeyCollection0() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            door.unlocked = true; // having the key means you can unlock the door
        }
}

// function to check if door is reached
function openDoor0() {
    if (door.unlocked && ((door.x < player.x && player.x-player.width < door.x) ||
        (door.x+door.width > player.x-player.width && player.x > door.x+door.width)) &&
        door.y <= player.y && player.y <= door.y+door.height) { // if player reaches door AND door is unlocked
            victoryCondition = true; // you win!
        }
}

// function to check if player died
function playerAlive0() {
    hazardCollided = false;
    index = 0;

    // test for enemy collision

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
        // sorry this next line looks like a mess, it was the best way i could make it work
        if (((spikes[ctr].x < player.x && player.x-player.width < spikes[ctr].x) || 
            (spikes[ctr].x+spikes[ctr].width > player.x-player.width && player.x > spikes[ctr].x+spikes[ctr].width)) &&
            spikes[ctr].y-spikes[ctr].height < player.y && player.y <= spikes[ctr].y) {
                hazardCollided = true;
                index = ctr;
                break;
            }
    }

    isPlayerAlive = !hazardCollided;

}

// function to check win condition
// this is really only relevant for the platform sequence level
/*
function isWin() {
    ans = true;
    if (currentSequence.length == winSequence.length) { 
        for (ctr=0; ctr<currentSequence.length; ctr++) {
            if (currentSequence[ctr] != winSequence[ctr]) {
                ans = false;
                break;
            }
        }
        victoryCondition = ans;
    }
}*/

// function to display end screen
function endScreenLoop0() {
    renderCanvas0();

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        playAgainButton.hidden = false;

        document.removeEventListener("keydown",keyDown);
        document.removeEventListener("keyup",keyUp);
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);

    //playAgainButton.hidden = false;
    //playAgainButton.removeAttribute("hidden");
    //playAgainButton.style.visibility = "visible";
}

// function to display end screen with play again fxn
function endScreenLoop0() {
    renderCanvas0();

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        //console.log("hi");
        playAgainButton.hidden = false;
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);

    //playAgainButton.hidden = false;
    //playAgainButton.removeAttribute("hidden");
    //playAgainButton.style.visibility = "visible";
}



// ok here we go with the actual game
function startSurvey0() {
    //console.log(door.unlocked);
    init0();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 450;
    ctx.canvas.width = 550;
    createPlatforms0();
    createSpikes0();
    document.addEventListener("keydown",keyDown);
    document.addEventListener("keyup",keyUp);
    // timePassed = 0;

    window.requestAnimationFrame(gameLoopSurvey0);
}

/*function startAgain() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas();
    //window.requestAnimationFrame(gameLoop);
}*/

function gameLoopSurvey0(timeStamp) {
    console.log(victoryCondition);
    // render everything
    renderCanvas0();
    //renderLadder0();
    renderPlayer0();
    renderStarKey0();
    renderDoor0();
    renderGround0();
    renderSpikes0();
    renderPlatforms0();
    //checkLadderClimb0();
    // timePassed += Math.round(timeStamp / 1000);
    // timer.innerHTML = "Timer: " + timePassed;

    // if player is not jumping, apply friction; otherwise apply gravity
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


    // // update player's coordinates
    // player.x += player.x_v;
    // if (player.y + player.y_v >= platforms[closestPlatform()].y && !player.jump) player.y = platforms[closestPlatform()].y;
    // else player.y += player.y_v;

    
    //player.y += player.y_v;

    //player.climb = false;

    // check for collisions with platform
    checkCollisions0();
    checkKeyCollection0();
    playerAlive0();

    // if win condition is met, end game
    //isWin0();
    openDoor0();

    //basicLevel.gameWon = isGameWon;
    //console.log("basic level: " + basicLevel.gameWon());

    // game ends if you win, or if you die
    if (victoryCondition || !isPlayerAlive) {
        gameOverSurvey0();
    }

    else window.requestAnimationFrame(gameLoopSurvey0);
}

function gameOverSurvey0() { // if game is over
    cancelAnimationFrame(gameLoopSurvey0);

    // add something to be able to toggle btwn these two
    //endScreen0();
    endScreenLoop0(); 

    init0();
}

function isGameWon(){
    //return (victoryCondition || !isPlayerAlive);
    return victoryCondition;
}

var basicLevelSurvey = { // need start, render, gameloop?, end
    type: jsPsychGameSurvey,
    start: startSurvey0,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "basic",
    questions: [
        {prompt:"Insert instructions here.", rows: 10}
    ]
}