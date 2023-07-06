/* exported data */
interface Data {
  view: string;
  topAnime: Anime;
  airingAnime: Anime;
  upcomingAnime: Anime;
}

interface Anime {
  shows: AnimeData[];
  lastRetrieved: number;
}

declare let data: Data;

document.addEventListener("unload", () => {
  const JSONString = JSON.stringify(data);
  localStorage.setItem("animaniac", JSONString);
});

const storageData = localStorage.getItem("animaniac");

if (storageData) {
  data = JSON.parse(storageData);
}
