/* exported data */
declare interface Data {
  view: string;
  topAnime: Anime;
  airingAnime: Anime;
  upcomingAnime: Anime;
}

interface Anime {
  shows: AnimeData[];
  lastRetrieved: number;
}

let data: Data = {
  view: "home",
  topAnime: {
    shows: [],
    lastRetrieved: 0,
  },
  airingAnime: {
    shows: [],
    lastRetrieved: 0,
  },
  upcomingAnime: {
    shows: [],
    lastRetrieved: 0,
  },
};

document.addEventListener("visibilitychange", () => {
  const JSONString = JSON.stringify(data);
  localStorage.setItem("animaniac", JSONString);
});

const storageData = localStorage.getItem("animaniac");

if (storageData) {
  data = JSON.parse(storageData);
}
