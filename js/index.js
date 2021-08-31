// Select Input from html
const inputValue = document.getElementById('inputValue');
// Select 2nd Input field
const displayValue = document.getElementById('displayValue');
// Select rate to show rating
const rateText = document.getElementById('rate');
// Select switch
const swapToggle = document.getElementById('swap');
// Select dropdown-menu
const dropdownMenus = document.querySelectorAll('.dropdown-menu');
// Declare global variable for store rate & first input fields value
let rate, value = '';
// Base of url
let base = 'USD';
// Set API key 
const API_KEY = 'XXXXX';


/*
* Extract Data from API
* Set dropdown Menu from api values
* return rate as a promise
*/
async function getData() {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;

    let response = await fetch(url);
    let exchangeData = await response.json();
    rate = exchangeData.conversion_rates;
    let currencies = Object.keys(exchangeData.conversion_rates);
    currencies.forEach(currency => {
        createDropItem(currency);
    });
    return rate;
}

// Called getData
getData();

/*
* Create Dropdown Menu item
* Add Class
*/
function createDropItem(name) {
    dropdownMenus.forEach(dropdownMenu => {
        const li = document.createElement('li');
        li.textContent = name;
        li.classList.add('dropdown-item');
        li.addEventListener('click', selectCurrency);
        dropdownMenu.appendChild(li);
    });
}

/*
* Click Event of Dropdown Menu
* Find Dropdowns Sibling (Button)
*/
function selectCurrency(e) {
    let clicked = e.target;
    let clickedValue = clicked.textContent;
    let parent = clicked.parentElement;
    let siblingOfParent = parent.previousElementSibling;
    siblingOfParent.innerHTML = clickedValue;
    if (siblingOfParent.id === 'select1') {
        base = clickedValue;
        getData();
    } else if (siblingOfParent.id === 'select2') {
        calculateValue(value, rate[clickedValue], clickedValue);
    }
}

/*
* Calculate Currency 
* Add calculated value in 2nd input fields
* Show stylished rate in display
*/
function calculateValue(value, rate, toConvert) {
    displayValue.value = rate * value;
    rateText.innerHTML = `1 ${base} equal ${rate} ${toConvert}`;
    rateText.style.display = 'block';
}

/*
* Hendle Switch 
* Select Two Dropdown toggle 
* Swap two value
* And call getData with new Base url
*/
function swap() {
    select1 = document.getElementById('select1');
    select2 = document.getElementById('select2');
    let tempSel1 = select1.textContent;
    let tempSel2 = select2.textContent;
    select2.innerHTML = tempSel1;
    select1.innerHTML = tempSel2;
    
    base = select1.innerHTML;
    getData()
        .then(rate => {
            calculateValue(value, rate[select2.innerHTML], select2.innerHTML);
        })
        .catch(e => {
            console.log(e);
        });
}

// Add Event listener in switch
swapToggle.addEventListener('click', swap);

// Handle 1st Input Field
inputValue.addEventListener('input', e => {
    const select2 = document.getElementById('select2');
    let toConvert = select2.textContent;
    value = e.target.value;
    calculateValue(value, rate[toConvert], toConvert);
});