const $topAnime = document.querySelector(".anime-container");

// Getting the top anime of all time from the API and appending the images/titles to the home page
const getTopAnime = async () => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const JSONData = await response.json();
    data.topAnime.lastRetrieved = Date.now();
    for (let i = 0; i < JSONData.data.length; i++) {
      data.topAnime.shows.push(JSONData.data[i]);
      const anime = JSONData.data[i];
      const renderedAnime = renderAnime(anime);
      $topAnime.appendChild(renderedAnime);
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
  $animeTitle.textContent = anime.title_english;

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

/// Once page loads, check if we have data or it's been an hour since the last request
window.addEventListener('DOMContentLoaded', () => {
  const dataIsLessThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
  if (data.topAnime.shows.length <= 0 || !dataIsLessThanOneHour) {
    getTopAnime();
  } else {
    for (let i = 0; i < data.topAnime.shows.length; i++) {
      const anime = data.topAnime.shows[i];
      const renderedAnime = renderAnime(anime);
      $topAnime.appendChild(renderedAnime);
    }
  }
})
