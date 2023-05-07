/* exported data */
var data = {
  view: 'home',
  topAnime: {
    shows: [],
    lastRetrieved: ''
  },
  airingAnime: {
    shows: [],
    lastRetrieved: ''
  },
  upcomingAnime: {
    shows: [],
    lastRetrieved: ''
  }
};

document.addEventListener('visibilitychange', () => {
  const JSONString = JSON.stringify(data);
  localStorage.setItem('animaniac', JSONString);
})

const storageData = localStorage.getItem('animaniac')

if (storageData) {
  data = JSON.parse(storageData)
}
