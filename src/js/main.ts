const $animeContainer = document.querySelector(
  ".anime-container"
) as HTMLDivElement;
const $animeSelect = document.getElementById(
  "anime-select"
) as HTMLSelectElement;
const $pageH1 = document.querySelector("h1") as HTMLHeadingElement;

interface APIResponse {
  pagination: object;
  data: object[];
}

/** Getting the top anime of all time from the API and appending the images/titles to the home page */
const getTopAnime = async () => {
  showLoadingSpinner();
  const response = await fetch("https://api.jikan.moe/v4/top/anime");
  const JSONData: APIResponse = await response.json();
  if (JSONData.data) {
    data.topAnime.lastRetrieved = Date.now();
    for (let i = 0; i < JSONData.data.length; i++) {
      data.topAnime.shows.push(JSONData.data[i]);
      const anime = JSONData.data[i];
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
  if (JSONData.data) {
    data.airingAnime.lastRetrieved = Date.now();
    for (let i = 0; i < JSONData.data.length; i++) {
      const test: object = JSONData.data[i];
      data.airingAnime.shows.push(test);
      const anime = JSONData.data[i];
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
const renderAnimeImage = (anime: object) => {
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
 */
const renderAnimeText = (anime: object) => {
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
 */
const renderAnime = (anime: object) => {
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
  const $loader = document.querySelector(".loader");
  $loader.classList.remove("hidden");
};

const hideLoadingSpinner = () => {
  const $loader = document.querySelector(".loader");
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
      const anime = data.topAnime.shows[i];
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  }
});

/** Check which value was selected from dropdown, remove current showing anime shows and make api request */
$animeSelect.addEventListener("change", () => {
  const selectValue = event.target.value;
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
