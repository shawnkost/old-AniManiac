/* eslint-disable no-var */

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

declare global {
  var data: Data;
}

export {};
