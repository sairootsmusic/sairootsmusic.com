/* ==================================================
   SAI ROOTS MUSIC - ASSET.JS PART 1
   Header + Search + Drawer + Smart Core
================================================== */

(function(){

"use strict";

/* ===============================
   GLOBAL SELECTOR
================================= */
const $  = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

/* ===============================
   READY
================================= */
document.addEventListener("DOMContentLoaded", initSite);

function initSite(){

initHeader();
initSearchExpand();
initSmartSearch();
initAutoYear();
initSmoothAnchor();

}

/* ===============================
   HEADER / DRAWER MENU
================================= */
function initHeader(){

const menuBtn  = $(".menu-btn");
const drawer   = $(".drawer");
const overlay  = $(".overlay");

if(!menuBtn || !drawer || !overlay) return;

menuBtn.addEventListener("click", function(){
drawer.classList.add("show");
overlay.classList.add("show");
document.body.style.overflow="hidden";
});

overlay.addEventListener("click", closeDrawer);

window.closeDrawer = closeDrawer;

function closeDrawer(){
drawer.classList.remove("show");
overlay.classList.remove("show");
document.body.style.overflow="";
}

}

/* ===============================
   SEARCH EXPAND
================================= */
function initSearchExpand(){

const wrap  = $(".search-wrap");
const input = $(".search-input");
const btn   = $(".search-btn");

if(!wrap || !input || !btn) return;

btn.addEventListener("click", function(){

if(!wrap.classList.contains("active")){
wrap.classList.add("active");
setTimeout(()=>input.focus(),120);
return;
}

runSearch();

});

input.addEventListener("focus", function(){
wrap.classList.add("active");
});

document.addEventListener("click", function(e){

if(!wrap.contains(e.target)){
if(input.value.trim()===""){
wrap.classList.remove("active");
}
}

});

input.addEventListener("keydown", function(e){
if(e.key==="Enter"){
runSearch();
}
});

}

/* ===============================
   SMART SEARCH
================================= */
function initSmartSearch(){
window.runSearch = runSearch;
}

function runSearch(){

const input = $(".search-input");
if(!input) return;

let q = input.value.trim();
if(!q) return;

const key = q.toLowerCase();

if(
key.includes("lirik") ||
key.includes("lyrics")
){
goTo("/lyric?q="+encodeURIComponent(q));
return;
}

if(
key.includes("artikel") ||
key.includes("berita") ||
key.includes("news")
){
goTo("/article?q="+encodeURIComponent(q));
return;
}

if(
key.includes("video") ||
key.includes("cover")
){
goTo("/video_cover?q="+encodeURIComponent(q));
return;
}

if(
key.includes("album") ||
key.includes("single") ||
key.includes("lagu") ||
key.includes("music")
){
goTo("/discography?q="+encodeURIComponent(q));
return;
}

/* fallback */
goTo("/search?q="+encodeURIComponent(q));

}

/* ===============================
   NAVIGATION HELPER
================================= */
function goTo(url){
window.location.href = url;
}

/* ===============================
   AUTO YEAR COPYRIGHT
================================= */
function initAutoYear(){

const yearBox = $(".auto-year");

if(yearBox){
yearBox.textContent = new Date().getFullYear();
}

}

/* ===============================
   SMOOTH HASH LINK
================================= */
function initSmoothAnchor(){

$$('a[href^="#"]').forEach(link=>{

link.addEventListener("click",function(e){

const id = this.getAttribute("href");
const target = document.querySelector(id);

if(target){
e.preventDefault();
target.scrollIntoView({
behavior:"smooth",
block:"start"
});
}

});

});

}

/* ===============================
   GLOBAL POPUP
================================= */
window.showPopup = function(msg="Success"){

let pop = document.createElement("div");
pop.className = "popup";
pop.innerText = msg;

document.body.appendChild(pop);

setTimeout(()=>{
pop.classList.add("show");
},50);

setTimeout(()=>{
pop.classList.remove("show");
setTimeout(()=>pop.remove(),300);
},2600);

};

})();
