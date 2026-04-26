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

/* ==================================================
   SAI ROOTS MUSIC - ASSET.JS PART 2
   GitHub Content Loader + Homepage Auto Content
================================================== */

(function(){

"use strict";

/* ===============================
   CONFIG
================================= */
const REPO_OWNER = "sairootsmusic";
const REPO_NAME  = "sairootsmusic.com";
const API_BASE   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

/* ===============================
   READY
================================= */
document.addEventListener("DOMContentLoaded", initDynamicContent);

function initDynamicContent(){

loadLatestMusic();
loadLatestLyrics();
loadLatestArticles();
initContactForm();
initShareButtons();

}

/* ===============================
   FETCH HELPER
================================= */
async function getFolder(path){

try{

const res = await fetch(`${API_BASE}/${path}`);

if(!res.ok) throw new Error("Failed");

return await res.json();

}catch(err){

return [];

}

}

/* ===============================
   SORT HELPER
================================= */
function sortNewest(arr){

return arr.sort((a,b)=>{

const aTime = new Date(a.updated_at || 0).getTime();
const bTime = new Date(b.updated_at || 0).getTime();

return bTime - aTime;

});

}

/* ===============================
   CLEAN NAME
================================= */
function cleanName(name){

return name
.replace(".html","")
.replace(".mp3","")
.replace(".wav","")
.replace(".m4a","")
.replace(/[-_]/g," ")
.replace(/\b\w/g,m=>m.toUpperCase());

}

/* ===============================
   LATEST MUSIC
================================= */
async function loadLatestMusic(){

const box = document.querySelector("#latestMusic");
if(!box) return;

let files = await getFolder("music");

if(!Array.isArray(files) || !files.length){
box.innerHTML = "";
return;
}

files = sortNewest(files).slice(0,5);

box.innerHTML = files.map(file=>`
<div class="music-card">
<div class="music-cover">
<img loading="lazy" src="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/android-chrome-512x512.png">
<div class="play-badge">▶</div>
</div>
<div class="music-body">
<div class="music-title">${cleanName(file.name)}</div>
<div class="music-meta">Official Release</div>
<audio controls>
<source src="${file.download_url}">
</audio>
<div class="music-actions mt-20">
<button class="btn btn-dark share-btn" data-link="${file.download_url}">
Share
</button>
</div>
</div>
</div>
`).join("");

}

/* ===============================
   LATEST LYRICS
================================= */
async function loadLatestLyrics(){

const box = document.querySelector("#latestLyrics");
if(!box) return;

let files = await getFolder("lyric");

if(!Array.isArray(files) || !files.length){
box.innerHTML = "";
return;
}

files = sortNewest(files).slice(0,5);

box.innerHTML = files.map(file=>{

const slug = file.name.replace(".html","");

return `
<a href="/lyric/${slug}">
<div class="card">
<div class="card-img">
<img loading="lazy" src="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/sairoots.jpg">
</div>
<div class="card-body">
<div class="card-title">${cleanName(slug)}</div>
<div class="card-text">Baca lirik resmi SAI Roots</div>
</div>
</div>
</a>
`;

}).join("");

}

/* ===============================
   LATEST ARTICLES
================================= */
async function loadLatestArticles(){

const box = document.querySelector("#latestArticles");
if(!box) return;

let files = await getFolder("article");

if(!Array.isArray(files) || !files.length){
box.innerHTML = "";
return;
}

files = sortNewest(files).slice(0,5);

box.innerHTML = files.map(file=>{

const slug = file.name.replace(".html","");

return `
<a href="/article/${slug}">
<div class="card">
<div class="card-img">
<img loading="lazy" src="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/sairoots.jpg">
</div>
<div class="card-body">
<div class="card-title">${cleanName(slug)}</div>
<div class="card-text">Artikel terbaru SAI Roots</div>
</div>
</div>
</a>
`;

}).join("");

}

/* ===============================
   CONTACT FORM POPUP
================================= */
function initContactForm(){

const form = document.querySelector("#contactForm");
if(!form) return;

form.addEventListener("submit", async function(e){

e.preventDefault();

const data = new FormData(form);

try{

await fetch(form.action,{
method:"POST",
body:data,
headers:{
'Accept':'application/json'
}
});

form.reset();

if(window.showPopup){
showPopup("Pesan berhasil dikirim");
}

}catch(err){

if(window.showPopup){
showPopup("Gagal mengirim pesan");
}

}

});

}

/* ===============================
   SHARE BUTTONS
================================= */
function initShareButtons(){

document.addEventListener("click", async function(e){

const btn = e.target.closest(".share-btn");
if(!btn) return;

const link = btn.dataset.link || location.href;

if(navigator.share){

try{
await navigator.share({
title:"SAI Roots Music",
url:link
});
}catch(err){}

}else{

navigator.clipboard.writeText(link);

if(window.showPopup){
showPopup("Link disalin");
}

}

});

}

})();

/* ==================================================
   SAI ROOTS MUSIC - ASSET.JS PART 3
   Admin Panel GitHub Publisher + Upload System
================================================== */

(function(){

"use strict";

/* ===============================
   READY
================================= */
document.addEventListener("DOMContentLoaded", initAdminPanel);

function initAdminPanel(){

const loginForm = document.querySelector("#adminLoginForm");
if(!loginForm) return;

loginForm.addEventListener("submit", adminLogin);

bindTabButtons();
bindPublishButtons();

}

/* ===============================
   SESSION
================================= */
function saveSession(token, yt){

localStorage.setItem("sai_github_token", token);
localStorage.setItem("sai_youtube_token", yt);

}

function getToken(){
return localStorage.getItem("sai_github_token") || "";
}

function getYTToken(){
return localStorage.getItem("sai_youtube_token") || "";
}

/* ===============================
   LOGIN
================================= */
async function adminLogin(e){

e.preventDefault();

const git = document.querySelector("#githubToken")?.value.trim();
const yt  = document.querySelector("#youtubeToken")?.value.trim();

if(!git || !yt){
showMsg("Token wajib diisi");
return;
}

try{

const res = await fetch("https://api.github.com/user",{
headers:{
Authorization:"token " + git
}
});

if(!res.ok) throw new Error();

saveSession(git,yt);

document.querySelector(".admin-login").style.display="none";
document.querySelector(".admin-dashboard").style.display="block";

showMsg("Login berhasil");

}catch(err){

showMsg("Token salah");

}

}

/* ===============================
   TAB BUTTON
================================= */
function bindTabButtons(){

document.querySelectorAll("[data-tab]").forEach(btn=>{

btn.addEventListener("click", function(){

document.querySelectorAll("[data-tab]").forEach(x=>x.classList.remove("active"));
this.classList.add("active");

const target = this.dataset.tab;

document.querySelectorAll(".tab-pane").forEach(p=>p.classList.add("hidden"));

const pane = document.querySelector("#"+target);
if(pane) pane.classList.remove("hidden");

});

});

}

/* ===============================
   PUBLISH BUTTONS
================================= */
function bindPublishButtons(){

const articleBtn = document.querySelector("#publishArticle");
const lyricBtn   = document.querySelector("#publishLyric");
const musicBtn   = document.querySelector("#publishMusic");
const videoBtn   = document.querySelector("#publishVideo");

if(articleBtn){
articleBtn.addEventListener("click", publishArticle);
}

if(lyricBtn){
lyricBtn.addEventListener("click", publishLyric);
}

if(musicBtn){
musicBtn.addEventListener("click", publishMusic);
}

if(videoBtn){
videoBtn.addEventListener("click", publishVideo);
}

}

/* ===============================
   GITHUB COMMIT CORE
================================= */
async function uploadToGithub(path, content, message){

const token = getToken();

if(!token){
showMsg("Login dulu");
return false;
}

const body = {
message: message,
content: btoa(unescape(encodeURIComponent(content)))
};

const res = await fetch(
`https://api.github.com/repos/sairootsmusic/sairootsmusic.com/contents/${path}`,
{
method:"PUT",
headers:{
Authorization:"token " + token,
"Content-Type":"application/json"
},
body:JSON.stringify(body)
});

return res.ok;

}

/* ===============================
   ARTICLE
================================= */
async function publishArticle(){

const title = val("#articleTitle");
const html  = val("#articleContent");

if(!title || !html){
showMsg("Isi artikel belum lengkap");
return;
}

const slug = slugify(title);
const file = `article/${slug}.html`;

const ok = await uploadToGithub(
file,
html,
`Publish article: ${title}`
);

showMsg(ok ? "Artikel dipublish" : "Gagal publish");

}

/* ===============================
   LYRIC
================================= */
async function publishLyric(){

const title = val("#lyricTitle");
const text  = val("#lyricContent");

if(!title || !text){
showMsg("Isi lirik belum lengkap");
return;
}

const slug = slugify(title);

const html = `
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="/assets/asset.css">
</head>
<body>
<div class="container section">
<div class="lyric-wrap">
<h1 class="lyric-title">${title}</h1>
<div class="lyric-content">${text}</div>
</div>
</div>
</body>
</html>
`;

const ok = await uploadToGithub(
`lyric/${slug}.html`,
html,
`Publish lyric: ${title}`
);

showMsg(ok ? "Lirik dipublish" : "Gagal publish");

}

/* ===============================
   MUSIC
================================= */
async function publishMusic(){

const fileInput = document.querySelector("#musicFile");

if(!fileInput || !fileInput.files.length){
showMsg("Pilih file musik");
return;
}

const file = fileInput.files[0];

const reader = new FileReader();

reader.onload = async function(){

const base64 = reader.result.split(",")[1];

const ok = await uploadBinary(
`music/${file.name}`,
base64,
`Upload music: ${file.name}`
);

showMsg(ok ? "Musik diupload" : "Gagal upload");

};

reader.readAsDataURL(file);

}

/* ===============================
   VIDEO EMBED
================================= */
async function publishVideo(){

const title = val("#videoTitle");
const link  = val("#videoLink");

if(!title || !link){
showMsg("Isi video belum lengkap");
return;
}

const slug = slugify(title);

const html = `
<div class="video-card">
<iframe src="${convertYoutube(link)}" allowfullscreen></iframe>
<div class="video-title">${title}</div>
</div>
`;

const ok = await uploadToGithub(
`video/${slug}.html`,
html,
`Publish video: ${title}`
);

showMsg(ok ? "Video dipublish" : "Gagal publish");

}

/* ===============================
   BINARY UPLOAD
================================= */
async function uploadBinary(path, base64, message){

const token = getToken();

const body = {
message: message,
content: base64
};

const res = await fetch(
`https://api.github.com/repos/sairootsmusic/sairootsmusic.com/contents/${path}`,
{
method:"PUT",
headers:{
Authorization:"token " + token,
"Content-Type":"application/json"
},
body:JSON.stringify(body)
});

return res.ok;

}

/* ===============================
   HELPERS
================================= */
function slugify(text){

return text
.toLowerCase()
.trim()
.replace(/[^\w\s-]/g,"")
.replace(/\s+/g,"-");

}

function val(el){
return document.querySelector(el)?.value.trim() || "";
}

function convertYoutube(url){

if(url.includes("watch?v=")){
return url.replace("watch?v=","embed/");
}

if(url.includes("youtu.be/")){
return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
}

return url;

}

function showMsg(msg){

if(window.showPopup){
showPopup(msg);
}else{
alert(msg);
}

}

})();
