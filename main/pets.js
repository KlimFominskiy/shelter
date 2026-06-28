// -------- загрузка карточек (главная страница, карусель) ------------
"use strict";

import shelter from "../assets/json/animal.js";
import afterLoad from "./popup.js";

const template = document.querySelector("#template");
const sizePage = document.querySelector("section.pets .page");
const carouselSize = document.querySelector(".carousel");

let viewDone = { view1: 3 }; // 3, 2, 1 в зависимости от ширины
let oldSet = [];
let newSet = [];

// -------- инициализация --------
document.addEventListener("DOMContentLoaded", function () {
    addSet();
    petPanel("#item-left", true);
    addSet();
    petPanel("#item-active", false);
    addSet();
    petPanel("#item-right", true);
    changeSlider();
});

window.onresize = changeSlider;

// -------- определение количества карточек по ширине --------
function changeSlider() {
    const size = sizePage.clientWidth;
    carouselSize.style.left = `-${size}px`;
    if (size > 1071) {
        viewDone.view1 = 3;
    } else if (size < 1071 && size > 601) {
        viewDone.view1 = 2;
    } else if (size < 601) {
        viewDone.view1 = 1;
    }
}

// -------- общая функция заполнения панели --------
function petPanel(selector, clear = true) {
    const content = document.querySelector(`${selector} .content`);
    if (clear) {
        content.querySelectorAll(".card").forEach(el => el.remove());
    }

    for (let i = 0; i < 3; i++) {
        const clone = template.content.cloneNode(true);
        content.append(clone);
        const card = content.querySelectorAll(".card")[i];
        const k = +newSet[i];
        card.dataset.pet = shelter[k].name;
        card.dataset.id = shelter[k].id;
        const img = card.querySelector(".pet-img");
        img.src = shelter[k].img;
        img.alt = shelter[k].name;
        const nameSpan = card.querySelector(".pets-name");
        nameSpan.textContent = shelter[k].name;
    }
    afterLoad();
}

// -------- карусель (обработчики кнопок и анимация) --------
const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector(".button-right");
const carousel = document.querySelector("#carousel");
const itemLeft = document.querySelector("#item-left");
const itemRight = document.querySelector("#item-right");
const itemActive = document.querySelector("#item-active");

btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);

function moveRight() {
    const suffix = viewDone.view1 === 3 ? "" : viewDone.view1;
    carousel.classList.add(`move-right${suffix === 3 ? "" : suffix}`);
    btnRight.removeEventListener("click", moveRight);
    btnLeft.removeEventListener("click", moveLeft);
}

function moveLeft() {
    const suffix = viewDone.view1 === 3 ? "" : viewDone.view1;
    carousel.classList.add(`move-left${suffix === 3 ? "" : suffix}`);
    btnRight.removeEventListener("click", moveRight);
    btnLeft.removeEventListener("click", moveLeft);
}

carousel.addEventListener("animationend", (animationEvent) => {
    const name = animationEvent.animationName;
    carousel.classList.remove(
        "move-left", "move-left2", "move-left3",
        "move-right", "move-right2", "move-right3"
    );

    if (name.startsWith("go-left")) {
        // сдвиг влево
        itemRight.innerHTML = itemActive.innerHTML;
        itemActive.innerHTML = itemLeft.innerHTML;
        addSet();
        petPanel("#item-left", true);
    } else {
        // сдвиг вправо
        itemLeft.innerHTML = itemActive.innerHTML;
        itemActive.innerHTML = itemRight.innerHTML;
        addSet();
        petPanel("#item-right", true);
    }

    btnLeft.addEventListener("click", moveLeft);
    btnRight.addEventListener("click", moveRight);
    afterLoad();
});

// -------- генерация случайного набора индексов (0…7) --------
function addSet() {
    oldSet = newSet.slice();
    const activeIds = [];
    itemActive.querySelectorAll(".item .card").forEach(card => {
        activeIds.push(+card.dataset.id);
    });
    if (activeIds.length > 0) {
        oldSet = [];
    }
    newSet = [];
    for (let i = 0; i < 3; i++) {
        let nn;
        do {
            nn = Math.floor(Math.random() * 8);
        } while (activeIds.includes(nn) || newSet.includes(nn) || oldSet.includes(nn));
        newSet.push(nn);
    }
}