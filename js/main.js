var $topAnime = document.querySelector('.top-img');
var $topAiringAnime = document.querySelector('.top-airing-img');
var $home = document.querySelector('.home-container');
var $details = document.querySelector('.details-container');
var $detailsRow = document.querySelector('.details-row');
var $bioRow = document.querySelector('.bio-row');

function getTopAnime() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.response)
    for (var i = 0; i < xhr.response.top.length; i++) {
      var $img = document.createElement('img');
      $img.setAttribute('src', xhr.response.top[i].image_url);
      $img.setAttribute('alt', xhr.response.top[i].title);
      $img.addEventListener('click', function (event) {
        data.view = 'details';
        viewSwap();
        // console.log(event);
        for (var k = 0; k < xhr.response.top.length; k++) {
          if (event.target.alt === xhr.response.top[k].title) {
            var xhr2 = new XMLHttpRequest();
            xhr2.open('GET', `https://api.jikan.moe/v3/anime/${xhr.response.top[k].mal_id}`);
            xhr2.responseType = 'json';
            xhr2.addEventListener('load', function () {
              // console.log(xhr2.response);
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
              $detailsRow.appendChild($animeTitle);
              $detailsRow.appendChild($animeImgContainer);
              $animeImgContainer.appendChild($animeImg);
              $bioRow.appendChild($synopsis);
            });
            xhr2.send();
            return;
          }
        }
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
