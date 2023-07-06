"use strict";
document.addEventListener("unload", () => {
    const JSONString = JSON.stringify(data);
    localStorage.setItem("animaniac", JSONString);
});
const storageData = localStorage.getItem("animaniac");
if (storageData) {
    data = JSON.parse(storageData);
}
