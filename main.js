const canvas = document.getElementById('canvas1'); 
const ctx = canvas.getContext('2d'); 
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 

const collisionCanvas = document.getElementById('collisionCanvas'); 
const collisionCtx = collisionCanvas.getContext('2d'); 
collisionCanvas.width = window.innerWidth; 
collisionCanvas.height = window.innerHeight; 

const bg_img = new Image(); 
bg_img.src = './assets/bg1.png'; 
const target_img = new Image(30,30); 
target_img.src = './assets/gun-target.png'; 
const life_img = new Image(40,40); 
life_img.src = './assets/life.png';
const score_img = new Image(40,40); 
score_img.src = './assets/score.png';
const gameover_sound = new Audio(); 
gameover_sound.src = './assets/fast-game-over.wav'; 
const shoot_sound = new Audio(); 
shoot_sound.src = './assets/shoot.ogg'; 
const bg_sound = new Audio(); 
bg_sound.src = './assets/bg_sound.ogg'; 

let LIFE = 5; 
let SCORE = 0; 
let LEVEL = 1; 

let lastTime = 0; 
let enemyInterval = 800; 
let timeToNextEnemy = 0; 

let enemies = [];
let enemiesGetShoooted = []; 
let detectPixelColor; 

const mouse = { 
    x : undefined,
    y : undefined
}

canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    var canvasX = Math.round(e.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    var canvasY = Math.round(e.clientY - cRect.top);         // positions to get make (0,0) the top left of the 
 
    mouse.x = canvasX; 
    mouse.y = canvasY;
});

bg_sound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.volume = 0.05
    this.play();
}, false);

window.addEventListener('click', function(e) { 
    shoot_sound.currentTime = 0; 
    shoot_sound.play(); 
    detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1); 
    // console.log(detectPixelColor); 
    let clickColor = detectPixelColor.data; 
    // console.log(clickColor); 
    enemies.forEach(Object => {
        if (
            Object.randomColor[0] === clickColor[0]
            && Object.randomColor[1] === clickColor[1]
            && Object.randomColor[2] === clickColor[2]
        ) { 
            Object.markedToDelete = true; 
            enemiesGetShoooted.push(new EnemyGetShooted(Object.x, Object.y, Object.scale)); 
            SCORE += 10; 
        }
    })
})

function showStats() { 
    ctx.fillStyle = '#fff'; 
    ctx.font = "20px Arial"; 
    ctx.drawImage(life_img, 20, 5, life_img.width, life_img.height); 
    ctx.fillText('x '+LIFE, 65, 30); 
    LEVEL = Math.floor(SCORE / 100) + 1; 
    //ctx.drawImage(level_img, canvas.width/2 - 20, 0, level_img.width , level_img.height);
    ctx.fillText('LEVEL ' + LEVEL, canvas.width/2 - 15 , 30);
    ctx.drawImage(score_img, canvas.width - 120, 5, score_img.width, score_img.height); 
    ctx.fillText(SCORE, canvas.width - 75, 30);
}

function isGameOver() { 
    if (
        LIFE < 1
    ) { 
        canvas.style.cursor = 'default';
        //showStats();
        gameover_sound.currentTime = 0; 
        gameover_sound.play(); 
        ctx.fillStyle = 'black'; 
        ctx.fillRect(canvas.width/2 - 150, canvas.height/2-80, 335, 120); 
        let alertmsg1 = "😵GAME OVER !!!😵" ;
        let alertmsg2 = "️YOUR SCORE WAS 🌟" + SCORE  + " 🌟"; 
        ctx.fillStyle = '#fff'; 
        ctx.font = "20px Arial"; 
        ctx.fillText(alertmsg1, canvas.width/2 - 85 , canvas.height/2-40);
        ctx.fillText(alertmsg2,canvas.width/2 - 110, canvas.height/2); 
        return true;  
    }

}

function createNewGame() { 
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    collisionCtx.clearRect(0,0,canvas.width,canvas.height); 
    ctx.drawImage(bg_img, 0, 0, canvas.width, canvas.height); 
    SCORE = 0; 
    LIFE = 15; 
    LEVEL = 1; 
    showStats(); 
}

function animate(timestamp) { 
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    collisionCtx.clearRect(0,0,canvas.width,canvas.height); 
    ctx.drawImage(bg_img, 0, 0, canvas.width, canvas.height); 
    showStats(); 
    // bg_sound.muted = true; 
    bg_sound.volume = 0.05; 
    bg_sound.play(); 
    // bg_sound.muted = false;
    // bg_sound.volume = 0.05; 
    // bg_sound.play(); 
    // if (SCORE > 0 && SCORE % 100 === 0) LEVEL ++; 
    let deltaTime = timestamp - lastTime; 
    lastTime = timestamp; 
    // console.log(deltaTime); 
    timeToNextEnemy += deltaTime; 
    if (timeToNextEnemy > enemyInterval) { 
        enemies.push(new Enemy()); 
        enemies.sort(function(a,b) { 
            return a.width - b.width; 
        });
        timeToNextEnemy = 0; 
    }
    [...enemies, ...enemiesGetShoooted].forEach(Object => Object.update(deltaTime)); 
    [...enemies, ...enemiesGetShoooted].forEach(Object => Object.draw()); 
    enemies = enemies.filter(Object => !Object.markedToDelete); 
    enemiesGetShoooted = enemiesGetShoooted.filter(Object => !Object.markedToDelete); 
    ctx.drawImage(target_img, mouse.x - target_img.width/2, mouse.y - target_img.height/2, target_img.width, target_img.height); 
    isGameOver(); 
    if (isGameOver()) return; 
    requestAnimationFrame(animate); 
}

animate(0); 

