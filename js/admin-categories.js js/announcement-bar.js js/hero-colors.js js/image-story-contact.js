(function(){
  function esc2(s){ return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function resolveAnyImage(v,w,h){
    if(!v) return `https://picsum.photos/seed/placeholder/${w}/${h}.jpg`;
    if(/^data:image\//.test(v) || /^https?:\/\//.test(v) || v.startsWith('./') || v.startsWith('/')) return v;
    return `https://picsum.photos/seed/${v}/${w}/${h}.jpg`;
  }
  function productImagesFor(p){
    const arr = Array.isArray(p.images) && p.images.length ? p.images.filter(Boolean) : (p.img ? [p.img] : []);
    return arr.length ? arr : ['placeholder-product'];
  }
  function normalizeImageLines(raw){
    return String(raw || '').split('\n').map(s => s.trim()).filter(Boolean);
  }
  async function fileToDataURL(file){
    return await new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  window.heroUploadHint = 'Recommended size: 1920 × 1080 px';
  window.storyPortraitHint = 'Recommended size: 700 × 900 px';
  window.storyBannerHint = 'Recommended size: 1400 × 500 px';
  window.productUploadHint = 'Recommended size: 1200 × 1600 px';
  window.productGalleryHint = 'Upload up to 6 images. Best ratio: 3:4 portrait.';

  window.renderProductUploadPreview = function(textareaId='pf-images'){
    const area = document.getElementById(textareaId);
    const box = document.getElementById('pf-images-preview');
    if(!area || !box) return;
    const imgs = normalizeImageLines(area.value).slice(0,6);
    box.innerHTML = imgs.length ? imgs.map((img,i)=>`
      <div class="relative rounded-xl overflow-hidden bg-cream border border-[rgba(45,42,42,0.08)] aspect-[3/4]">
        <img src="${resolveAnyImage(img,300,400)}" class="w-full h-full object-cover"/>
        <button type="button" onclick="removeProductUploadImage(${i})" class="absolute top-2 right-2 bg-white/90 text-xs px-2 py-1 rounded-full border border-[rgba(45,42,42,0.08)]">Remove</button>
      </div>
    `).join('') : '<div class="text-xs text-brand-faint">No product images added yet.</div>';
  };

  window.removeProductUploadImage = function(idx){
    const area = document.getElementById('pf-images');
    if(!area) return;
    const imgs = normalizeImageLines(area.value);
    imgs.splice(idx,1);
    area.value = imgs.join('\n');
    renderProductUploadPreview('pf-images');
  };

  window.handleProductMultiUpload = async function(event){
    const files = [...(event.target.files || [])].slice(0,6);
    if(!files.length) return;
    const area = document.getElementById('pf-images');
    if(!area) return;
    const existing = normalizeImageLines(area.value);
    const uploaded = [];
    for(const file of files){
      try{
        uploaded.push(await fileToDataURL(file));
      }catch(e){}
    }
    area.value = existing.concat(uploaded).slice(0,6).join('\n');
    renderProductUploadPreview('pf-images');
    showToast('Product images added');
    event.target.value = '';
  };

  window.handleSingleImageUploadWithNote = async function(inputId, previewId, event){
    const file = event.target.files && event.target.files[0];
    if(!file) return;
    try{
      const dataUrl = await fileToDataURL(file);
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);
      if(input) input.value = dataUrl;
      if(preview) preview.src = dataUrl;
      showToast('Image uploaded');
    }catch(e){
      showToast('Upload failed');
    }
    event.target.value = '';
  };

  window.pc = function(p){
    const imgs = productImagesFor(p);
    const main = resolveAnyImage(imgs[0],500,667);
    return `<div class="pcard group cursor-pointer" onclick="navigate('product',${p.id})">
      <div class="relative overflow-hidden rounded-2xl aspect-[3/4] bg-cream">
        <img src="${main}" alt="${esc2(p.name)}" class="pimg absolute inset-0 w-full h-full object-cover sepia-[0.15] opacity-75 transition-all duration-700"/>
        <div class="pover absolute inset-0 bg-white/30 opacity-0 transition-opacity duration-300 flex items-center justify-center">
          <span class="bg-white text-brand-text text-xs font-medium uppercase tracking-widest px-6 py-3 rounded-full shadow-md">View</span>
        </div>
        ${p.badge ? `<span class="absolute top-4 left-4 text-[10px] font-semibold tracking-[.15em] uppercase ${p.badge === 'New' ? 'bg-rose-gold text-white' : 'bg-brand-text text-white'} px-3 py-1 rounded-full">${esc2(p.badge)}</span>` : ''}
        ${p.soldOut ? '<span class="absolute top-4 right-4 text-[10px] font-semibold tracking-[.15em] uppercase bg-brand-text text-white px-3 py-1 rounded-full">Sold Out</span>' : ''}
      </div>
      <div class="mt-4 px-1">
        <h3 class="font-heading text-base font-medium tracking-tight">${esc2(p.name)}</h3>
        <p class="text-sm text-brand-muted mt-1">${esc2(p.material || '')}</p>
        <p class="text-sm font-medium mt-2 ${p.soldOut ? 'text-brand-faint line-through' : ''}">${fp(p.price)}</p>
      </div>
    </div>`;
  };

  window.renderProductDetail = function(id){
    const p = products.find(x => x.id === id);
    if(!p) return;
    currentProductId = id;
    const rv = reviews[id] || [];
    const avg = rv.length ? Math.round(rv.reduce((s, r) => s + r.rating, 0) / rv.length * 10) / 10 : 0;
    const dist = [5,4,3,2,1].map(s => ({ s, c: rv.filter(r => r.rating === s).length }));
    const mx = Math.max(...dist.map(r => r.c), 1);
    const imgs = productImagesFor(p);

    document.getElementById('product-detail').innerHTML = `
      <div class="space-y-4">
        <div class="overflow-hidden rounded-2xl aspect-[3/4] bg-cream">
          <img id="pd-img" src="${resolveAnyImage(imgs[0],800,1067)}" class="w-full h-full object-cover sepia-[0.15] opacity-80 hover:sepia-0 hover:opacity-90 transition-all duration-700"/>
        </div>
        <div class="grid grid-cols-4 gap-3">
          ${imgs.slice(0,4).map((img,i)=>`
            <div class="overflow-hidden rounded-lg aspect-square bg-cream cursor-pointer border border-transparent hover:border-rose-gold/30"
                 onclick="document.getElementById('pd-img').src='${resolveAnyImage(img,800,1067)}'">
              <img src="${resolveAnyImage(img,200,200)}" class="w-full h-full object-cover sepia-[0.15] opacity-70"/>
            </div>`).join('')}
        </div>
      </div>
      <div class="lg:py-4">
        ${p.badge ? `<span class="inline-block text-[10px] font-semibold tracking-[.15em] uppercase ${p.badge === 'New' ? 'bg-rose-gold text-white' : 'bg-brand-text text-white'} px-3 py-1 rounded-full mb-4">${esc2(p.badge)}</span>` : ''}
        <h1 class="font-heading text-3xl md:text-4xl font-semibold tracking-tighter">${esc2(p.name)}</h1>
        <div class="flex items-center gap-3 mt-2"><p class="text-2xl font-heading font-medium ${p.soldOut ? 'text-brand-faint line-through' : ''}">${fp(p.price)}</p>${avg ? `<div class="flex">${renderStars(avg)}</div><span class="text-sm text-brand-muted">${avg}</span>` : ''}</div>
        <div class="mt-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full ${p.soldOut ? 'bg-red-400' : 'bg-green-500 pulse-dot'}"></span><span class="text-xs text-brand-muted">${p.soldOut ? 'Sold Out' : 'In Stock'}</span></div>
        <p class="text-brand-muted font-light leading-relaxed mt-6">${esc2(p.desc || '')}</p>
        <div class="mt-6 pt-6 border-t border-[rgba(45,42,42,0.06)]"><p class="text-xs text-brand-faint uppercase tracking-widest mb-2">Material</p><p class="text-sm">${esc2(p.material || '')}</p></div>
        <div class="mt-6"><p class="text-xs text-brand-faint uppercase tracking-widest mb-3">Color &mdash; <span id="cl">${esc2((p.colorNames||['Default'])[0])}</span></p><div class="flex gap-3">${(p.colors||['#111111']).map((c, i) => `<button onclick="selectedColor=${i};document.getElementById('cl').textContent='${esc2((p.colorNames||['Default'])[i]||'Default')}';document.querySelectorAll('.pdc').forEach((b,j)=>{b.style.outline=j===${i}?'2px solid #B76E79':'none';b.style.outlineOffset=j===${i}?'2px':'0'})" class="pdc w-8 h-8 rounded-full border border-[rgba(45,42,42,0.1)]" style="background:${c};${i === 0 ? 'outline:2px solid #B76E79;outline-offset:2px' : ''}"></button>`).join('')}</div></div>
        <div class="mt-6"><p class="text-xs text-brand-faint uppercase tracking-widest mb-3">Size</p><div class="flex flex-wrap gap-2">${(p.sizes||[]).map(s => `<button onclick="selectedSize='${esc2(s)}';document.querySelectorAll('.size-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active')" class="size-btn text-xs font-medium px-4 py-2.5 rounded-full border border-[rgba(45,42,42,0.08)] text-brand-muted hover:bg-blush/30 transition-all">${esc2(s)}</button>`).join('')}</div></div>
        <div class="mt-8 flex gap-3">
          <button onclick="addFromDetail(${p.id})" class="flex-1 bg-rose-gold text-white text-xs font-medium uppercase tracking-widest py-4 rounded-full hover:bg-rose-dark transition-colors ${p.soldOut ? 'opacity-40 pointer-events-none' : ''}">${p.soldOut ? 'Sold Out' : 'Add to Cart'}</button>
          <button class="w-14 h-14 flex items-center justify-center border border-[rgba(45,42,42,0.08)] bg-white rounded-full hover:border-rose-gold/30 transition-colors"><i data-lucide="heart" class="w-5 h-5 text-brand-muted"></i></button>
        </div>
      </div>`;

    document.getElementById('product-extras').innerHTML = `
      <div class="mb-16">
        ${rv.length ? `<div class="md:w-1/3 mb-8"><h3 class="font-heading text-2xl font-semibold tracking-tight">Reviews</h3><div class="mt-4 flex items-baseline gap-2"><span class="font-heading text-5xl font-semibold">${avg}</span><span class="text-brand-muted">/ 5</span></div><div class="mt-2 flex">${renderStars(avg)}</div><p class="text-sm text-brand-faint mt-1">${rv.length} review${rv.length > 1 ? 's' : ''}</p><div class="mt-6 space-y-2">${dist.map(r => `<div class="flex items-center gap-3"><span class="text-xs text-brand-muted w-3">${r.s}</span><div class="flex-1 h-2 bg-blush/20 rounded-full overflow-hidden"><div class="review-bar h-full bg-rose-gold rounded-full" style="width:${(r.c / mx * 100)}%"></div></div><span class="text-xs text-brand-faint w-6 text-right">${r.c}</span></div>`).join('')}</div></div>` : ''}
        <div class="bg-cream rounded-2xl p-6 mb-6 border border-[rgba(45,42,42,0.04)]"><h4 class="font-heading font-medium mb-4">Write a Review</h4>
          ${!currentUser ? '<p class="text-sm text-brand-faint"><button onclick="navigate(\'login\')" class="text-rose-gold hover:underline">Sign in</button> to review.</p>' : `
          <div class="flex gap-1 mb-4" id="rv-stars">${[1,2,3,4,5].map(i => `<button onclick="reviewRating=${i};document.querySelectorAll('.rvs').forEach((b,j)=>{b.classList.toggle('star-fill',j<${i});b.classList.toggle('star-empty',j>=${i})})" class="rvs text-2xl star-empty transition-colors">&#9733;</button>`).join('')}</div>
          <input id="rv-title" placeholder="Review title" class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm mb-3"/>
          <textarea id="rv-body" placeholder="Your thoughts..." rows="3" class="w-full bg-white border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm mb-3 resize-none"></textarea>
          <button onclick="submitReview(${p.id})" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-6 py-3 rounded-full hover:bg-rose-dark transition-colors">Submit</button>`}
        </div>
        <div class="space-y-4">${rv.map(r => `<div class="bg-cream rounded-2xl p-6 border border-[rgba(45,42,42,0.04)]"><div class="flex items-center gap-2"><span class="font-medium text-sm">${esc2(r.name)}</span><div class="flex">${renderStars(r.rating)}</div><span class="text-xs text-brand-faint ml-auto">${esc2(r.date)}</span></div><h5 class="font-medium text-sm mt-2">${esc2(r.title)}</h5><p class="text-sm text-brand-muted mt-1 font-light">${esc2(r.body)}</p></div>`).join('')}</div>
      </div>
      <h3 class="font-heading text-2xl font-semibold tracking-tight">You May Also Like</h3>
      <div id="related-products" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"></div>`;
    document.getElementById('related-products').innerHTML = products.filter(x => x.id !== p.id && (x.category === p.category || x.collection === p.collection)).slice(0, 4).map(pc).join('');
    lucide.createIcons();
  };

  window.prodForm = function(p,idx){
    const imgs = productImagesFor(p);
    const categories = (typeof categoriesData !== 'undefined' && Array.isArray(categoriesData) && categoriesData.length)
      ? categoriesData
      : [{id:'tops',label:'Tops'},{id:'bottoms',label:'Bottoms'},{id:'layers',label:'Layers'}];
    const imageSizePreset = p.imageSize || '1200x1600';
    return `<div class="space-y-4">
      <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Name</label><input id="pf-name" value="${esc2(p.name)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Price (USD)</label><input id="pf-price" type="number" value="${p.price}" min="0" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Category</label><select id="pf-cat" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${categories.map(c=>'<option value="'+esc2(c.id)+'" '+(c.id===p.category?'selected':'')+'>'+esc2(c.label)+'</option>').join('')}</select></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Collection</label><select id="pf-col" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${['essentials','outerwear','avantgarde'].map(c=>'<option '+(c===p.collection?'selected':'')+'>'+c+'</option>').join('')}</select></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge</label><select id="pf-badge" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">${['','New','Sale'].map(b=>'<option value="'+esc2(b)+'" '+(b===p.badge?'selected':'')+'>'+(b||'None')+'</option>').join('')}</select></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Image Size Preset</label><select id="pf-sizepreset" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm text-brand-muted">
          ${[['1200x1600','Portrait 1200 × 1600'],['1200x1200','Square 1200 × 1200'],['1600x1200','Landscape 1600 × 1200']].map(([v,l])=>`<option value="${v}" ${v===imageSizePreset?'selected':''}>${l}</option>`).join('')}
        </select></div>
        <div class="flex items-end"><p class="text-xs text-brand-faint leading-relaxed">${productUploadHint}<br>${productGalleryHint}</p></div>
      </div>
      <div>
        <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Upload Product Images</label>
        <input type="file" accept="image/*" multiple onchange="handleProductMultiUpload(event)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/>
      </div>
      <div>
        <label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Product Images (URLs, seeds, or uploaded images — one per line)</label>
        <textarea id="pf-images" rows="5" oninput="renderProductUploadPreview('pf-images')" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc2(imgs.join('\n'))}</textarea>
      </div>
      <div id="pf-images-preview" class="grid grid-cols-2 md:grid-cols-3 gap-3"></div>
      <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Material</label><input id="pf-mat" value="${esc2(p.material)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
      <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Description</label><textarea id="pf-desc" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc2(p.desc)}</textarea></div>
      <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Sizes (comma-separated)</label><input id="pf-sizes" value="${esc2((p.sizes||[]).join(','))}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
      <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Color Names (comma-separated)</label><input id="pf-cnames" value="${esc2((p.colorNames||[]).join(','))}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
      <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="pf-so" ${p.soldOut?'checked':''} class="accent-red-400"/><span class="text-sm text-red-500">Sold Out</span></label>
      <button onclick="saveProductEdit(${idx},${p.id})" class="w-full bg-rose-gold text-white text-xs font-medium uppercase tracking-widest py-3 rounded-full hover:bg-rose-dark transition-colors">${idx>=0?'Save Changes':'Add Product'}</button>
    </div>`;
  };

  const _oldAddProduct = window.addProduct;
  window.addProduct = function(){
    openModal('Add Product', prodForm({id:0,name:'',price:0,category:(typeof categoriesData!=='undefined'&&categoriesData[0]?categoriesData[0].id:'tops'),collection:'essentials',material:'',desc:'',sizes:['S','M','L'],colors:['#111111'],colorNames:['Black'],badge:'',soldOut:false,img:'new-'+Date.now(),images:[],imageSize:'1200x1600'},-1));
    setTimeout(()=>renderProductUploadPreview('pf-images'), 20);
  };

  const _oldEditProduct = window.editProduct;
  window.editProduct = function(i){
    openModal('Edit Product', prodForm(products[i],i));
    setTimeout(()=>renderProductUploadPreview('pf-images'), 20);
  };

  window.saveProductEdit = function(idx,origId){
    const n=document.getElementById('pf-name').value.trim();
    if(!n){showToast('Name required');return}
    const pr=parseInt(document.getElementById('pf-price').value)||0;
    if(pr<=0){showToast('Price must be > 0');return}
    const sz=document.getElementById('pf-sizes').value.split(',').map(s=>s.trim()).filter(Boolean);
    const cn=document.getElementById('pf-cnames').value.split(',').map(s=>s.trim()).filter(Boolean);
    const bg=document.getElementById('pf-badge').value;
    const images = normalizeImageLines(document.getElementById('pf-images').value).slice(0,6);
    const data={
      name:n,
      price:pr,
      category:document.getElementById('pf-cat').value,
      collection:document.getElementById('pf-col').value,
      material:document.getElementById('pf-mat').value,
      desc:document.getElementById('pf-desc').value,
      sizes:sz,
      colors:cn.map((_,i)=>'#'+['111111','444444','E5E5E5','1a1a2e','3d2b1f','2b3a2b','333333','2d1f1f','b8c4d4'][i%9]),
      colorNames:cn,
      badge:bg==='None'?'':bg,
      soldOut:document.getElementById('pf-so').checked,
      img:images[0] || ('p-'+Date.now()),
      images,
      imageSize:document.getElementById('pf-sizepreset').value
    };
    if(idx>=0){
      products[idx]={...products[idx],...data,id:origId};
    } else {
      data.id=Math.max(0,...products.map(p=>p.id))+1;
      products.unshift(data);
    }
    saveProducts();
    closeModal();
    showToast(idx>=0?'Product updated':'Product added');
    renderAdmin('products');
    if(currentPage==='shop') renderShopProducts();
  };

  const prevSaveHeroData = window.saveHeroData;
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

  window.applyHero = function(){
    const img = document.getElementById('hero-img');
    if(img) img.src = resolveAnyImage(heroData.image,1920,1080);
    document.getElementById('hero-badge').textContent = heroData.badge;
    document.getElementById('hero-t1').textContent = heroData.title1;
    document.getElementById('hero-t2').textContent = heroData.title2;
    document.getElementById('hero-sub').textContent = heroData.subtitle;
  };

  const prevSaveStoryData = window.saveStoryData;
  window.saveStoryData = function(){
    const statsRaw=document.getElementById('st-stats').value.trim().split('\n').filter(Boolean);
    const stats=statsRaw.map(l=>{const [v,label]=l.split('|'); return {value:(v||'').trim(),label:(label||'').trim()};}).filter(s=>s.value&&s.label);
    const valCards=document.getElementById('st-vals').children;
    const values=[];
    for(let c of valCards){
      const icon=c.querySelector('.st-vi')?.value||'';
      const title=c.querySelector('.st-vt')?.value||'';
      const desc=c.querySelector('.st-vd')?.value||'';
      if(title) values.push({icon,title,desc});
    }
    storyData = {
      heroImage: document.getElementById('st-hero').value.trim() || 'atelier-senerova',
      introText: document.getElementById('st-intro').value.trim(),
      bodyText: document.getElementById('st-body').value.trim(),
      quoteImage: document.getElementById('st-qimg').value.trim() || 'fabric-mill-sen',
      quoteText: document.getElementById('st-quote').value.trim(),
      stats,
      values
    };
    saveStory();
    renderStoryPage();
    showToast('Story saved!');
  };

  window.renderStoryPage = function(){
    const s = storyData;
    document.getElementById('story-content').innerHTML = `<div class="pt-32 pb-20 px-6"><div class="max-w-7xl mx-auto">
      <div class="text-center mb-20 anim"><span class="text-[10px] font-semibold tracking-[.3em] uppercase text-rose-gold">Our Story</span><h2 class="font-heading text-4xl md:text-7xl font-semibold tracking-tighter mt-3 uppercase">Born From<br/>Restlessness</h2></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 anim d1">
        <div class="overflow-hidden rounded-2xl"><img src="${resolveAnyImage(s.heroImage,700,900)}" class="w-full aspect-[3/4] object-cover sepia-[0.15] opacity-70 hover:opacity-90 hover:sepia-0 transition-all duration-700"/></div>
        <div><p class="text-brand-muted font-light leading-relaxed text-lg">${esc2(s.introText)}</p><p class="text-brand-muted font-light leading-relaxed mt-5">${esc2(s.bodyText)}</p>
          <div class="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-[rgba(45,42,42,0.06)]">${(s.stats||[]).map(st => `<div><div class="font-heading text-3xl font-semibold tracking-tighter">${esc2(st.value)}</div><div class="text-xs text-brand-faint mt-1 tracking-widest uppercase">${esc2(st.label)}</div></div>`).join('')}</div>
        </div>
      </div>
      <div class="relative mb-16 anim"><div class="overflow-hidden rounded-2xl"><img src="${resolveAnyImage(s.quoteImage,1400,500)}" class="w-full h-80 md:h-[500px] object-cover sepia-[0.2] opacity-60"/></div><div class="absolute inset-0 bg-gradient-to-t from-cream-bg via-transparent to-cream-bg"></div><div class="absolute bottom-8 left-8 right-8 text-center"><p class="font-heading text-xl md:text-3xl font-medium tracking-tight max-w-2xl mx-auto">${esc2(s.quoteText)}</p></div></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">${(s.values||[]).map((v,i)=>`<div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm anim d${Math.min(i+1,5)}"><div class="w-12 h-12 rounded-full bg-rose-gold/10 flex items-center justify-center mb-5"><i data-lucide="${esc2(v.icon||'sparkles')}" class="w-5 h-5 text-rose-gold"></i></div><h3 class="font-heading text-lg font-semibold tracking-tight">${esc2(v.title)}</h3><p class="text-sm text-brand-muted mt-3 font-light leading-relaxed">${esc2(v.desc)}</p></div>`).join('')}</div>
    </div></div>`;
    lucide.createIcons();
  };

  const prevRenderAdmin = window.renderAdmin;
  window.renderAdmin = function(tab){
    if(tab === 'hero'){
      const c=document.getElementById('admin-content');
      c.innerHTML = `<div class="mb-8"><h2 class="font-heading text-2xl font-semibold tracking-tight">Hero Section</h2><p class="text-sm text-brand-muted mt-1">Edit the homepage hero banner and upload a new image</p></div>
      <div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6">
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Preview</label><div class="rounded-xl overflow-hidden aspect-video bg-cream"><img id="hero-preview" src="${resolveAnyImage(heroData.image,900,500)}" class="w-full h-full object-cover sepia-[0.15] opacity-80"/></div></div>
        <div class="rounded-xl bg-cream p-4 border border-[rgba(45,42,42,0.06)]"><div class="text-sm font-medium">Hero image upload size</div><div class="text-xs text-brand-faint mt-1">${heroUploadHint}</div></div>
        <div class="grid gap-3"><label class="text-xs text-brand-muted uppercase tracking-widest block">Upload Image</label><input type="file" accept="image/*" onchange="handleSingleImageUploadWithNote('he-img','hero-preview',event)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/><p class="text-xs text-brand-faint">You can upload from your device or paste an image URL/seed below.</p></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Image URL or Seed</label><input id="he-img" value="${esc2(heroData.image)}" oninput="document.getElementById('hero-preview').src=resolveAnyImage(this.value,900,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Badge Text</label><input id="he-badge" value="${esc2(heroData.badge)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
          <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 1</label><input id="he-t1" value="${esc2(heroData.title1)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
          <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Title Line 2</label><input id="he-t2" value="${esc2(heroData.title2)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
          <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Subtitle</label><textarea id="he-sub" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc2(heroData.subtitle)}</textarea></div>
        </div>
        <button onclick="saveHeroData()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Hero</button>
      </div>`;
      return;
    }
    if(tab === 'story'){
      const c=document.getElementById('admin-content');
      const s=storyData;
      c.innerHTML = `<div class="mb-8"><h2 class="font-heading text-2xl font-semibold tracking-tight">Story Page</h2><p class="text-sm text-brand-muted mt-1">Edit the story page content and upload images</p></div>
      <div class="bg-white border border-[rgba(45,42,42,0.06)] rounded-2xl p-8 shadow-sm max-w-3xl space-y-6">
        <div class="rounded-xl bg-cream p-4 border border-[rgba(45,42,42,0.06)]">
          <div class="text-sm font-medium">Story image sizes</div>
          <div class="text-xs text-brand-faint mt-1">Main portrait: ${storyPortraitHint}</div>
          <div class="text-xs text-brand-faint mt-1">Quote/banner image: ${storyBannerHint}</div>
        </div>
        <div class="grid gap-3">
          <label class="text-xs text-brand-muted uppercase tracking-widest block">Main Story Image Upload</label>
          <input type="file" accept="image/*" onchange="handleSingleImageUploadWithNote('st-hero','st-hero-preview',event)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/>
          <div class="rounded-xl overflow-hidden bg-cream aspect-[7/9] max-w-xs"><img id="st-hero-preview" src="${resolveAnyImage(s.heroImage,700,900)}" class="w-full h-full object-cover"/></div>
        </div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Main Story Image URL or Seed</label><input id="st-hero" value="${esc2(s.heroImage)}" oninput="document.getElementById('st-hero-preview').src=resolveAnyImage(this.value,700,900)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Introduction Text</label><textarea id="st-intro" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc2(s.introText)}</textarea></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Body Text</label><textarea id="st-body" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none">${esc2(s.bodyText)}</textarea></div>
        <div class="grid gap-3">
          <label class="text-xs text-brand-muted uppercase tracking-widest block">Quote / Banner Image Upload</label>
          <input type="file" accept="image/*" onchange="handleSingleImageUploadWithNote('st-qimg','st-qimg-preview',event)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/>
          <div class="rounded-xl overflow-hidden bg-cream aspect-[14/5]"><img id="st-qimg-preview" src="${resolveAnyImage(s.quoteImage,1400,500)}" class="w-full h-full object-cover"/></div>
        </div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Quote / Banner Image URL or Seed</label><input id="st-qimg" value="${esc2(s.quoteImage)}" oninput="document.getElementById('st-qimg-preview').src=resolveAnyImage(this.value,1400,500)" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Quote Text</label><input id="st-quote" value="${esc2(s.quoteText)}" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm"/></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-2 block">Stats (value|label per line)</label><textarea id="st-stats" rows="3" class="w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-3 text-sm resize-none font-mono">${esc2((s.stats||[]).map(st=>st.value+'|'+st.label).join('\n'))}</textarea></div>
        <div><label class="text-xs text-brand-muted uppercase tracking-widest mb-3 block">Value Cards</label><div id="st-vals" class="space-y-4">${(s.values||[]).map((v,vi)=>`<div class="p-4 border border-[rgba(45,42,42,0.06)] rounded-xl space-y-2"><div class="flex justify-between items-center"><span class="text-xs font-medium text-rose-gold">Card ${vi+1}</span><button onclick="this.closest('.space-y-4').remove()" class="text-xs text-red-500 hover:underline">Remove</button></div><input class="st-vi w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm" placeholder="Icon name" value="${esc2(v.icon)}"/><input class="st-vt w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm" placeholder="Title" value="${esc2(v.title)}"/><textarea class="st-vd w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm resize-none" placeholder="Description" rows="2">${esc2(v.desc)}</textarea></div>`).join('')}</div><button onclick="document.getElementById('st-vals').insertAdjacentHTML('beforeend','<div class=\\'p-4 border border-[rgba(45,42,42,0.06)] rounded-xl space-y-2\\'><div class=\\'flex justify-between items-center\\'><span class=\\'text-xs font-medium text-rose-gold\\'>New Card</span><button onclick=\\'this.closest(\\'.space-y-4\\').remove()\\' class=\\'text-xs text-red-500 hover:underline\\'>Remove</button></div><input class=\\'st-vi w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm\\' placeholder=\\'Icon name\\'/><input class=\\'st-vt w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm\\' placeholder=\\'Title\\'/><textarea class=\\'st-vd w-full bg-cream border border-[rgba(45,42,42,0.08)] rounded-lg px-4 py-2 text-sm resize-none\\' placeholder=\\'Description\\' rows=\\'2\\'></textarea></div>')" class="mt-3 text-xs text-rose-gold hover:underline">+ Add Value Card</button></div>
        <button onclick="saveStoryData()" class="bg-rose-gold text-white text-xs font-medium uppercase tracking-widest px-8 py-3 rounded-full hover:bg-rose-dark transition-colors">Save Story</button>
      </div>`;
      return;
    }
    const out = prevRenderAdmin ? prevRenderAdmin(tab) : undefined;
    setTimeout(()=>{ if(tab==='products' && document.getElementById('admin-content')) lucide.createIcons(); }, 0);
    return out;
  };

  // ensure current visible hero/story use the improved image resolver
  try{ applyHero(); }catch(e){}
})();

