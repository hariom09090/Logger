// index.js

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    const inputElement = document.getElementById('input-el');
    const saveButton = document.getElementById('save-btn');
    const removeButton = document.getElementById('remove-btn');
    const openTabButton = document.getElementById('open-tab-btn');
    const ulElement = document.getElementById('ul-el');
    let linksArray = [];

    loadLinks();

    function loadLinks() {
        const linksStorage = JSON.parse(localStorage.getItem("links")) || [];
        linksArray = linksStorage;
        renderLinks();
    }

    function setupEventListeners() {
        saveButton.addEventListener("click", saveLink);
        openTabButton.addEventListener("click", saveCurrentTab);
        removeButton.addEventListener("dblclick", removeAllLinks);
    }

    function saveLink() {
        const newLink = inputElement.value.trim();
        if (isValidURL(newLink)) {
            linksArray.push(newLink);
            saveLinks();
            renderLinks();
            inputElement.value = "";
        } else {
            alert("Please enter a valid URL.");
        }
    }
    
    function saveCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const tabURL = tabs[0].url;
            linksArray.push(tabURL);
            saveLinks();
            renderLinks();
        });
    }

    function removeAllLinks() {
        localStorage.clear();
        linksArray = [];
        renderLinks();
    }

    function saveLinks() {
        localStorage.setItem("links", JSON.stringify(linksArray));
    }

    function renderLinks() {
        ulElement.innerHTML = linksArray.map(link => `
            <li>
                <a target='_blank' href='${link}'>
                    ${link}
                </a>
            </li>
        `).join("");
    }

    function isValidURL(url) {
        const urlPattern = /^((http|https):\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)/;
        return urlPattern.test(url);
    }


    setupEventListeners();
}

