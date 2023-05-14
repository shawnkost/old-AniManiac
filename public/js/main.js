"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const $animeContainer = document.querySelector(".anime-container");
const $animeSelect = document.getElementById("anime-select");
const $pageH1 = document.querySelector("h1");
const $loader = document.querySelector(".loader");
/** Getting the top anime of all time from the API and appending the images/titles to the home page */
const getTopAnime = () => __awaiter(void 0, void 0, void 0, function* () {
    showLoadingSpinner();
    const response = yield fetch("https://api.jikan.moe/v4/top/anime");
    const JSONData = yield response.json();
    console.log('JSONData', JSONData);
    const animeData = JSONData.data;
    if (animeData) {
        data.topAnime.lastRetrieved = Date.now();
        for (let i = 0; i < animeData.length; i++) {
            const animeObject = animeData[i];
            data.topAnime.shows.push(animeObject);
            const anime = animeObject;
            const renderedAnime = renderAnime(anime);
            $animeContainer.appendChild(renderedAnime);
        }
    }
    hideLoadingSpinner();
});
/** Getting the current top airing anime from the API and appending the images/titles to the home page */
const getTopAiringAnime = () => __awaiter(void 0, void 0, void 0, function* () {
    showLoadingSpinner();
    const response = yield fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
    const JSONData = yield response.json();
    if (JSONData.data) {
        data.airingAnime.lastRetrieved = Date.now();
        for (let i = 0; i < JSONData.data.length; i++) {
            const test = JSONData.data[i];
            data.airingAnime.shows.push(test);
            const anime = JSONData.data[i];
            const renderedAnime = renderAnime(anime);
            $animeContainer.appendChild(renderedAnime);
        }
    }
    hideLoadingSpinner();
});
/**
 * Creates the DOM elements for the anime image
 * @param {object} anime - All details about the anime.
 */
const renderAnimeImage = (anime) => {
    const $imgContainer = document.createElement("div");
    $imgContainer.setAttribute("class", "column-full image-container");
    const $img = document.createElement("img");
    $img.setAttribute("class", "border-color");
    $img.setAttribute("src", anime.images.jpg.image_url);
    $img.setAttribute("alt", anime.title);
    $img.setAttribute("title", anime.title);
    $imgContainer.appendChild($img);
    return $imgContainer;
};
/**
 * Creates the DOM elements for the anime info text
 * @param {object} anime - All details about the anime.
 * @returns {HTMLDivElement}
 */
const renderAnimeText = (anime) => {
    const $textContainer = document.createElement("div");
    $textContainer.setAttribute("class", "column-full text-container");
    const $animeTitle = document.createElement("h2");
    $animeTitle.textContent = anime.title_english
        ? anime.title_english
        : anime.title;
    const $animeScore = document.createElement("h3");
    $animeScore.textContent = `Rating: ${anime.score}`;
    $textContainer.appendChild($animeTitle);
    $textContainer.appendChild($animeScore);
    return $textContainer;
};
/**
 * Appends the anime text & anime image to the DOM
 * @param {object} anime - All details about the anime.
 * @returns {HTMLDivElement} The DOM element for each anime container
 */
const renderAnime = (anime) => {
    const $animeRow = document.createElement("div");
    $animeRow.setAttribute("class", "anime");
    const $animeImage = renderAnimeImage(anime);
    const $animeText = renderAnimeText(anime);
    $animeRow.appendChild($animeImage);
    $animeRow.appendChild($animeText);
    return $animeRow;
};
/**
 * Checks if the date passed in is less than an hour ago
 * @param {number} date - A date number
 * @returns {boolean} True if the date passed in is less than an hour ago
 */
const lessThanOneHourAgo = (date) => {
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;
    return date > anHourAgo;
};
const resetAnimeContainer = () => {
    $animeContainer.replaceChildren();
};
const changeHeadingText = (selectedAnime) => {
    $pageH1.textContent = `${selectedAnime} Anime`;
};
const showLoadingSpinner = () => {
    $loader.classList.remove("hidden");
};
const hideLoadingSpinner = () => {
    $loader.classList.add("hidden");
};
/** Once the content loads, renders top anime either from localStorage or api depending on how old data is */
window.addEventListener("DOMContentLoaded", () => {
    const dataIsLessThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
    if (data.topAnime.shows.length <= 0 || !dataIsLessThanOneHour) {
        data.topAnime.shows = [];
        getTopAnime();
    }
    else {
        for (let i = 0; i < data.topAnime.shows.length; i++) {
            const anime = data.topAnime.shows[i];
            const renderedAnime = renderAnime(anime);
            $animeContainer.appendChild(renderedAnime);
        }
    }
});
/** Check which value was selected from dropdown, remove current showing anime shows and make api request */
$animeSelect.addEventListener("change", () => {
    const selectValue = $animeSelect.value;
    switch (selectValue) {
        case "Top":
            resetAnimeContainer();
            changeHeadingText("Top");
            getTopAnime();
            break;
        case "Airing":
            resetAnimeContainer();
            changeHeadingText("Top Airing");
            getTopAiringAnime();
            break;
        case "Upcoming":
            resetAnimeContainer();
            changeHeadingText("Top Upcoming");
            // getTopUpcomingAnime();
            break;
    }
});
