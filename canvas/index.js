const canvas = document.getElementById('canvas0')
const c = canvas.getContext('2d')
const platformImg = document.getElementById('platform')
const playerImg = document.getElementById('playerImage0')
const background = document.getElementById('background')

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5

class Player {
    constructor() {
        this.x = 100;
        this.y = 50;

        this.vx = 0;
        this.vy = 1;

        this.width = 54;
        this.height = 54;

        this.frameX = 0;
        this.frameY = 0;

        this.maxFrame = 3;
        this.fps = 1000 / 20;

        this.isJumping = false;

        this.speed = 5;
        this.jumpSpeed = 15
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.x,this.y,this.width,this.height)
        c.drawImage(playerImg, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    update() {
        this.draw();
        this.y += this.vy;
        this.x += this.vx;

        if (this.y + this.vy <= 0)
            this.vy = 0

        else if (this.y + this.height + this.vy <= canvas.height)
            this.vy += gravity; 
        else
            this.vy =   0
    }
}

class Platform {
    constructor({ x,y,width,height,image }) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.image = image;
    }

    draw() {
        c.fillStyle = '#ff66a3'
        if (this.image)
            c.drawImage(this.image,this.x,this.y)
        else
            c.fillRect(this.x,this.y,this.width,this.height)
    }
}

class GenericObject {
    constructor({ x,y,width,height,image }) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;

        this.image = image;
    }

    draw() {
        c.fillStyle = '#ff66a3'
        if (this.image)
            c.drawImage(this.image,this.x,this.y,this.width,this.height)
        else
            c.fillRect(this.x,this.y,this.width,this.height)
    }
}

const player = new Player();
const gameBackground = new GenericObject({ x: -1, y: -1, width: canvas.width, height: canvas.height, image: background })
const genericObjects = [
    
]
const platforms = [
    new Platform({ x: 0, y: canvas.height - 30, width: 10000, height: 30 }),
    new Platform({ x: 500, y: canvas.height - 200, width: 300, height: 20, image: platformImg }),
    new Platform({ x: 1000, y: canvas.height - 300, width: 300, height: 20, image: platformImg })
]
const keys = {

    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}
player.update();

let scrollOffset = 0;
let lastTime = 0;
let dt = 0;
let fps = 100


function animate(ts) {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height)
    gameBackground.draw();

    genericObjects.forEach(go => {
        go.draw()
    })

    dt = ts - lastTime
    if (dt > fps) {
        lastTime = ts;
    }
    

    platforms.forEach(platform => {
        platform.draw()
        if (player.y + player.height <= platform.y &&
            player.y + player.height + player.vy >= platform.y &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platform.width) {
            player.vy = 0;
            player.isJumping = false;
        }
    })
    
    player.update();
    if (keys.right.pressed) {
        player.frameY = 0;
        if (dt > fps) {
            player.frameX = player.frameX < player.maxFrame ? player.frameX + 1 : 0
        }
        
    } else if (keys.left.pressed && scrollOffset >= player.speed) {
        player.frameY = 1;
        if (dt > fps) {
            player.frameX = player.frameX < player.maxFrame ? player.frameX + 1 : 0
        }
    } else {
        player.frameX = 0;
    }

    if (keys.right.pressed && player.x < 400) {
        player.vx = player.speed;
    } else if (keys.left.pressed && player.x > 100 && scrollOffset >= player.speed) {
        player.vx = -player.speed;
    } else {
        player.vx = 0;

        
        platforms.forEach(platform => {
            if (keys.right.pressed) {
                platform.x -= player.speed
                scrollOffset += player.speed
            } else if (keys.left.pressed && scrollOffset >= player.speed) {
                platform.x += player.speed
                scrollOffset -= player.speed
            }
        })
    }

    c.fillStyle = 'black';
    c.font = '40px Helvetica';
    c.fillText(scrollOffset,50,50)
}

animate()

addEventListener('keydown', ({ key }) => {

    switch (key) {
        case 'ArrowLeft':
            keys.left.pressed = true;
            break;
        case 'ArrowRight':
            keys.right.pressed = true;
            break;
        case 'ArrowUp':
            if (!player.isJumping && player.y >= 0) {
                player.vy = -player.jumpSpeed;
                player.isJumping = true;
            }
            keys.up.pressed = true;
            break;
    }
});

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':

            keys.left.pressed = false;
            break;
        case 'ArrowRight':

            keys.right.pressed = false;
            break;
        case 'ArrowUp':
            keys.up.pressed = false;
            break;
    }
});