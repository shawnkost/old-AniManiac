var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var $animeContainer = document.querySelector(".anime-container");
var $animeSelect = document.getElementById("anime-select");
var $pageH1 = document.querySelector("h1");
/** Getting the top anime of all time from the API and appending the images/titles to the home page */
var getTopAnime = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, JSONData, i, anime, renderedAnime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                showLoadingSpinner();
                return [4 /*yield*/, fetch("https://api.jikan.moe/v4/top/anime")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                JSONData = _a.sent();
                if (JSONData.data) {
                    data.topAnime.lastRetrieved = Date.now();
                    for (i = 0; i < JSONData.data.length; i++) {
                        data.topAnime.shows.push(JSONData.data[i]);
                        anime = JSONData.data[i];
                        renderedAnime = renderAnime(anime);
                        $animeContainer.appendChild(renderedAnime);
                    }
                }
                hideLoadingSpinner();
                return [2 /*return*/];
        }
    });
}); };
/** Getting the current top airing anime from the API and appending the images/titles to the home page */
var getTopAiringAnime = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, JSONData, i, test, anime, renderedAnime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                showLoadingSpinner();
                return [4 /*yield*/, fetch("https://api.jikan.moe/v4/top/anime?filter=airing")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                JSONData = _a.sent();
                if (JSONData.data) {
                    data.airingAnime.lastRetrieved = Date.now();
                    for (i = 0; i < JSONData.data.length; i++) {
                        test = JSONData.data[i];
                        data.airingAnime.shows.push(test);
                        anime = JSONData.data[i];
                        renderedAnime = renderAnime(anime);
                        $animeContainer.appendChild(renderedAnime);
                    }
                }
                hideLoadingSpinner();
                return [2 /*return*/];
        }
    });
}); };
/**
 * Creates the DOM elements for the anime image
 * @param {object} anime - All details about the anime.
 */
var renderAnimeImage = function (anime) {
    var $imgContainer = document.createElement("div");
    $imgContainer.setAttribute("class", "column-full image-container");
    var $img = document.createElement("img");
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
 */
var renderAnimeText = function (anime) {
    var $textContainer = document.createElement("div");
    $textContainer.setAttribute("class", "column-full text-container");
    var $animeTitle = document.createElement("h2");
    $animeTitle.textContent = anime.title_english
        ? anime.title_english
        : anime.title;
    var $animeScore = document.createElement("h3");
    $animeScore.textContent = "Rating: ".concat(anime.score);
    $textContainer.appendChild($animeTitle);
    $textContainer.appendChild($animeScore);
    return $textContainer;
};
/**
 * Appends the anime text & anime image to the DOM
 * @param {object} anime - All details about the anime.
 */
var renderAnime = function (anime) {
    var $animeRow = document.createElement("div");
    $animeRow.setAttribute("class", "anime");
    var $animeImage = renderAnimeImage(anime);
    var $animeText = renderAnimeText(anime);
    $animeRow.appendChild($animeImage);
    $animeRow.appendChild($animeText);
    return $animeRow;
};
/**
 * Checks if the date passed in is less than an hour ago
 * @param {number} date - A date number
 */
var lessThanOneHourAgo = function (date) {
    var HOUR = 1000 * 60 * 60;
    var anHourAgo = Date.now() - HOUR;
    return date > anHourAgo;
};
var resetAnimeContainer = function () {
    $animeContainer.replaceChildren();
};
var changeHeadingText = function (selectedAnime) {
    $pageH1.textContent = "".concat(selectedAnime, " Anime");
};
var showLoadingSpinner = function () {
    var $loader = document.querySelector(".loader");
    $loader.classList.remove("hidden");
};
var hideLoadingSpinner = function () {
    var $loader = document.querySelector(".loader");
    $loader.classList.add("hidden");
};
/** Once the content loads, renders top anime either from localStorage or api depending on how old data is */
window.addEventListener("DOMContentLoaded", function () {
    var dataIsLessThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
    if (data.topAnime.shows.length <= 0 || !dataIsLessThanOneHour) {
        data.topAnime.shows = [];
        getTopAnime();
    }
    else {
        for (var i = 0; i < data.topAnime.shows.length; i++) {
            var anime = data.topAnime.shows[i];
            var renderedAnime = renderAnime(anime);
            $animeContainer.appendChild(renderedAnime);
        }
    }
});
/** Check which value was selected from dropdown, remove current showing anime shows and make api request */
$animeSelect.addEventListener("change", function () {
    var selectValue = event.target.value;
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
