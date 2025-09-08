function debounce (fn, ms) {
    let timeout;
    return function () {
        const f = () => {
            fn.apply(this,arguments);
        }
        clearTimeout(timeout);
        timeout = setTimeout(f,ms);
    }
}

function createElement (name, owner, stars) {
    let searchResult = document.createElement('div');
    searchResult.dataset.owner = owner;
    searchResult.dataset.stars = stars;
    searchResult.insertAdjacentHTML('beforeend', name);
    searchResult.style.cssText = 'background-color: #E3E3E3; width: 500px; height: 44px; border: solid 1px black; font-size: 30px; padding-left: 15px; margin-left: 74px; box-sizing: border-box;'
    return searchResult;
}

function createElementResult(name, owner, stars) {
    let div = document.createElement('div');
    div.style.cssText = 'background-color: #E27BEB; width: 503px; height: 101px; border: solid 1px black; box-sizing: border-box; padding-left: 15px; margin-left: 74px;font-size: 24px;display: flex;justify-content: space-between;align-items:center';
    div.insertAdjacentHTML('afterbegin', `<div>Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}</div>`);
    div.insertAdjacentHTML('beforeend',`<div class= 'close'  style ='width: 50px; heiht: 50px; font-size:50px; color: red;cursor: pointer;'>&#x2715;</div>`);
    return div;
}

async function search (event) {
    let searchText = event.target.value;
    if (searchText[0] === ' ') {
        let counter = 0;
        for (value of searchText) {
            if (value === ' ') {
                counter ++;
            } else {
                break;
            }
        }
        searchText = searchText.split('');
        searchText.splice(0, counter);
        searchText = searchText.join('');
    }
    if(searchText === '') {
        resultBox.innerHTML = '';
        return;
    }
    
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchText}&per_page=5`);
    resultBox.innerHTML = '';
    if(response.ok) {
        let resultObj = await response.json();
        if(resultObj['items'].length === 0) {
            let box = createElement('Нет результатов');
            resultBox.insertAdjacentElement('afterbegin', box);
        }
        for (value of resultObj['items']){
            let box = createElement(value['name'],value['owner']['login'],value['stargazers_count']);
            resultBox.insertAdjacentElement('afterbegin', box);
        }
    } else (
        console.log(response.status)
    )
}

let container = document.querySelector('.container');
let input = container.querySelector('input');
let resultBox = container.querySelector('.search-result')
let save = container.querySelector('.save')

search = debounce(search, 400);

input.addEventListener('input', event => {
    search(event);
})

resultBox.addEventListener('click', event => {  
    if (event.target.textContent === 'Нет результатов')  {
        return;
    }
    let box = createElementResult(event.target.textContent,event.target.dataset.owner,event.target.dataset.stars);
    save.insertAdjacentElement('afterbegin',box);
    resultBox.innerHTML='';
    input.value = '';
})

save.addEventListener('click', event => {
    if (event.target.className === 'close'){
        event.target.parentElement.remove();
    }
})