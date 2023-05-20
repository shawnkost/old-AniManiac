const $animeContainer = document.querySelector(
  ".anime-container"
) as HTMLDivElement;
const $animeSelect = document.getElementById(
  "anime-select"
) as HTMLSelectElement;
const $pageH1 = document.querySelector("h1") as HTMLHeadingElement;
const $loader = document.querySelector(".loader") as HTMLDivElement;

interface APIResponse {
  pagination: object;
  data: AnimeData[];
}

interface AnimeData {
  mal_id: number;
  url: string;
  images: object;
  trailer: object;
  approved: boolean;
  titles: object[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: object[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: object;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  season: string;
  year: number;
}

/** Getting the top anime of all time from the API and appending the images/titles to the home page */
const getTopAnime = async () => {
  showLoadingSpinner();
  const response = await fetch("https://api.jikan.moe/v4/top/anime");
  const JSONData: APIResponse = await response.json();
  const animeData: AnimeData[] = JSONData.data;
  if (animeData) {
    data.topAnime.lastRetrieved = Date.now();
    for (let i = 0; i < animeData.length; i++) {
      const animeObject = animeData[i];
      data.topAnime.shows.push(animeObject);
      const anime: AnimeData = animeObject;
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  }
  hideLoadingSpinner();
};

/** Getting the current top airing anime from the API and appending the images/titles to the home page */
const getTopAiringAnime = async () => {
  showLoadingSpinner();
  const response = await fetch(
    "https://api.jikan.moe/v4/top/anime?filter=airing"
  );
  const JSONData: APIResponse = await response.json();
  const animeData: AnimeData[] = JSONData.data;
  if (animeData) {
    data.airingAnime.lastRetrieved = Date.now();
    for (let i = 0; i < animeData.length; i++) {
      const animeObject = animeData[i];
      data.airingAnime.shows.push(animeObject);
      const anime: AnimeData = animeObject;
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  }
  hideLoadingSpinner();
};

/** Getting the current top upcoming anime from the API and appending the images/titles to the home page */
const getTopUpcomingAnime = async () => {
  showLoadingSpinner();
  const response = await fetch(
    "https://api.jikan.moe/v4/top/anime?filter=upcoming"
  );
  const JSONData: APIResponse = await response.json();
  const animeData: AnimeData[] = JSONData.data;
  if (animeData) {
    data.upcomingAnime.lastRetrieved = Date.now();
    for (let i = 0; i < animeData.length; i++) {
      const animeObject = animeData[i];
      data.upcomingAnime.shows.push(animeObject);
      const anime: AnimeData = animeObject;
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  }
  hideLoadingSpinner();
};

/**
 * Creates the DOM elements for the anime image
 * @param {object} anime - All details about the anime.
 */
const renderAnimeImage = (anime: AnimeData) => {
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
 * @param {AnimeData} anime - All details about the anime.
 * @returns {HTMLDivElement}
 */
const renderAnimeText = (anime: AnimeData) => {
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
const renderAnime = (anime: AnimeData) => {
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
const lessThanOneHourAgo = (date: number) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
};

const resetAnimeContainer = () => {
  $animeContainer.replaceChildren();
};

const changeHeadingText = (selectedAnime: string) => {
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
  } else {
    for (let i = 0; i < data.topAnime.shows.length; i++) {
      const anime: AnimeData = data.topAnime.shows[i];
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
      getTopUpcomingAnime();
      break;
  }
});
