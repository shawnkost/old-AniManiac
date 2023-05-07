const $topAnime = document.querySelector(".anime-container");

// Getting the top anime of all time from the API and appending the images/titles to the home page
const getTopAnime = async () => {
  const currentTime = Date.now();
  const dataIsHourOld = lessThanOneHourAgo(currentTime);

  if (data.topAnime && !dataIsHourOld) {
    return;
  }

  const newObj = {
    shows: [],
    lastRetrieved: ''
  };
  
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime");
    const JSONData = await response.json();
    data.topAnime.shows = JSONData.data;
    for (let i = 0; i < JSONData.data.length; i++) {
      newObj.shows.push(JSONData.data[i]);
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
  const dataIsOlderThanOneHour = lessThanOneHourAgo(data.topAnime.lastRetrieved);
  if (data.topAnime.length <= 0 && !dataIsOlderThanOneHour) {
    getTopAnime();
  } else {
    for (let i = 0; i < data.topAnime.length; i++) {
      const anime = data.topAnime[i];
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
  // $img.addEventListener('click', event => {
  //   data.view = 'details';
  //   // viewSwap();
  //   // loopOverAnime(xhr, event);
  // });

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

  // const $animeDescription = document.createElement("p");
  const isMobile = window.innerWidth <= 768;
  let numberToTruncate = 150;
  if (isMobile) {
    numberToTruncate = window.innerWidth - 225;
  }
  // const truncatedText = truncateText(anime.synopsis, numberToTruncate);
  // $animeDescription.textContent = truncatedText;

  $textContainer.appendChild($animeTitle);
  $textContainer.appendChild($animeScore);
  // $textContainer.appendChild($animeDescription);

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

// window.addEventListener('DOMContentLoaded', () => {
//   createTheme();
//   viewSwap();
// });

// const $homeTag = document.querySelector('.home-tag');

// $homeTag.addEventListener('click', () => {
//   data.view = 'home';
//   viewSwap();
// });

// const $userTag = document.querySelector('.user-tag');

// $userTag.addEventListener('click', () => {
//   data.view = 'list';
//   viewSwap();
// });

// const $searchButton = document.querySelector('.search-button');

// $searchButton.addEventListener('click', () => {
//   submitSearch();
// });

// const $searchInput = document.querySelector('.search-input');

// $searchInput.addEventListener('keydown', event => {
//   if (event.key === 'Enter') {
//     submitSearch();
//   }
// });

// const $userNameInput = document.querySelector('.username-input');

// $userNameInput.addEventListener('keydown', event => {
//   if (event.key === 'Enter') {
//     getAnimeList();
//   }
// });

// const $userNameButton = document.querySelector('.username-button');

// $userNameButton.addEventListener('click', () => {
//   getAnimeList();
//   disableBtn();
//   window.setTimeout(() => {
//     enableBtn();
//   }, 3000);
// });

// const disableBtn = () => {
//   $userNameButton.disabled = true;
// };

// const enableBtn = () => {
//   $userNameButton.disabled = false;
// };

// const $detailsRow = document.querySelector('.details-row');
// const $bioRow = document.querySelector('.bio-row');
// const $iFrameRow = document.querySelector('.iframe-row');

// // searching for the anime the user inputted in the search bar and clearing any previous data
// const submitSearch = () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open(
//     'GET',
//     `https://api.jikan.moe/v3/search/anime?q=${$searchInput.value}&page=1`
//   );
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', () => {
//     $detailsRow.innerHTML = '';
//     $bioRow.innerHTML = '';
//     $iFrameRow.innerHTML = '';
//     data.view = 'details';
//     viewSwap();
//     searchAnime(xhr);
//   });
//   $searchInput.value = '';
//   xhr.onerror = () => {
//     alert('An unexpected error occurred');
//   };
//   xhr.send();
// };

// // sending an API request for the specific title that was searched and creating a dom tree with the results

// const searchAnime = xhr => {
//   window.scrollTo(0, 0);
//   const loader = document.createElement('div');
//   loader.setAttribute('class', 'loader');
//   $detailsRow.appendChild(loader);
//   const xhr2 = new XMLHttpRequest();
//   xhr2.open(
//     'GET',
//     `https://api.jikan.moe/v3/anime/${xhr.response.results[0].mal_id}`
//   );
//   xhr2.responseType = 'json';
//   xhr2.addEventListener('load', () => {
//     const $animeTitle = document.createElement('div');
//     const $animeImgContainer = document.createElement('div');
//     const $animeImg = document.createElement('img');
//     const $synopsis = document.createElement('div');
//     $animeTitle.setAttribute('class', 'anime-title');
//     $animeTitle.textContent = xhr2.response.title;
//     $animeImgContainer.setAttribute('class', 'anime-img');
//     $animeImg.setAttribute('src', xhr2.response.image_url);
//     $animeImg.setAttribute('alt', xhr2.response.title);
//     $synopsis.setAttribute('class', 'anime-bio');
//     $synopsis.textContent = xhr2.response.synopsis;
//     if (xhr2.response.trailer_url !== null) {
//       const $iFrame = document.createElement('iframe');
//       $iFrame.setAttribute('src', xhr2.response.trailer_url);
//       $iFrame.setAttribute('frameborder', '0');
//       $iFrame.setAttribute(
//         'allow',
//         'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
//       );
//       $iFrame.setAttribute('allowfullscreen', 'allowfullscreen');
//       $iFrameRow.appendChild($iFrame);
//     }
//     loader.setAttribute('class', 'loader hidden');
//     $detailsRow.appendChild($animeTitle);
//     $detailsRow.appendChild($animeImgContainer);
//     $animeImgContainer.appendChild($animeImg);
//     $bioRow.appendChild($synopsis);
//   });
//   xhr2.onerror = () => {
//     alert('An unexpected error occurred');
//   };
//   xhr2.send();
// };

// const $scrollingWrapperImg = document.querySelectorAll('.border-color');
// const $home = document.querySelector('.home-container');
// const $topAllTimeHeader = document.querySelector('.top-all-time');
// const $topAiringHeader = document.querySelector('.top-airing');
// const $topUpcomingHeader = document.querySelector('.top-upcoming');
// const $details = document.querySelector('.details-container');
// const $listRow = document.querySelector('.list-row');
// const $malQuestion = document.querySelector('.mal-question');
// const $wrongUsername = document.querySelector('.wrong-username');
// const $inputContainer = document.querySelector('.input-container');
// const $body = document.querySelector('body');
// const $userIcon = document.querySelector('.user-icon');

// // swap between data.view to show the page we want to navigate to
// const viewSwap = () => {
//   if (data.view === 'home') {
//     $home.setAttribute('class', 'home-container');
//     $details.setAttribute('class', 'details-container hidden');
//     $listRow.setAttribute('class', 'row list-row hidden');
//     $detailsRow.innerHTML = '';
//     $bioRow.innerHTML = '';
//     $iFrameRow.innerHTML = '';
//     getTopAnime();
//     getTopAiringAnime();
//     getTopUpcomingAnime();
//   } else if (data.view === 'details') {
//     $details.setAttribute('class', 'details-container');
//     $home.setAttribute('class', 'home-container hidden');
//     $listRow.setAttribute('class', 'row list-row hidden');
//   } else if (data.view === 'list' && data.username !== '') {
//     $iFrameRow.innerHTML = '';
//     $listRow.setAttribute('class', 'row list-row');
//     $home.setAttribute('class', 'home-container hidden');
//     $details.setAttribute('class', 'details-container hidden');
//   } else if (data.view === 'list') {
//     $iFrameRow.innerHTML = '';
//     const tbl = document.querySelector('.table');
//     const lH = document.querySelector('.list-header');
//     const userS = document.querySelector('.user-search');
//     if (tbl) {
//       tbl.remove();
//       lH.remove();
//       userS.remove();
//     }
//     $malQuestion.setAttribute('class', 'mal-question');
//     $wrongUsername.setAttribute('class', 'wrong-username');
//     $inputContainer.setAttribute('class', 'input-container');
//     $listRow.setAttribute('class', 'row list-row');
//     $home.setAttribute('class', 'home-container hidden');
//     $details.setAttribute('class', 'details-container hidden');
//   }
//   if ($body.classList.contains('light')) {
//     $topAllTimeHeader.classList.add('light');
//     $topAiringHeader.classList.add('light');
//     $topUpcomingHeader.classList.add('light');
//     $details.classList.add('light');
//     $listRow.classList.add('light');
//     $userNameInput.classList.add('light');
//     for (let i = 0; i < $scrollingWrapperImg.length; i++) {
//       $scrollingWrapperImg.classList.add('light');
//     }
//   } else {
//     $topAllTimeHeader.classList.remove('light');
//     $topAiringHeader.classList.remove('light');
//     $topUpcomingHeader.classList.remove('light');
//     $details.classList.add('dark');
//     $listRow.classList.add('dark');
//     $userNameInput.classList.add('dark');
//     for (let p = 0; p < $scrollingWrapperImg.length; p++) {
//       $scrollingWrapperImg.classList.add('dark');
//     }
//   }
// };

// const scrollContainerTop = direction => {
//   if (direction === 'left') {
//     $topAnime.scrollLeft -= 227;
//   } else {
//     $topAnime.scrollLeft += 227;
//   }
// };

// const $topAiringAnime = document.querySelector('.top-airing-img');
// const $topAiringContainer = document.querySelector('.top-airing-container');

// // getting the top airing anime from the API and appending the images/titles to the home page
// const getTopAiringAnime = () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://api.jikan.moe/v4/top/anime?filter=airing');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', () => {
//     for (let i = 0; i < xhr.response.data.length; i++) {
//       const $img = document.createElement('img');
//       $img.setAttribute('class', 'border-color');
//       if ($body.classList.contains('light')) {
//         $img.classList.add('light');
//       } else {
//         $img.classList.add('dark');
//       }
//       $img.setAttribute('src', xhr.response.data[i].images.jpg.image_url);
//       $img.setAttribute('alt', xhr.response.data[i].title);
//       $img.setAttribute('title', xhr.response.data[i].title);
//       $img.addEventListener('click', event => {
//         data.view = 'details';
//         viewSwap();
//         loopOverAnime(xhr, event);
//       });
//       $topAiringAnime.appendChild($img);
//     }
//     const $previousBtn = document.createElement('i');
//     const $nextBtn = document.createElement('i');
//     $previousBtn.setAttribute(
//       'class',
//       'fas fa-arrow-left airing-arrow-left arrow'
//     );
//     $previousBtn.addEventListener('click', () => {
//       scrollContainerAiring('left');
//     });
//     $nextBtn.setAttribute(
//       'class',
//       'fas fa-arrow-right airing-arrow-right arrow'
//     );
//     $nextBtn.addEventListener('click', () => {
//       scrollContainerAiring('right');
//     });
//     $topAiringContainer.appendChild($previousBtn);
//     $topAiringContainer.appendChild($nextBtn);
//   });
//   xhr.onerror = () => {
//     alert('An unexpected error occurred');
//   };
//   xhr.send();
// };

// const scrollContainerAiring = direction => {
//   if (direction === 'left') {
//     $topAiringAnime.scrollLeft -= 227;
//   } else {
//     $topAiringAnime.scrollLeft += 227;
//   }
// };

// const $topUpcomingAnime = document.querySelector('.top-upcoming-img');
// const $topUpcomingContainer = document.querySelector('.top-upcoming-container');

// // getting the top upcoming anime from the API and appending the images/titles to the home page
// const getTopUpcomingAnime = () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://api.jikan.moe/v4/top/anime?filter=upcoming');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', () => {
//     for (let i = 0; i < xhr.response.data.length; i++) {
//       const $img = document.createElement('img');
//       $img.setAttribute('class', 'border-color');
//       if ($body.classList.contains('light')) {
//         $img.classList.add('light');
//       } else {
//         $img.classList.add('dark');
//       }
//       $img.setAttribute('src', xhr.response.data[i].images.jpg.image_url);
//       $img.setAttribute('alt', xhr.response.data[i].title);
//       $img.setAttribute('title', xhr.response.data[i].title);
//       $img.addEventListener('click', event => {
//         data.view = 'details';
//         viewSwap();
//         loopOverAnime(xhr, event);
//       });
//       $topUpcomingAnime.appendChild($img);
//     }
//     const $previousBtn = document.createElement('i');
//     const $nextBtn = document.createElement('i');
//     $previousBtn.setAttribute(
//       'class',
//       'fas fa-arrow-left upcoming-arrow-left arrow'
//     );
//     $previousBtn.addEventListener('click', () => {
//       scrollContainerUpcoming('left');
//     });
//     $nextBtn.setAttribute(
//       'class',
//       'fas fa-arrow-right upcoming-arrow-right arrow'
//     );
//     $nextBtn.addEventListener('click', () => {
//       scrollContainerUpcoming('right');
//     });
//     $topUpcomingContainer.appendChild($previousBtn);
//     $topUpcomingContainer.appendChild($nextBtn);
//   });
//   xhr.onerror = () => {
//     alert('An unexpected error occurred');
//   };
//   xhr.send();
// };

// const scrollContainerUpcoming = direction => {
//   if (direction === 'left') {
//     $topUpcomingAnime.scrollLeft -= 227;
//   } else {
//     $topUpcomingAnime.scrollLeft += 227;
//   }
// };

// // makes a network request to return the users anime list from myAnimeList.net
// const getAnimeList = () => {
//   const xhr = new XMLHttpRequest();
//   xhr.open(
//     'GET',
//     `https://api.jikan.moe/v3/user/${$userNameInput.value}/animelist/all`
//   );
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', () => {
//     if (xhr.response.status !== 400) {
//       $wrongUsername.innerHTML = '';
//       $userIcon.setAttribute('class', 'fas fa-user');
//       $malQuestion.setAttribute('class', 'mal-question hidden');
//       $inputContainer.setAttribute('class', 'input-container hidden');
//       createTable(xhr);
//       $newUserSpan.addEventListener('click', () => {
//         data.username = '';
//         $userIcon.setAttribute('class', 'fas fa-user-plus');
//         viewSwap();
//       });
//     } else {
//       $wrongUsername.textContent = 'Username does not exist';
//     }
//   });
//   xhr.onerror = () => {
//     alert('An unexpected error occurred');
//   };
//   xhr.send();
// };

// let $newUserSpan = null;

// // creating a table in the DOM with data from the API about the users animelist
// const createTable = xhr => {
//   data.username = $userNameInput.value;
//   const $listHeader = document.createElement('div');
//   const $newUserSearch = document.createElement('div');
//   $newUserSpan = document.createElement('span');
//   const $tableContainer = document.createElement('div');
//   const $table = document.createElement('table');
//   const $thead = document.createElement('thead');
//   const $theadRow = document.createElement('tr');
//   const $thImage = document.createElement('th');
//   const $thTitle = document.createElement('th');
//   const $thScore = document.createElement('th');
//   const $thProgress = document.createElement('th');
//   const $tbody = document.createElement('tbody');
//   $listHeader.setAttribute('class', 'list-header');
//   $listHeader.textContent = $userNameInput.value + ' ' + 'Anime List';
//   $tableContainer.setAttribute('class', 'table-container');
//   $table.setAttribute('class', 'table');
//   $newUserSearch.setAttribute('class', 'user-search');
//   $newUserSpan.textContent = 'Search for new user';
//   $thImage.textContent = 'Image';
//   $thImage.setAttribute('class', 'image-td');
//   $thTitle.textContent = 'Anime Title';
//   $thTitle.setAttribute('class', 'title-td');
//   $thScore.textContent = 'Score';
//   $thScore.setAttribute('class', 'score-td');
//   $thProgress.textContent = 'Progress';
//   $thProgress.setAttribute('class', 'progress-td');
//   $listRow.appendChild($listHeader);
//   $listRow.appendChild($newUserSearch);
//   $listRow.appendChild($tableContainer);
//   $newUserSearch.appendChild($newUserSpan);
//   $tableContainer.appendChild($table);
//   $table.appendChild($thead);
//   $table.appendChild($tbody);
//   $thead.appendChild($theadRow);
//   $theadRow.appendChild($thImage);
//   $theadRow.appendChild($thTitle);
//   $theadRow.appendChild($thScore);
//   $theadRow.appendChild($thProgress);
//   for (let i = 0; i < xhr.response.anime.length; i++) {
//     const $tbodyRow = document.createElement('tr');
//     const $tdImageData = document.createElement('td');
//     const $tdImage = document.createElement('img');
//     const $tdTitle = document.createElement('td');
//     const $tdScore = document.createElement('td');
//     const $tdProgress = document.createElement('td');
//     $tdImage.setAttribute('src', xhr.response.anime[i].image_url);
//     $tdImage.setAttribute('class', 'image-td');
//     $tdTitle.textContent = xhr.response.anime[i].title;
//     $tdTitle.setAttribute('class', 'title-td');
//     $tdScore.textContent = xhr.response.anime[i].score;
//     $tdScore.setAttribute('class', 'score-td');
//     $tdProgress.textContent =
//       xhr.response.anime[i].watched_episodes +
//       '/' +
//       xhr.response.anime[i].total_episodes;
//     $tdProgress.setAttribute('class', 'progress-td');
//     $tbody.appendChild($tbodyRow);
//     $tbodyRow.appendChild($tdImageData);
//     $tdImageData.appendChild($tdImage);
//     $tbodyRow.appendChild($tdTitle);
//     $tbodyRow.appendChild($tdScore);
//     $tbodyRow.appendChild($tdProgress);
//   }
// };

// // looping over the specific anime that was clicked and creating a DOMTree with the results
// const loopOverAnime = (xhr, event) => {
//   window.scrollTo(0, 0);
//   const loader = document.createElement('div');
//   loader.setAttribute('class', 'loader');
//   $detailsRow.appendChild(loader);
//   for (let k = 0; k < xhr.response.top.length; k++) {
//     if (event.target.alt === xhr.response.top[k].title) {
//       const xhr2 = new XMLHttpRequest();
//       xhr2.open(
//         'GET',
//         `https://api.jikan.moe/v3/anime/${xhr.response.top[k].mal_id}`
//       );
//       xhr2.responseType = 'json';
//       xhr2.addEventListener('load', () => {
//         const $animeTitle = document.createElement('div');
//         const $animeImgContainer = document.createElement('div');
//         const $animeImg = document.createElement('img');
//         const $synopsis = document.createElement('div');
//         $animeTitle.setAttribute('class', 'anime-title');
//         $animeTitle.textContent = event.target.alt;
//         $animeImgContainer.setAttribute('class', 'anime-img');
//         $animeImg.setAttribute('src', xhr2.response.image_url);
//         $animeImg.setAttribute('alt', xhr2.response.title);
//         $synopsis.setAttribute('class', 'anime-bio');
//         $synopsis.textContent = xhr2.response.synopsis;
//         if (xhr2.response.trailer_url !== null) {
//           const $iFrame = document.createElement('iframe');
//           $iFrame.setAttribute('width', '353');
//           $iFrame.setAttribute('height', '199');
//           $iFrame.setAttribute('src', xhr2.response.trailer_url);
//           $iFrame.setAttribute('frameborder', '0');
//           $iFrame.setAttribute(
//             'allow',
//             'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
//           );
//           $iFrame.setAttribute('allowfullscreen', 'allowfullscreen');
//           $iFrameRow.appendChild($iFrame);
//         }
//         loader.setAttribute('class', 'loader hidden');
//         $detailsRow.appendChild($animeTitle);
//         $detailsRow.appendChild($animeImgContainer);
//         $animeImgContainer.appendChild($animeImg);
//         $bioRow.appendChild($synopsis);
//       });
//       xhr2.onerror = () => {
//         alert('An unexpected error occurred');
//         loader.setAttribute('class', 'loader hidden');
//       };
//       xhr2.send();
//       return;
//     }
//   }
// };

// const $lightDarkMode = document.querySelector('.light-dark-mode');

// const createTheme = () => {
//   if (window.localStorage.getItem('theme')) {
//     const theme = window.localStorage.getItem('theme');
//     $body.setAttribute('class', `${theme}`);
//     if (theme === 'light') {
//       $lightDarkMode.setAttribute('class', 'fas fa-lightbulb light-dark-mode');
//     }
//   } else {
//     $body.setAttribute('class', 'dark');
//   }
//   $lightDarkMode.addEventListener('click', () => {
//     if ($body.classList.contains('light')) {
//       window.localStorage.setItem('theme', 'dark');
//       const $lightAll = document.querySelectorAll('.light');
//       for (let i = 0; i < $lightAll.length; i++) {
//         $lightAll[i].classList.remove('light');
//         $lightAll[i].classList.add('dark');
//       }
//       $lightDarkMode.setAttribute('class', 'far fa-lightbulb light-dark-mode');
//     } else {
//       window.localStorage.setItem('theme', 'light');
//       const $darkAll = document.querySelectorAll('.dark');
//       $topAllTimeHeader.classList.add('light');
//       $topAiringHeader.classList.add('light');
//       $topUpcomingHeader.classList.add('light');
//       for (let p = 0; p < $darkAll.length; p++) {
//         $darkAll[p].classList.remove('dark');
//         $darkAll[p].classList.add('light');
//       }
//       $lightDarkMode.setAttribute('class', 'fas fa-lightbulb light-dark-mode');
//     }
//   });
// };
