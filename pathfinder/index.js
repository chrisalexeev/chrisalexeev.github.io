const container = document.getElementById('container');
const options = document.getElementsByName('draw-mode');
const algoSelect = document.getElementById('algorithm');
const go = document.getElementById('go');
const reset = document.getElementById('reset')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let hasGone = false;
let squares = [];
let mode = 'start'
let startingNode = null;
let endingNode = null;
let drag = false;
document.addEventListener('mousedown', () => drag = true)
document.addEventListener('mouseup', () => drag = false)

class Square {
    constructor(elem,x,y) {
        this._elem = elem;
        this._neighbors = [];
        this._position = { x: x, y: y }
        this._searched = false;
        this._isWall = false;

        this.addEventListeners(elem);
        this.before = null
    }

    addEventListeners(square) {
        square.addEventListener('click',e => {
            if (hasGone) {
                return;
            }
            switch (mode) {
                case 'start':
                    if (startingNode)
                        startingNode._elem.classList.remove('start')
                    this._elem.classList.add('start');
                    if (!startingNode) {
                        document.getElementById('end').checked = true;
                        mode = 'end'
                    }
                    startingNode = this;
                    break;
                case 'end':
                    if (endingNode)
                        endingNode._elem.classList.remove('end')
                    this._elem.classList.add('end');
                    if (!endingNode) {
                        document.getElementById('wall').checked = true;
                        mode = 'wall'
                    }
                    endingNode = this;
                    break;
            }
        })
        square.addEventListener('mouseover',e => {
            if (hasGone) {
                return;
            }
            if (mode === 'wall' && drag) {
                this.toggleWall()
            }
        })
        square.addEventListener('mousedown',e => {
            if (hasGone) {
                return;
            }
            if (mode === 'wall') {
                this.toggleWall()
            }
        })
    }

    get elem() {
        return this._elem;
    }

    get neighbors() {
        return this._neighbors;
    }

    get position() {
        return this._position;
    }

    get searched() {
        return this._searched;
    }

    get isWall() {
        return this._isWall;
    }

    markSearched(isStart) {
        this._searched = true;
        if (!isStart)
            this._elem.classList.add('visited')
    }

    resetSearched() {
        this._searched = false;
        this._elem.classList.remove('visited')
    }

    toggleWall() {
        this._isWall = !this._isWall;
        this._elem.classList.toggle('blocked');
    }

    addNeighbor(n) {
        this._neighbors.push(n)
    }

    reset() {
        this.resetSearched()
        // TODO: fix all this 
        this._elem.classList.remove('blocked')
        this._isWall = false;
        this.before = null;
        this._elem.style.cursor = 'pointer';
        this._elem.classList.remove('start');
        this._elem.classList.remove('end');
        this._elem.style.backgroundColor = null;
            
        
    }
}

options.forEach(e => {
    e.addEventListener('click', () => mode = e.id)
})

// console.log(squares)

for (let i = 0; i < 20; i++) {
    squares.push([])
    for (let j = 0; j < 30; j++) {
        let square = document.createElement('div');
        square.classList.add('square');
        let sqObj = new Square(square,j,i);
        container.appendChild(sqObj.elem);
        squares[i].push(sqObj);
    }
}

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 30; j++) {
        if (i > 0)
            squares[i][j].addNeighbor(squares[i-1][j])
        if (j < 29)
            squares[i][j].addNeighbor(squares[i][j+1])
        if (i < 19)
            squares[i][j].addNeighbor(squares[i+1][j])
        if (j > 0)
            squares[i][j].addNeighbor(squares[i][j-1])
    }
}

function initialize() {
    startingNode = null;
    endingNode = null;
    hasGone = false;
    go.disabled = false;
    // TODO: fix fix fix
    document.getElementById("start").checked = true;
    mode = 'start';
    squares.forEach(row => {
        row.forEach(s => {
            s.reset()
        })
    })
}

async function bfs() {
    console.log("Starting BFS");
    let q = [startingNode];
    let count = 0;
    while (q) {
        let node = q.shift();
        if (node.searched) 
            continue;
        if (node === endingNode) {
            console.log(count)
            return node;
        }
        node.markSearched(count === 0 ? true : false);
        node.neighbors.forEach(n => {
            if (!n.isWall && !n.searched) {
                n.before = node;
                q.push(n)
            }
        })
        count++;
        await sleep(50)
    }
    return null;
}

async function dfs() {
    console.log("Starting DFS");
    let q = [startingNode];
    let count = 0;
    while (q) {
        let node = q.pop();
        if (node.searched) 
            continue;
        if (node === endingNode) {
            console.log(count)
            return node;
        }
        node.markSearched(count === 0 ? true : false);
        node.neighbors.forEach(n => {
            if (!n.isWall && !n.searched) {
                n.before = node;
                q.push(n)
            }
        })
        count++;
        await sleep(50)
    }
    return null;
}

function createPath(node) {
    let path = [];
    let cur = node;
    while (cur.before) {
        path.push(cur);
        cur = cur.before;
    }
    return path;
}

async function illuminatePath(path) {
    for (let i = path.length - 1; i >= 0; i--) {
        path[i]._elem.style.backgroundColor = 'yellow';
        path[i]._elem.classList.remove('visited')
        await sleep(50);
    }
}

async function goListener() {
    if (startingNode && endingNode) {
        hasGone = true;
        go.disabled = true;
        // TODO: make a function
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 30; j++) {
                squares[i][j]._elem.style.cursor = 'unset';
            }
        }
        switch (algoSelect.value) {
            case 'bfs':
                result = await bfs();
                break;
            case 'dfs':
                result = await dfs();
                break;
        }
        
        if (result) {
            let path = createPath(result);
            console.log(path)
            await illuminatePath(path);
        }
        console.log(result);
    }
    else 
        alert("Need starting and ending node!")
}

go.addEventListener('click', goListener)
reset.addEventListener('click',initialize)