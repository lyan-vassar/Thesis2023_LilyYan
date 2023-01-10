/* NUMBER 4: INVERTED GRAVITY VER
    inverted gravity

    (this version does not have any changes in regards to key controls, it's purely semantics)
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


window.addEventListener("load", init4);

function init4() {
    //startButton = document.getElementById("startButton");
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
function renderCanvas4() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 700);
}

// render player
function renderPlayer4() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder4() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey4() {
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
function renderDoor4() {
    ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);
}

// create spikes
function createSpikes4() {
    // spike on first platform
    spikes.push({x: 200, y: 230, width: 25, height: 20});

    // spike on starkey platform
    spikes.push({x: 50, y: 215, width: 25, height: 20});
}

// render spikes
function renderSpikes4() {
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
function renderGround4() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms4() {
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
function renderPlatforms4() {
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
}

// function for when a key is pressed
function keyDown4(e) {
    // left arrow key = 37
    if (e.keyCode == 37) {
        keys.left = true;
    }

    // up arrow key = 38
    if (e.keyCode == 38) {
        if (!player.jump) {
            player.x_v = -10; 
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
function keyUp4(e) {
    // left arrow key
    if (e.keyCode == 37) {
        keys.left = false;
    }

    // up arrow key
    if (e.keyCode == 38) {
        if (player.x_v > 2 && !player.climb) {
            player.x_v = 3; 
        }
        if (player.climb) {
            player.x_v = 0;
            keys.up = false;
        }
    }

    // down arrow key
    if (e.keyCode == 40) {
        if (player.climb) {
            player.x_v = 0;
            keys.down = false;
        }
    }

    // right arrow key
    if (e.keyCode == 39) {
        keys.right = false;
    }
}

// function to check for collisions
function checkCollisions4() {
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
function checkLadderClimb4() {
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
function checkKeyCollection4() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            door.unlocked = true;
        }
}

// function to check if door is reached
function openDoor4() {
    if (door.x < player.x && player.x < door.x + door.width &&
        door.y < player.y && player.y < door.y + door.height &&
        door.unlocked) {
            victoryCondition = true;
        }
}

// function to check if player died
function playerAlive4() {
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

// function to display end screen
function endScreen4() {
    renderCanvas4();
    //playAgainButton.style.visibility = "visible";

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        successOneButton.hidden = false;
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);
}



// ok here we go with the actual game
function start4() {
    init4();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 550;
    ctx.canvas.width = 1000;
    createPlatforms4();
    createSpikes4();
    document.addEventListener("keydown",keyDown4);
    document.addEventListener("keyup",keyUp4);
    timePassed = 0;

    window.requestAnimationFrame(gameLoop4);
}

function startAgain4() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas4();
    //window.requestAnimationFrame(gameLoop4);
}

function gameLoop4(timeStamp) {
    // render everything
    renderCanvas4();
    renderLadder4();
    renderPlayer4();
    renderStarKey4();
    renderDoor4();
    renderGround4();
    renderSpikes4();
    renderPlatforms4();
    checkLadderClimb4();
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
    checkCollisions4();
    checkKeyCollection4();
    playerAlive4();

    // if win condition is met, end game
    openDoor4();

    if (victoryCondition || !isPlayerAlive || isOver) gameOver4();

    else window.requestAnimationFrame(gameLoop4);
}

function gameOver4() {
    cancelAnimationFrame(gameLoop4);
    endScreen4();
    init4();
}

function isGameOver(){
    return false;
}

var gravityLevel = { // need start, render, gameloop?, end
    type: jsPsychGame,
    start: start4,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "gravity"
}


