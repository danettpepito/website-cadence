

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
  { id:'cherie',   label:'CHERIE',   img:'assets/icons/cherie.png',   portrait:'assets/members/cherie.png',   left:130, top:60,  size:260, glow:'255,77,171'  },
  { id:'mika',     label:'MIKA',     img:'assets/icons/mika.png',     portrait:'assets/members/mika.png',     left:280, top:70,  size:270, glow:'255,204,77' },
  { id:'nadia',    label:'NADIA',    img:'assets/icons/nadia.png',    portrait:'assets/members/nadia.png',    left:230, top:200, size:300, glow:'0,229,255'  },
  { id:'adrienne', label:'ADRIENNE', img:'assets/icons/adrienne.png', portrait:'assets/members/adrienne.png', left:60,  top:200, size:280, glow:'176,102,255' },
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
   const LORE_VIDEO_URL = 'https://www.youtube.com/watch?v=TsydqjGGlhE'; // <-- swap in the real link

   const UTILS = [
     { id:'photobook', label:'concept-photos', img:'assets/dock/folder.png', action:openPhotobook },
     {
       id:'video',
       label:'Origin',
       img:'assets/statement.png',
       portrait:'assets/members/cherie.png', // drop your poster/thumbnail PNG here
       window: renderVideoPromoWindow
     },
   ];

   function renderVideoPromoWindow(b){
    b.innerHTML = `
      <div class="video-portrait-wrap">
        <img class="member-window-img" src="assets/video2.png" alt="The Lore Film">
        <a class="video-play-btn" href="${LORE_VIDEO_URL}" target="_blank" rel="noopener" aria-label="Watch the lore video on YouTube">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7-11-7z" fill="currentColor"/>
          </svg>
        </a>
      </div>`;
  }
  
/* ============================================================
   IMAGES
============================================================ */
const PHOTOBOOK_IMAGES = [
  "assets/concept/concept1.png",
  "assets/concept/concept4.jpg",
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
  { id:'playlist', label:'Playlist', img:'assets/dock/playlist.png', window: renderPlaylistWindow },
  { id:'site',label:'Room', img:'assets/dock/key.png', action:()=>window.open('room.html', '_blank') },
  { id:'settings', label:'BATTERAM', img:'assets/dock/album.png',portrait:'assets/album.png', window:(b)=>b.innerHTML=`<img class="member-window-img" src="assets/album.png" alt="Help">` },
  {
    id:'help',
    label:'Mission',
    img:'assets/dock/cadence.png',
    portrait:'assets/background.png', // <-- drop your help PNG at this path
    window:(b)=>{
      b.innerHTML = `<img class="member-window-img" src="assets/statement.png" alt="Help">`;
    }
  },
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
      style="left:${app.left}px; top:${app.top}px; --glow-rgb:${app.glow};">
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
      <span class="util-label">${u.label ? u.label : u.id.toUpperCase()}</span>
    </button>`;
});

DOCK.forEach((d, i) => {
  const dockLabel = d.label ? d.label : d.id.toUpperCase();
  dock.innerHTML += `
    <button class="dock-btn" data-open="${d.id}" data-tooltip="${dockLabel}">
      <span class="dock-icon-clip">
        <img src="${d.img}" alt="${d.id}">
      </span>
    </button>
  `;
  if (i === DOCK.length - 2) {
    dock.innerHTML += `<div class="dock-sep" id="dock-resize" title="Drag to resize"></div>`;
  }
});

/* ============================================================
   DOCK MAGNIFICATION — mac-style proximity scaling. The icon
   closest to the cursor grows most, neighbors taper off based
   on distance. Falls back to normal size once the cursor
   leaves the dock. Only touches real app icons (.dock-btn),
   not the resize handle or minimized-window chips.
============================================================ */
(function(){
  const dockEl = document.getElementById('dock');
  if(!dockEl) return;

  const MAX_SCALE = 1.25; // was 1.6 → smaller zoom
  const INFLUENCE = 90;   // keep or slightly reduce if you want tighter effect

  const btns = Array.from(dockEl.querySelectorAll('.dock-btn'));

  function onMove(e){
    btns.forEach(btn=>{
      const rect = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - center);

      const scale = dist < INFLUENCE
        ? 1 + (MAX_SCALE - 1) * (1 - dist / INFLUENCE)
        : 1;

      btn.style.transform = `translateY(${(scale - 1) * -10}px) scale(${scale})`;
    });
  }

  function onLeave(){
    btns.forEach(btn => btn.style.transform = '');
  }

  dockEl.addEventListener('mousemove', onMove);
  dockEl.addEventListener('mouseleave', onLeave);
})();

/* ============================================================
   ICON LAUNCH BOUNCE — every icon that opens something gets a
   quick mac-style "launching" bounce the moment it's clicked
   (or auto-opened). Looks for every button pointing at that id
   — covers the desktop shard, util rail, and dock all the same
   way, since they all share the [data-open] attribute.
============================================================ */
function bounceIconFor(id){

  // ⛔️ disable bounce for these icons
  const NO_BOUNCE = ['photobook', 'video'];

  if (NO_BOUNCE.includes(id)) return;

  document.querySelectorAll(`[data-open="${id}"]`).forEach(btn=>{
    btn.classList.remove('icon-launch-bounce');
    void btn.offsetWidth;
    btn.classList.add('icon-launch-bounce');
    btn.addEventListener('animationend', ()=>{
      btn.classList.remove('icon-launch-bounce');
    }, { once:true });
  });
}


/* ============================================================
   WINDOWS — draggable, closable, and minimize-to-dock, like a
   real desktop/browser window. Drag from the title bar, click
   – to tuck it into a small tray above the dock, click the
   tray chip to bring it back, click × to close it for good.
============================================================ */
let z = 20;
let cascadeCount = 0;
const minimizedWindows = new Map(); // id -> tray chip element
let minimizedGroupEl = null;

function getMinimizedGroup(){
  if(!minimizedGroupEl){
    dock.insertAdjacentHTML('beforeend', '<div class="dock-min-sep"></div>');
    minimizedGroupEl = document.createElement('div');
    minimizedGroupEl.className = 'dock-minimized-group';
    dock.appendChild(minimizedGroupEl);
  }
  return minimizedGroupEl;
}

function updateTrayVisibility(){
  dock.classList.toggle('has-minimized', minimizedWindows.size > 0);
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
  chip.className = 'dock-min-chip';
  chip.type = 'button';
  const label = item.label ? item.label : id.toUpperCase();
  chip.title = label;
  chip.innerHTML = `<img src="${item.img}" alt="${label}">`;
  chip.addEventListener('click', ()=> restoreWindow(id));

  getMinimizedGroup().appendChild(chip);
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
    if(id === 'video') el.classList.add('window--fixed');
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

if(id === 'video'){
  // The lore-video window has a permanent home: pinned to the
  // bottom-right, directly below the Fan Playlist widget (which
  // has been shifted up in styles.css to make room for it). No
  // cascade offset here — it should always open in the same
  // spot rather than drifting on repeat opens.
  el.style.left = 'auto';
  el.style.top = 'auto';
  el.style.right = '34px';
  el.style.bottom = '180px';
} else if(item.portrait){
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

if(id !== 'video'){
  makeDraggable(el);
  makeResizable(el, item);
}
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

const MEMBER_IDS = new Set(APPS.map(app => app.id));

document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-open]');
  if(!btn) return;
  const id=btn.dataset.open;
  const item=REGISTRY[id];
  if(MEMBER_IDS.has(id)) bounceIconFor(id);
  if(item?.action) return item.action();
  openWindow(id);
});


/* ============================================================
   WINDOW RESIZE — corner-drag. If the window has an `item.portrait`
   image, the height is always derived from the width using the
   PNG's own natural aspect ratio — so the box can be scaled, but
   never distorted relative to the image. Windows without a
   portrait (Settings, Playlist) resize freely instead.
============================================================ */
function makeResizable(el, item){
  const handle = document.createElement('div');
  handle.className = 'window-resize-handle';
  el.appendChild(handle);

  const head = el.querySelector('.window-head'); // <-- add this line
  const img = item.portrait ? el.querySelector('.member-window-img') : null;

  let aspect = null;        // the PNG's own width / height
  let maxWidth = Infinity;  // never upscale past the PNG's real resolution
  const minWidth  = item.portrait ? 160 : 280;
  const minHeight = item.portrait ? 120 : 180;

  function captureAspect(){
    if(img && img.naturalWidth && img.naturalHeight){
      aspect = img.naturalWidth / img.naturalHeight;
      maxWidth = img.naturalWidth;
    }
  }
  if(img){
    img.complete ? captureAspect() : img.addEventListener('load', captureAspect);
  }

  let resizing = false;
  let startX = 0, startY = 0, startWidth = 0, startHeight = 0;

  function onDown(e){
    resizing = true;
    bringToFront(el);
    captureAspect(); // covers the case the image just finished loading

    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX;
    startY = p.clientY;

    const rect = el.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;

    if(img){
      // from here on, the window's own box controls the size —
      // the image just fills it, scaled to fit without distortion
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
    }

    document.body.style.userSelect = 'none';
    e.preventDefault();
    e.stopPropagation();
  }

  function onMove(e){
    if(!resizing) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - startX;
    const dy = p.clientY - startY;

    let newWidth = Math.max(minWidth, startWidth + dx);
    newWidth = Math.min(newWidth, maxWidth, window.innerWidth - 40);
    el.style.width = newWidth + 'px';

    if(aspect){
      // the image only fills window-body, not the title bar — so the
      // body's height (not the whole window's) must match the image's
      // own ratio at this width, or object-fit: contain letterboxes it
      const headHeight = head.offsetHeight;
      const bodyHeight = newWidth / aspect;
      let newHeight = bodyHeight + headHeight;
      newHeight = Math.min(newHeight, window.innerHeight - 40);
      el.style.height = newHeight + 'px';
    } else {
      // no image to lock to — free resize
      const newHeight = Math.max(minHeight, startHeight + dy);
      el.style.height = Math.min(newHeight, window.innerHeight - 40) + 'px';
    }
  }

  function onUp(){
    if(!resizing) return;
    resizing = false;
    document.body.style.userSelect = '';
  }

  handle.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);

  handle.addEventListener('touchstart', onDown, {passive:false});
  window.addEventListener('touchmove', onMove, {passive:false});
  window.addEventListener('touchend', onUp);
}

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
  const count = FAN_PLAYLIST.length;

  const listHTML = count
    ? FAN_PLAYLIST.map(fanPlaylistTrackMarkup).join('')
    : `<li class="fpw-empty">
         <span class="fpw-empty-icon">&#9835;</span>
         <span class="fpw-empty-text">No songs yet —<br>be the first to add one.</span>
       </li>`;

  document.querySelectorAll('[data-fan-playlist-list]').forEach(ul=>{
    ul.innerHTML = listHTML;
  });

  document.querySelectorAll('[data-fan-playlist-count]').forEach(el=>{
    el.textContent = count === 1 ? '1 track' : `${count} tracks`;
  });
}

function buildFanPlaylistWidget(){
  if(document.getElementById('fan-playlist-widget')) return;
  const widget = document.createElement('div');
  widget.id = 'fan-playlist-widget';
  widget.innerHTML = `
    <div class="fpw-header">
      <div class="fpw-eyebrow">
        <span class="fpw-eq" aria-hidden="true"><span></span><span></span><span></span></span>
        FAN PLAYLIST
      </div>
      <div class="fpw-title-row">
        <h3 class="fpw-title">Fan Picks</h3>
        <span class="fpw-count" data-fan-playlist-count>0 tracks</span>
      </div>
    </div>
    <div class="fpw-divider"></div>
    <ul class="fpw-tracks fpw-tracks--widget" data-fan-playlist-list></ul>
    <div class="fpw-footer">Add yours from the dock <span class="fpw-footer-arrow">&rarr;</span></div>`;
  document.getElementById('desktop').appendChild(widget);
}

/* Playlist app window: just the Add Song form. Submitting
   pushes into FAN_PLAYLIST and calls renderFanPlaylist(), which
   updates the desktop widget instantly — no list view inside
   this window at all anymore. */
   function renderPlaylistWindow(b){
    b.innerHTML = `
      <div class="playlist-prompt">
        <p class="playlist-prompt-question">What's your fight song?</p>
        <p class="playlist-prompt-sub">Drop the track that gets you hyped! & help us build the ultimate fan playlist.</p>
      </div>
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
   TOPBAR — slim macOS/Chrome-style menu bar pinned to the top
   of the desktop. Brand mark + decorative menu words on the
   left (these are set dressing, not real dropdowns — same
   spirit as the placeholder Settings window). System glyphs +
   a live clock on the right. Edit TOPBAR_MENU to change words.
============================================================ */
const TOPBAR_MENU = ['File','Edit','View','History','Bookmarks'];

function renderTopbar(){
  const bar = document.getElementById('topbar');
  if(!bar) return;

  bar.innerHTML = `
    <div class="topbar-left">
      <img class="topbar-icon" src="assets/logo/bw-icon.png" alt="">
      <img class="topbar-logo" src="assets/logo/bw-wordmark.png" alt="">
      <nav class="topbar-menu">
        ${TOPBAR_MENU.map(label => `<span class="topbar-menu-item">${label}</span>`).join('')}
      </nav>
    </div>
    <div class="topbar-right">
      <span class="topbar-glyph" title="Wi-Fi">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 7.5C6.5 3 13.5 3 18 7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M5 10.8C8 8 12 8 15 10.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M8 14C9.3 12.8 10.7 12.8 12 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <circle cx="10" cy="16.3" r="1" fill="currentColor"/>
        </svg>
      </span>
      <span class="topbar-glyph" title="Search">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M16.5 16.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="topbar-glyph topbar-battery" title="Battery">
        <svg viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1.5" width="21" height="11" rx="2.5" stroke="currentColor" stroke-width="1.3"/>
          <rect x="3" y="3.5" width="14" height="7" rx="1.2" fill="currentColor"/>
          <path d="M24 5v4a1.5 1.5 0 0 0 0-4z" fill="currentColor"/>
        </svg>
      </span>
      <span class="topbar-clock" id="topbar-clock"></span>
    </div>`;

  updateTopbarClock();
  setInterval(updateTopbarClock, 30000);
}

function updateTopbarClock(){
  const el = document.getElementById('topbar-clock');
  if(!el) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' });
  el.textContent = `${dateStr}  ${timeStr}`;
}

renderTopbar();

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

