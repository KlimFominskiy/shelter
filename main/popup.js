"use strict";

import shelter from "../assets/json/animal.js";

// -------- Popup --------
document.addEventListener("DOMContentLoaded", afterLoad);

export default afterLoad;

function afterLoad() {
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            showCard(card.dataset.pet);
        });
    });
}

// -------- DOM-элементы --------
const popup = document.querySelector(".popup");
const popupPet = document.querySelector(".popup-pet");
const popupBtn = document.querySelector(".button-close");
const modal = document.querySelector(".modal");
const body = document.querySelector("body");

popupBtn.addEventListener("click", popupClose);

function popupClose() {
    popup.style.display = "none";
    modal.style.display = "none";
    body.style.overflow = "auto";
}

function popupOpen() {
    popup.style.display = "flex";
    modal.style.display = "block";
    body.style.overflow = "hidden";

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const popupHeight = popupPet.offsetHeight;
    const delta = popupPet.offsetTop;
    const popupWidth = popupPet.offsetWidth;
    const topPopup = windowHeight / 2 - popupHeight / 2 - delta;
    const leftPopup = windowWidth / 2 - popupWidth / 2;

    popup.style.top = topPopup + "px";
    popup.style.left = leftPopup + "px";
}

function showCard(petName) {
    const pet = shelter.find(item => item.name === petName);
    if (!pet) return;

    popupOpen();

    const popupImg = document.querySelector(".popup-img");
    popupImg.style.backgroundImage = `url(${pet.img})`;

    document.querySelector(".popup-head").textContent = pet.name;
    document.querySelector(".popup-txt div h4").textContent = `${pet.type} - ${pet.breed}`;
    document.querySelector(".popup-txt div p").textContent = pet.description;

    const popupList1 = document.querySelector(".popup-list li:first-child span");
    popupList1.innerHTML = `<b>Age:</b> ${pet.age}`;
    const popupList2 = document.querySelector(".popup-list li:nth-child(2) span");
    popupList2.innerHTML = `<b>Inoculations:</b> ${pet.inoculations}`;
    const popupList3 = document.querySelector(".popup-list li:nth-child(3) span");
    popupList3.innerHTML = `<b>Diseases:</b> ${pet.diseases}`;
    const popupList4 = document.querySelector(".popup-list li:last-child span");
    popupList4.innerHTML = `<b>Parasites:</b> ${pet.parasites}`;
}

// -------- клик по оверлею для закрытия попапа --------
window.onclick = function (event) {
    if (event.target === modal) {
        popupClose();
    }
};

// -------- Бургер-меню --------
const burgerMenu = document.querySelector(".burger-menu");
const headerBar = document.querySelector(".header-bar");
const modalBar = document.querySelector(".modal-bar");
const bar = document.querySelector(".header-bar");

bar.addEventListener("click", menuToggle);

function menuToggle() {
    burgerMenu.classList.toggle("active-bar");
    burgerMenu.classList.toggle("inactive");
    headerBar.classList.toggle("change");

    if (burgerMenu.classList.contains("active-bar")) {
        modalBar.style.display = "block";
        body.style.overflow = "hidden";
    } else {
        modalBar.style.display = "none";
        body.style.overflow = "auto";
    }
}

burgerMenu.addEventListener("click", menuToggle);

window.onclick = function (event) {
    if (event.target === modal) {
        popupClose();
    }
    if (event.target === modalBar) {
        menuToggle();
    }
};