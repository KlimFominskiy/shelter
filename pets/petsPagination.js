"use strict";

let range = 0;               // текущая страница (индекс в массиве)
let maxRange = 6;            // общее количество страниц (зависит от размера)
let choosenBtn = 1;          // номер активной кнопки пагинации (1‑индексация)
let mas = [];                // массив индексов животных (0…7)
let viewDone = {
    view1: 1,                  // текущий режим: 1 (десктоп), 2 (планшет), 3 (мобильный)
    view2: 0                   // предыдущий режим (используется для определения смены размера)
};
let table = [];              // массив страниц для десктопа (6 страниц по 8 карточек)
let table2 = [];             // для планшета (8 страниц по 6 карточек)
let table3 = [];             // для мобильных (16 страниц по 3 карточки)

const centerBtn = document.querySelector(".nav-btn.center");
const endLeft = document.querySelector("#end-left");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const endRight = document.querySelector("#end-right");

// Импорт данных и функций
import shelter from "../assets/json/animal.js";
import afterLoad from "../main/popup.js";
const template = document.querySelector("#template");

// -------- инициализация ----------
document.addEventListener("DOMContentLoaded", function () {
    clickEventHandler();
    getBoard();
    loadPets();
});

window.onresize = function () {
    loadPets();
};

// -------- загрузка карточек с учётом размера окна ----------
function loadPets() {
    const size = window.innerWidth;
    if (size > 1071) {
        viewDone.view1 = 1;
        maxRange = 6;
    } else if (size < 1071 && size > 601) {
        viewDone.view1 = 2;
        maxRange = 8;
    } else if (size < 601) {
        viewDone.view1 = 3;
        maxRange = 16;
    }

    // если режим изменился – сбрасываем на первую страницу
    if (viewDone.view1 !== viewDone.view2) {
        range = 0;
        choosenBtn = 1;
        centerBtn.textContent = "1";
        endLeftRange();          // устанавливаем состояние кнопок (левые заблокированы)
        petPanel();
    }
}

// -------- обработка нажатий на кнопки пагинации ----------
function clickEventHandler() {
    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            onClickBTN(this);
        });
    });
}

function onClickBTN(btn) {
    const id = btn.getAttribute("id");
    switch (id) {
        case "end-right":
            range = maxRange - 1;
            choosenBtn = maxRange;
            endRightRange();
            break;
        case "right":
            range++;
            choosenBtn++;
            enableBtnLeft();
            if (choosenBtn === maxRange) {
                range = maxRange - 1;
                endRightRange();
            }
            break;
        case "left":
            range--;
            choosenBtn--;
            enableBtnRight();
            if (choosenBtn === 1) {
                range = 0;
                endLeftRange();
            }
            break;
        case "end-left":
            range = 0;
            choosenBtn = 1;
            endLeftRange();
            break;
        case "center":
            // ничего не делаем
            break;
    }
    centerBtn.textContent = choosenBtn.toString();
    petPanel();
}

// -------- вспомогательные функции для управления состоянием кнопок ----------
function enableBtnLeft() {
    left.classList.add("active-btn");
    endLeft.classList.add("active-btn");
    left.classList.remove("none-active");
    endLeft.classList.remove("none-active");
    left.disabled = false;
    endLeft.disabled = false;
}

function enableBtnRight() {
    right.classList.add("active-btn");
    endRight.classList.add("active-btn");
    right.classList.remove("none-active");
    endRight.classList.remove("none-active");
    right.disabled = false;
    endRight.disabled = false;
}

function endLeftRange() {
    // активируем правые кнопки
    right.classList.add("active-btn");
    endRight.classList.add("active-btn");
    right.classList.remove("none-active");
    endRight.classList.remove("none-active");
    right.disabled = false;
    endRight.disabled = false;
    // блокируем левые
    left.classList.remove("active-btn");
    endLeft.classList.remove("active-btn");
    left.classList.add("none-active");
    endLeft.classList.add("none-active");
    left.disabled = true;
    endLeft.disabled = true;
}

function endRightRange() {
    // активируем левые
    left.classList.add("active-btn");
    endLeft.classList.add("active-btn");
    left.classList.remove("none-active");
    endLeft.classList.remove("none-active");
    left.disabled = false;
    endLeft.disabled = false;
    // блокируем правые
    right.classList.remove("active-btn");
    endRight.classList.remove("active-btn");
    right.classList.add("none-active");
    endRight.classList.add("none-active");
    right.disabled = true;
    endRight.disabled = true;
}

// -------- отрисовка карточек ----------
function petPanel() {
    const container = document.querySelector("#item-active");

    // при смене размера очищаем контейнер (перерисовка с нуля)
    if (viewDone.view1 !== viewDone.view2) {
        container.innerHTML = "";
    }

    let currentTable;
    switch (viewDone.view1) {
        case 1:
            currentTable = table;
            break;
        case 2:
            currentTable = table2;
            break;
        case 3:
            currentTable = table3;
            break;
        default:
            return;
    }

    const page = currentTable[range];
    if (!page) return;

    // если контейнер пуст, заполняем его шаблонами
    const existingCards = container.querySelectorAll(".card");
    if (existingCards.length === 0) {
        for (let i = 0; i < page.length; i++) {
            loadContent();
        }
    }

    const cards = container.querySelectorAll(".card");
    page.forEach((id, index) => {
        const card = cards[index];
        if (!card) return;
        card.dataset.pet = shelter[id].name;
        card.dataset.id = shelter[id].id;
        card.classList.add("animate");
        const img = card.querySelector(".pet-img");
        img.src = shelter[id].img;
        img.alt = shelter[id].name;
        const nameSpan = card.querySelector(".pets-name");
        nameSpan.textContent = shelter[id].name;
    });

    afterLoad(); // добавление слушателей на кнопки "Learn more"
    viewDone.view2 = viewDone.view1;
}

function loadContent() {
    const clone = template.content.cloneNode(true);
    document.querySelector("#item-active").append(clone);
}

// -------- перемешивание массива (алгоритм Фишера-Йетса) ----------
function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function createMas() {
    mas = [];
    for (let i = 0; i < 8; i++) {
        mas.push(i);
    }
    return mas;
}

// -------- формирование таблиц для разных разрешений ----------
function getBoard() {
    createMas();
    table = [];
    table2 = [];
    table3 = [];

    let table21 = [];
    let table22 = [];
    let table31 = [];
    let table32 = [];

    // 6 страниц по 8 карточек (десктоп)
    for (let row = 0; row < 6; row++) {
        table[row] = new Array(8);
        table21[row] = new Array(6);   // первая часть для table2 (6 строк)
        table31[row] = new Array(3);   // для table3 (первая половина)
        table32[row] = new Array(3);   // для table3 (вторая половина)

        mas = shuffle(mas);
        const mas21 = mas.slice(0, 6);
        const mas31 = mas.slice(0, 4);
        const mas32 = mas.slice(4, 8);

        for (let col = 0; col < 8; col++) {
            table[row][col] = mas[col];
        }
        for (let col = 0; col < 6; col++) {
            table21[row][col] = mas21[col];
        }
        // первые 3 строки из 4 для table31 (используем только первые 3 из 4, но в оригинале берётся 4 и потом всё равно 3)
        // В оригинале: mas31 = table2[row].slice(0,3) позже, а здесь мы пока заполняем table31 и table32, но потом пересобираем table3.
        // Оставим как в оригинале: там после цикла собирается table3 из table31 и table32, которые формируются позже.
        // Поэтому здесь просто заполняем table31 и table32 нулями или оставляем пустыми.
        // В оригинале table31 и table32 заполняются в отдельном цикле ниже.
    }

    // доформируем table21 и table22
    for (let row22 = 0; row22 < 2; row22++) {
        table22[row22] = new Array(6);
        const mas22 = shuffle([...mas]).slice(0, 6);
        for (let col = 0; col < 6; col++) {
            table22[row22][col] = mas22[col];
        }
    }
    table2 = table21.concat(table22);

    // теперь формируем table3 (16 страниц по 3 карточки)
    // используем table2 как основу
    for (let row = 0; row < 8; row++) {
        table31[row] = new Array(3);
        table32[row] = new Array(3);
        const rowData = table2[row];
        const firstHalf = rowData.slice(0, 3);
        const secondHalf = rowData.slice(3, 6);
        for (let col = 0; col < 3; col++) {
            table31[row][col] = firstHalf[col];
            table32[row][col] = secondHalf[col];
        }
    }
    table3 = table31.concat(table32);
}