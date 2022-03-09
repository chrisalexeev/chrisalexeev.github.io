window.onload = () => {
    const canvas = document.getElementById('canvas0');
    const ctx = canvas.getContext('2d');
    canvas.width = 720;
    canvas.height = 480;
    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = Math.random() * 1000 + 500;
    let enemies = [];
    let score = 0;
    let platforms = [];

    class InputHandler {
        constructor() {
            this.keys = []
            window.addEventListener('keydown', e => {
                if ((   e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight')
                        && this.keys.indexOf(e.key) === -1) {
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

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight - 35;
            this.width = 135;
            this.height = 135;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage0');
            this.frameX = 0;
            this.frameY = 0;
            this.vy = 0;
            this.weight = 1;
            this.maxFrame = 3;
            this.fps = 10;
            this.frameTimer = 0;
            this.vx = 0;
        }

        draw(context) {
            context.fillStyle = 'white';
            // context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)

        }

        update(input,dt) {
            if (this.frameTimer > this.frameInterval && (this.onGround() || this.isOnPlatform)) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;

            } else {
                this.frameTimer += dt;
            }

            if (input.keys.includes('ArrowRight')) {
                this.frameY = 0;
                this.speed = 5;

                
            } else if (input.keys.includes('ArrowLeft')) {
                this.frameY = 1;
                this.speed = -5;

                
            } else {
                this.speed = 0;
                if (!this.isJumping(input))
                this.frameX = 0;
            }
            if (input.keys.includes('ArrowUp')) {
                this.vy -= 20;
                this.frameX = 1;
            }
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            this.y += this.vy;
            if (this.isJumping(input)) {
                this.vy += this.weight;
            } else {
                this.vy = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }

        isJumping(input) {
            return input.keys.includes('ArrowUp');
        }
    }

    class Platform {
        constructor(x,y,width,height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        draw(context) {
            context.fillStyle = 'blue';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('background')
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y)
            context.fillStyle = 'rgba(0, 0, 0, 0.5)'
            context.fillRect(0,0,this.width,this.height)
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('enemy')
            this.width = 110;
            this.height = 100;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.speed = 8;
            this.markedForDeletion = false;
            
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }

        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    function handleEnemies(dt) {
        if (enemyTimer > enemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyInterval = enemyInterval < 200 ? 200 : enemyInterval;
            enemyTimer = 0;
        } else {
            enemyTimer += dt;
        }
        enemies.forEach(e => {
            e.draw(ctx);
            e.update();
        })
        enemies = enemies.filter(e => !e.markedForDeletion)
    }

    function handlePlatforms(context,player) {
        platforms.forEach(p => {
            p.draw(context);
            if (player.y + player.height <= p.y &&
                player.y + player.height + player.vy >= p.y &&
                player.x + player.width - 50 >= p.x &&
                player.x <= p.x + p.width - 50
                ) {
                player.vy = 0;
                player.isOnPlatform = true;
            } else {
                player.isOnPlatform = false;
            }
        })
    }

    function displayStatusText(context) {
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText(`Score ${score}`, 20, 50)
    }

    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)
    for (let i = 0; i < 5;i++) {
        platforms.push(new Platform(canvas.width - i * 120,canvas.height - i * 100,200,20))
    }

    function animate(timestamp) {
        const dt = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw(ctx);
        
        player.draw(ctx);
        player.update(input,dt);
        // handleEnemies(dt)
        handlePlatforms(ctx,player);
        displayStatusText(ctx)
        requestAnimationFrame(animate);
    }

    animate(0);
}