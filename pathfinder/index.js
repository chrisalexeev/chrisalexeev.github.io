const container = document.getElementById('container');
const options = document.getElementsByName('draw-mode');
const squares = [];

let mode = 'start'
let startingNode = null;
let endingNode = null;
let drag = false;
document.addEventListener('mousedown', () => drag = true)
document.addEventListener('mouseup', () => drag = false)

options.forEach(e => {
    e.addEventListener('click', () => mode = e.id)
})

for (let i = 0; i < 20*30; i++) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('click',e => {
        switch (mode) {
            case 'start':
                if (startingNode)
                    startingNode.classList.remove('start')
                e.target.classList.add('start');
                startingNode = e.target;
                break;
            case 'end':
                if (endingNode)
                    endingNode.classList.remove('end')
                e.target.classList.add('end');
                endingNode = e.target;
                break;
            case 'wall':
                e.target.classList.toggle('blocked');
                break;
        }
    })
    square.addEventListener('mouseover',e => {
        if (mode === 'wall' && drag) {
            e.target.classList.toggle('blocked')
        }
    })
    square.addEventListener('mousedown',e => {
        if (mode === 'wall') {
            e.target.classList.toggle('blocked')
        }
    })
    container.appendChild(square);
    squares.push(square);
}