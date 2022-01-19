async function loadData() {
    let jsonData = fetch('../../blog/blog.json')
        .then(response => response.json())
        .catch(error => console.log(error));
    return jsonData;
}

async function main() {
    let jsonData = await loadData();
    let entries = jsonData.entries.reverse();
    const mainTag = document.querySelector('main');
    entries.forEach(entry => {
        const newElem = document.createElement('article');
        newElem.innerHTML = `<h2>${entry.title}</h2>\n${entry.body}`;
        mainTag.appendChild(newElem)
    });
}

main()