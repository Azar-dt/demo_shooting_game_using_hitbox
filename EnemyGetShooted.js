class EnemyGetShooted { 
    constructor (x, y, scale) {
        this.spriteWidth = 534; 
        this.spriteHeight = 419;
        this.frameX = 0; 
        this.maxFrameX = 7;  
        this.scale = scale; 
        this.width = this.spriteWidth * this.scale; 
        this.height = this.spriteHeight * this.scale; 
        this.x = x;
        this.y = y; 
        this.markedToDelete = false; 
        this.image = new Image(); 
        this.image.src = './assets/bat_hurt.png'; 
        this.timeSinceLastFrame = 0; 
        this.frameInterval = 50; 
    } 

    update(deltaTime) { 
        this.timeSinceLastFrame += deltaTime; 
        if (this.timeSinceLastFrame > this.frameInterval) { 
            this.frameX ++; 
            if (this.frameX > this.maxFrameX) { 
                this.markedToDelete = true; 
            }
            this.timeSinceLastFrame = 0; 
        }
    }

    draw() { 
        ctx.drawImage(this.image,this.spriteWidth * this.frameX, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height); 
    }
}