const canvas = document.getElementById('canvas0')
const c = canvas.getContext('2d')
const platformImg = document.getElementById('platform')
const playerImg = document.getElementById('playerImage0')
const background = document.getElementById('background')
const tap = document.getElementById('tap')
const florida = document.getElementById('florida')

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5

class InputHandler {
    constructor() {
        this.keys = {
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

        addEventListener('keydown', ({ key }) => {
            switch (key) {
                case 'ArrowLeft':
                    this.keys.left.pressed = true;
                    break;
                case 'ArrowRight':
                    this.keys.right.pressed = true;
                    break;
                case 'ArrowUp':
                    this.keys.up.pressed = true;
                    break;
            }
        });
        
        addEventListener('keyup', ({ key }) => {
            switch (key) {
                case 'ArrowLeft':
                    this.keys.left.pressed = false;
                    break;
                case 'ArrowRight':
                    this.keys.right.pressed = false;
                    break;
                case 'ArrowUp':
                    this.keys.up.pressed = false;
                    break;
            }
        });
    }
}

class Player {
    constructor(game) {
        this.x = 100;
        this.y = 50;

        this.vx = 0;
        this.vy = 1;

        this.width = 34;
        this.height = 54;

        this.frameX = 0;
        this.frameY = 0;

        this.maxFrame = 3;
        this.fps = 1000 / 20;

        this.isJumping = false;

        this.speed = 10;
        this.jumpSpeed = 15;

        this.game = game;
        this.input = this.game.input;

        this.canMove = {
            left: true,
            right: true,
            up: true,
            down: true,
            actor: this,
            clear() {
                this.left = true
                this.right = true
                this.up = true
                this.down = true
            }
        }
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.x,this.y,this.width,this.height)
        c.drawImage(playerImg, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
    }

    update() {
        this.game.platforms.forEach(platform => {
            // if player between platform.x and platform.x + width
            if (this.x + this.width >= platform.x &&
                this.x <= platform.x + platform.width) {

                // if collide with bottom of platform
                if (this.y <= platform.y + platform.height &&
                    this.y >= platform.y) {
                    this.canMove.up = false;

                // on top of platform
                } else if (this.y + this.height <= platform.y &&
                    this.y + this.height + this.vy >= platform.y) {
                    
                    this.canMove.down = false;
                }

            } else {

                let shorterObj;
                let tallerObj;
                if (this.height < platform.height) {
                    shorterObj = this
                    tallerObj = platform
                } else {
                    shorterObj = platform
                    tallerObj = this
                }
                
                if (shorterObj.y + shorterObj.height >= tallerObj.y &&
                    shorterObj.y <= tallerObj.y + tallerObj.height) {
                        // console.log(shorterObj)
                        // console.log(tallerObj)

                        if (this.x + this.width >= platform.x - this.speed &&
                            this.x + this.width < platform.x) {
                            console.log('hit right')
                            this.canMove.right = false;
                        } 
                        if (this.x <= platform.x + platform.width + this.speed &&
                            this.x > platform.x + platform.width) {
                            console.log('hit left')
                            this.canMove.left = false;
                        }
                    }
            }


        })

        // gravity
        if (this.y + this.vy <= 0)
            this.vy = 0

        else if (this.y + this.height + this.vy <= canvas.height)
            this.vy += gravity; 
        else
            this.vy =   0

        if (!this.canMove.up && this.vy < 0) {
            this.vy = -gravity;
        }
    
        if (this.canMove.up && this.input.keys.up.pressed) {
            if (!this.isJumping && this.y >= 0) {
                this.vy = -this.jumpSpeed;
                this.isJumping = true;
            }     
        }
    
        if (!this.canMove.down && this.vy > 0) {
            this.vy = 0;
            this.isJumping = false;
        }
    
    
        if (this.input.keys.right.pressed) {
            this.frameY = 0;
            if (this.game.dt > this.game.fps) {
                this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0
            }
            
        } else if (this.input.keys.left.pressed) {
            this.frameY = 1;
            if (this.game.dt > this.game.fps) {
                this.frameX = this.frameX < this.maxFrame ? this.frameX + 1 : 0
            }
        } else {
            this.frameX = 0;
        }
    
        if (this.vy !== 0) {
            this.frameX = 1;
        }
    
        this.draw();
        this.y += this.vy;
        this.x += this.vx;
    }
}

class Platform {
    constructor({ x,y,width,height,image }) {
        this.x = x;
        this.y = y;

        this.width = image ? image.width : width;
        this.height = image ? image.height : height;

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

        this.width = image ? image.width : width;
        this.height = image ? image.height : height;

        this.image = image;

        this.speed = 3;
    }

    draw() {
        c.fillStyle = '#ff66a3'
        if (this.image)
            c.drawImage(this.image,this.x,this.y,this.width,this.height)
        else
            c.fillRect(this.x,this.y,this.width,this.height)
    }
}

class Game {
    constructor() {
        this.input = new InputHandler()
        this.player = new Player(this);
        this.scrollOffset = 0;
        this.lastTime = 0;
        this.dt = 0;
        this.fps = 100;

        this.init()
    }

    init() {
        
        this.gameBackground = new GenericObject({ x: -1, y: -1, width: canvas.width, height: canvas.height, image: background })
        this.genericObjects = [
            new GenericObject({ x: 700, y: canvas.height - 300 - 30, image: tap }),
            new GenericObject({ x: 1700, y: canvas.height - 300 - 30, image: florida })
        ]
        this.platforms = [
            new Platform({ x: 200, y: canvas.height - 100, width: 300, height: 100 }),
            new Platform({ x: 0, y: canvas.height - 30, width: 10000, height: 30 }),
            new Platform({ x: 500, y: canvas.height - 200, width: 300, height: 20 }),
            new Platform({ x: 1000, y: canvas.height - 300, width: 300, height: 20 }),
            new Platform({ x: 1500, y: canvas.height - 300, width: 300, height: 20 }),
            new Platform({ x: 4000, y: canvas.height - 600, width: 300, height: 600 }),
            new Platform({ x: 3600, y: canvas.height - 100, width: 100, height: 15 }),
            new Platform({ x: 3900, y: canvas.height - 300, width: 100, height: 15 }),
            new Platform({ x: 3600, y: canvas.height - 500, width: 100, height: 15 })
        ]
        this.player = new Player(this);
    }

    update(ts) {
        requestAnimationFrame(this.update.bind(this));
        c.clearRect(0,0,canvas.width,canvas.height)
        this.gameBackground.draw();

        this.genericObjects.forEach(go => {
            go.draw()
        })

        this.platforms.forEach(platform => {
            platform.draw()
        })

        this.dt = ts - this.lastTime
        if (this.dt > this.fps) {
            this.lastTime = ts;
        }

        this.player.update();

        if (this.input.keys.right.pressed && this.player.canMove.right && this.player.x < 400) {
            this.player.vx = this.player.speed;
        } else if (this.input.keys.left.pressed && this.player.canMove.left && this.player.x > 100) {
            this.player.vx = -this.player.speed;
        } else {
            this.player.vx = 0;
    
            
            this.platforms.forEach(platform => {
                if (this.input.keys.right.pressed && this.player.canMove.right) {
                    platform.x -= this.player.speed
                    this.scrollOffset += this.player.speed
                } else if (this.input.keys.left.pressed && this.player.canMove.left && this.scrollOffset >= 0) {
                    platform.x += this.player.speed
                    this.scrollOffset -= this.player.speed
                }
            })
    
            this.genericObjects.forEach(go => {
                if (this.input.keys.right.pressed && this.player.canMove.right) {
                    go.x -= this.player.speed * 0.6
                } else if (this.input.keys.left.pressed && this.player.canMove.left && this.scrollOffset >= 0) {
                    go.x += this.player.speed * 0.6
                }
            })
        }

        this.player.canMove.clear();

        c.fillStyle = 'black';
        c.font = '40px Helvetica';
        c.fillText(this.scrollOffset,50,50)
    }
}



const game = new Game();
game.update()



