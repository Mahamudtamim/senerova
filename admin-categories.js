(function(){
  const oldRenderAdmin = window.renderAdmin;
  const oldBuildAdminNav = window.buildAdminNav;
  const oldAdminTab = window.adminTab;

  const DEFAULT_CATEGORIES = [...new Set(['tops','bottoms','layers', ...products.map(p => p.category).filter(Boolean)])];
  let categoriesData = JSON.parse(localStorage.getItem('sen-categories') || 'null') || DEFAULT_CATEGORIES.map(id => ({id, label: id.charAt(0).toUpperCase()+id.slice(1)}));
  let contactData = JSON.parse(localStorage.getItem('sen-contact') || 'null') || {
    showroom: 'Torstrasse 127, 10119 Berlin, Germany',
    hours: 'Mon-Sat: 11:00 - 19:00',
    email1: 'hello@senerova.com',
    email2: 'press@senerova.com',
    phone: '+49 30 1234 5678',
    instagram: '#',
    twitter: '#',
    youtube: '#'
  };

  window.saveCategoriesData = function(){
    localStorage.setItem('sen-categories', JSON.stringify(categoriesData));
  };
  window.saveContactDataStore = function(){
    localStorage.setItem('sen-contact', JSON.stringify(contactData));
  };

  products.forEach(p => { if(!p.gender) p.gender = 'unisex'; });

  function esc(s){ return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function imgSrc(v,w,h){
    if(!v) return `https://picsum.photos/seed/placeholder/${w}/${h}.jpg`;
    if(/^data:image\//.test(v) || /^https?:\/\//.test(v) || v.startsWith('./') || v.startsWith('/')) return v;
    return `https://picsum.photos/seed/${encodeURIComponent(v)}/${w}/${h}.jpg`;
  }
  window.__imgSrc = imgSrc;

  window.handleImageUploadToInput = function(inputId, previewId, evt, w=900, h=500){
    const file = evt.target.files && evt.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      const val = e.target.result;
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);
      if(input) input.value = val;
      if(preview) preview.src = val;
      showToast('Image loaded');
    };
    reader.readAsDataURL(file);
  };

  window.renderContactPage = function(){
    const el = document.getElementById('page-contact');
    if(!el) return;
    el.innerHTML = `<div class="pt-32 pb-20 px-6"><div class="max-w-7xl mx-auto"><div class="text-center mb-20 anim"><span class="text-[10px] font-semibold tracking-[.3em] uppercase text-rose-gold">Get In Touch</span><h2 class="font-heading text-4xl md:text-7xl font-semibold tracking-tighter mt-3 uppercase">Contact</h2></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-16"><div class="anim d1"><form onsubmit="handleContact(event)" class="space-y-5"><div class="grid grid-cols-2 gap-5"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">First Name</label><input required class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Last Name</label><input required class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Email</label><input type="email" required class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Subject</label><select class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted"><option>General Inquiry</option><option>Order Support</option><option>Returns</option><option>Press</option></select></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Message</label><textarea required rows="5" class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none"></textarea></div><button type="submit" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-4 rounded-full hover:bg-rose-dark transition-colors">Send Message</button></form></div><div class="space-y-6 anim d2"><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm"><div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full border border-[rgba(45,42,42,0.08)] bg-cream flex items-center justify-center flex-shrink-0"><i data-lucide="map-pin" class="w-5 h-5 text-rose-gold"></i></div><div><h4 class="font-heading font-medium">Atelier & Showroom</h4><p class="text-sm text-brand-muted mt-1">${esc(contactData.showroom)}</p><p class="text-xs text-brand-faint mt-2">${esc(contactData.hours)}</p></div></div></div><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm"><div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full border border-[rgba(45,42,42,0.08)] bg-cream flex items-center justify-center flex-shrink-0"><i data-lucide="mail" class="w-5 h-5 text-rose-gold"></i></div><div><h4 class="font-heading font-medium">Email</h4><p class="text-sm text-brand-muted mt-1">${esc(contactData.email1)}</p><p class="text-sm text-brand-muted">${esc(contactData.email2)}</p></div></div></div><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm"><div class="flex items-start gap-4"><div class="w-10 h-10 rounded-full border border-[rgba(45,42,42,0.08)] bg-cream flex items-center justify-center flex-shrink-0"><i data-lucide="phone" class="w-5 h-5 text-rose-gold"></i></div><div><h4 class="font-heading font-medium">Phone</h4><p class="text-sm text-brand-muted mt-1">${esc(contactData.phone)}</p></div></div></div><div class="flex gap-4"><a href="${esc(contactData.instagram)}" class="w-12 h-12 rounded-full border border-[rgba(45,42,42,0.08)] bg-white flex items-center justify-center text-brand-muted hover:border-rose-gold/30 hover:text-rose-gold transition-colors"><i data-lucide="instagram" class="w-5 h-5"></i></a><a href="${esc(contactData.twitter)}" class="w-12 h-12 rounded-full border border-[rgba(45,42,42,0.08)] bg-white flex items-center justify-center text-brand-muted hover:border-rose-gold/30 hover:text-rose-gold transition-colors"><i data-lucide="twitter" class="w-5 h-5"></i></a><a href="${esc(contactData.youtube)}" class="w-12 h-12 rounded-full border border-[rgba(45,42,42,0.08)] bg-white flex items-center justify-center text-brand-muted hover:border-rose-gold/30 hover:text-rose-gold transition-colors"><i data-lucide="youtube" class="w-5 h-5"></i></a></div></div></div></div></div></div>`;
    lucide.createIcons();
  };

  window.applyHero = function(){
    const img = document.getElementById('hero-img');
    if(img) img.src = imgSrc(heroData.image, 1920, 1080);
    const b = document.getElementById('hero-badge'); if(b) b.textContent = heroData.badge;
    const t1 = document.getElementById('hero-t1'); if(t1) t1.textContent = heroData.title1;
    const t2 = document.getElementById('hero-t2'); if(t2) t2.textContent = heroData.title2;
    const s = document.getElementById('hero-sub'); if(s) s.textContent = heroData.subtitle;
  };

  window.renderStoryPage = function(){
    const s = storyData;
    document.getElementById('story-content').innerHTML = `<div class="pt-32 pb-20 px-6"><div class="max-w-7xl mx-auto"><div class="text-center mb-20 anim"><span class="text-[10px] font-semibold tracking-[.3em] uppercase text-rose-gold">Our Story</span><h2 class="font-heading text-4xl md:text-7xl font-semibold tracking-tighter mt-3 uppercase">Born From<br/>Restlessness</h2></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 anim d1"><div class="overflow-hidden rounded-2xl"><img src="${imgSrc(s.heroImage,700,900)}" class="w-full aspect-[3/4] object-cover sepia-[0.15] opacity-70 hover:opacity-90 hover:sepia-0 transition-all duration-700"/></div><div><p class="text-brand-muted font-light leading-relaxed text-lg">${esc(s.introText)}</p><p class="text-brand-muted font-light leading-relaxed mt-5">${esc(s.bodyText)}</p><div class="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[rgba(45,42,42,0.06)]">${(s.stats||[]).map(st=>`<div><div class="font-heading text-3xl font-semibold tracking-tighter">${esc(st.value)}</div><div class="text-xs text-brand-faint mt-1 tracking-widest uppercase">${esc(st.label)}</div></div>`).join('')}</div></div></div><div class="relative mb-16 anim"><div class="overflow-hidden rounded-2xl"><img src="${imgSrc(s.quoteImage,1400,500)}" class="w-full h-80 md:h-[500px] object-cover sepia-[0.2] opacity-60"/></div><div class="absolute inset-0 bg-gradient-to-t from-cream-bg via-transparent to-cream-bg"></div><div class="absolute bottom-8 left-8 right-8 text-center"><p class="font-heading text-xl md:text-3xl font-medium tracking-tight max-w-2xl mx-auto">${esc(s.quoteText)}</p></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8">${(s.values||[]).map((v,i)=>`<div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm anim d${(i%5)+1}"><div class="w-12 h-12 rounded-full bg-blush/30 flex items-center justify-center mb-5"><i data-lucide="${esc(v.icon||'sparkles')}" class="w-5 h-5 text-rose-gold"></i></div><h3 class="font-heading text-lg font-semibold tracking-tight">${esc(v.title)}</h3><p class="text-sm text-brand-muted mt-3 font-light leading-relaxed">${esc(v.desc)}</p></div>`).join('')}</div></div></div>`;
    lucide.createIcons();
  };

  let shopCategory = 'all';
  let shopGender = 'all';
  let shopPriceMin = '';
  let shopPriceMax = '';

  window.renderShopPage = function(){
    const categoryOptions = ['all', ...categoriesData.map(c=>c.id)];
    document.getElementById('shop-filters').innerHTML = `
      <div class="flex flex-wrap items-center gap-3 w-full">
        <select id="shop-category-select" onchange="shopCategory=this.value;renderShopProducts()" class="bg-white border border-[rgba(45,42,42,0.08)] rounded-full px-4 py-2.5 text-sm text-brand-muted cursor-pointer">
          ${categoryOptions.map(c=>`<option value="${c}" ${c===shopCategory?'selected':''}>${c==='all'?'All Categories':(categoriesData.find(x=>x.id===c)?.label||c)}</option>`).join('')}
        </select>
        <div class="flex gap-2">
          ${['all','man','woman','unisex'].map(g=>`<button onclick="shopGender='${g}';renderShopProducts();updateShopBtns()" class="sgb tab-btn ${g===shopGender?'active':''} text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full border border-[rgba(45,42,42,0.08)] transition-all ${g===shopGender?'':'text-brand-muted'}">${g}</button>`).join('')}
        </div>
        <input id="shop-min-price" value="${shopPriceMin}" oninput="shopPriceMin=this.value;renderShopProducts()" type="number" min="0" placeholder="Min price" class="bg-white border border-[rgba(45,42,42,0.08)] rounded-full px-4 py-2.5 text-sm w-32"/>
        <input id="shop-max-price" value="${shopPriceMax}" oninput="shopPriceMax=this.value;renderShopProducts()" type="number" min="0" placeholder="Max price" class="bg-white border border-[rgba(45,42,42,0.08)] rounded-full px-4 py-2.5 text-sm w-32"/>
      </div>`;
    renderShopProducts();
  };

  window.updateShopBtns = function(){
    document.querySelectorAll('.sgb').forEach(b=>{
      const m = b.textContent.trim().toLowerCase() === shopGender;
      b.classList.toggle('active', m);
      b.classList.toggle('bg-rose-gold', m);
      b.classList.toggle('text-white', m);
      b.classList.toggle('text-brand-muted', !m);
    });
  };

  window.renderShopProducts = function(){
    const s=(document.getElementById('shop-search')?.value||'').toLowerCase();
    const so=document.getElementById('shop-sort')?.value||'newest';
    let f=products.filter(p=>{
      const price = Number(p.price)||0;
      if(shopCategory!=='all' && p.category!==shopCategory) return false;
      if(shopGender!=='all' && (p.gender||'unisex')!==shopGender) return false;
      if(shopPriceMin!=='' && price < Number(shopPriceMin)) return false;
      if(shopPriceMax!=='' && price > Number(shopPriceMax)) return false;
      if(s && !p.name.toLowerCase().includes(s) && !String(p.material||'').toLowerCase().includes(s)) return false;
      return true;
    });
    if(so==='price-asc') f.sort((a,b)=>a.price-b.price);
    if(so==='price-desc') f.sort((a,b)=>b.price-a.price);
    if(so==='name') f.sort((a,b)=>a.name.localeCompare(b.name));
    document.getElementById('shop-products').innerHTML = f.length ? f.map(pc).join('') : '<div class="col-span-full text-center py-20 text-brand-faint">No products found</div>';
    updateShopBtns();
  };

  window.prodForm = function(p,idx){
    const categoryOptions = categoriesData.map(c=>`<option value="${c.id}" ${c.id===p.category?'selected':''}>${esc(c.label)}</option>`).join('');
    return `<div class="space-y-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Name</label><input id="pf-name" value="${esc(p.name)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Price (USD)</label><input id="pf-price" type="number" value="${p.price}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Category</label><select id="pf-cat" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${categoryOptions}</select></div></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Collection</label><select id="pf-col" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${['essentials','outerwear','avantgarde'].map(c=>'<option '+(c===p.collection?'selected':'')+'>'+c+'</option>').join('')}</select></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Gender</label><select id="pf-gender" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${['man','woman','unisex'].map(g=>'<option '+((p.gender||'unisex')===g?'selected':'')+'>'+g+'</option>').join('')}</select></div></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge</label><select id="pf-badge" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${['','New','Sale'].map(b=>'<option '+(b===p.badge?'selected':'')+'>'+(b||'None')+'</option>').join('')}</select></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Image Seed</label><input id="pf-img" value="${esc(p.img)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Material</label><input id="pf-mat" value="${esc(p.material)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Description</label><textarea id="pf-desc" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc(p.desc)}</textarea></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Sizes (comma-separated)</label><input id="pf-sizes" value="${(p.sizes||[]).join(',')}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Color Names (comma-separated)</label><input id="pf-cnames" value="${(p.colorNames||[]).join(',')}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="pf-so" ${p.soldOut?'checked':''} class="accent-red-400"/><span class="text-sm text-red-500">Sold Out</span></label><button onclick="saveProductEdit(${idx},${p.id})" class="w-full bg-rose-gold text-white text-xs font-medium uppercase tracking-widest py-3 rounded-full hover:bg-rose-dark transition-colors">${idx>=0?'Save Changes':'Add Product'}</button></div>`;
  };

  window.saveProductEdit = function(idx,origId){
    const n=document.getElementById('pf-name').value.trim();
    if(!n){showToast('Name required');return}
    const pr=parseInt(document.getElementById('pf-price').value)||0;
    if(pr<=0){showToast('Price must be > 0');return}
    const sz=document.getElementById('pf-sizes').value.split(',').map(s=>s.trim()).filter(Boolean);
    const cn=document.getElementById('pf-cnames').value.split(',').map(s=>s.trim()).filter(Boolean);
    const bg=document.getElementById('pf-badge').value;
    const data={name:n,price:pr,category:document.getElementById('pf-cat').value,collection:document.getElementById('pf-col').value,gender:document.getElementById('pf-gender').value,material:document.getElementById('pf-mat').value,desc:document.getElementById('pf-desc').value,sizes:sz,colors:cn.map((_,i)=>'#'+['111111','444444','E5E5E5','1a1a2e','3d2b1f','2b3a2b','333333','2d1f1f','b8c4d4'][i%9]),colorNames:cn,badge:bg==='None'?'':bg,soldOut:document.getElementById('pf-so').checked,img:document.getElementById('pf-img').value||'p-'+Date.now()};
    if(idx>=0)products[idx]={...products[idx],...data}; else {data.id=Math.max(...products.map(p=>p.id),0)+1;products.push(data)}
    saveProducts(); closeModal(); showToast(idx>=0?'Product updated':'Product added'); renderAdmin('products');
  };

  window.couponForm = function(co,idx){
    const allCols=['essentials','outerwear','avantgarde'];
    return `<div class="space-y-4"><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Code</label><input id="cp-code" value="${esc(co.code)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm uppercase tracking-wider font-medium"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Type</label><select id="cp-type" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted"><option value="percentage" ${co.type==='percentage'?'selected':''}>Percentage</option><option value="fixed" ${co.type==='fixed'?'selected':''}>Fixed</option></select></div></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Value</label><input id="cp-val" type="number" value="${co.value}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Min Order ($)</label><input id="cp-min" type="number" value="${co.minOrder}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Max Discount ($) 0=unlimited</label><input id="cp-max" type="number" value="${co.maxDiscount}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Usage Limit 0=unlimited</label><input id="cp-limit" type="number" value="${co.usageLimit}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Used Count</label><input id="cp-used" type="number" value="${co.usedCount}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div></div><div class="grid grid-cols-2 gap-4"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Start Date</label><input id="cp-start" type="date" value="${esc(co.startDate)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">End Date</label><input id="cp-end" type="date" value="${esc(co.endDate)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Categories (empty=all)</label><div class="flex flex-wrap gap-2">${categoriesData.map(cat=>`<label class="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" class="cp-cat accent-rose-gold" value="${cat.id}" ${(co.categories||[]).includes(cat.id)?'checked':''}/>${esc(cat.label)}</label>`).join('')}</div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Collections (empty=all)</label><div class="flex flex-wrap gap-2">${allCols.map(col=>`<label class="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" class="cp-col accent-rose-gold" value="${col}" ${(co.collections||[]).includes(col)?'checked':''}/>${col}</label>`).join('')}</div></div><label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="cp-active" ${co.active?'checked':''} class="accent-rose-gold"/><span class="text-sm text-brand-muted">Active</span></label><button onclick="saveCoupon(${idx})" class="w-full bg-rose-gold text-white text-xs font-medium uppercase tracking-widest py-3 rounded-full hover:bg-rose-dark transition-colors">${idx>=0?'Save Changes':'Add Coupon'}</button></div>`;
  };

  window.saveCoupon = function(idx){
    const code=document.getElementById('cp-code').value.trim().toUpperCase();
    if(!code){showToast('Code required');return}
    const val=parseFloat(document.getElementById('cp-val').value)||0;
    if(val<=0){showToast('Value must be > 0');return}
    const data={code,type:document.getElementById('cp-type').value,value:val,minOrder:parseFloat(document.getElementById('cp-min').value)||0,maxDiscount:parseFloat(document.getElementById('cp-max').value)||0,categories:[...document.querySelectorAll('.cp-cat:checked')].map(c=>c.value),collections:[...document.querySelectorAll('.cp-col:checked')].map(c=>c.value),startDate:document.getElementById('cp-start').value,endDate:document.getElementById('cp-end').value,usageLimit:parseInt(document.getElementById('cp-limit').value)||0,usedCount:parseInt(document.getElementById('cp-used').value)||0,active:document.getElementById('cp-active').checked};
    if(idx>=0)couponsData[idx]={...couponsData[idx],...data}; else {data.id=Math.max(0,...couponsData.map(c=>c.id))+1;couponsData.push(data)}
    saveCoupons(); closeModal(); showToast(idx>=0?'Coupon updated':'Coupon added'); renderAdmin('coupons');
  };

  const customAdminTabs = [
    {id:'overview',icon:'layout-dashboard',label:'Overview'},
    {id:'orders',icon:'package',label:'Orders'},
    {id:'products',icon:'shirt',label:'Products'},
    {id:'categories',icon:'list-tree',label:'Categories'},
    {id:'users',icon:'users',label:'Users'},
    {id:'hero',icon:'image',label:'Hero'},
    {id:'offers',icon:'tag',label:'Offers'},
    {id:'coupons',icon:'ticket',label:'Coupons'},
    {id:'story',icon:'book-open',label:'Story'},
    {id:'contact',icon:'phone',label:'Contact'},
    {id:'settings',icon:'settings',label:'Settings'}
  ];

  window.buildAdminNav = function(){
    const nav=document.getElementById('admin-nav'),mob=document.getElementById('admin-mobile-tabs');
    if(!nav||!mob)return;
    nav.innerHTML=customAdminTabs.map(t=>`<button onclick="adminTab('${t.id}')" class="sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-brand-text hover:bg-white/50 transition-colors text-left"><i data-lucide="${t.icon}" class="w-4 h-4"></i> ${t.label}</button>`).join('');
    mob.innerHTML=customAdminTabs.map(t=>`<button onclick="adminTab('${t.id}')" class="atab-btn tab-btn whitespace-nowrap text-xs px-4 py-2 rounded-full border border-[rgba(45,42,42,0.08)] text-brand-muted transition-all">${t.label}</button>`).join('');
    lucide.createIcons();
  };

  window.adminTab = function(tab){
    document.querySelectorAll('.sidebar-link').forEach((l,i)=>l.classList.toggle('active',customAdminTabs[i]?.id===tab));
    document.querySelectorAll('.atab-btn').forEach((b,i)=>{
      const m=customAdminTabs[i]?.id===tab;
      b.classList.toggle('active',m); b.classList.toggle('bg-rose-gold',m); b.classList.toggle('text-white',m); b.classList.toggle('text-brand-muted',!m);
    });
    renderAdmin(tab);
  };

  window.addCategoryItem = function(){
    const raw = prompt('New category name');
    if(!raw) return;
    const label = raw.trim();
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    if(!id) return;
    if(categoriesData.some(c=>c.id===id)){showToast('Category already exists'); return;}
    categoriesData.push({id, label});
    saveCategoriesData();
    showToast('Category added');
    renderAdmin('categories');
  };
  window.deleteCategoryItem = function(id){
    if(!confirm('Delete this category?')) return;
    categoriesData = categoriesData.filter(c=>c.id!==id);
    products.forEach(p=>{ if(p.category===id) p.category = categoriesData[0]?.id || 'general'; });
    couponsData.forEach(c=>{ c.categories = (c.categories||[]).filter(x=>x!==id); });
    saveCategoriesData(); saveProducts(); saveCoupons();
    showToast('Category deleted');
    renderAdmin('categories');
  };

  window.saveContactAdmin = function(){
    contactData = {
      showroom: document.getElementById('ct-showroom').value.trim(),
      hours: document.getElementById('ct-hours').value.trim(),
      email1: document.getElementById('ct-email1').value.trim(),
      email2: document.getElementById('ct-email2').value.trim(),
      phone: document.getElementById('ct-phone').value.trim(),
      instagram: document.getElementById('ct-instagram').value.trim() || '#',
      twitter: document.getElementById('ct-twitter').value.trim() || '#',
      youtube: document.getElementById('ct-youtube').value.trim() || '#'
    };
    saveContactDataStore();
    renderContactPage();
    showToast('Contact info saved!');
  };

  window.saveStoryData = function(){
    const statsRaw=document.getElementById('st-stats').value.trim().split('\n').filter(Boolean);
    const stats=statsRaw.map(l=>{const[v,label]=l.split('|');return{value:(v||'').trim(),label:(label||'').trim()}}).filter(s=>s.value&&s.label);
    const valCards=document.getElementById('st-vals').children;
    const values=[];
    for(let c of valCards){
      const icon=c.querySelector('.st-vi')?.value||'';
      const title=c.querySelector('.st-vt')?.value||'';
      const desc=c.querySelector('.st-vd')?.value||'';
      if(title) values.push({icon,title,desc});
    }
    storyData={heroImage:document.getElementById('st-hero').value.trim()||'atelier-senerova',introText:document.getElementById('st-intro').value.trim(),bodyText:document.getElementById('st-body').value.trim(),quoteImage:document.getElementById('st-qimg').value.trim()||'fabric-mill-sen',quoteText:document.getElementById('st-quote').value.trim(),stats,values};
    saveStory();
    renderStoryPage();
    showToast('Story saved!');
  };

  window.saveHeroData = function(){
    heroData = {
      image: document.getElementById('he-img').value.trim() || 'senerova-hero-fash',
      badge: document.getElementById('he-badge').value.trim(),
      title1: document.getElementById('he-t1').value.trim(),
      title2: document.getElementById('he-t2').value.trim(),
      subtitle: document.getElementById('he-sub').value.trim()
    };
    saveHero();
    applyHero();
    showToast('Hero saved!');
  };

  window.renderAdmin = function(tab){
    if(tab==='categories'){
      const c=document.getElementById('admin-content');
      c.innerHTML = `<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"><div><h2 class="font-heading text-2xl font-semibold tracking-tight">Categories</h2><p class="text-sm text-brand-muted mt-1">Manage product categories used in shop, products, and coupons</p></div><button onclick="addCategoryItem()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-6 py-3 rounded-full hover:bg-rose-dark transition-colors">+ Add Category</button></div><div class="grid gap-4">${categoriesData.map(cat=>`<div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"><div><div class="font-medium">${esc(cat.label)}</div><div class="text-xs text-brand-faint mt-1">${esc(cat.id)}</div></div><button onclick="deleteCategoryItem('${esc(cat.id)}')" class="text-xs text-red-500 hover:underline">Delete</button></div>`).join('')}</div>`;
      return;
    }
    if(tab==='contact'){
      const c=document.getElementById('admin-content');
      c.innerHTML = `<div class="mb-8"><h2 class="font-heading text-2xl font-semibold tracking-tight">Contact Page</h2><p class="text-sm text-brand-muted mt-1">Edit the contact information shown on the contact page</p></div><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Showroom Address</label><textarea id="ct-showroom" rows="2" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc(contactData.showroom)}</textarea></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Hours</label><input id="ct-hours" value="${esc(contactData.hours)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Primary Email</label><input id="ct-email1" value="${esc(contactData.email1)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Secondary Email</label><input id="ct-email2" value="${esc(contactData.email2)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Phone</label><input id="ct-phone" value="${esc(contactData.phone)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Instagram URL</label><input id="ct-instagram" value="${esc(contactData.instagram)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Twitter URL</label><input id="ct-twitter" value="${esc(contactData.twitter)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">YouTube URL</label><input id="ct-youtube" value="${esc(contactData.youtube)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div></div><button onclick="saveContactAdmin()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Contact Info</button></div>`;
      return;
    }
    if(tab==='hero'){
      const c=document.getElementById('admin-content');
      c.innerHTML = `<div class="mb-8"><h2 class="font-heading text-2xl font-semibold tracking-tight">Hero Section</h2><p class="text-sm text-brand-muted mt-1">Edit the homepage hero banner and upload a new image</p></div><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Preview</label><div class="rounded-xl overflow-hidden aspect-video bg-cream"><img id="hero-preview" src="${imgSrc(heroData.image,900,500)}" class="w-full h-full object-cover sepia-[0.15] opacity-80"/></div></div><div class="grid gap-3"><label class="text-xs text-brand-muted uppercase tracking-widest block">Upload Image</label><input type="file" accept="image/*" onchange="handleImageUploadToInput('he-img','hero-preview',event,900,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/><p class="text-xs text-brand-faint">You can upload from your device or paste an image URL/seed below.</p></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Image URL or Seed</label><input id="he-img" value="${esc(heroData.image)}" oninput="document.getElementById('hero-preview').src=__imgSrc(this.value,900,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Text</label><input id="he-badge" value="${esc(heroData.badge)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 1</label><input id="he-t1" value="${esc(heroData.title1)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 2</label><input id="he-t2" value="${esc(heroData.title2)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Subtitle</label><textarea id="he-sub" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc(heroData.subtitle)}</textarea></div></div><button onclick="saveHeroData()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Hero</button></div>`;
      return;
    }
    if(tab==='story'){
      const c=document.getElementById('admin-content');
      const s=storyData;
      c.innerHTML = `<div class="mb-8"><h2 class="font-heading text-2xl font-semibold tracking-tight">Story Page</h2><p class="text-sm text-brand-muted mt-1">Edit the story page content and upload images</p></div><div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6"><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Story Hero Preview</label><div class="rounded-xl overflow-hidden aspect-[4/5] bg-cream max-w-sm"><img id="story-hero-preview" src="${imgSrc(s.heroImage,700,900)}" class="w-full h-full object-cover sepia-[0.15] opacity-80"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Upload Story Hero Image</label><input type="file" accept="image/*" onchange="handleImageUploadToInput('st-hero','story-hero-preview',event,700,900)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Story Hero Image URL or Seed</label><input id="st-hero" value="${esc(s.heroImage)}" oninput="document.getElementById('story-hero-preview').src=__imgSrc(this.value,700,900)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Introduction Text</label><textarea id="st-intro" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc(s.introText)}</textarea></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Body Text</label><textarea id="st-body" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc(s.bodyText)}</textarea></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Quote Banner Preview</label><div class="rounded-xl overflow-hidden aspect-[16/6] bg-cream"><img id="story-quote-preview" src="${imgSrc(s.quoteImage,1400,500)}" class="w-full h-full object-cover sepia-[0.15] opacity-80"/></div></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Upload Quote Banner Image</label><input type="file" accept="image/*" onchange="handleImageUploadToInput('st-qimg','story-quote-preview',event,1400,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Quote Image URL or Seed</label><input id="st-qimg" value="${esc(s.quoteImage)}" oninput="document.getElementById('story-quote-preview').src=__imgSrc(this.value,1400,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Quote Text</label><input id="st-quote" value="${esc(s.quoteText)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div><div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Stats (value|label per line)</label><textarea id="st-stats" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${(s.stats||[]).map(st=>`${st.value}|${st.label}`).join('\n')}</textarea></div><div><div class="flex items-center justify-between mb-3"><label class="text-xs text-brand-muted uppercase tracking-widest block">Value Cards</label><button onclick="document.getElementById('st-vals').insertAdjacentHTML('beforeend',\`<div class=&quot;grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-cream rounded-xl&quot;><input placeholder=&quot;Icon&quot; class=&quot;st-vi bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm&quot;/><input placeholder=&quot;Title&quot; class=&quot;st-vt bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm&quot;/><input placeholder=&quot;Description&quot; class=&quot;st-vd bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm md:col-span-1&quot;/></div>\`)" class="text-xs text-rose-gold hover:underline">+ Add Card</button></div><div id="st-vals" class="space-y-3">${(s.values||[]).map(v=>`<div class="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-cream rounded-xl"><input value="${esc(v.icon)}" class="st-vi bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm"/><input value="${esc(v.title)}" class="st-vt bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm"/><input value="${esc(v.desc)}" class="st-vd bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-3 py-2 text-sm"/></div>`).join('')}</div></div><button onclick="saveStoryData()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Story</button></div>`;
      return;
    }
    oldRenderAdmin(tab);
  };

  try{ applyHero(); }catch(e){}
  try{ renderOffers(); }catch(e){}
})();
