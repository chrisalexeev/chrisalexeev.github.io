const lvl = `........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
........................................................................................................................................
..................................................................................#####################.................................
..................................................................................#####################.................................
..................................................................................########################################..............
..................................................................................########################################..............
..................................................................................#####################.................##..............
.....................................#######################......................#####################.................##..............
.....................................#######################......................#####################.........$$......##..............
..................................................................................#####################.........##......##..............
..................................................................................#####################.................##..............
...................................................########################.......#####################..#########......##..............
.............................###...................########################.......#####################.................####............
.............................###..................................................#####################............#########............
.............................###.............................................##########################.................................
.............................###.....................................###########################################........................
.............................###......................#################################################.................................
####################################################################################################################################`
const playerImg = document.getElementById('playerImage0');
console.log(playerImg)

class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener('keydown', e => {
            if ((   e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && !this.keys.includes(e.key)) {
                this.keys.push(e.key)
            }
        });
        window.addEventListener('keyup', e => {
            if (    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }
        })
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('canvas0');
        this.canvas.width = innerWidth ;
        this.canvas.height = innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.sprites = [];
        this.board = [];

        this.gravity = 0.5;
        this.input = new InputHandler()
        this.lastRefreshTime = Date.now()

        this.init(lvl)
        this.refresh()
        
    }

    init(lvl) {
        this.board = createLevel(lvl,this.ctx);
        this.player = new Player({
            x: 100,
            y: 100,
            width: 54,
            height: 54,
            image: playerImg,
            game: this,
            ctx: this.ctx,
            input: this.input
        })
    }

    refresh() {
        const now = Date.now();
        const dt = (now - this.lastRefreshTime) / 1000.0;

        this.update(dt);
        this.draw();

        this.lastRefreshTime = now;

        const game = this;
        requestAnimationFrame(function() {
            game.refresh();
        });


    }

    update(dt) {
        this.player.update(dt)
        // console.log(dt)
    }

    draw() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.player.draw();
        
        this.board.forEach(b => {
            b.draw()
            // console.log(b)
        })

        for (let sprite of this.sprites) {
            sprite.draw();
        }
    }
}

class GameObject {
    constructor(options) {
        this.ctx = options.ctx;
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
    }

    draw() {}
    update() {}

    static hitTest(a,b) {
        const vya = a.vy ? a.vy : 0;
        const vyb = b.vy ? b.vy : 0;
        if (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y + vya < b.y + b.height + vyb &&
            a.height + a.y + vya > b.y + vyb) {
            // collision detected!
            return true
        } else {
            // no collision
            return false
        }
    }
    
}

class Block extends GameObject {
    constructor(options) {
        super(options)
    }

    draw() {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}

class Player extends GameObject {
    constructor(options) {
        super(options)

        this.vx = 0;
        this.vy = 1;

        this.frameX = 0;
        this.frameY = 0;

        this.maxFrame = 3;
        this.fps = 20;

        this.speed = 5;
        this.jumpSpeed = 15

        this.image = options.image;
        this.game = options.game;

        this.input = options.input;
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.x,this.y,this.width,this.height)
        this.ctx.drawImage(
            this.image,
            this.frameX * this.width,
            this.frameY * this.height,
            this.width, this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }

    update(dt) {
        this.draw();
        this.y += this.vy;
        this.x += this.vx;

        if (this.input.keys.includes('ArrowRight')) {
            this.frameY = 0;
            this.vx = 5;  
        } else if (this.input.keys.includes('ArrowLeft')) {
            this.frameY = 1;
            this.vx = -5;
        } else {
            this.vx = 0
        }

        if (this.input.keys.includes('ArrowUp')) {
            this.vy -= 5;
        }

        // gravity handling
        if (this.y + this.vy <= 0)
            this.vy = 0

        else if (this.y + this.height + this.vy <= this.game.canvas.height)
            this.vy += this.game.gravity;

        
        this.game.board.forEach(block => {
            // console.log('hit')
            if (GameObject.hitTest(this,block)) {
                
                if (this.x + this.width >= block.x &&
                    this.x <= block.x + block.width) {
                // if player hits top of block, vy = 0
                    if (this.y + this.height + this.vy >= block.y) {

                        this.vy = 0;

                    } else if (this.y <= block.y + block.height) {

                        this.y = block.y + block.height - 1
                        this.vy = 0;
                        
                    } 
                }

                if (block.y >= this.y &&
                    block.y + block.height <= this.y + this.height + this.vy) {
                    // if player hits left 
                    if (this.x + this.width >= block.x) {

                        this.x = block.x - this.width - 1
                        this.vx = 0
                    }
                    // or right side of a block, vx = 0
                    if (this.x <= block.x + block.width) {

                        this.x = block.x + block.width + 1
                        this.vx = 0
                    }
                }
            }
        })
    }
}

function createLevel(levelStr,ctx) {
    const empty = '.';
    const block = '#';
    const win = '$';
  
    const board = [];
  
    const split = levelStr.split('\n');
    
    for (let row = 0; row < split.length; row++) {
        const rowSplit = split[row].split('');
        for (let col = 0; col < rowSplit.length; col++) {
            switch (rowSplit[col]) {
                case block:
                    board.push(new Block({
                        x: col * 10,
                        y: row * 20,
                        width: 10,
                        height: 20,
                        ctx: ctx
                    }));
                    break;
                default:
                    break;
            }
        }
    }

    return board;
}

const game = new Game();