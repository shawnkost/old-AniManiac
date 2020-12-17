var $topAnime = document.querySelector('.top-img');
var $topAiringAnime = document.querySelector('.top-airing-img');
var $topUpcomingAnime = document.querySelector('.top-upcoming-img');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');
var $detailsRow = document.querySelector('.details-row');
var $bioRow = document.querySelector('.bio-row');
var $iFrameRow = document.querySelector('.iframe-row');
var $homeTag = document.querySelector('.home-tag');
var $listTag = document.querySelector('.list-tag');
var $listRow = document.querySelector('.list-row');

window.addEventListener('DOMContentLoaded', function () {
  viewSwap();
});

$homeTag.addEventListener('click', function () {
  data.view = 'home';
  viewSwap();
});

$listTag.addEventListener('click', function () {
  data.view = 'list';
  viewSwap();
});

// we swap between data.view to show the page we want to navigate to
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
  } else if (data.view === 'list') {
    $listRow.innerHTML = '';
    $listRow.setAttribute('class', 'row list-row');
    $home.setAttribute('class', 'home-container hidden');
    $details.setAttribute('class', 'details-container hidden');
    getAnimeList();
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
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topAnime.appendChild($img);
    }
  });
  xhr.send();
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
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topAiringAnime.appendChild($img);
    }
  });
  xhr.send();
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
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        loopOverAnime(xhr, event);
      });
      $topUpcomingAnime.appendChild($img);
    }
  });
  xhr.send();
}

function getAnimeList() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/user/shaaka24/animelist/all');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    createTable(xhr);
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
          $iFrame.setAttribute('height', '315');
          $iFrame.setAttribute('src', xhr2.response.trailer_url);
          $iFrame.setAttribute('frameborder', '0');
          $iFrame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          $iFrame.setAttribute('allowfullscreen', 'true');
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
// creating a table in the DOM with data from the API about the users animelist
function createTable(xhr) {
  var $listHeader = document.createElement('div');
  var $table = document.createElement('table');
  var $thead = document.createElement('thead');
  var $theadRow = document.createElement('tr');
  var $thImage = document.createElement('th');
  var $thTitle = document.createElement('th');
  var $thScore = document.createElement('th');
  var $thProgress = document.createElement('th');
  var $tbody = document.createElement('tbody');
  $listHeader.setAttribute('class', 'list-header');
  $listHeader.textContent = 'Shaaka24 Anime List';
  $thImage.textContent = 'Image';
  $thTitle.textContent = 'Anime Title';
  $thScore.textContent = 'Score';
  $thProgress.textContent = 'Progress';
  $listRow.appendChild($listHeader);
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
    $tdTitle.textContent = xhr.response.anime[i].title;
    $tdScore.textContent = xhr.response.anime[i].score;
    $tdProgress.textContent = xhr.response.anime[i].watched_episodes + '/' + xhr.response.anime[i].total_episodes;
    $tbody.appendChild($tbodyRow);
    $tbodyRow.appendChild($tdImageData);
    $tdImageData.appendChild($tdImage);
    $tbodyRow.appendChild($tdTitle);
    $tbodyRow.appendChild($tdScore);
    $tbodyRow.appendChild($tdProgress);
  }
}
