(function(){
  const defaultHeroColors = {
    badgeText: '#B76E79',
    badgeBorder: 'rgba(183,110,121,0.30)',
    badgeBg: 'rgba(255,255,255,0.50)',
    title1: '#D98F9D',
    title2: '#1F1B1B',
    subtitle: '#4B4545',
    primaryBtnBg: '#B76E79',
    primaryBtnText: '#FFFFFF',
    secondaryBtnBorder: 'rgba(183,110,121,0.35)',
    secondaryBtnText: '#B76E79',
    overlay: 'rgba(255,255,255,0.35)'
  };

  let heroColors = JSON.parse(localStorage.getItem('sen-hero-colors') || 'null') || defaultHeroColors;

  function saveHeroColors(){
    localStorage.setItem('sen-hero-colors', JSON.stringify(heroColors));
  }

  function setStyleIf(id, prop, val){
    const el = document.getElementById(id);
    if(el && val !== undefined && val !== null) el.style[prop] = val;
  }

  window.applyHeroColorStyles = function(){
    setStyleIf('hero-badge', 'color', heroColors.badgeText);
    setStyleIf('hero-badge', 'borderColor', heroColors.badgeBorder);
    setStyleIf('hero-badge', 'background', heroColors.badgeBg);
    setStyleIf('hero-t1', 'color', heroColors.title1);
    setStyleIf('hero-t1', 'webkitTextFillColor', heroColors.title1);
    setStyleIf('hero-t1', 'background', 'none');
    setStyleIf('hero-t2', 'color', heroColors.title2);
    setStyleIf('hero-sub', 'color', heroColors.subtitle);

    const heroSection = document.querySelector('#page-home section');
    if(heroSection){
      let overlay = heroSection.querySelector('.hero-fix-overlay');
      if(!overlay){
        overlay = document.createElement('div');
        overlay.className = 'hero-fix-overlay';
        heroSection.insertBefore(overlay, heroSection.firstChild);
      }
      overlay.style.background = heroColors.overlay || 'rgba(255,255,255,0.35)';
    }

    const buttons = heroSection ? heroSection.querySelectorAll('button') : [];
    if(buttons[0]){
      buttons[0].style.background = heroColors.primaryBtnBg;
      buttons[0].style.color = heroColors.primaryBtnText;
      buttons[0].style.border = 'none';
    }
    if(buttons[1]){
      buttons[1].style.borderColor = heroColors.secondaryBtnBorder;
      buttons[1].style.color = heroColors.secondaryBtnText;
      buttons[1].style.background = 'transparent';
    }
  };

  const oldApplyHero = window.applyHero;
  window.applyHero = function(){
    if(oldApplyHero) oldApplyHero();
    applyHeroColorStyles();
  };

  window.saveHeroAppearance = function(){
    heroColors = {
      badgeText: document.getElementById('hc-badge-text').value,
      badgeBorder: document.getElementById('hc-badge-border').value,
      badgeBg: document.getElementById('hc-badge-bg').value,
      title1: document.getElementById('hc-title1').value,
      title2: document.getElementById('hc-title2').value,
      subtitle: document.getElementById('hc-subtitle').value,
      primaryBtnBg: document.getElementById('hc-pbtn-bg').value,
      primaryBtnText: document.getElementById('hc-pbtn-text').value,
      secondaryBtnBorder: document.getElementById('hc-sbtn-border').value,
      secondaryBtnText: document.getElementById('hc-sbtn-text').value,
      overlay: document.getElementById('hc-overlay').value
    };
    saveHeroColors();
    applyHeroColorStyles();
    showToast('Hero colors saved!');
  };

  const previousRenderAdmin = window.renderAdmin;
  window.renderAdmin = function(tab){
    if(tab === 'hero'){
      const c=document.getElementById('admin-content');
      c.innerHTML = `
      <div class="space-y-8">
        <div>
          <h2 class="font-heading text-2xl font-semibold tracking-tight">Hero Section</h2>
          <p class="text-sm text-brand-muted mt-1">Edit hero content, image, text colors, overlay and button colors.</p>
        </div>

        <div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-4xl space-y-8">
          <div>
            <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Preview</label>
            <div class="rounded-xl overflow-hidden aspect-video bg-cream relative">
              <img id="hero-preview" src="${heroData && heroData.image ? heroData.image : ''}" class="w-full h-full object-cover sepia-[0.15] opacity-80" onerror="this.src='https://picsum.photos/seed/senerova-hero-fash/900/500.jpg'"/>
            </div>
          </div>

          <div class="rounded-xl bg-cream p-4 border border-[rgba(45,42,42,0.06)]">
            <div class="text-sm font-medium">Hero image upload size</div>
            <div class="text-xs text-brand-faint mt-1">Recommended size: 1920 × 1080 px</div>
          </div>

          <div class="grid gap-3">
            <label class="text-xs text-brand-muted uppercase tracking-widest block">Upload Image</label>
            <input type="file" accept="image/*" onchange="handleSingleImageUploadWithNote('he-img','hero-preview',event)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/>
            <p class="text-xs text-brand-faint">You can upload from your device or paste an image URL/seed below.</p>
          </div>

          <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Image URL or Seed</label><input id="he-img" value="${heroData ? (heroData.image || '') : ''}" oninput="document.getElementById('hero-preview').src=this.value" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Text</label><input id="he-badge" value="${heroData ? (heroData.badge || '') : ''}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
            <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 1</label><input id="he-t1" value="${heroData ? (heroData.title1 || '') : ''}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
            <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 2</label><input id="he-t2" value="${heroData ? (heroData.title2 || '') : ''}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
            <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Subtitle</label><textarea id="he-sub" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${heroData ? (heroData.subtitle || '') : ''}</textarea></div>
          </div>

          <div class="border-t border-[rgba(45,42,42,0.06)] pt-6">
            <h3 class="font-heading text-lg font-semibold tracking-tight mb-4">Hero Color Controls</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Text Color</label><input id="hc-badge-text" type="color" value="${heroColors.badgeText}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Border Color</label><input id="hc-badge-border" type="color" value="${heroColors.badgeBorder.startsWith('#') ? heroColors.badgeBorder : '#d9a1aa'}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Background Color</label><input id="hc-badge-bg" type="color" value="${heroColors.badgeBg.startsWith('#') ? heroColors.badgeBg : '#fff8f8'}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Overlay Color</label><input id="hc-overlay" value="${heroColors.overlay}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Top Title Color</label><input id="hc-title1" type="color" value="${heroColors.title1}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Bottom Title Color</label><input id="hc-title2" type="color" value="${heroColors.title2}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Subtitle Color</label><input id="hc-subtitle" type="color" value="${heroColors.subtitle}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Primary Button Background</label><input id="hc-pbtn-bg" type="color" value="${heroColors.primaryBtnBg}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Primary Button Text</label><input id="hc-pbtn-text" type="color" value="${heroColors.primaryBtnText}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Secondary Button Border</label><input id="hc-sbtn-border" type="color" value="${heroColors.secondaryBtnBorder.startsWith('#') ? heroColors.secondaryBtnBorder : '#d9a1aa'}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
              <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Secondary Button Text</label><input id="hc-sbtn-text" type="color" value="${heroColors.secondaryBtnText}" class="w-full h-12 rounded-lg border border-[rgba(45,42,42,0.08)]"/></div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button onclick="saveHeroData()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Hero Content</button>
            <button onclick="saveHeroAppearance()" class="border border-rose-gold/30 text-rose-gold text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-gold/5 transition-colors">Save Hero Colors</button>
          </div>
        </div>
      </div>`;
      return;
    }
    return previousRenderAdmin(tab);
  };

  try{ applyHeroColorStyles(); }catch(e){}
})();
