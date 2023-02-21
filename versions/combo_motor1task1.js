/* NUMBER 9: COMBO of motor1+task1 (inverted controls + sequence win)
    * combination of inverted controls and platform sequence win condition
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
var groundCollided;
var isPlayerAlive;
var isOver;
var victoryCondition;
var playAgainButton;
var successOneButton;
var instructionsField;
//var timer;
//var timePassed = 0;


window.addEventListener("load", init9);

function init9() {
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

    winSequence = [0,1,2,3];
    currentSequence = [];
    groundCollided = false;

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
    console.log("hi");

}

// render canvas
function renderCanvas9() {
    //ctx.fillStyle = "#F0F8FF";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 450);
}

// render player
function renderPlayer9() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder9() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey9() {
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
function renderDoor9() {
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
function createSpikes9() {
    // spike on first platform
    spikes.push({x: 230, y: 200, width: 20, height: 10});

    // spike on starkey platform
    spikes.push({x: 215, y: 50, width: 20, height: 10});
}

// render spikes
function renderSpikes9() {
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

// render enemy


// render ground
function renderGround9() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms9() {
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
function renderPlatforms9() {
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }

}

// function for when a key is pressed
function keyDown9(e) {
    // left arrow key = 37
    if (e.keyCode == 39) {
        keys.left = true;
    }

    // up arrow key = 38
    if (e.keyCode == 40) {
        if (!player.jump) {
            player.y_v = -10;
        }

        if (player.climb) {
            keys.up = true;
        }
    }

    // down arrow key
    if (e.keyCode == 38) {
        if (player.climb) {
            keys.down = true;
        }
    }

    // right arrow key = 39
    if (e.keyCode == 37) {
        keys.right = true;
    }
}

// function for when a key is released
function keyUp9(e) {
    // left arrow key
    if (e.keyCode == 39) {
        keys.left = false;
    }

    // up arrow key
    if (e.keyCode == 40) {
        if (player.y_v < -2 && !player.climb) {
            player.y_v = -3; 
        }
        if (player.climb) {
            player.y_v = 0;
            keys.up = false;
        }
    }

    // down arrow key
    if (e.keyCode == 38) {
        if (player.climb) {
            player.y_v = 0;
            keys.down = false;
        }
    }

    // right arrow key
    if (e.keyCode == 37) {
        keys.right = false;
    }
}

// function to check for collisions
function checkCollisions9() {
    ans = false;
    index = -1;

    for (ctr=0; ctr<numPlatforms; ctr++) {
        if (platforms[ctr].x < player.x && player.x-player.width <= platforms[ctr].x + platforms[ctr].width &&
            platforms[ctr].y < player.y && player.y < platforms[ctr].y + platforms[ctr].height){
                ans = true;
                index = ctr;
                //if (!currentSequence.includes(ctr)) currentSequence.push(ctr);
                if (currentSequence.length == 0) currentSequence.push(index);
                else if (currentSequence.length > 0 && currentSequence[currentSequence.length-1] != index) 
                    currentSequence.push(index);

                    //console.log(noDuplicates(currentSequence), ctr, currentSequence);

                //console.log(currentSequence);
                // for changing color of platforms; green = correct, red = incorrect
                if (currentSequence.length <= winSequence.length && currentSequence[index] == winSequence[index] 
                    && groundCollided && noDuplicates(currentSequence)) {
                        //console.log(noDuplicates(currentSequence), ctr);
                        platforms[index].color = "limegreen";
                }
                else if (currentSequence.length <= winSequence.length && 
                    currentSequence[index] != winSequence[index] && groundCollided) {
                        platforms[index].color = "red";
                }
                else if ((!noDuplicates(currentSequence)) && groundCollided) 
                    platforms[index].color = "red";

                else if (currentSequence.length > winSequence.length && groundCollided) platforms[index].color = "red";
                break;
        }
    }

    if (ans) {
        player.jump = false;
        player.y = platforms[index].y;
    }

    else if (ground.y < player.y && player.y < ground.y+ground.height) { // collide with ground
        player.jump = false;
        player.y = ground.y;
        groundCollided = true;
        currentSequence = [];
        for (ctr=0; ctr<numPlatforms; ctr++) {
            platforms[ctr].color = "steelblue";
        }
    }
    
    if (player.x-player.width <= 0) player.x = player.width;
    if (player.x >= ground.width) player.x = ground.width;
}

// function for climbing the ladder
function checkLadderClimb9() {
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
function checkKeyCollection9() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            //door.unlocked = true;
        }
}

// 

// function to check if door is reached
function openDoor9() {
    /*if (door.x < player.x && player.x < door.x + door.width &&
        door.y < player.y && player.y < door.y + door.height &&
        door.unlocked) {
            victoryCondition = true;
        }*/

        if (door.unlocked && ((door.y < player.y && player.y-player.height < door.y) ||
        (door.y+door.height > player.y-player.height && player.y > door.y+door.height)) &&
        door.x <= player.x && player.x <= door.x+door.width) { // if player reaches door AND door is unlocked
            victoryCondition = true; // you win!
        }
}

// function to check if player died
function playerAlive9() {
    hazardCollided = false;
    index = 0;

    // test for enemy collision

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
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
function isWin9() {
    door.unlocked = arrEqual(currentSequence, winSequence) && groundCollided;
}

// function to display end screen
function endScreen9() {
    renderCanvas9();

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        successOneButton.hidden = false;

        document.removeEventListener("keydown",keyDown);
        document.removeEventListener("keyup",keyUp);
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
        playAgainButton.hidden = false;
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);
}



// ok here we go with the actual game
function start9() {
    init9();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 450;
    ctx.canvas.width = 550;
    createPlatforms9();
    createSpikes9();
    document.addEventListener("keydown",keyDown9);
    document.addEventListener("keyup",keyUp9);
    // timePassed = 0;

    window.requestAnimationFrame(gameLoop9);
}

/*
function startAgain9() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas9();
    //window.requestAnimationFrame(gameLoop);
}*/

function gameLoop9(timeStamp) {
    // render everything
    renderCanvas9();
    //renderLadder9();
    renderPlayer9();
    renderStarKey9();
    renderDoor9();
    renderGround9();
    renderSpikes9();
    renderPlatforms9();
    //checkLadderClimb9();
    // timePassed += Math.round(timeStamp / 1000);
    // timer.innerHTML = "Timer: " + timePassed;

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
    checkCollisions9();
    checkKeyCollection9();
    playerAlive9();

    // if win condition is met, end game
    isWin9();
    openDoor9();

    if (victoryCondition || !isPlayerAlive || isOver) gameOver9();

    else window.requestAnimationFrame(gameLoop9);
}

function gameOver9() {
    cancelAnimationFrame(gameLoop9);
    endScreen9();
    init9();
}



var comboMotor1Task1 = { // need start, render, gameloop?, end
    type: jsPsychGame,
    start: start9,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "comboM1T1"
}
