class Enemy { 
    constructor() { 
        this.spriteWidth = 534; 
        this.spriteHeight = 419;
        this.frameX = 0; 
        this.maxFrameX = 7; 
        this.scale = Math.random() * 0.3 + 0.2;  
        this.width = this.spriteWidth * this.scale; 
        this.height = this.spriteHeight * this.scale; 
        this.x = - this.width; 
        this.y = Math.random() * (canvas.height - this.height); 
        this.speed = (Math.random() * 2 + 3) + (Math.floor(SCORE / 100)); 
        this.speedX = this.speed ; 
        this.speedY = this.speed * (Math.random() * 2 - 1); 
        this.markedToDelete = false; 
        this.image = new Image() ; 
        this.image.src = './assets/bat.png'; 
        this.timeSinceLastFrame = 0;  
        this.frameInterval = Math.floor(300 / this.speed);
        this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]; 
        this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')'; 
    }

    update(deltaTime) { 
        this.x += this.speedX; 
        this.y += this.speedY; 
        if (this.y <= 0 || this.y + this.height >= canvas.height) { 
            this.speedY *= -1; 
        } 
        if (this.x > canvas.width ) { 
            this.markedToDelete = true; 
            LIFE --; 
        }
        this.timeSinceLastFrame += deltaTime; 
        if (this.timeSinceLastFrame > this.frameInterval) { 
            this.frameX ++; 
            if (this.frameX > this.maxFrameX) this.frameX = 0; 
            this.timeSinceLastFrame = 0; 
        }
    }

    draw() { 
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.strokeStyle = this.color;  
        // ctx.strokeRect(this.x, this.y, this.width, this.height); 
        ctx.drawImage(this.image,this.spriteWidth * this.frameX, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); 
    }
}