const randomVal = () => Math.floor(Math.random() * 255)
const notes = {
    '1': "Sophie is great!",
    '2': "No really, she rocks",
    '3': "I love her so much",
    '4': "FUCK",
    '5': "Sorry, I just love her a lot",
    '6': "Butt"
}
const textDisplay = document.getElementById('text-display');
const displayText = e => {
    textDisplay.innerHTML = notes[e.target.id];
}
const hideText = () => {
    textDisplay.innerHTML = '';
}

for (i = 1; i < 7; i++) {
    let elem = document.getElementById(`${i}`)
    let val = `rgb(${randomVal()},${randomVal()},${randomVal()})`
    console.log(elem, val);
    elem.style.backgroundColor = val;
    elem.addEventListener('mouseover',displayText)
    elem.addEventListener('mouseout',hideText)
}


