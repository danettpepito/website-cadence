const ICON = {
    note:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>`,
    folder:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3z"/><path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    play:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
    help:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.5 9a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2"/><circle cx="12" cy="17" r=".4"/><circle cx="12" cy="12" r="9"/></svg>`,
    file:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v13H7z"/></svg>`,
    star:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6L22 9l-5.5 4.8L18 22l-6-4-6 4 1.5-8.2L2 9l7.4-.4z"/></svg>`,
  };
  
  const APPS = [
    { id:'nadia', label:'NADIA', glyph:ICON.note, color:'#888', window:(b)=>b.innerHTML="Nadia content" },
    { id:'mika', label:'MIKA', glyph:ICON.star, color:'#888', window:(b)=>b.innerHTML="Mika content" },
  ];
  
  const UTILS = [
    { id:'photobook', glyph:ICON.folder, window:(b)=>b.innerHTML="Photobook" },
    { id:'video', glyph:ICON.play, window:(b)=>b.innerHTML="Video" },
  ];
  
  const DOCK = [
    { id:'playlist', glyph:ICON.note, window:(b)=>b.innerHTML="Playlist" },
    { id:'site', glyph:ICON.globe, action:()=>window.open('https://example.com') },
    { id:'help', glyph:ICON.help, window:(b)=>b.innerHTML="Help" },
  ];
  
  const iconRail = document.getElementById('icon-rail');
  const utilRail = document.getElementById('util-rail');
  const dock = document.getElementById('dock');
  const winLayer = document.getElementById('windows');
  
  const REGISTRY = {};
  
  [...APPS,...UTILS,...DOCK].forEach(i=>{ if(i.id) REGISTRY[i.id]=i });
  
  APPS.forEach(app=>{
    iconRail.innerHTML += `
      <button class="file-icon" data-open="${app.id}">
        <span class="glyph">${app.glyph}</span>
        <span class="label">${app.label}</span>
      </button>`;
  });
  
  UTILS.forEach(u=>{
    utilRail.innerHTML += `
      <button class="util-btn" data-open="${u.id}">
        ${u.glyph}
      </button>`;
  });
  
  DOCK.forEach(d=>{
    if(d.sep) return;
    dock.innerHTML += `
      <button class="dock-btn" data-open="${d.id}">
        ${d.glyph}
      </button>`;
  });
  
  let z=20;
  
  function openWindow(id){
    let el=document.getElementById('win-'+id);
    if(!el){
      const item=REGISTRY[id];
      el=document.createElement('div');
      el.className='window';
      el.id='win-'+id;
  
      el.innerHTML=`
        <div class="window-head">
          <span class="title">${id.toUpperCase()}</span>
          <button class="close">✕</button>
        </div>
        <div class="window-body"></div>`;
  
      winLayer.appendChild(el);
      item.window(el.querySelector('.window-body'));
  
      el.querySelector('.close').onclick=()=>el.classList.remove('open');
    }
  
    el.classList.add('open');
    el.style.zIndex=++z;
  }
  
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-open]');
    if(!btn) return;
    const id=btn.dataset.open;
    const item=REGISTRY[id];
    if(item?.action) return item.action();
    openWindow(id);
  });