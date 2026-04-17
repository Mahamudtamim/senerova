(function(){
  const defaultAnnouncement = {
    enabled: true,
    items: [
      'Free Shipping Worldwide',
      'Sustainable Materials',
      'Limited Edition Drops',
      'Handcrafted Details'
    ],
    bg: '#FBF7F4',
    text: '#C4B5B5',
    icon: '#B76E79',
    border: 'rgba(45,42,42,0.06)'
  };

  let announcementData = JSON.parse(localStorage.getItem('sen-announcement') || 'null') || defaultAnnouncement;

  function saveAnnouncementData(){
    localStorage.setItem('sen-announcement', JSON.stringify(announcementData));
  }

  function getAnnouncementWrap(){
    const marquee = document.querySelector('.marquee');
    return marquee ? marquee.parentElement : null;
  }

  function applyAnnouncementBar(){
    const wrap = getAnnouncementWrap();
    const marquee = document.querySelector('.marquee');
    if(!wrap || !marquee) return;

    if(!announcementData.enabled){
      wrap.style.display = 'none';
      return;
    }

    wrap.style.display = '';
    wrap.style.background = announcementData.bg || '#FBF7F4';
    wrap.style.borderTopColor = announcementData.border || 'rgba(45,42,42,0.06)';
    wrap.style.borderBottomColor = announcementData.border || 'rgba(45,42,42,0.06)';
    wrap.classList.remove('bg-white');

    const items = (announcementData.items || []).filter(Boolean);
    const seq = items.length ? items : defaultAnnouncement.items;

    const build = seq.concat(seq).map((item) => `
      <span class="mx-8 text-sm font-heading tracking-[.3em] uppercase" style="color:${announcementData.text || '#C4B5B5'}">${item}</span>
      <span class="mx-4" style="color:${announcementData.icon || '#B76E79'}">&#10003;</span>
    `).join('');

    marquee.innerHTML = build;
  }

  window.saveAnnouncementAdmin = function(){
    const raw = (document.getElementById('an-items')?.value || '').split('\n').map(s => s.trim()).filter(Boolean);
    announcementData = {
      enabled: !!document.getElementById('an-enabled')?.checked,
      items: raw,
      bg: document.getElementById('an-bg')?.value || '#FBF7F4',
      text: document.getElementById('an-text')?.value || '#C4B5B5',
      icon: document.getElementById('an-icon')?.value || '#B76E79',
      border: document.getElementById('an-border')?.value || 'rgba(45,42,42,0.06)'
    };
    saveAnnouncementData();
    applyAnnouncementBar();
    showToast('Announcement bar saved!');
  };

  const oldRenderAdmin2 = window.renderAdmin;
  window.renderAdmin = function(tab){
    if(tab === 'settings'){
      const c = document.getElementById('admin-content');
      c.innerHTML = `
        <div class="space-y-8">
          <div>
            <h2 class="font-heading text-2xl font-semibold tracking-tight">Announcement Bar</h2>
            <p class="text-sm text-brand-muted mt-1">Edit the scrolling line under the hero and remove the unwanted white shade.</p>
          </div>

          <div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6">
            <label class="flex items-center gap-3 cursor-pointer">
              <input id="an-enabled" type="checkbox" class="accent-rose-gold" ${announcementData.enabled ? 'checked' : ''}/>
              <span class="text-sm text-brand-muted">Show announcement bar</span>
            </label>

            <div>
              <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Items (one per line)</label>
              <textarea id="an-items" rows="6" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${(announcementData.items || []).join('\n')}</textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Background Color</label>
                <input id="an-bg" type="color" value="${announcementData.bg || '#FBF7F4'}" class="w-full h-12 bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-2 py-2"/>
                <p class="text-xs text-brand-faint mt-2">Current fix uses a soft cream instead of bright white.</p>
              </div>
              <div>
                <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Text Color</label>
                <input id="an-text" type="color" value="${announcementData.text || '#C4B5B5'}" class="w-full h-12 bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-2 py-2"/>
              </div>
              <div>
                <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Checkmark Color</label>
                <input id="an-icon" type="color" value="${announcementData.icon || '#B76E79'}" class="w-full h-12 bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-2 py-2"/>
              </div>
              <div>
                <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Border Color</label>
                <input id="an-border" value="${announcementData.border || 'rgba(45,42,42,0.06)'}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/>
              </div>
            </div>

            <div>
              <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Live Preview</label>
              <div id="an-preview" class="border-y py-4 overflow-hidden rounded-lg" style="background:${announcementData.bg || '#FBF7F4'}; border-color:${announcementData.border || 'rgba(45,42,42,0.06)'}">
                <div class="flex whitespace-nowrap overflow-hidden">
                  ${((announcementData.items || defaultAnnouncement.items).slice(0,4)).map(item => `<span class="mx-6 text-xs font-heading tracking-[.3em] uppercase" style="color:${announcementData.text || '#C4B5B5'}">${item}</span><span class="mx-2" style="color:${announcementData.icon || '#B76E79'}">&#10003;</span>`).join('')}
                </div>
              </div>
            </div>

            <button onclick="saveAnnouncementAdmin()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Announcement Bar</button>
          </div>
        </div>
      `;
      return;
    }
    return oldRenderAdmin2(tab);
  };

  applyAnnouncementBar();
})();
