/* ============================================================
   APPS — each desktop file icon. Points at a PNG asset, plus
   a left/top offset so the four shards sit in their own
   staggered cluster instead of a grid. Adjust left/top here
   to nudge any icon's position.

   `portrait` is the image shown inside the member's window
   once it's opened. It defaults to the same icon PNG, but you
   can point it at a different full image later (a comic-style
   splash, a posed photo, etc.) per member without touching
   any of the window logic below.
============================================================ */
const APPS = [
  { id:'cherie',   label:'CHERIE',   img:'assets/icons/cherie.png',   portrait:'assets/members/cherie.png',   left:130, top:60,  size:180 },
  { id:'mika',     label:'MIKA',     img:'assets/icons/mika.png',     portrait:'assets/members/cherie.png',     left:280, top:70,  size:190 },
  { id:'nadia',    label:'NADIA',    img:'assets/icons/nadia.png',    portrait:'assets/members/cherie.png',    left:230, top:200, size:220 },
  { id:'adrienne', label:'ADRIENNE', img:'assets/icons/adrienne.png', portrait:'assets/members/cherie.png', left:60,  top:200, size:200 },
];

/* Every member window is just the portrait at its own natural
   size/aspect ratio — defined once here so each app object can
   own its own renderer. The name lives in the title bar. */
function memberWindowBody(label, img){
  return `<img class="member-window-img" src="${img}" alt="${label}">`;
}
APPS.forEach(app=>{
  app.window = (b)=>{ b.innerHTML = memberWindowBody(app.label, app.portrait || app.img); };
});

  /* ============================================================
   PHOTOBOOK
============================================================ */

/* UTILS and DOCK now point at your own PNGs instead of the
   built-in inline SVGs — drop your files in assets/icons/ using
   these names (or edit the paths below to match whatever you
   already have). */
   const LORE_VIDEO_URL = 'https://youtu.be/YOUR-VIDEO-ID'; // <-- swap in the real link

   const UTILS = [
     { id:'photobook', img:'assets/dock/file.png', action:openPhotobook },
     {
       id:'video',
       label:'VIDEO',
       img:'assets/statement.png',
       portrait:'assets/members/cherie.png', // drop your poster/thumbnail PNG here
       window: renderVideoPromoWindow
     },
   ];

   function renderVideoPromoWindow(b){
    b.innerHTML = `
      <div class="video-portrait-wrap">
        <img class="member-window-img" src="assets/thumbnail.png" alt="The Lore Film">
        <a class="video-watch-btn" href="${LORE_VIDEO_URL}" target="_blank" rel="noopener">
          WATCH NOW
        </a>
      </div>`;
  }

  
/* ============================================================
   IMAGES
============================================================ */
const PHOTOBOOK_IMAGES = [
  "assets/concept/concept1.png",
  "assets/concept/concept2.png",
  "assets/concept/concept3.png",
];

let currentPhoto = 0;

function openPhotobook(){

let gallery = document.getElementById("photobook-overlay");

if(!gallery){

  gallery = document.createElement("div");
  gallery.id = "photobook-overlay";

  gallery.innerHTML = `
    <div class="gallery-counter"></div>

    <button class="gallery-close">CLOSE</button>

    <button class="gallery-nav gallery-prev">
      LEFT
    </button>

    <button class="gallery-nav gallery-next">
      RIGHT
    </button>

    <img class="gallery-image" alt="Concept image">
  `;

  document.body.appendChild(gallery);

  const img = gallery.querySelector(".gallery-image");
  const counter = gallery.querySelector(".gallery-counter");

  function updateImage(){
    img.src = PHOTOBOOK_IMAGES[currentPhoto];
    counter.textContent =
      `${currentPhoto + 1}/${PHOTOBOOK_IMAGES.length}`;
  }

  gallery.querySelector(".gallery-close").onclick = () => {
    gallery.classList.remove("open");
  };

  gallery.querySelector(".gallery-prev").onclick = () => {
    currentPhoto =
      (currentPhoto - 1 + PHOTOBOOK_IMAGES.length) %
      PHOTOBOOK_IMAGES.length;

    updateImage();
  };

  gallery.querySelector(".gallery-next").onclick = () => {
    currentPhoto =
      (currentPhoto + 1) %
      PHOTOBOOK_IMAGES.length;

    updateImage();
  };

  updateImage();
}

gallery.classList.add("open");
}

const DOCK = [
  { id:'playlist', img:'assets/dock/music.png', window: renderPlaylistWindow },
  { id:'site', img:'assets/dock/music.png', action:()=>window.open('room.html', '_blank') },
  {
    id:'help',
    img:'assets/dock/music.png',
    window:(b)=>{
      b.innerHTML = `<img class="member-window-img" src="assets/background.jpeg" alt="Help">`;
    }
  },
  { id:'settings', img:'assets/dock/music.png', window:(b)=>b.innerHTML="Settings" }
];

const iconRail = document.getElementById('icon-rail');
const utilRail = document.getElementById('util-rail');
const dock = document.getElementById('dock');
const winLayer = document.getElementById('windows');

const REGISTRY = {};
[...APPS,...UTILS,...DOCK].forEach(i=>{ if(i.id) REGISTRY[i.id]=i });

APPS.forEach(app=>{
  iconRail.innerHTML += `
    <button class="file-icon" data-open="${app.id}"
      style="left:${app.left}px; top:${app.top}px;">
      <span class="glyph" style="width:clamp(100px, 15vw, ${app.size}px);
     height:clamp(100px, 15vw, ${app.size}px);"">
        <img src="${app.img}" alt="${app.label}">
      </span>
    </button>`;
});

UTILS.forEach(u=>{
  utilRail.innerHTML += `
    <button class="util-btn" data-open="${u.id}">
      <img src="${u.img}" alt="${u.id}">
    </button>`;
});

DOCK.forEach((d, i) => {
  dock.innerHTML += `
    <button class="dock-btn" data-open="${d.id}">
      <img src="${d.img}" alt="${d.id}">
    </button>
  `;
  if (i === DOCK.length - 2) {
    dock.innerHTML += `<div class="dock-sep" id="dock-resize" title="Drag to resize"></div>`;
  }
});

/* ============================================================
   WINDOWS — draggable, closable, and minimize-to-dock, like a
   real desktop/browser window. Drag from the title bar, click
   – to tuck it into a small tray above the dock, click the
   tray chip to bring it back, click × to close it for good.
============================================================ */
let z = 20;
let cascadeCount = 0;
const minimizedWindows = new Map(); // id -> tray chip element
let trayEl = null;

function getTray(){
  if(!trayEl){
    trayEl = document.createElement('div');
    trayEl.id = 'minimized-tray';
    document.body.appendChild(trayEl);
  }
  return trayEl;
}

function updateTrayVisibility(){
  getTray().classList.toggle('has-items', minimizedWindows.size > 0);
}

function bringToFront(el){
  el.style.zIndex = ++z;
}

function makeDraggable(el){
  const head = el.querySelector('.window-head');
  let dragging = false;
  let startX=0, startY=0, startLeft=0, startTop=0;

  function onDown(e){
    if(e.target.closest('.win-btn')) return; // buttons handle their own click
    dragging = true;
    bringToFront(el);
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX;
    startY = p.clientY;
    const rect = el.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    head.classList.add('dragging');
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  function onMove(e){
    if(!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - startX;
    const dy = p.clientY - startY;

    let newLeft = startLeft + dx;
    let newTop  = startTop + dy;

    // keep the title bar reachable within the viewport
    newLeft = Math.max(4, Math.min(window.innerWidth - el.offsetWidth - 4, newLeft));
    newTop  = Math.max(4, Math.min(window.innerHeight - 40, newTop));

    el.style.left = newLeft + 'px';
    el.style.top = newTop + 'px';
    el.style.right = 'auto';
  }

  function onUp(){
    if(!dragging) return;
    dragging = false;
    head.classList.remove('dragging');
    document.body.style.userSelect = '';
  }

  head.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  head.addEventListener('touchstart', onDown, {passive:false});
  window.addEventListener('touchmove', onMove, {passive:false});
  window.addEventListener('touchend', onUp);
}

function closeWindow(id){
  const el = document.getElementById('win-'+id);
  if(!el) return;
  el.classList.remove('open');
  if(minimizedWindows.has(id)){
    minimizedWindows.get(id).remove();
    minimizedWindows.delete(id);
    updateTrayVisibility();
  }
}

function minimizeWindow(id){
  const el = document.getElementById('win-'+id);
  if(!el || minimizedWindows.has(id)) return;
  el.classList.remove('open');

  const item = REGISTRY[id];
  const chip = document.createElement('button');
  chip.className = 'tray-chip';
  chip.type = 'button';
  chip.innerHTML = `<span>${item.label ? item.label : id.toUpperCase()}</span>`;
  chip.addEventListener('click', ()=> restoreWindow(id));

  getTray().appendChild(chip);
  minimizedWindows.set(id, chip);
  updateTrayVisibility();
}

function restoreWindow(id){
  const el = document.getElementById('win-'+id);
  if(!el) return;
  if(minimizedWindows.has(id)){
    minimizedWindows.get(id).remove();
    minimizedWindows.delete(id);
    updateTrayVisibility();
  }
  el.classList.add('open');
  bringToFront(el);
}

function openWindow(id){
  let el=document.getElementById('win-'+id);
  const item=REGISTRY[id];

  if(!el){
    el=document.createElement('div');
    el.className='window';
    if(item.portrait) el.classList.add('window--portrait');
    el.id='win-'+id;
    el.innerHTML=`
      <div class="window-head">
        <span class="title">${item.label ? item.label : id.toUpperCase()}</span>
        <div class="win-controls">
          <button class="win-btn minimize" type="button" title="Minimize" aria-label="Minimize">&#8211;</button>
          <button class="win-btn close" type="button" title="Close" aria-label="Close">&times;</button>
        </div>
      </div>
      <div class="window-body"></div>`;

    winLayer.appendChild(el);
    item.window(el.querySelector('.window-body'));

    // cascade new windows so they don't stack exactly on top of each other
    const offset = (cascadeCount % 6) * 28;
    cascadeCount++;
    if(item.portrait){
      // portrait windows size to the image, so anchor from the left
      // instead of assuming a fixed width
      el.style.left = (480 + offset) + 'px';
      el.style.top  = (90 + offset) + 'px';
      el.style.right = 'auto';
    } else {
      el.style.left = Math.max(20, window.innerWidth - 420 - 34 - offset) + 'px';
      el.style.top  = (90 + offset) + 'px';
      el.style.right = 'auto';
    }

    makeDraggable(el);
    el.addEventListener('mousedown', ()=> bringToFront(el));

    el.querySelector('.win-btn.close').addEventListener('click', (e)=>{
      e.stopPropagation();
      closeWindow(id);
    });
    el.querySelector('.win-btn.minimize').addEventListener('click', (e)=>{
      e.stopPropagation();
      minimizeWindow(id);
    });
  }

  if(minimizedWindows.has(id)){
    restoreWindow(id);
    return;
  }

  el.classList.add('open');
  bringToFront(el);
}

document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-open]');
  if(!btn) return;
  const id=btn.dataset.open;
  const item=REGISTRY[id];
  if(item?.action) return item.action();
  openWindow(id);
});

/* ============================================================
   DOCK RESIZE — drag the separator up/down to scale every
   dock icon at once, mac-style. The dock's bottom edge stays
   put (position:absolute bottom:18px + transform-origin:bottom)
   so it grows upward, not in place on screen.
============================================================ */
(function(){
  const handle = document.getElementById('dock-resize');
  if(!handle) return;

  const root = document.documentElement;
  const MIN = 40;   // px, smallest icon size
  const MAX = 110;  // px, largest icon size
  const STORAGE_KEY = 'cadence-dock-size';

  let current = 60;
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) current = clamp(parseInt(saved,10));
  }catch(e){ /* storage unavailable, ignore */ }
  setSize(current);

  function clamp(v){ return Math.max(MIN, Math.min(MAX, v)); }
  function setSize(v){
    current = clamp(v);
    root.style.setProperty('--dock-size', current + 'px');
  }

  let dragging = false;
  let startY = 0;
  let startSize = 0;

  function onPointerDown(e){
    dragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    startSize = current;
    handle.classList.add('dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
    e.preventDefault();
  }

  function onPointerMove(e){
    if(!dragging) return;
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    const delta = startY - y;
    setSize(startSize + delta);
  }

  function onPointerUp(){
    if(!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    try{ localStorage.setItem(STORAGE_KEY, String(current)); }catch(e){ /* ignore */ }
  }

  handle.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  handle.addEventListener('touchstart', onPointerDown, {passive:false});
  window.addEventListener('touchmove', onPointerMove, {passive:false});
  window.addEventListener('touchend', onPointerUp);

  handle.addEventListener('dblclick', ()=> setSize(60));
})();

/* ============================================================
   FAN PLAYLIST — fan-submitted songs. Starts empty; anyone who
   opens the dock's Playlist app can add a song under its
   "Add Song" tab. Every submission re-renders BOTH that tab's
   list and the desktop widget, since they're driven off the
   same array — one push, two views update.
============================================================ */
const FAN_PLAYLIST = [];

function fanPlaylistTrackMarkup(track){
  return `
    <li>
      <span class="fpw-note">&#9834;</span>
      <span>
        <span class="fpw-song">${track.title}</span><br>
        <span class="fpw-artist">${track.artist}</span>
      </span>
    </li>`;
}

function renderFanPlaylist(){
  const listHTML = FAN_PLAYLIST.length
    ? FAN_PLAYLIST.map(fanPlaylistTrackMarkup).join('')
    : `<li class="fpw-empty">No songs yet — be the first to add one.</li>`;

  document.querySelectorAll('[data-fan-playlist-list]').forEach(ul=>{
    ul.innerHTML = listHTML;
  });
}

function buildFanPlaylistWidget(){
  if(document.getElementById('fan-playlist-widget')) return;
  const widget = document.createElement('div');
  widget.id = 'fan-playlist-widget';
  widget.innerHTML = `
    <h3 class="fpw-title">Lyrics</h3>
    <ul class="fpw-tracks fpw-tracks--widget" data-fan-playlist-list></ul>`;
  document.getElementById('desktop').appendChild(widget);
}

/* Playlist app window: just the Add Song form. Submitting
   pushes into FAN_PLAYLIST and calls renderFanPlaylist(), which
   updates the desktop widget instantly — no list view inside
   this window at all anymore. */
   function renderPlaylistWindow(b){
    b.innerHTML = `
      <form class="playlist-form" id="playlist-add-form">
        <input type="text" name="title" placeholder="Song title" required maxlength="60">
        <input type="text" name="artist" placeholder="Artist / fan name" required maxlength="60">
        <button type="submit">ADD TO PLAYLIST</button>
        <span class="playlist-form-note">Submitting adds your song to the Fan Playlist on the desktop.</span>
      </form>`;
  
    b.querySelector('#playlist-add-form').addEventListener('submit', (e)=>{
      e.preventDefault();
      const form = e.target;
      const title = form.title.value.trim();
      const artist = form.artist.value.trim();
      if(!title || !artist) return;
  
      FAN_PLAYLIST.push({ title, artist });
      renderFanPlaylist();
      form.reset();
    });
  }

/* ============================================================
   LOADING
============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');

  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2200);
});

buildFanPlaylistWidget();
renderFanPlaylist();
/* ============================================================
   AUTO-OPEN — the lore-film promo opens itself on load since
   it's the main campaign CTA. Visitors can minimize or close
   it like any other window once they've seen it.
============================================================ */
openWindow('video');