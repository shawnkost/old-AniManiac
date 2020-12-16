var $topAnime = document.querySelector('.top-img');
var $topAiringAnime = document.querySelector('.top-airing-img');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');
var $detailsRow = document.querySelector('.details-row');
var $bioRow = document.querySelector('.bio-row');
var $iFrameRow = document.querySelector('.iframe-row');
var $homeTag = document.querySelector('.home-tag');

window.addEventListener('DOMContentLoaded', function () {
  viewSwap();
});

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
// we swap between data.view to show the page we want to navigate to
function viewSwap() {
  if (data.view === 'home') {
    $home.setAttribute('class', 'home-container');
    $details.setAttribute('class', 'details-container hidden');
    $detailsRow.innerHTML = '';
    $bioRow.innerHTML = '';
    $iFrameRow.innerHTML = '';
    getTopAnime();
    getTopAiringAnime();
  } else {
    $details.setAttribute('class', 'details-container');
    $home.setAttribute('class', 'home-container hidden');
  }
}

$homeTag.addEventListener('click', function () {
  data.view = 'home';
  viewSwap();
});

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
