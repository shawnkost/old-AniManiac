var $topAnime = document.querySelector('.top-img');
var $topAiringAnime = document.querySelector('.top-airing-img');
var $topUpcomingAnime = document.querySelector('.top-upcoming-img');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');
var $detailsRow = document.querySelector('.details-row');
var $bioRow = document.querySelector('.bio-row');
var $iFrameRow = document.querySelector('.iframe-row');
var $homeTag = document.querySelector('.home-tag');
var $listRow = document.querySelector('.list-row');
var $searchButton = document.querySelector('.search-button');
var $searchInput = document.querySelector('.search-input');
var $userTag = document.querySelector('.user-tag');
var $header = document.querySelector('header');
var $userNameInput = document.querySelector('.username-input');
var $userNameButton = document.querySelector('.username-button');
var $malQuestion = document.querySelector('.mal-question');
var $wrongUsername = document.querySelector('.wrong-username');
var $inputContainer = document.querySelector('.input-container');
var $body = document.querySelector('body');

window.addEventListener('DOMContentLoaded', function () {
  viewSwap();
});

$homeTag.addEventListener('click', function () {
  data.view = 'home';
  viewSwap();
});

$userTag.addEventListener('click', function () {
  data.view = 'list';
  viewSwap();
});

$searchButton.addEventListener('click', function () {
  submitSearch();
});

$searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    submitSearch();
  }
});

$userNameInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    getAnimeList();
  }
});

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

function swapColors() {
  var r = 255;
  var g = 0;
  var b = 0;
  var speed = 15;
  var check = false;
  $header.style.backgroundColor = 'green';
  var colorInterval = setInterval(function () {
    if (r >= 255 && g < 255 && b <= 0) {
      g += speed;
    } else if (r > 0 && g >= 255 && b <= 0) {
      r -= speed;
    } else if (r <= 0 && g >= 255 && b < 255) {
      b += speed;
    } else if (r <= 0 && g > 0 && b >= 255) {
      g -= speed;
    } else if (r < 255 && g <= 0 && b <= 255) {
      r += speed;
    } else {
      b -= speed;
      check = true;
    }
    if (check === true && b <= 10) {
      clearInterval(colorInterval);
      $header.style.backgroundColor = '#03045e';
    } else {
      $header.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    }

  }, 1);
  window.setTimeout(function () {
    $header.style.backgroundColor = 'var(--main)';
  }, 200);
}

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

// we swap between data.view to show the page we want to navigate to
function viewSwap() {
  // $body.style.backgroundColor = '#ffffff';
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
    $listRow.setAttribute('class', 'row list-row');
    $home.setAttribute('class', 'home-container hidden');
    $details.setAttribute('class', 'details-container hidden');
    getAnimeList();
  } else if (data.view === 'list') {
    swapColors();
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
}

function scrollContainerTop(direction) {
  if (direction === 'left') {
    $topAnime.scrollLeft -= 227;
  } else {
    $topAnime.scrollLeft += 227;
  }
}

// getting the top anime of all time from the API and appending the images/titles to the home page
function getTopAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
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
    $topAnime.appendChild($previousBtn);
    $topAnime.appendChild($nextBtn);
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

// getting the top airing anime from the API and appending the images/titles to the home page
function getTopAiringAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime/1/airing');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
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
    $topAiringAnime.appendChild($previousBtn);
    $topAiringAnime.appendChild($nextBtn);
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

function getTopUpcomingAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime/1/upcoming');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
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
    $topAiringAnime.appendChild($previousBtn);
    $topAiringAnime.appendChild($nextBtn);
  });
  xhr.send();
}

function getAnimeList() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.jikan.moe/v3/user/${$userNameInput.value}/animelist/all`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.status !== 400) {
      $wrongUsername.innerHTML = '';
      $malQuestion.setAttribute('class', 'mal-question hidden');
      $inputContainer.setAttribute('class', 'input-container hidden');
      createTable(xhr);
      $newUserSpan.addEventListener('click', function () {
        data.username = '';
        viewSwap();
      });
      $body.style.backgroundColor = '#222222';
    } else {
      $wrongUsername.textContent = 'Username does not exist';
    }
  });
  xhr.send();
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
      // $iFrame.setAttribute('width', '353');
      // $iFrame.setAttribute('height', '199');
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
  // $newUserSpan.addEventListener('click', function () {
  //   data.username = '';
  //   viewSwap();
  // });
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
