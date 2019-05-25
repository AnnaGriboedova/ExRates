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

setupButtons();
refreshBanks();

function Bank(name, buy, selling) {
    this.name = name;
    this.buy = buy;
    this.selling = selling;
}

function refreshBanks() {
    banks = getBanks();
    sortBanks(selectedSortType);
    displayBanks();
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
                    banks.sort(byField('selling').desc);
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
        const bankEl = document.createElement('div');

        bankEl.appendChild(getNewSpan(bank.name));

        if (buyIsSelected) {
            bankEl.appendChild(getNewSpan(bank.buy));
        }

        if (sellingIsSelected) {
            bankEl.appendChild(getNewSpan(bank.selling));
        }

        return bankEl;
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

    btnBuy.addEventListener('click', function () {
        onChangeCurrencyActionType(BUY_TYPE);
    });

    btnSelling.addEventListener('click', function () {
        onChangeCurrencyActionType(SELLING_TYPE);
    });


    btnSortByName.addEventListener('click', function () {
        onChangeSortType(BY_NAME);
    });

    btnSortByAdvantage.addEventListener('click', function () {
        onChangeSortType(BY_ADVANTAGE);
    });

    btnSortByLocation.addEventListener('click', function () {
        onChangeSortType(BY_LOCATION);
    });
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

function getBanks() {
    //TODO: get banks from API
    const arr = [];

    arr.push(new Bank('БелВэб', 2.07, 2.096));
    arr.push(new Bank('Приорбанк', 2.0831, 2.0918));
    arr.push(new Bank('СтатусБанк', 2.0774, 2.088));
    arr.push(new Bank('БНБ-Банк', 2.0763, 2.092));
    arr.push(new Bank('МТБанк', 2.083, 2.094));
    arr.push(new Bank('Идея Банк', 2.081, 2.0895));
    arr.push(new Bank('Белинвест Банк', 2.0755, 2.089));
    arr.push(new Bank('Беларусбанк', 2.0711, 2.0917));
    arr.push(new Bank('Банк Добрабыт', 2.0773, 2.088));

    return arr;
}