window.addEventListener('DOMContentLoaded', function () {
  viewSwap();
});

var $homeTag = document.querySelector('.home-tag');

$homeTag.addEventListener('click', function () {
  data.view = 'home';
  viewSwap();
});

var $userTag = document.querySelector('.user-tag');

$userTag.addEventListener('click', function () {
  data.view = 'list';
  viewSwap();
});

var $searchButton = document.querySelector('.search-button');

$searchButton.addEventListener('click', function () {
  submitSearch();
});

var $searchInput = document.querySelector('.search-input');

$searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    submitSearch();
  }
});

var $userNameInput = document.querySelector('.username-input');

$userNameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getAnimeList();
  }
});

var $userNameButton = document.querySelector('.username-button');

$userNameButton.addEventListener('click', function () {
  getAnimeList();
  disableBtn();
  window.setTimeout(function () {
    enableBtn();
  }, 3000);
});

function disableBtn() {
  $userNameButton.disabled = true;
}

function enableBtn() {
  $userNameButton.disabled = false;
}

var $detailsRow = document.querySelector('.details-row');
var $bioRow = document.querySelector('.bio-row');
var $iFrameRow = document.querySelector('.iframe-row');

// searching for the anime the user inputted in the search bar and clearing any previous data
function submitSearch() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v3/search/anime?q=${$searchInput.value}&page=1`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    $detailsRow.innerHTML = '';
    $bioRow.innerHTML = '';
    $iFrameRow.innerHTML = '';
    data.view = 'details';
    viewSwap();
    searchAnime(xhr);
  });
  $searchInput.value = '';
  xhr.send();
}

// sending an API request for the specific title that was searched and creating a dom tree with the results
function searchAnime(xhr) {
  var xhr2 = new XMLHttpRequest();
  xhr2.open('GET', `https://api.jikan.moe/v3/anime/${xhr.response.results[0].mal_id}`);
  xhr2.responseType = 'json';
  xhr2.addEventListener('load', function () {
    var $animeTitle = document.createElement('div');
    var $animeImgContainer = document.createElement('div');
    var $animeImg = document.createElement('img');
    var $synopsis = document.createElement('div');
    $animeTitle.setAttribute('class', 'anime-title');
    $animeTitle.textContent = xhr2.response.title;
    $animeImgContainer.setAttribute('class', 'anime-img');
    $animeImg.setAttribute('src', xhr2.response.image_url);
    $animeImg.setAttribute('alt', xhr2.response.title);
    $synopsis.setAttribute('class', 'anime-bio');
    $synopsis.textContent = xhr2.response.synopsis;
    if (xhr2.response.trailer_url !== null) {
      var $iFrame = document.createElement('iframe');
      $iFrame.setAttribute('src', xhr2.response.trailer_url);
      $iFrame.setAttribute('frameborder', '0');
      $iFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      $iFrame.setAttribute('allowfullscreen', 'allowfullscreen');
      $iFrameRow.appendChild($iFrame);
    }
    $detailsRow.appendChild($animeTitle);
    $detailsRow.appendChild($animeImgContainer);
    $animeImgContainer.appendChild($animeImg);
    $bioRow.appendChild($synopsis);
  });
  xhr2.send();
}

var $scrollingWrapperImg = document.querySelectorAll('.border-color');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');
var $listRow = document.querySelector('.list-row');
var $malQuestion = document.querySelector('.mal-question');
var $wrongUsername = document.querySelector('.wrong-username');
var $inputContainer = document.querySelector('.input-container');
var $body = document.querySelector('body');
var $userIcon = document.querySelector('.user-icon');

// swap between data.view to show the page we want to navigate to
function viewSwap() {
  if (data.view === 'home') {
    $home.setAttribute('class', 'home-container');
    $details.setAttribute('class', 'details-container hidden');
    $listRow.setAttribute('class', 'row list-row hidden');
    $detailsRow.innerHTML = '';
    $bioRow.innerHTML = '';
    $iFrameRow.innerHTML = '';
    getTopAnime();
    getTopAiringAnime();
    getTopUpcomingAnime();
  } else if (data.view === 'details') {
    $details.setAttribute('class', 'details-container');
    $home.setAttribute('class', 'home-container hidden');
    $listRow.setAttribute('class', 'row list-row hidden');
  } else if (data.view === 'list' && data.username !== '') {
    $iFrameRow.innerHTML = '';
    $listRow.setAttribute('class', 'row list-row');
    $home.setAttribute('class', 'home-container hidden');
    $details.setAttribute('class', 'details-container hidden');
  } else if (data.view === 'list') {
    $iFrameRow.innerHTML = '';
    var tbl = document.querySelector('.table');
    var lH = document.querySelector('.list-header');
    var userS = document.querySelector('.user-search');
    if (tbl) {
      tbl.remove();
      lH.remove();
      userS.remove();
    }
    $malQuestion.setAttribute('class', 'mal-question');
    $wrongUsername.setAttribute('class', 'wrong-username');
    $inputContainer.setAttribute('class', 'input-container');
    $listRow.setAttribute('class', 'row list-row');
    $home.setAttribute('class', 'home-container hidden');
    $details.setAttribute('class', 'details-container hidden');
  }
  if ($body.classList.contains('light')) {
    $details.classList.add('light');
    $listRow.classList.add('light');
    $userNameInput.classList.add('light');
    for (var i = 0; i < $scrollingWrapperImg.length; i++) {
      $scrollingWrapperImg.classList.add('light');
    }
  } else {
    $details.classList.add('dark');
    $listRow.classList.add('dark');
    $userNameInput.classList.add('dark');
    for (var p = 0; p < $scrollingWrapperImg.length; p++) {
      $scrollingWrapperImg.classList.add('dark');
    }
  }
}

var $topAnime = document.querySelector('.top-img');
var $topAllContainer = document.querySelector('.top-all-container');

// getting the top anime of all time from the API and appending the images/titles to the home page
function getTopAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('class', 'border-color');
      if ($body.classList.contains('light')) {
        $img.classList.add('light');
      } else {
        $img.classList.add('dark');
      }
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.setAttribute('title', xhr.response.top[i].title);
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topAnime.appendChild($img);
    }
    var $previousBtn = document.createElement('i');
    var $nextBtn = document.createElement('i');
    $previousBtn.setAttribute('class', 'fas fa-arrow-left top-arrow-left arrow');
    $previousBtn.addEventListener('click', function () {
      scrollContainerTop('left');
    });
    $nextBtn.setAttribute('class', 'fas fa-arrow-right top-arrow-right arrow');
    $nextBtn.addEventListener('click', function () {
      scrollContainerTop('right');
    });
    $topAllContainer.appendChild($previousBtn);
    $topAllContainer.appendChild($nextBtn);
  });
  xhr.send();
}

function scrollContainerTop(direction) {
  if (direction === 'left') {
    $topAnime.scrollLeft -= 227;
  } else {
    $topAnime.scrollLeft += 227;
  }
}

var $topAiringAnime = document.querySelector('.top-airing-img');
var $topAiringContainer = document.querySelector('.top-airing-container');

// getting the top airing anime from the API and appending the images/titles to the home page
function getTopAiringAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime/1/airing');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('class', 'border-color');
      if ($body.classList.contains('light')) {
        $img.classList.add('light');
      } else {
        $img.classList.add('dark');
      }
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.setAttribute('title', xhr.response.top[i].title);
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topAiringAnime.appendChild($img);
    }
    var $previousBtn = document.createElement('i');
    var $nextBtn = document.createElement('i');
    $previousBtn.setAttribute('class', 'fas fa-arrow-left airing-arrow-left arrow');
    $previousBtn.addEventListener('click', function () {
      scrollContainerAiring('left');
    });
    $nextBtn.setAttribute('class', 'fas fa-arrow-right airing-arrow-right arrow');
    $nextBtn.addEventListener('click', function () {
      scrollContainerAiring('right');
    });
    $topAiringContainer.appendChild($previousBtn);
    $topAiringContainer.appendChild($nextBtn);
  });
  xhr.send();
}

function scrollContainerAiring(direction) {
  if (direction === 'left') {
    $topAiringAnime.scrollLeft -= 227;
  } else {
    $topAiringAnime.scrollLeft += 227;
  }
}

var $topUpcomingAnime = document.querySelector('.top-upcoming-img');
var $topUpcomingContainer = document.querySelector('.top-upcoming-container');

// getting the top upcoming anime from the API and appending the images/titles to the home page
function getTopUpcomingAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime/1/upcoming');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('class', 'border-color');
      if ($body.classList.contains('light')) {
        $img.classList.add('light');
      } else {
        $img.classList.add('dark');
      }
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.setAttribute('title', xhr.response.top[i].title);
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topUpcomingAnime.appendChild($img);
    }
    var $previousBtn = document.createElement('i');
    var $nextBtn = document.createElement('i');
    $previousBtn.setAttribute('class', 'fas fa-arrow-left upcoming-arrow-left arrow');
    $previousBtn.addEventListener('click', function () {
      scrollContainerUpcoming('left');
    });
    $nextBtn.setAttribute('class', 'fas fa-arrow-right upcoming-arrow-right arrow');
    $nextBtn.addEventListener('click', function () {
      scrollContainerUpcoming('right');
    });
    $topUpcomingContainer.appendChild($previousBtn);
    $topUpcomingContainer.appendChild($nextBtn);
  });
  xhr.send();
}

function scrollContainerUpcoming(direction) {
  if (direction === 'left') {
    $topUpcomingAnime.scrollLeft -= 227;
  } else {
    $topUpcomingAnime.scrollLeft += 227;
  }
}

// makes a network request to return the users anime list from myAnimeList.net
function getAnimeList() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v3/user/${$userNameInput.value}/animelist/all`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.status !== 400) {
      $wrongUsername.innerHTML = '';
      $userIcon.setAttribute('class', 'fas fa-user');
      $malQuestion.setAttribute('class', 'mal-question hidden');
      $inputContainer.setAttribute('class', 'input-container hidden');
      createTable(xhr);
      $newUserSpan.addEventListener('click', function () {
        data.username = '';
        $userIcon.setAttribute('class', 'fas fa-user-plus');
        viewSwap();
      });
    } else {
      $wrongUsername.textContent = 'Username does not exist';
    }
  });
  xhr.send();
}

var $newUserSpan = null;

// creating a table in the DOM with data from the API about the users animelist
function createTable(xhr) {
  data.username = $userNameInput.value;
  var $listHeader = document.createElement('div');
  var $newUserSearch = document.createElement('div');
  $newUserSpan = document.createElement('span');
  var $table = document.createElement('table');
  var $thead = document.createElement('thead');
  var $theadRow = document.createElement('tr');
  var $thImage = document.createElement('th');
  var $thTitle = document.createElement('th');
  var $thScore = document.createElement('th');
  var $thProgress = document.createElement('th');
  var $tbody = document.createElement('tbody');
  $listHeader.setAttribute('class', 'list-header');
  $listHeader.textContent = $userNameInput.value + ' ' + 'Anime List';
  $table.setAttribute('class', 'table');
  $newUserSearch.setAttribute('class', 'user-search');
  $newUserSpan.textContent = 'Search for new user';
  $thImage.textContent = 'Image';
  $thImage.setAttribute('class', 'image-td');
  $thTitle.textContent = 'Anime Title';
  $thTitle.setAttribute('class', 'title-td');
  $thScore.textContent = 'Score';
  $thScore.setAttribute('class', 'score-td');
  $thProgress.textContent = 'Progress';
  $thProgress.setAttribute('class', 'progress-td');
  $listRow.appendChild($listHeader);
  $listRow.appendChild($newUserSearch);
  $newUserSearch.appendChild($newUserSpan);
  $listRow.appendChild($table);
  $table.appendChild($thead);
  $table.appendChild($tbody);
  $thead.appendChild($theadRow);
  $theadRow.appendChild($thImage);
  $theadRow.appendChild($thTitle);
  $theadRow.appendChild($thScore);
  $theadRow.appendChild($thProgress);
  for (var i = 0; i < xhr.response.anime.length; i++) {
    var $tbodyRow = document.createElement('tr');
    var $tdImageData = document.createElement('td');
    var $tdImage = document.createElement('img');
    var $tdTitle = document.createElement('td');
    var $tdScore = document.createElement('td');
    var $tdProgress = document.createElement('td');
    $tdImage.setAttribute('src', xhr.response.anime[i].image_url);
    $tdImage.setAttribute('class', 'image-td');
    $tdTitle.textContent = xhr.response.anime[i].title;
    $tdTitle.setAttribute('class', 'title-td');
    $tdScore.textContent = xhr.response.anime[i].score;
    $tdScore.setAttribute('class', 'score-td');
    $tdProgress.textContent = xhr.response.anime[i].watched_episodes + '/' + xhr.response.anime[i].total_episodes;
    $tdProgress.setAttribute('class', 'progress-td');
    $tbody.appendChild($tbodyRow);
    $tbodyRow.appendChild($tdImageData);
    $tdImageData.appendChild($tdImage);
    $tbodyRow.appendChild($tdTitle);
    $tbodyRow.appendChild($tdScore);
    $tbodyRow.appendChild($tdProgress);
  }
}

// looping over the specific anime that was clicked and creating a DOMTree with the results
function loopOverAnime(xhr, event) {
  for (var k = 0; k < xhr.response.top.length; k++) {
    if (event.target.alt === xhr.response.top[k].title) {
      var xhr2 = new XMLHttpRequest();
      xhr2.open('GET', `https://api.jikan.moe/v3/anime/${xhr.response.top[k].mal_id}`);
      xhr2.responseType = 'json';
      xhr2.addEventListener('load', function () {
        var $animeTitle = document.createElement('div');
        var $animeImgContainer = document.createElement('div');
        var $animeImg = document.createElement('img');
        var $synopsis = document.createElement('div');
        $animeTitle.setAttribute('class', 'anime-title');
        $animeTitle.textContent = event.target.alt;
        $animeImgContainer.setAttribute('class', 'anime-img');
        $animeImg.setAttribute('src', xhr2.response.image_url);
        $animeImg.setAttribute('alt', xhr2.response.title);
        $synopsis.setAttribute('class', 'anime-bio');
        $synopsis.textContent = xhr2.response.synopsis;
        if (xhr2.response.trailer_url !== null) {
          var $iFrame = document.createElement('iframe');
          $iFrame.setAttribute('width', '353');
          $iFrame.setAttribute('height', '199');
          $iFrame.setAttribute('src', xhr2.response.trailer_url);
          $iFrame.setAttribute('frameborder', '0');
          $iFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          $iFrame.setAttribute('allowfullscreen', 'allowfullscreen');
          $iFrameRow.appendChild($iFrame);
        }
        $detailsRow.appendChild($animeTitle);
        $detailsRow.appendChild($animeImgContainer);
        $animeImgContainer.appendChild($animeImg);
        $bioRow.appendChild($synopsis);
      });
      xhr2.send();
      return;
    }
  }
}

var $lightDarkMode = document.querySelector('.light-dark-mode');

$lightDarkMode.addEventListener('click', function () {
  if ($body.classList.contains('light')) {
    var $lightAll = document.querySelectorAll('.light');
    for (var i = 0; i < $lightAll.length; i++) {
      $lightAll[i].classList.remove('light');
      $lightAll[i].classList.add('dark');
    }
    $lightDarkMode.setAttribute('class', 'far fa-lightbulb light-dark-mode');
  } else {
    var $darkAll = document.querySelectorAll('.dark');
    for (var p = 0; p < $darkAll.length; p++) {
      $darkAll[p].classList.remove('dark');
      $darkAll[p].classList.add('light');
    }
    $lightDarkMode.setAttribute('class', 'fas fa-lightbulb light-dark-mode');
  }
});
