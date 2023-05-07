const $animeContainer = document.querySelector(".anime-container");
const $animeSelect = document.getElementById('anime-select');
const $pageH1 = document.querySelector('h1');

// Getting the top anime of all time from the API and appending the images/titles to the home page
const getTopAnime = async () => {
  try {
    showLoadingSpinner();
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const JSONData = await response.json();
    data.topAnime.lastRetrieved = Date.now();
    for (let i = 0; i < JSONData.data.length; i++) {
      hideLoadingSpinner();
      data.topAnime.shows.push(JSONData.data[i]);
      const anime = JSONData.data[i];
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  } catch (error) {
    console.error(error);
  }
}

const getTopAiringAnime = async () => {
  try {
    showLoadingSpinner();
    const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
    const JSONData = await response.json();
    data.airingAnime.lastRetrieved = Date.now();
    for (let i = 0; i < JSONData.data.length; i++) {
      hideLoadingSpinner();
      data.airingAnime.shows.push(JSONData.data[i]);
      const anime = JSONData.data[i];
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  } catch (error) {
    console.error(error);
  }
}

// Renders images for each anime
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

// Renders the text for each anime on the home page
const renderAnimeText = (anime) => {
  const $textContainer = document.createElement("div");
  $textContainer.setAttribute("class", "column-full text-container");

  const $animeTitle = document.createElement("h2");
  $animeTitle.textContent = anime.title_english ? anime.title_english : anime.title;

  const $animeScore = document.createElement("h3");
  $animeScore.textContent = `Rating: ${anime.score}`;

  $textContainer.appendChild($animeTitle);
  $textContainer.appendChild($animeScore);

  return $textContainer;
};

// Renders the whole anime container for each anime image & text
const renderAnime = (anime) => {
  const $animeRow = document.createElement("div");
  $animeRow.setAttribute("class", "anime");

  const $animeImage = renderAnimeImage(anime);
  const $animeText = renderAnimeText(anime);

  $animeRow.appendChild($animeImage);
  $animeRow.appendChild($animeText);

  return $animeRow;
};


// Check if the data passed in is less than an hour ago
const lessThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
}

const resetAnimeContainer = () => {
  $animeContainer.replaceChildren();
}

const changeHeadingText = (selectedAnime) => {
  $pageH1.textContent = `${selectedAnime} Anime`;
}

const showLoadingSpinner = () => {
  const $loader = document.querySelector('.loader');
  $loader.classList.remove('hidden');
}

const hideLoadingSpinner = () => {
  const $loader = document.querySelector('.loader');
  $loader.classList.add('hidden');
}

/// Once page loads, check if we have data or it's been an hour since the last request
window.addEventListener('DOMContentLoaded', () => {
  const dataIsLessThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
  if (data.topAnime.shows.length <= 0 || !dataIsLessThanOneHour) {
    getTopAnime();
  } else {
    for (let i = 0; i < data.topAnime.shows.length; i++) {
      const anime = data.topAnime.shows[i];
      const renderedAnime = renderAnime(anime);
      $animeContainer.appendChild(renderedAnime);
    }
  }
})

// Check which value was selected from dropdown, remove current showing anime shows and make api request
$animeSelect.addEventListener('change', () => {
  const selectValue = event.target.value;

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
})
