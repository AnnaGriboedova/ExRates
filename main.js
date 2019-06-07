"use strict";

const BY_NAME = 'BY_NAME';
const BY_ADVANTAGE = 'BY_ADVANTAGE';
const BY_LOCATION = 'BY_LOCATION';

const BUY_TYPE = 'BUY_TYPE';
const SELLING_TYPE = 'SELLING_TYPE';

const DEFAULT_SORT_TYPE = BY_NAME;
const DEFAULT_CURRENCY_ACTION_TYPE = BUY_TYPE;


const banksWrapper = document.getElementById('bankList');

let banks = [];
let selectedSortType = DEFAULT_SORT_TYPE;
let selectedCurrencyActionType = DEFAULT_CURRENCY_ACTION_TYPE;

let bestBuyCourse;
let bestSellCourse;

setupButtons();
refreshBanks();

function Bank(name, buy, sell) {
    this.name = name;
    this.buy = buy;
    this.sell = sell;
}

function refreshBanks() {
    getJSON('https://kafemaak.000webhostapp.com/',
        function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                //TODO: change for better
                banks = data.banksUsd;
                defineBestCourse();
                calculateResultBestCourse();
                sortBanks(selectedSortType);
                addPropResult();
                displayBanks();
            }
        });
}

function addPropResult() {

    banks.forEach(function (bank) {
        let resultBuy = gaussRound(bank.buy * getInputValue(), 3);
        let resultSell = gaussRound(bank.sell * getInputValue(), 3);

        let bestResultBuy = gaussRound(bestBuyCourse * getInputValue(), 3);
        let bestResultSell = gaussRound(bestSellCourse * getInputValue(), 3);

        bank.resultBuy = resultBuy;
        bank.resultSell = resultSell;

        if (resultBuy === bestResultBuy) {
            bank.differenceBuy = 'лучший курс';
        } else {
            bank.differenceBuy = gaussRound(resultBuy - bestResultBuy, 3);
        }
        if (resultSell === bestResultSell) {
            bank.differenceSell = 'лучший курс';
        } else {
            bank.differenceSell = gaussRound(bestResultSell - resultSell, 3);
        }
    })

}

function gaussRound(num, decimalPlaces) {
    let d = decimalPlaces || 0,
        m = Math.pow(10, d),
        n = +(d ? num * m : num).toFixed(8),
        i = Math.floor(n), f = n - i,
        e = 1e-8,
        r = (f > 0.5 - e && f < 0.5 + e) ?
            ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
}

function defineBestCourse() {
    var buyArr = banks.map(function (bank) {
        return bank.buy;
    });
    var sellArr = banks.map(function (bank) {
        return bank.sell;
    });
    bestBuyCourse = Math.min.apply(null, buyArr);
    bestSellCourse = Math.max.apply(null, sellArr);
}

let bestCourseEl = document.getElementById('bestCourse');

function calculateResultBestCourse() {

    switch (selectedCurrencyActionType) {
        case BUY_TYPE:
            displayBestCourse(bestBuyCourse);
            displayCalculateResult(gaussRound(getInputValue() * bestBuyCourse, 3));
            break;
        case SELLING_TYPE:
            displayBestCourse(bestSellCourse);
            displayCalculateResult(gaussRound(getInputValue() * bestSellCourse,3));
            break;
    }

    function displayBestCourse(bestCourse) {
        bestCourseEl.innerHTML = bestCourse;
    }

    function displayCalculateResult(num) {
        let resultEl = document.getElementById('result');
        resultEl.innerHTML = num;
    }
}

function getInputValue() {
    let inputValueEl = document.getElementById('inputValue');
    return inputValueEl.value || 1000;
}

function sortBanks(sortType) {
    switch (sortType) {
        case BY_NAME:
            selectedSortType = sortType;
            banks.sort(byField('name').asc);
            break;

        case BY_ADVANTAGE:
            selectedSortType = sortType;
            switch (selectedCurrencyActionType) {
                case BUY_TYPE:
                    banks.sort(byField('buy').asc);
                    break;

                case SELLING_TYPE:
                    banks.sort(byField('sell').desc);
                    break
            }
            break;

        case BY_LOCATION:
            selectedSortType = sortType;
            //banks.sort(byField('').asc);
            break;
    }
}

function byField(field) {
    return {
        asc: function (a, b) {
            return a[field] > b[field] ? 1 : -1;
        },
        desc: function (a, b) {
            return a[field] < b[field] ? 1 : -1;
        }
    }
}

function displayBanks() {
    const buyIsSelected = selectedCurrencyActionType === BUY_TYPE;
    const sellingIsSelected = selectedCurrencyActionType === SELLING_TYPE;

    clearBanksWrapper();

    banks.forEach(
        function (bank) {
            banksWrapper.appendChild(getBankEl(bank));
        }
    );

    function getBankEl(bank) {
        const bankEl = document.createElement('tr');

        let nameEl=getNewTd(getNewSpan(bank.name));
        nameEl.classList.add('bankItem__name');
        let inputValueEl = getNewTd(getNewSpan(getInputValue()));
        inputValueEl.classList.add('bankItem__inputValue');

        let buyEl = getNewTd(getNewSpan(bank.buy));
        buyEl.classList.add('bankItem__currencyValue');
        let resultBuyEl = getNewTd(getNewSpan(bank.resultBuy));
        resultBuyEl.classList.add('bankItem__result');
        let differenceBuyEl = getNewTd(getNewSpan(bank.differenceBuy));
        differenceBuyEl.classList.add('bankItem__differenceValue');

        let sellEl = getNewTd(getNewSpan(bank.sell));
        sellEl.classList.add('bankItem__currencyValue');
        let resultSellEl = getNewTd(getNewSpan(bank.resultSell));
        resultSellEl.classList.add('bankItem__result');
        let differenceSellEl = getNewTd(getNewSpan(bank.differenceSell));
        differenceSellEl.classList.add('bankItem__differenceValue');

        bankEl.appendChild(nameEl);

        if (buyIsSelected) {
            if (+bestBuyCourse === +bank.buy) {
                bankEl.classList.add('bestCourse');
            }
            bankEl.appendChild(buyEl);
            bankEl.appendChild(inputValueEl);
            bankEl.appendChild(resultBuyEl);
            bankEl.appendChild(differenceBuyEl);
        }

        if (sellingIsSelected) {
            if (+bestSellCourse === +bank.sell) {
                bankEl.classList.add('bestCourse');
            }
            bankEl.appendChild(sellEl);
            bankEl.appendChild(inputValueEl);
            bankEl.appendChild(resultSellEl);
            bankEl.appendChild(differenceSellEl);
        }

        return bankEl;
    }

    function getNewTd(el) {
        const td = document.createElement('td');
        td.appendChild(el);
        return td;
    }

    function getNewSpan(text) {
        const span = document.createElement('span');
        span.innerHTML = text;
        return span;
    }
}

function clearBanksWrapper() {
    while (banksWrapper.firstChild) {
        banksWrapper.removeChild(banksWrapper.firstChild);
    }
}

function setupButtons() {
    const btnBuy = document.getElementById('btnBuy');
    const btnSelling = document.getElementById('btnSelling');

    const btnSortByName = document.getElementById('btnSortByName');
    const btnSortByAdvantage = document.getElementById('btnSortByAdvantage');
    const btnSortByLocation = document.getElementById('btnSortByLocation');

    //const getBestCourseBtn = document.getElementById('getBestCourseBtn');

    const getBestCourse=document.getElementById('inputValue');

    isActive();

    btnBuy.addEventListener('click', function () {
        onChangeCurrencyActionType(BUY_TYPE);
        calculateResultBestCourse();
        isActive();
    });

    btnSelling.addEventListener('click', function () {
        onChangeCurrencyActionType(SELLING_TYPE);
        calculateResultBestCourse();
        isActive();
    });


    btnSortByName.addEventListener('click', function () {
        onChangeSortType(BY_NAME);
        isActive();
    });

    btnSortByAdvantage.addEventListener('click', function () {
        onChangeSortType(BY_ADVANTAGE);
        isActive();
    });

    btnSortByLocation.addEventListener('click', function () {
        onChangeSortType(BY_LOCATION);
        isActive();
    });

    /*getBestCourseBtn.addEventListener('click', function () {
        addPropResult();
        displayBanks();
        calculateResultBestCourse();
    });*/

    getBestCourse.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            addPropResult();
            displayBanks();
            calculateResultBestCourse();
        }
    });

    function isActive() {
        switch (selectedSortType) {
            case BY_NAME:
                removeClassActive(document.getElementsByClassName('buttonsSortWrapper__btn'));
                addClassActive(btnSortByName);
                break;
            case BY_LOCATION:
                removeClassActive(document.getElementsByClassName('buttonsSortWrapper__btn'));
                addClassActive(btnSortByLocation);
                break;
            case BY_ADVANTAGE:
                removeClassActive(document.getElementsByClassName('buttonsSortWrapper__btn'));
                addClassActive(btnSortByAdvantage);
                break;
        }
        switch (selectedCurrencyActionType) {
            case BUY_TYPE:
                removeClassActive(document.getElementsByClassName('buttonsActionWrapper__btn'));
                addClassActive(btnBuy);
                break;
            case SELLING_TYPE:
                removeClassActive(document.getElementsByClassName('buttonsActionWrapper__btn'));
                addClassActive(btnSelling);
                break;
        }
    }
}

function addClassActive(el) {
    el.classList.add('active')
}

function removeClassActive(elArr) {
    for (let i = 0; i < elArr.length; i++) {
        elArr[i].classList.remove('active');
    }
}

function onChangeCurrencyActionType(type) {
    if (selectedCurrencyActionType !== type) {
        selectedCurrencyActionType = type;
        if (selectedSortType === BY_ADVANTAGE) {
            sortBanks(selectedSortType);
        }
        displayBanks();
    }
}

function onChangeSortType(type) {
    if (selectedSortType !== type) {
        sortBanks(type);
        displayBanks();
    }
}

function getJSON(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        const status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}