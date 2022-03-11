addEventListener('DOMContentLoaded',e => {
    const canvas = document.getElementById('canvas0')
    const c = canvas.getContext('2d')
    const platformImg = document.getElementById('platform')
    const playerImg = document.getElementById('playerImage0')
    const background = document.getElementById('background')
    const tap = document.getElementById('tap')
    const florida = document.getElementById('florida')
    const indy = document.getElementById('indy')
    const hearts = document.getElementById('hearts')
    const pets = document.getElementById('pets')
    const chris = document.getElementById('chris')
    const sun = document.getElementById('sun')
    const audio = document.getElementById("audio");

    addEventListener('keydown',e => {
        if (audio.paused)
            audio.play()
    })

    function loop() {
        audio.play()
    }
    
    audio.addEventListener("ended", loop, false);

    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ch = canvas.height
    c.font = '40px Helvetica';

    const gravity = 0.5;
    let hasWon = false;

    class Win {
        constructor({ x, y }) {
            this.x = x;
            this.y = y;

            this.image = chris;

            this.width = this.image.width;
            this.height = this.image.height;

            this.offsetY = 0;
            this.up = true;
        }

        draw() {
            c.drawImage(
                this.image,
                this.x,
                this.y - this.offsetY,
                this.width,
                this.height
            )
        }

        update() {
            this.draw();

            if (this.up) {
                this.offsetY += 1.5
            } else {
                this.offsetY -= 1.5
            }

            if (this.offsetY > 14) {
                this.up = false;
            } else if (this.offsetY <= 0) {
                this.up = true;
            }
        }
    }

    class Player {
        constructor() {
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

            this.speed = 6;
            this.jumpSpeed = 15

            this.offsetY = 0;
            this.up = true;

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
            c.drawImage(playerImg,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.x,
                this.y - this.offsetY,
                this.width,
                this.height
            )
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

        win() {
            this.y = ch - 84
            this.draw();

            if (this.up) {
                this.offsetY += 1.5
            } else {
                this.offsetY -= 1.5
            }

            if (this.offsetY > 14) {
                this.up = false;
            } else if (this.offsetY <= 0) {
                this.up = true;
            }

            this.frameY = 2;
            this.frameX = 0;
            
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
        constructor({ x,y,width,height,image,color }) {
            this.x = x;
            this.y = y;

            this.width = image ? image.width : width;
            this.height = image ? image.height : height;

            this.image = image;

            this.color = color ? color : '#ff66a3';
        }

        draw() {
            c.fillStyle = this.color
            if (this.image)
                c.drawImage(this.image,this.x,this.y,this.width,this.height)
            else
                c.fillRect(this.x,this.y,this.width,this.height)
        }
    }

    class GenericText {
        constructor({ x,y,width,text,size }) {
            this.x = x;
            this.y = y;
            this.size = size ? size : '40px'

            this.width = width;

            this.text = text;
        }

        wrapText(text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';

            for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = c.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                c.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
            }
            c.fillText(line, x, y);
        }

        draw() {
            c.font = `${this.size} Helvetica`;
            c.fillStyle = 'black';
            if (this.width)
                this.wrapText(this.text,this.x,this.y,this.width,40)
            else
                c.fillText(this.text,this.x,this.y,this.width)
        }
    }

    const player = new Player();
    const gameBackground = new GenericObject({ x: -1, y: -1, width: canvas.width, height: canvas.height, image: background })
    const genericObjects = [
        new GenericText({ x: 300, y: ch - 450, width: 500, text: 'To my beautiful babe,' }),
        new GenericText({ x: 900, y: ch - 450, width: 500, text: 'A lot has happened this past year.' }),
        new GenericText({ x: 1500, y: ch - 450, width: 500, text: 'We hit it off at the tap.' }),
        new GenericText({ x: 2100, y: ch - 450, width: 500, text: 'We had a wonderful trip to Florida.' }),
        new GenericText({ x:2700, y: ch - 450, width: 500, text: 'We moved to Indy.' }),
        new GenericText({ x:3300, y: ch - 450, width: 500, text: 'We faced obstacles.' }),
        new GenericText({ x:4800, y: ch - 450, width: 500, text: 'And we came out the other side of those obstacles more in love than ever.' }),
        new GenericText({ x:5400, y: ch - 450, width: 500, text: 'We\'re a team, a family, and soulmates.' }),
        new GenericText({ x:6000, y: ch - 450, width: 500, text: 'I am so happy we\'re together, and I can\'t wait to continue our life together in the years to come. I am grateful for every day we have together.' }),
        new GenericText({ x:6600, y: ch - 450, width: 500, text: 'Here\'s to you, us, and our precious children.' }),
        new GenericText({ x:7200, y: ch - 450, width: 500, text: 'Happy anniversary, darling. I love you more than anything.' }),
        

        new GenericObject({ x: 1500, y: ch - 300 - 30, image: tap }),
        new GenericObject({ x: 2100, y: ch - 300 - 30, image: florida }),
        new GenericObject({ x: 2700, y: ch - 400 - 30, image: indy }),
        new GenericObject({ x:4800, y: ch - 340, image: hearts }),
        new GenericObject({ x:6600, y: ch - 330, image: pets }),
        new GenericObject({ x:5600, y: ch - 330, image: sun }),
        new GenericText({ x:5720, y: ch - 100, width: 500, size: '16px', text: '*supposed to be a sun' }),
    ]

    const obstaclePosition = 5200;
    const platforms = [
        // new Platform({ x: 200, y: ch - 100, width: 300, height: 100 }),
        new Platform({ x: -20, y: ch - 30, width: 100000, height: 30 }),
        new Platform({ x: obstaclePosition + 500, y: canvas.height - 300, width: 300, height: 300 }),
        new Platform({ x: obstaclePosition + 500, y: canvas.height - 600, width: 300, height: 220 }),
        new Platform({ x: obstaclePosition + 200, y: canvas.height - 200, width: 100, height: 20 }),
        new Platform({ x: obstaclePosition + 800, y: canvas.height - 200, width: 300, height: 200 }),
        new Platform({ x: obstaclePosition + 1100, y: canvas.height - 500, width: 300, height: 700 }),
        new Platform({ x: obstaclePosition + 800, y: canvas.height - 400, width: 100, height: 20 }),
        new Platform({ x: obstaclePosition + 1700, y: canvas.height - 500, width: 300, height: 700 }),
        new Platform({ x: obstaclePosition + 1400, y: canvas.height - 300, width: 50, height: 20 }),
        new Platform({ x: obstaclePosition + 1650, y: canvas.height - 100, width: 50, height: 20 }),
        new Platform({ x: obstaclePosition + 2100, y: canvas.height - 300, width: 50, height: 20 }),
        new Platform({ x: obstaclePosition + 2200, y: canvas.height - 100, width: 50, height: 20 })
    ]

    const win = new Win({ x: 7400, y: ch - 30 - chris.height });
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
            // if player between platform.x and platform.x + width
            if (player.x + player.width >= platform.x &&
                player.x <= platform.x + platform.width) {

                // if collide with bottom of platform
                if (player.y <= platform.y + platform.height &&
                    player.y >= platform.y) {
                    player.canMove.up = false;

                // on top of platform
                } else if (player.y + player.height <= platform.y &&
                    player.y + player.height + player.vy >= platform.y) {
                    
                    player.canMove.down = false;
                }

            } else {

                let shorterObj;
                let tallerObj;
                if (player.height < platform.height) {
                    shorterObj = player
                    tallerObj = platform
                } else {
                    shorterObj = platform
                    tallerObj = player
                }
                
                if (shorterObj.y + shorterObj.height >= tallerObj.y &&
                    shorterObj.y <= tallerObj.y + tallerObj.height) {
                        // console.log(shorterObj)
                        // console.log(tallerObj)

                        if (player.x + player.width >= platform.x - player.speed &&
                            player.x + player.width < platform.x) {
                            // console.log('hit right')
                            player.canMove.right = false;
                        } 
                        if (player.x <= platform.x + platform.width + player.speed &&
                            player.x > platform.x + platform.width) {
                            // console.log('hit left')
                            player.canMove.left = false;
                        }
                    }
            }


        })

        if (player.x + player.width >= win.x - 5) {
            player.canMove.up = false;
            player.canMove.down = false;
            player.canMove.left = false;
            player.canMove.right = false;
            hasWon = true;
        } else {

            
            
            
            if (!player.canMove.up && player.vy < 0) {
                player.vy = -gravity;
            } else if (player.canMove.up && keys.up.pressed) {
                if (!player.isJumping && player.y >= 0) {
                    player.vy = -player.jumpSpeed;
                    player.isJumping = true;
                }     
            }

            if (!player.canMove.down && player.vy > 0) {
                player.vy = 0;
                player.isJumping = false;
            }


            if (keys.right.pressed) {
                player.frameY = 0;
                if (dt > fps) {
                    player.frameX = player.frameX < player.maxFrame ? player.frameX + 1 : 0
                }
                
            } else if (keys.left.pressed) {
                player.frameY = 1;
                if (dt > fps) {
                    player.frameX = player.frameX < player.maxFrame ? player.frameX + 1 : 0
                }
            } else {
                player.frameX = 0;
            }

            if (player.vy !== 0) {
                player.frameX = 1;
            }

            if (keys.right.pressed && player.canMove.right && (player.x < 400 || win.x <= canvas.width - 400)) {
                player.vx = player.speed;
            } else if (keys.left.pressed && player.canMove.left && player.x > 100) {
                player.vx = -player.speed;
            } else {
                player.vx = 0;

                
                platforms.forEach(platform => {
                    if (keys.right.pressed && player.canMove.right) {
                        platform.x -= player.speed
                        scrollOffset += player.speed
                    } else if (keys.left.pressed && player.canMove.left && scrollOffset >= 0) {
                        platform.x += player.speed
                        scrollOffset -= player.speed
                    }
                })

                genericObjects.forEach(go => {
                    if (keys.right.pressed && player.canMove.right) {
                        go.x -= player.speed * 0.6
                    } else if (keys.left.pressed && player.canMove.left && scrollOffset >= 0) {
                        go.x += player.speed * 0.6
                    }
                })

                if (keys.right.pressed && player.canMove.right) {
                    win.x -= player.speed * 0.6
                } else if (keys.left.pressed && player.canMove.left && scrollOffset >= 0) {
                    win.x += player.speed * 0.6
                } 
            }
        }

        if (hasWon)
            player.win()
        else
            player.update();

        player.canMove.clear();
        win.update();


        // c.fillStyle = 'black'
        // c.fillText(player.x + scrollOffset,50,50)
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
})