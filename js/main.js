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

const lessThanOneHourAgo = (date) => {
  const HOUR = 1000 * 60 * 60;
  const anHourAgo = Date.now() - HOUR;

  return date > anHourAgo;
}

window.addEventListener('DOMContentLoaded', () => {
  const dataIsLessThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
  console.log('older', dataIsLessThanOneHour);
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

const renderAnime = (anime) => {
  const $animeRow = document.createElement("div");
  $animeRow.setAttribute("class", "anime");

  const $animeImage = renderAnimeImage(anime);
  const $animeText = renderAnimeText(anime);

  $animeRow.appendChild($animeImage);
  $animeRow.appendChild($animeText);

  return $animeRow;
};

const truncateText = (words, maxLength) => {
  return `${words.slice(0, maxLength)} ...`;
};
