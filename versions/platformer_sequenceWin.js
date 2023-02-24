/* NUMBER 5: PLATFORM SEQUENCE WIN

    win by jumping on platforms

    * so the win sequence works, but for some reason 
        it takes so long for the doorunlocked thing to register. 
        i didn't have this issue w the old howtounlock.js file before
        so maybe i'm missing a code difference somewhere?

    * would also like to figure out how to make the platforms
        change color every time you jump on them, that'd be greattttt
    * ^ changed this to having the platform turn green if correct
        and red if not
        * as long as there's SOME visual indication i think it's okay?
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
var hintButton;
var hintGif;
var hintUsed = false;
var instructionsField;
var numberOfDeaths = 0;
var initialTimeCollected = false;
var startTime = 0;


window.addEventListener("load", init5);

function init5() {
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

    hintButton = document.getElementById("hint");
    hintGif = document.getElementById("hintAnimation");
    hintGif.src = "hints/sequence_win.gif";

}

// render canvas
function renderCanvas5() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 300);
}

// render player
function renderPlayer5() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder5() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey5() {
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
function renderDoor5() {
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
function createSpikes5() {
    // spike on first platform
    spikes.push({x: 230, y: 200, width: 20, height: 10});

    // spike on starkey platform
    spikes.push({x: 215, y: 50, width: 20, height: 10});
}

// render spikes
function renderSpikes5() {
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
function renderGround5() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms5() {
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
function renderPlatforms5() {
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

// function to check for collisions
function checkCollisions5() {
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
function checkLadderClimb5() {
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
function checkKeyCollection5() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            //door.unlocked = true;
        }
}

// 

// function to check if door is reached
function openDoor5() {
    /*if (door.x < player.x && player.x < door.x + door.width &&
        door.y < player.y && player.y < door.y + door.height &&
        door.unlocked) {
            victoryCondition = true;
        }*/

        if (door.unlocked && ((door.x < player.x && player.x-player.width < door.x) ||
        (door.x+door.width > player.x-player.width && player.x > door.x+door.width)) &&
        door.y <= player.y && player.y <= door.y+door.height) { // if player reaches door AND door is unlocked
            victoryCondition = true; // you win!
        }
}

// function to check if player died
function playerAlive5() {
    hazardCollided = false;
    index = 0;

    // test for enemy collision

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
        /*if (spikes[ctr].x < player.x && player.x < spikes[ctr].x+spikes[ctr].width &&
            spikes[ctr].y < player.y && player.y < spikes[ctr].y-spikes[ctr].height) {
                hazardCollided = true;
                break;
            }*/

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
function isWin5() {
    door.unlocked = arrEqual(currentSequence, winSequence) && groundCollided;
}

// function to display end screen
function endScreen5() {
    renderCanvas5();

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
        successOneButton.hidden = false;

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

    //playAgainButton.removeAttribute("hidden");
    //playAgainButton.style.visibility = "visible";
}


// ok here we go with the actual game
function start5() {
    init5();
    //startButton.style.display = "none";
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 300;
    ctx.canvas.width = 550;
    createPlatforms5();
    createSpikes5();
    document.addEventListener("keydown",keyDown);
    document.addEventListener("keyup",keyUp);
    // timePassed = 0;

    window.requestAnimationFrame(gameLoop5);
}

function startAgain5() {
    playAgainButton.hidden = true;
    renderCanvas5();
    //window.requestAnimationFrame(gameLoop);
}

function gameLoop5(timeStamp) {
    // render everything
    renderCanvas5();
    //renderLadder5();
    renderPlayer5();
    renderStarKey5();
    renderDoor5();
    renderGround5();
    renderSpikes5();
    renderPlatforms5();
    
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
    checkCollisions5();
    checkKeyCollection5();
    playerAlive5();

    // if win condition is met, end game
    isWin5();
    openDoor5();

    if ((timeStamp - startTime) >= 240000 && !hintUsed) {
        hintButton.hidden = false;
        hintUsed = true;
    } 

    if (victoryCondition || !isPlayerAlive || isOver) gameOver5();

    else window.requestAnimationFrame(gameLoop5);
}

function gameOver5() {
    cancelAnimationFrame(gameLoop5);
    endScreen5();
    init5();
}

function isGameWon(){
    //return (victoryCondition || !isPlayerAlive);
    return victoryCondition;
}

var sequenceWinLevel = { // need start, render, gameloop?, end
    type: jsPsychGame,
    start: start5,
    //loop: function(){},
    gameWon: isGameWon,
    verName: "sequenceWin"
}

