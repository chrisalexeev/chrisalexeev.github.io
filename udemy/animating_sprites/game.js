class Game {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '30px Verdana'

        this.sprites = []

        this.states = {
            static: {
                frames: [0],
                loop: true,
                motion: { x: 0, y:0 },
                fps: 1
            },
            walk: {
                frames: [0,1,2,3,4,5,6,7],
                loop: true,
                motion: { x: 120, y: 0 },
                fps: 8
            },
            turn: {
                frames: [8,9,10,11,12,13,14],
                loop: false,
                motion: { x: 120, y: 0 },
                fps: 8,
                oncomplete: {
                    state: 'walk',
                    flip: true,
                    move: { x: 40, y: 0 },
                    userinteraction: false,
                    fps: 12
                }
            }
        }
        for (let prop in this.states) {
            const state = this.states[prop];
            state.name = prop;
            state.duration = state.frames.length * (1.0/state.fps);
        }
        Object.freeze(this.states)

        const game = this;
        this.loadJSON('bucket', function(data,game) {
            game.spriteData = JSON.parse(data);
            game.spriteImage = new Image();
            game.spriteImage.src = game.spriteData.meta.image;
            game.spriteImage.onload = function() {
                game.init();
                game.refresh();
            }
        })
    }

    loadJSON(json, callback) {
        const xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json")
        xobj.open('GET', json + '.json', true);
        const game = this;
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == 200) {
                callback(xobj.responseText, game);
            }
        }
        xobj.send(null)
    }

    init() {
        this.score = 0;
        this.lastRefreshTime = Date.now();
        this.spawn();
        this.refresh();

        const game = this;

        function tap(evt) {
            game.tap(evt);
        }

        if ('ontouchstart' in window) {
            this.canvas.addEventListener('touchstart', tap);
        } else {
            this.canvas.addEventListener('mousedown', tap);
        }
    }

    tap(evt) {
        const mousePos = this.getMousePos(evt);

        for (let sprite of this.sprites) {
            if (sprite.hitTest(mousePos)) {
                sprite.kill = true;
                this.score++;
            }
        }
    }

    getMousePos(evt) {
        const rect = this.canvas.getBoundingClientRect();

        const clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        const clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;

        const canvasScale = this.canvas.width / this.canvas.offsetWidth;
        const loc = {};

        loc.x = (clientX - rect.left) * canvasScale;
        loc.y = (clientY - rect.top) * canvasScale;

        return loc;
    }

    spawn() {
        const frameData = this.spriteData.frames[0];
        console.log(frameData)
        const sprite = new Sprite({
            game: this,
            context: this.ctx,
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            width: frameData.sourceSize.w,
            height: frameData.sourceSize.h,
            anchor: { x: 0.5, y: 0.5 },
            image: this.spriteImage,
            json: this.spriteData,
            states: this.states,
            frameData: frameData,
            state: 'walk'
        })

        this.bucket = sprite;
        this.sprites.push(sprite);
        this.sinceLastSpawn = 0;
    }

    refresh() {
        const now = Date.now();
        const dt = (now - this.lastRefreshTime) / 1000.0;

        this.update(dt);
        this.render();

        this.lastRefreshTime = now;

        const game = this;
        requestAnimationFrame(function() {
            game.refresh();
        });


    }

    update(dt) {
        for (let sprite of this.sprites) {
            if (sprite==null) continue
            sprite.update(dt)
        }
    }

    render() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        for (let sprite of this.sprites) {
            sprite.render();
        }

        this.ctx.fillText(`Score: ${this.score}`, 150, 30)
    }
}

class Sprite {
    constructor(options) {
        this.game = options.game,
        this.ctx = options.context;
        this.image = options.image;
        this.width = options.width;
        this.height = options.height;
        this.json = options.json;
        this.index = options.index;
        this.x = options.x;
        this.y = options.y;
        this.frameData = options.frameData;
        this.index = options.index;
        this.anchor = (options.anchor==null) ? { x: 0.5, y: 0.5 } : options.anchor;
        this.states = options.states;
        this.state = options.states[options.state];
        this.scale = (options.scale == null) ? 1.0: options.scale;
        this.opacity = (options.opacity == null) ? 1.0: options.opacity;
        this.currentTime = 0;
        this.kill = false;

        this.state.duration = this.state.frames.length * (1.0/this.state.fps)
        console.log(this.frameData)
    }

    getState() {
        let result;

        if (this.stateIndex < this.states.length)
            result = this.states[this.stateIndex];

        return result;
    }

    setState(state) {
        this.state = this.states[state];
    }

    hitTest(pt) {
        const center = { x: this.x, y: this.y };
        const radius = (this.frame.w * this.scale) / 2;
        const dist = distanceBetweenPoints(pt, center);

        return (dist < radius);

        function distanceBetweenPoints(a,b) {
            const x = a.x - b.x;
            const y = a.y - b.y;

            return Math.sqrt(x * x + y * y)
        }
    }

    get offSet() {
        const scale = this.scale;
        const w = this.frameData.sourceSize.w;
        const h = this.frameData.sourceSize.h;
        const x = this.frameData.spriteSourceSize.x;
        const y = this.frameData.spriteSourceSize.y;
        return {
            x: (w - x) * scale * this.anchor.x,
            y: (h - y) * scale * this.anchor.y
        }
    }

    update(dt) {
        this.currentTime += dt;
        if (this.currentTime > this.state.duration) {
            if (this.state.loop) {
                this.currentTime -= this.state.duration;
            } else {
                if (this.state.oncomplete.move != null) {
                    this.x += (this.flipped) ? this.state.oncomplete.move.x : -this.state.oncomplete.move.x;
                    this.y += this.state.oncomplete.move.y;
                }
                if (this.state.oncomplete.flip != null) this.flipped = (this.state.oncomplete.flip) ? !this.flipped : this.flipped;
                this.setState(this.state.oncomplete.state)
            }
        }
        
        this.x += (this.flipped) ? -this.state.motion.x * dt : this.state.motion.x * dt;
        this.y += this.state.motion.y * dt;

        switch(this.state.name) {
            case "walk":
                if (this.flipped) {
                    if (this.x <= (this.width/2)) {
                        this.setState('turn');
                    }
                } else {
                    if (this.x > (this.game.canvas.width - this.width/3)) {
                        this.setState('turn');
                    }
                }
                break;
        }

        const index = Math.floor((this.currentTime/this.state.duration) * this.state.frames.length);
        this.frameData = this.json.frames[this.state.frames[index]]
    }

    render() {

        const alpha = this.ctx.globalAlpha;

        this.ctx.globalAlpha = this.opacity;

        console.log(this.frameData)
        const frame = this.frameData.frame;
        const size = this.frameData.sourceSize;
        const pos = { x: this.x, y: this.y };
        const offset = this.offSet;

        pos.x = this.flipped ? pos.x + offset.x : pos.x - offset.x;
        pos.y -= offset.y;

        this.ctx.translate(pos.x, pos.y)
        if (this.flipped) this.ctx.scale(-1,1)

        this.ctx.drawImage(
            this.image,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            0,
            0,
            frame.w * this.scale,
            frame.h * this.scale
        )

        this.ctx.globalAlpha = alpha;
        this.ctx.setTransform(1,0,0,1,0,0)
    }
}