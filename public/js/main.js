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
const $allAnimeView = document.querySelector(".all-anime");
const $individualAnimeView = document.querySelector(".individual-anime");
const $animeContainer = document.querySelector(".anime-container");
const $animeSelect = document.getElementById("anime-select");
const $pageH1 = document.querySelector("h1");
const $loader = document.querySelector(".loader");
const $homeTag = document.querySelector(".home-tag");
const data = {
    view: "home",
    topAnime: {
        shows: [],
        lastRetrieved: 0,
    },
    airingAnime: {
        shows: [],
        lastRetrieved: 0,
    },
    upcomingAnime: {
        shows: [],
        lastRetrieved: 0,
    },
};
/** Getting the top anime of all time from the API and appending the images/titles to the home page */
function getTopAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch("https://api.jikan.moe/v4/top/anime");
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            data.topAnime.lastRetrieved = Date.now();
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.topAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener("click", () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap("anime");
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/** Getting the current top airing anime from the API and appending the images/titles to the home page */
function getTopAiringAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            data.airingAnime.lastRetrieved = Date.now();
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.airingAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener("click", () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap("anime");
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/** Getting the current top upcoming anime from the API and appending the images/titles to the home page */
function getTopUpcomingAnime() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoadingSpinner();
        const response = yield fetch("https://api.jikan.moe/v4/top/anime?filter=upcoming");
        const JSONData = yield response.json();
        const animeData = JSONData.data;
        if (animeData) {
            data.upcomingAnime.lastRetrieved = Date.now();
            for (let i = 0; i < animeData.length; i++) {
                const animeObject = animeData[i];
                data.upcomingAnime.shows.push(animeObject);
                const anime = animeObject;
                const renderedAnime = renderAnime(anime);
                renderedAnime.addEventListener("click", () => {
                    const $individualAnime = renderIndividualAnime(anime);
                    $individualAnimeView.appendChild($individualAnime);
                    viewSwap("anime");
                });
                $animeContainer.appendChild(renderedAnime);
            }
        }
        hideLoadingSpinner();
    });
}
/**
 * Creates the DOM elements for the anime image
 * @param anime - All details about the anime.
 * @returns A `div` element containing an image for the anime
 */
function renderAnimeImage(anime) {
    const $imgContainer = document.createElement("div");
    $imgContainer.setAttribute("class", "column-full image-container");
    const $img = document.createElement("img");
    $img.setAttribute("class", "border-color");
    $img.setAttribute("src", anime.images.jpg.image_url);
    $img.setAttribute("alt", anime.title);
    $img.setAttribute("title", anime.title);
    $imgContainer.appendChild($img);
    return $imgContainer;
}
/**
 * Creates the DOM elements for the anime info text
 * @param anime - All details about the anime.
 * @returns A `div` element containing the text content
 */
function renderAnimeText(anime) {
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
}
/**
 * Appends the anime text & anime image to the DOM
 * @param anime - All details about the anime.
 * @returns A `div` wrapper for the anime image and text
 */
function renderAnime(anime) {
    const $animeRow = document.createElement("div");
    $animeRow.setAttribute("class", "anime");
    const $animeImage = renderAnimeImage(anime);
    const $animeText = renderAnimeText(anime);
    $animeRow.appendChild($animeImage);
    $animeRow.appendChild($animeText);
    return $animeRow;
}
/**
 * Checks if the date passed in is less than an hour ago
 * @param date - A date number
 * @returns A boolean indicating if the date was less than an hour ago or not
 */
function lessThanOneHourAgo(date) {
    const HOUR = 1000 * 60 * 60;
    const anHourAgo = Date.now() - HOUR;
    return date < anHourAgo;
}
/** Removes all child nodes from anime container */
function resetAnimeContainer() {
    $animeContainer.replaceChildren();
}
/** Removes all child nodes from individual anime view */
function resetIndividualAnimeView() {
    $individualAnimeView.replaceChildren();
}
/** Changes the heading text based off of whatever type of anime was selected from dropdown */
function changeHeadingText(selectedAnime) {
    $pageH1.textContent = `${selectedAnime} Anime`;
}
/** Shows loading spinner */
function showLoadingSpinner() {
    $loader.classList.remove("hidden");
}
/** Hides loading spinner */
function hideLoadingSpinner() {
    $loader.classList.add("hidden");
}
/**
 * Creates the DOM elements for the individual anime view
 * @param anime - All details about the anime.
 * @returns A `div` element containing all the content for the anime
 */
function renderIndividualAnime(anime) {
    const $row = document.createElement("div");
    $row.className = "row flex-column";
    const $titleDiv = document.createElement("div");
    $titleDiv.className = "column-full";
    const $title = document.createElement("h2");
    $title.textContent = anime.title_english ? anime.title_english : anime.title;
    $title.className = "anime-page-title";
    const $animeContentDiv = document.createElement("div");
    $animeContentDiv.className = "anime-content column-full";
    const $imgDiv = document.createElement("div");
    $imgDiv.className = "column-full individual-image-container";
    const $img = document.createElement("img");
    $img.setAttribute("src", anime.images.jpg.large_image_url);
    $img.setAttribute("alt", anime.title_english ? anime.title_english : anime.title);
    $img.className = "individual-image";
    const $descDiv = document.createElement("div");
    $descDiv.className = "column-full anime-description";
    const $desc = document.createElement("p");
    $desc.textContent = anime.synopsis;
    const $iframeDiv = document.createElement("div");
    $iframeDiv.className = "column-full";
    const $iframe = document.createElement("iframe");
    $iframe.setAttribute("src", `https://www.youtube.com/embed/${anime.trailer.youtube_id}`);
    $iframe.setAttribute("title", `${$title.textContent} youtube trailer`);
    $iframe.setAttribute("loading", "lazy");
    $iframe.setAttribute("allow", "fullscreen picture-in-picture");
    $iframe.setAttribute("allowfullscreen", "true");
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
/** Shows or hides wrappers depending on which view was selected */
function viewSwap(viewName) {
    if (viewName === "home") {
        $allAnimeView.classList.remove("hidden");
        $individualAnimeView.classList.add("hidden");
        resetIndividualAnimeView();
    }
    else if (viewName === "anime") {
        $allAnimeView.classList.add("hidden");
        $individualAnimeView.classList.remove("hidden");
    }
    window.scrollTo(0, 0);
}
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
            renderedAnime.addEventListener("click", () => {
                const $individualAnime = renderIndividualAnime(anime);
                $individualAnimeView.appendChild($individualAnime);
                viewSwap("anime");
            });
            $animeContainer.appendChild(renderedAnime);
        }
    }
});
$homeTag.addEventListener("click", () => viewSwap("home"));
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
            getTopUpcomingAnime();
            break;
    }
});
