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
const $allAnimeView = document.querySelector('.all-anime');
const $individualAnimeView = document.querySelector('.individual-anime');
const $animeContainer = document.querySelector('.anime-container');
const $animeSelect = document.getElementById('anime-select');
const $pageH1 = document.querySelector('h1');
const $loader = document.querySelector('.loader');
const $homeTag = document.querySelector('.home-tag');
const $lightBulb = document.querySelector('.light-dark-mode');
const $pageContainer = document.querySelector('.page-container');
const localStorageTheme = localStorage.getItem('theme');
const data = {
    theme: localStorageTheme ? localStorageTheme : 'light',
    topAnime: {
        shows: [],
    },
    airingAnime: {
        shows: [],
    },
    upcomingAnime: {
        shows: [],
    },
};
/**
 * Fetches the top anime of all time from the API and appends the images/titles to the home page.
 *
 * @async
 * @returns {Promise<void>} Appends anime data to the home page once fetched from the API.
 */
function getTopAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch('https://api.jikan.moe/v4/top/anime');
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.topAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener('click', () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap('anime');
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/**
 * Fetches the top airing anime from the API and appends the images/titles to the home page.
 *
 * @async
 * @returns {Promise<void>} Appends anime data to the home page once fetched from the API.
 */
function getTopAiringAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch('https://api.jikan.moe/v4/top/anime?filter=airing');
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.airingAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener('click', () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap('anime');
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/**
 * Fetches the top upcoming anime from the API and appends the images/titles to the home page.
 *
 * @async
 * @returns {Promise<void>} Appends anime data to the home page once fetched from the API.
 */
function getTopUpcomingAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch('https://api.jikan.moe/v4/top/anime?filter=upcoming');
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.upcomingAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener('click', () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap('anime');
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/**
 * Creates a DOM element containing the anime image.
 *
 * @param {AnimeData} anime - An object containing all the details about the anime.
 * @returns {HTMLDivElement} A `div` element containing an image for the anime
 */
function renderAnimeImage(anime) {
    const $imgContainer = document.createElement('div');
    $imgContainer.setAttribute('class', 'column-full image-container');
    const $img = document.createElement('img');
    $img.setAttribute('class', 'border-color');
    $img.setAttribute('src', anime.images.jpg.image_url);
    $img.setAttribute('alt', anime.title);
    $img.setAttribute('title', anime.title);
    $imgContainer.appendChild($img);
    return $imgContainer;
}
/**
 * Creates a DOM element containing the anime's title and score information.
 *
 * @param {AnimeData} anime - An object containing all the details about the anime.
 * @returns {HTMLDivElement} A `div` element containing the anime's title and score.
 */
function renderAnimeText(anime) {
    const $textContainer = document.createElement('div');
    $textContainer.setAttribute('class', 'column-full text-container');
    const $animeTitle = document.createElement('h2');
    $animeTitle.textContent = anime.title_english
        ? anime.title_english
        : anime.title;
    const $animeScore = document.createElement('h3');
    $animeScore.textContent = `Rating: ${anime.score ? anime.score : 'N/A'}`;
    $textContainer.appendChild($animeTitle);
    $textContainer.appendChild($animeScore);
    return $textContainer;
}
/**
 * Appends the anime text and anime image to the DOM inside a wrapper element.
 *
 * @param {AnimeData} anime - An object containing all details about the anime.
 * @returns {HTMLDivElement} A `div` element wrapping both the anime image and text.
 */
function renderAnime(anime) {
    const $animeRow = document.createElement('div');
    $animeRow.setAttribute('class', 'anime');
    const $animeImage = renderAnimeImage(anime);
    const $animeText = renderAnimeText(anime);
    $animeRow.appendChild($animeImage);
    $animeRow.appendChild($animeText);
    return $animeRow;
}
/**
 * Removes all child nodes from the anime container, effectively resetting it.
 *
 * @returns {void}
 */
function resetAnimeContainer() {
    $animeContainer.replaceChildren();
}
/** Removes all child nodes from individual anime view, effectively resetting it.
 *
 * @returns {void}
 */
function resetIndividualAnimeView() {
    $individualAnimeView.replaceChildren();
}
/**
 * Updates the page heading text based on the selected anime from the dropdown.
 *
 * @param {string} selectedAnime - The name of the selected anime category.
 * @returns {void}
 */
function changeHeadingText(selectedAnime) {
    $pageH1.textContent = `${selectedAnime} Anime`;
}
/**
 * Displays the loading spinner by removing the `hidden` class.
 *
 * @returns {void}
 */
function showLoadingSpinner() {
    $loader.classList.remove('hidden');
}
/**
 * Hides the loading spinner by adding the `hidden` class.
 *
 * @returns {void}
 */
function hideLoadingSpinner() {
    $loader.classList.add('hidden');
}
/**
 * Creates the DOM elements for the individual anime view
 * @param {AnimeData} anime - An object containing all the details about the anime.
 * @returns {HTMLDivElement} A `div` element containing all the content for the anime
 */
function renderIndividualAnime(anime) {
    const $row = document.createElement('div');
    $row.className = 'row flex-column';
    const $titleDiv = document.createElement('div');
    $titleDiv.className = 'column-full';
    const $title = document.createElement('h2');
    $title.textContent = anime.title_english ? anime.title_english : anime.title;
    $title.className = 'anime-page-title';
    const $animeContentDiv = document.createElement('div');
    $animeContentDiv.className = 'anime-content column-full';
    const $imgDiv = document.createElement('div');
    $imgDiv.className = 'column-full individual-image-container';
    const $img = document.createElement('img');
    $img.setAttribute('src', anime.images.jpg.large_image_url);
    $img.setAttribute('alt', anime.title_english ? anime.title_english : anime.title);
    $img.className = 'individual-image';
    const $descDiv = document.createElement('div');
    $descDiv.className = 'column-full anime-description';
    const $desc = document.createElement('p');
    $desc.textContent = anime.synopsis;
    const $iframeDiv = document.createElement('div');
    $iframeDiv.className = 'column-full';
    const $iframe = document.createElement('iframe');
    $iframe.setAttribute('src', `https://www.youtube.com/embed/${anime.trailer.youtube_id}`);
    $iframe.setAttribute('title', `${$title.textContent} youtube trailer`);
    $iframe.setAttribute('loading', 'lazy');
    $iframe.setAttribute('allow', 'fullscreen; picture-in-picture;');
    $iframe.setAttribute('allowfullscreen', '');
    $row.appendChild($titleDiv);
    $row.appendChild($animeContentDiv);
    $animeContentDiv.appendChild($imgDiv);
    $animeContentDiv.appendChild($descDiv);
    $row.appendChild($iframeDiv);
    $titleDiv.appendChild($title);
    $imgDiv.appendChild($img);
    $descDiv.appendChild($desc);
    $iframeDiv.appendChild($iframe);
    return $row;
}
/**
 * Shows or hides content wrappers based on the selected view.
 *
 * @param {string} viewName - The name of the view to display ('home' or 'anime').
 * @returns {void}
 */
function viewSwap(viewName) {
    if (viewName === 'home') {
        $allAnimeView.classList.remove('hidden');
        $individualAnimeView.classList.add('hidden');
        resetIndividualAnimeView();
    }
    else if (viewName === 'anime') {
        $allAnimeView.classList.add('hidden');
        $individualAnimeView.classList.remove('hidden');
    }
    window.scrollTo(0, 0);
}
/**
 * Changes the website theme to either light or dark mode and updates localStorage, CSS variables, and relevant DOM elements.
 *
 * @param {string} theme - The name of the theme to apply ('light' or 'dark').
 * @returns {void}
 */
const root = document.documentElement;
function changeTheme(theme) {
    if (theme === 'light') {
        data.theme = 'light';
        localStorage.setItem('theme', data.theme);
        root.style.setProperty('--accent', '#1e152a');
        root.style.setProperty('--main', '#f2f5ea');
        $pageContainer.dataset.theme = 'light';
        $lightBulb.className = 'fas fa-lightbulb light-dark-mode';
    }
    else if (theme === 'dark') {
        data.theme = 'dark';
        localStorage.setItem('theme', data.theme);
        root.style.setProperty('--accent', '#301E67');
        root.style.setProperty('--main', '#03001C');
        $pageContainer.dataset.theme = 'dark';
        $lightBulb.className = 'far fa-lightbulb light-dark-mode';
    }
}
/**
 * Handles changes to the anime selection dropdown. Based on the selected value, it resets the anime container, updates the heading text, and fetches the relevant anime data.
 *
 * @returns {void}
 */
$animeSelect.addEventListener('change', () => {
    const selectValue = $animeSelect.value;
    switch (selectValue) {
        case 'Top':
            resetAnimeContainer();
            changeHeadingText('Top');
            getTopAnime();
            break;
        case 'Airing':
            resetAnimeContainer();
            changeHeadingText('Top Airing');
            getTopAiringAnime();
            break;
        case 'Upcoming':
            resetAnimeContainer();
            changeHeadingText('Top Upcoming');
            getTopUpcomingAnime();
            break;
    }
});
/**
 * Once the DOM content has loaded, it changes the theme and fetches the top anime.
 *
 * @returns {void}
 */
window.addEventListener('DOMContentLoaded', () => {
    changeTheme(data.theme);
    getTopAnime();
});
/**
 * Handles clicks on the home tag. It changes the view to the home page.
 *
 * @returns {void}
 */
$homeTag.addEventListener('click', () => viewSwap('home'));
/**
 * Handles clicks on the light bulb. It changes the theme to light or dark mode.
 *
 * @returns {void}
 */
$lightBulb.addEventListener('click', () => {
    if (data.theme === 'dark') {
        changeTheme('light');
    }
    else if (data.theme === 'light') {
        changeTheme('dark');
    }
});
