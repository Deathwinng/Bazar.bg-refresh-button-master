// ==UserScript==
// @name         Bazar.bg бутон за обновяване
// @version      2.1
// @description  Бутон, за лесно обновяване на изтичащи обяви.
// @author       Deathwing
// @include      https://bazar.bg/ads/my*
// @grant        GM_xmlhttpRequest
// @connect      https://bazar.bg/
// @namespace    https://greasyfork.org/users/18375
// ==/UserScript==

var pagingElement = document.querySelector("div.paging").lastElementChild;

if (document.querySelector('.second_li')) {
    var element = document.querySelector("div.blueBox").children[1];

    var refreshButt = createHTMLElement('button', null, 'refreshButton', [{n:'style', v:'margin-left:20px;height:35px;font-size:13px;transition: all 200ms linear'}]);

    if (pagingElement.className.includes('disabled')) {
        refreshButt.textContent = 'ОБНОВИ ИЗТИЧАЩА';
        refreshButt.className = 'refresh';
    }
    else {
        refreshButt.textContent = 'ПОСЛЕДНА СТРАНИЦА';
        refreshButt.className = 'goToLast';
    }

    element.appendChild(refreshButt);

    createMessageBox();

    refreshButt.addEventListener('click', refreshHandler);
}

function refreshHandler(e) {
    if (e.target.className === 'refresh') {
        var button = e.target;
        var refreshButtons = document.querySelectorAll('.btnOferirai');
        var numToRefresh = document.querySelector('.second_li span').textContent;
        var counter = 0;

        for (var i = refreshButtons.length - 1; i >= refreshButtons.length - numToRefresh; i--) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: refreshButtons[i].href,
                onload: () => {
                    counter++;
                    if (counter === numToRefresh) {
                        showMessage(numToRefresh);
                        button.textContent = 'ОБНОВИ СТРАНИЦАТА';
                        button.style.background = '#fa7609';
                        setTimeout(() => button.style.background = '#3b6fb6', 200);
                    }
                }
            });
        }
    }
    else if (e.target.className === 'goToLast') {
        var numOfAds = document.querySelector('.first_li span').textContent;
        var lastPageNum = Math.ceil(numOfAds / 20);
        window.location.href = `https://bazar.bg/ads/my?page=${lastPageNum}`;
    }
}

function createMessageBox() {
    var msgDiv = createHTMLElement('div', null, 'msgBox', [{ n: 'style', v: 'height: 70px;width: 300px;padding: 20px;position: absolute;background-color: #fff;text-align: center;display: none;margin-left: 10px;box-shadow: #00000057 0px 0px 15px;font-weight: bold;border-radius: 5px;transition: all 300ms linear;opacity: 0;' }]);
    var element = document.querySelector("div.blueBox").children[1];
    element.appendChild(msgDiv);
}

function showMessage(numToRefresh) {
    var msgBox = document.querySelector('.msgBox');
    msgBox.innerHTML = `${numToRefresh} обяви успешно обновени! Моля обновете страницата.`;
    msgBox.style.display = 'inline';
    setTimeout(() => msgBox.style.opacity = '1', 50);
}


function createHTMLElement(tag, textContent, className, attributes) {
    var element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    if (attributes) {
        attributes.forEach((a) => {
            element.setAttribute(a.n, a.v);
        });
    }

    return element;
}

// function appendChildren(element, children) {
//     children.forEach((c) => {
//         element.appendChild(c);
//     });
// }
