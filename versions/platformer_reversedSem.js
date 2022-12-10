/* TO DO LIST:
    * reversed semantics
    * let's see if we can get the images to work lmao
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
var instructionsField;
var timer;
var timePassed = 0;


window.addEventListener("load", init);

function init() {
    startButton = document.getElementById("startButton");
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
    isOver = false;
    victoryCondition = false;
    timer = document.getElementById("timer");
    playAgainButton = document.getElementById("playAgain");

}

// render canvas
// this is taken from educate.io
function renderCanvas() {
    //ctx.fillStyle = "#F0F8FF";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1000, 550);
}

// render player
// this is taken from educate.io
function renderPlayer() {
    ctx.fillStyle = "#F08080";
    ctx.fillRect((player.x)-25, (player.y)-25, player.width, player.height);
}

// render ladder
function renderLadder() {
    ctx.fillStyle = "brown";
    ctx.fillRect(ladder.x, ladder.y, ladder.width, ladder.height);
}

// render starkey
function renderStarKey() {
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
function renderDoor() {
    ctx.fillStyle = "green";
    ctx.fillRect(door.x, door.y, door.width, door.height);
}

// create spikes
function createSpikes() {
    // spike on first platform
    spikes.push({x: 230, y: 200, width: 20, height: 25});

    // spike on starkey platform
    spikes.push({x: 215, y: 50, width: 20, height: 25});
}

// render spikes
function renderSpikes() {
    for (ctr=0; ctr<spikes.length; ctr++) {
        ctx.strokeSyle = "#000";
        ctx.beginPath();
        ctx.moveTo(spikes[ctr].x, spikes[ctr].y);
        ctx.lineTo(spikes[ctr].x+(spikes[ctr].width/2), spikes[ctr].y-spikes[ctr].height);
        ctx.lineTo(spikes[ctr].x+spikes[ctr].width, spikes[ctr].y);
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
function renderGround() {
    ctx.fillStyle = "black";
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// create platforms
function createPlatforms() {
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
function renderPlatforms() {
    //ctx.fillStyle = "#45597E";
    for (ctr=0; ctr<numPlatforms; ctr++) {
        ctx.fillStyle = platforms[ctr].color;
        ctx.fillRect(platforms[ctr].x, platforms[ctr].y, platforms[ctr].width, platforms[ctr].height);
    }
    //ctx.fillRect(platforms[0].x, platforms[0].y, platforms[0].width, platforms[0].height);
    //ctx.fillRect(platforms[1].x, platforms[1].y, platforms[1].width,platforms[1]. height);
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
            player.y_v = -10; // not fully sure what this is doing
        }

        if (player.climb) {
            keys.up = true;
            //player.y_v = 2.5;
        }
    }

    // down arrow key
    if (e.keyCode == 40) {
        if (player.climb) {
            keys.down = true;
            //player.y_v = 2.5;
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
            player.y_v = -3; // not fully sure about this either?
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
function checkCollisions() {
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
        player.y = platforms[index].y;
    }

    else if (ground.y < player.y && player.y < ground.y+ground.height) {
        player.jump = false;
        player.y = ground.y;
    }
}

// function for climbing the ladder
function checkLadderClimb() {
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
function checkKeyCollection() {
    if (starkey.x < player.x && player.x < starkey.x+(starkey.outerRadius*2) &&
        starkey.y < player.y && player.y < starkey.y+(starkey.outerRadius*2)) {
            starkey.collected = true;
            door.unlocked = true;
        }
}

// function to check if door is reached
function openDoor() {
    if (door.x < player.x && player.x < door.x + door.width &&
        door.y < player.y && player.y < door.y + door.height &&
        door.unlocked) {
            victoryCondition = true;
        }
}

// function to check if player died
function playerAlive() {
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
    //console.log(index, spikes[index].y-spikes[index].height, player.y, spikes[index].y);

}

// function to check win condition
function isWin() {
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
function endScreen() {
    renderCanvas();
    //playAgainButton.style.visibility = "visible";

    ctx.fillStyle = "black";
    ctx.font = "48px arial";
    ctx.textBaseline = "middle";
    if (victoryCondition) {
        ctx.fillText("Success!", 50, 100);
    }

    else if (!isPlayerAlive) {
        ctx.fillText("You have died.", 50, 100);
        ctx.fillText("Please try again.", 50, 150);
    }

    else ctx.fillText("Incorrect sequence. Please try again.", 50, 100);

    playAgainButton.removeAttribute("hidden");
    //playAgainButton.style.visibility = "visible";
}



// ok here we go with the actual game
function start() {
    startButton.style.display = "none";
    //playAgainButton.style.visibility = "hidden";
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    ctx.canvas.height = 550;
    ctx.canvas.width = 1000;
    createPlatforms();
    createSpikes();
    //createCoins();
    document.addEventListener("keydown",keyDown);
    document.addEventListener("keyup",keyUp);
    //setInterval(gameLoop,22);
    timePassed = 0;

    window.requestAnimationFrame(gameLoop);

    /*instructionsField = document.createElement("textarea");
    instructionsField.setAttribute("value", "Hello World!");
    instructionsField.style.position = "absolute";
    instructionsField.style.height = "200px";
    instructionsField.style.left = "500px";
    instructionsField.style.top = "10px";
    document.body.appendChild(instructionsField);*/

}

function startAgain() {
    playAgainButton.style.visibility = "hidden";
    renderCanvas();
    //window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // render everything
    renderCanvas();
    renderLadder();
    renderPlayer();
    renderStarKey();
    renderDoor();
    renderGround();
    renderSpikes();
    renderPlatforms();
    //renderCoins();
    checkLadderClimb();
    timePassed += Math.round(timeStamp / 1000);
    timer.innerHTML = "Timer: " + timePassed;

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

    /*if (keys.up) {
        player.y_v = -2.5;
        player.climb = false;
    }

    if (keys.down) {
        player.y_v = 2.5;
        player.climb = false;
    }*/

    if (keys.right) {
        player.x_v = 2.5;
    }

    // update player's coordinates
    player.x += player.x_v;
    player.y += player.y_v;
    //console.log(player.climb)

    //player.climb = false;

    // check for collisions with platform
    checkCollisions();
    //checkLadderClimb();
    //checkCoinCollisions();
    checkKeyCollection();
    playerAlive();

    // if win condition is met, end game
    //isWin();
    openDoor();
    //console.log(currentSequence, victoryCondition);
    /*if (victoryCondition) {
        //renderCoins();
        cancelAnimationFrame(gameLoop); 
        // render some kind of win text
        endScreen();
        playAgainButton.style.visibility = "visible";
    }

    else if (!isPlayerAlive || isOver) {
        //renderCoins();
        cancelAnimationFrame(gameLoop);
        // render some kind of loss text + a try again thing
        endScreen();
        playAgainButton.style.visibility = "visible";
        
    }*/

    if (victoryCondition || !isPlayerAlive || isOver) gameOver();

    else window.requestAnimationFrame(gameLoop);
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    endScreen();
    init();
}



