const squares = Array.from(document.getElementsByClassName('square'));
console.log(squares)
let playerOne = true;
let turn = 0;

const played = {}
const checkForWinner = () => {
    let rowOne = played['0'] + played['1'] + played['2'];
    let rowTwo = played['3'] + played['4'] + played['5'];
    let rowThree = played['6'] + played['7'] + played['8'];
    let colOne = played['0'] + played['3'] + played['6'];
    let colTwo = played['1'] + played['4'] + played['7'];
    let colThree = played['2'] + played['5'] + played['8'];
    let diagOne = played['0'] + played['4'] + played['8'];
    let diagTwo = played['2'] + played['4'] + played['6'];
    let win = null;
    [rowOne,rowTwo,rowThree,colOne,colTwo,colThree,diagOne,diagTwo].forEach((e) => {
        if (e === 3) {
            win = 'Player one wins!';
        } else if (e === -3) {
            win = 'Player two wins!';
        }
    });
    if (turn === 9 && !win) {
        win = 'Draw!'
    }
    return win;
}

const play = (e) => {
    if (!Object.keys(played).includes(e.target.id)) {
        e.target.innerHTML = playerOne ? 'X' : 'O';
        played[e.target.id] = playerOne ? 1 : -1;
        playerOne = !playerOne;
        turn++;
        let winner = checkForWinner();
        if (winner) {
            document.getElementById('winner').innerHTML = winner;
        }
    }
}

squares.forEach(element => {
    element.addEventListener('click',play)
});