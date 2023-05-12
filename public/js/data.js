/* exported data */
var data = {
    view: "home",
    topAnime: {
        shows: [],
        lastRetrieved: "",
    },
    airingAnime: {
        shows: [],
        lastRetrieved: "",
    },
    upcomingAnime: {
        shows: [],
        lastRetrieved: "",
    },
};
document.addEventListener("visibilitychange", function () {
    var JSONString = JSON.stringify(data);
    localStorage.setItem("animaniac", JSONString);
});
var storageData = localStorage.getItem("animaniac");
if (storageData) {
    data = JSON.parse(storageData);
}
