/* NUMBER 3: REVERSED SEMANTICS
    * the spikes will be stars
    * the star will be foe (just gotta get THIS png to work)
    * the door will be spike
    * */
   
// variables
var player;
var ground;
var numPlatforms;
var platforms;
var ladder;
var starkey;
const ghost = new Image();
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


window.addEventListener("load", init3);

function init3() {
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
    starkey = { // now a ghost/foe
        image: ghost,
        x: 150, 
        y: 15,
        width: 30,
        height: 30,
        collected: false
    }

    /* original starkey 
    starkey = {
        x: 170,
        y: 30,
        spikes: 5, 
        outerRadius: 20,
        innerRadius: 10,
        collected: false
    };*/

    /* original door
    door = {
        x: 340,
        y: 85,
        width: 30, 
        height: 40,
        unlocked: false
    };*/

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
    playAgainButton = document.getElementById("playAgain");
    successOneButton = document.getElementById("successOne");

    hintButton = document.getElementById("hint");
    hintGif = document.getElementById("hintAnimation");
    hintGif.src = "hints/reversed_sem.gif";

}

// render canvas
function renderCanvas3() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 550, 300);
}

// render player
function renderPlayer3() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder3() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey3() {
    // png render
    ctx.drawImage(starkey.image, starkey.x, starkey.y, starkey.width, starkey.height);
}

// render door
function renderDoor3() {
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
function createSpikes3() {
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
function renderSpikes3() {
    var rot = Math.PI / 2 * 3;
    var step = Math.PI / 5;

    for (ctr=0; ctr<spikes.length; ctr++) {
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

// render ground
function renderGround3() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms3() {
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
function renderPlatforms3() {
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
}

// function for when a key is pressed
function keyDown3(e) {
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
function keyUp3(e) {
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
function checkCollisions3() {
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
function checkLadderClimb3() {
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
function checkKeyCollection3() {
    if (((starkey.x < player.x && player.x-player.width < starkey.x) || 
        (starkey.x+starkey.width > player.x-player.width && player.x > starkey.x+starkey.width)) &&
        starkey.y <= player.y && player.y-player.height <= starkey.y+starkey.height) {
            starkey.collected = true;
            door.unlocked = true;
        }
}

// function to check if door is reached
function openDoor3() {
    if (door.unlocked && ((door.x < player.x && player.x-player.width < door.x) || 
    (door.x+door.width > player.x-player.width && player.x > door.x+door.width)) &&
    door.y-door.height < player.y && player.y <= door.y) { // if player reaches door AND door is unlocked
            victoryCondition = true; // you win!
        }
}

// function to check if player died
function playerAlive3() {
    hazardCollided = false;
    index = 0;

    // test for spike collision
    for (ctr=0; ctr<spikes.length; ctr++) {
        
        if (spikes[ctr].x < player.x && player.x < spikes[ctr].x+(spikes[ctr].outerRadius*2) &&
            spikes[ctr].y < player.y && player.y < spikes[ctr].y+(spikes[ctr].outerRadius*2)) {
                hazardCollided = true;
                index = ctr;
                break;
        }
    }

    isPlayerAlive = !hazardCollided;
}

// function to display end screen
function endScreen3() {
    renderCanvas3();
    
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "48px open sans";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("You won!", ctx.canvas.width/2, 100);
        successOneButton.hidden = false;

        hintButton.hidden = true;
        hintGif.style.display = "none";

        document.removeEventListener("keydown",keyDown);
        document.removeEventListener("keyup",keyUp);

        jsPsych.data.get().addToAll({deaths: numberOfDeaths});
        jsPsych.data.get().addToAll({hintNeeded: hintUsed});
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You lost.", ctx.canvas.width/2, 100);
        playAgainButton.hidden = false;
        numberOfDeaths += 1;
    }
}



// ok here we go with the actual game
function start3() {
    init3();
    playAgainButton.hidden = true;
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 300;
    ctx.canvas.width = 550;
    createPlatforms3();
    createSpikes3();
    document.addEventListener("keydown",keyDown3);
    document.addEventListener("keyup",keyUp3);

    window.requestAnimationFrame(gameLoop3);
}

function startAgain3() {
    playAgainButton.hidden = true;
    renderCanvas3();
}

function gameLoop3(timeStamp) {
    // render everything
    renderCanvas3();
    renderPlayer3();
    renderDoor3();
    renderGround3();
    renderSpikes3();
    renderPlatforms3();
    if (!starkey.collected) renderStarKey3();
    
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
    checkCollisions3();
    checkKeyCollection3();
    playerAlive3();

    // if win condition is met, end game
    openDoor3();

    if ((timeStamp - startTime) >= 240000 && !hintUsed) {
        hintButton.hidden = false;
        hintUsed = true;
    } 

    if (victoryCondition || !isPlayerAlive || isOver) gameOver3();

    else window.requestAnimationFrame(gameLoop3);
}

function gameOver3() {
    cancelAnimationFrame(gameLoop3);
    endScreen3();
    init3();
}


var reversedSemLevel = { // need start, render, gameloop?, end
    type: jsPsychGame,
    start: start3,
    gameWon: isGameWon,
    verName: "reversedSem"
}

