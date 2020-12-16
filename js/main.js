var $topAnime = document.querySelector('.top-img');
var $topAiringAnime = document.querySelector('.top-airing-img');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');

function getTopAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.addEventListener('click', function () {
        data.view = 'details';
        viewSwap();
      });
      $topAnime.appendChild($img);
    }
  });
  xhr.send();
}

function getTopAiringAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime/1/airing');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.addEventListener('click', function () {
        data.view = 'details';
        viewSwap();
      });
      $topAiringAnime.appendChild($img);
    }
  });
  xhr.send();
}

function viewSwap() {
  if (data.view === 'home') {
    $home.setAttribute('class', 'home-container');
    $details.setAttribute('class', 'details-container hidden');
    getTopAnime();
    getTopAiringAnime();
  } else {
    $details.setAttribute('class', 'details-container');
    $home.setAttribute('class', 'home-container hidden');
  }
}
viewSwap();
