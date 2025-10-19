// safe element getter
const $ = id => document.getElementById(id);

// ---- data ----
const products = [
    {id:1,name:'Dark Brown Jeans',cat:'men',price:150,img:'https://images.unsplash.com/photo-1602293589930-4535a9a7464a?auto=format&fit=crop&w=600&q=80'},
    {id:2,name:'Black Denim',cat:'men',price:120,img:'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80'},
    {id:3,name:'Blue Slim Jeans',cat:'men',price:110,img:'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=600&q=80'},
    {id:4,name:'White Tee',cat:'men',price:39,img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80'},
    {id:5,name:'Grey Hoodie',cat:'men',price:59,img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80'},
    {id:6,name:'Summer Dress',cat:'women',price:79,img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'},
    {id:7,name:'Black Jacket',cat:'women',price:169,img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'},
    {id:8,name:'Red Pullover',cat:'women',price:99,img:'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80'},
    {id:9,name:'Kids Jeans',cat:'kids',price:45,img:'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=600&q=80'},
    {id:10,name:'Backpack',cat:'accessories',price:89,img:'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=600&q=80'},
    {id:11,name:'Striped Shirt',cat:'men',price:49,img:'https://images.unsplash.com/photo-1520975698515-0b1b8b6a1b64?auto=format&fit=crop&w=600&q=80'},
    {id:12,name:'Chino Shorts',cat:'men',price:45,img:'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=600&q=80'},
    {id:13,name:'Floral Skirt',cat:'women',price:69,img:'https://images.unsplash.com/photo-1503342452485-86f7b94f8aa9?auto=format&fit=crop&w=600&q=80'},
    {id:14,name:'Sneakers',cat:'accessories',price:129,img:'https://images.unsplash.com/photo-1519741498816-0aa5b5f50b2a?auto=format&fit=crop&w=600&q=80'},
    {id:15,name:'Beanie',cat:'accessories',price:19,img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
];

// cart will be an array of {id, qty}
let cart = [];
let currentFilter = 'all';

// hero images for rotation
const heroImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1950&q=80'
];
let heroIndex = 0;
let heroTimer = null;

window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    startHeroRotation();
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const tgt = document.querySelector(a.getAttribute('href'));
            if(tgt) tgt.scrollIntoView({behavior:'smooth'});
        });
    });
    renderCart();
    // close cart if clicked outside
    document.addEventListener('click', e => {
        const drawer = document.getElementById('cartDrawer');
        const toggle = document.getElementById('cartToggle');
        if(!drawer || !toggle) return;
        if(!drawer.contains(e.target) && !toggle.contains(e.target) && drawer.classList.contains('open')){
            toggleCartDrawer(false);
        }
    });
});

function renderProducts() {
    const grid = $('productGrid');
    if(!grid) return;
    const filtered = currentFilter === 'all' ? products : products.filter(p => p.cat === currentFilter);
        grid.innerHTML = filtered.map(p => `
        <article class="prod-card">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'" onclick="openDetail(${p.id})" class="w-full h-80 object-cover cursor-pointer">
            <div class="p-4 text-center">
                <h4 class="text-sm font-semibold">${p.name}</h4>
                <p class="text-sm text-gray-500">$${p.price}.00</p>
                <div class="mt-3 flex items-center justify-center gap-2">
                    <button onclick="openDetail(${p.id})" class="border px-3 py-2 rounded text-sm">Details</button>
                    <button onclick="addToCartFromGrid(${p.id})" class="bg-black text-white px-3 py-2 rounded text-sm">Add to Cart</button>
                </div>
            </div>
        </article>`).join('');
}


// ---- category filter ----
function filterCat(cat){
    currentFilter = cat;
    renderProducts();
    document.querySelector('#featured').scrollIntoView({behavior:'smooth'});
}

// ---- open detail page ----
function openDetail(id){
    const p = products.find(x => x.id === id);
    if(!p) return;
    const home = $('homePage'), detail = $('detailPage'), title = $('detailTitle'), price = $('detailPrice'), mainPic = $('mainPic')?.querySelector('img'), bread = $('breadName');
    // Note: price variable defined above must be element
    const priceEl = $('detailPrice');
    if(!home || !detail || !title || !priceEl || !mainPic || !bread) return;
    title.textContent   = p.name;
    bread.textContent   = p.name;
    priceEl.textContent   = '$'+p.price.toFixed(2);
    // set main product image with fallback
    mainPic.onerror = function(){ this.src = 'https://via.placeholder.com/800x600?text=No+Image'; };
    mainPic.src         = p.img;
    // store current product id on the detail page for Add to Cart
    detail.dataset.prodId = p.id;
    $('detailCat').textContent = p.cat;
    $('detailQty').textContent = '1';
    // populate description and reviews (placeholder reviews)
    const desc = $('detailDescription');
    const rev = $('detailReviews');
    if(desc) desc.innerHTML = `<p>${p.name} — crafted with care. Material: 100% cotton (mix). Wash cold, tumble low. Available in sizes S-XXL.</p>`;
    if(rev) rev.innerHTML = `<div class="space-y-3"><div><strong>Alice</strong> <span class="text-xs text-gray-500">(5/5)</span><div class="text-sm text-gray-600">Lovely fit and color.</div></div><div><strong>Sam</strong> <span class="text-xs text-gray-500">(4/5)</span><div class="text-sm text-gray-600">Good value for the price.</div></div></div>`;
    // default to Description tab
    switchDetailTab('desc');
    // render related products (same category, exclude current)
    const related = $('relatedGrid');
    if(related){
        const rel = products.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,4);
        related.innerHTML = rel.map(r=>`<article class="prod-card" onclick="openDetail(${r.id})">
            <img src="${r.img}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" class="w-full h-56 object-cover">
            <div class="p-3 text-center"><h4 class="text-sm font-semibold">${r.name}</h4><p class="text-sm text-gray-500">$${r.price}.00</p></div>
        </article>`).join('');
    }
    home.classList.add('hidden');
    detail.classList.remove('hidden');
    window.scrollTo({top:0,behavior:'smooth'});

    // enable zoom handlers for detail main image
    enableDetailZoom();
}

// ---- close detail page ----
function closeDetail(){
    const home = $('homePage'), detail = $('detailPage');
    if(!home || !detail) return;
    detail.classList.add('hidden');
    home.classList.remove('hidden');

    // disable zoom handlers when leaving detail
    disableDetailZoom();
}

// Zoom handlers
let _zoomEnabled = false;
function enableDetailZoom(){
    if(_zoomEnabled) return;
    const container = document.getElementById('mainPic');
    if(!container) return;
    const img = container.querySelector('img');
    if(!img) return;

    function onMove(e){
        // support mouse only
        if(e.touches) return;
        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
    }

    function onEnter(e){
        container.classList.add('zoomed');
    }

    function onLeave(e){
        container.classList.remove('zoomed');
        img.style.transformOrigin = '';
    }

    container._zoomHandlers = {onMove, onEnter, onLeave};
    img.addEventListener('mousemove', onMove);
    img.addEventListener('mouseenter', onEnter);
    img.addEventListener('mouseleave', onLeave);
    _zoomEnabled = true;
}

function disableDetailZoom(){
    const container = document.getElementById('mainPic');
    if(!container || !container._zoomHandlers) return;
    const img = container.querySelector('img');
    const {onMove, onEnter, onLeave} = container._zoomHandlers;
    img.removeEventListener('mousemove', onMove);
    img.removeEventListener('mouseenter', onEnter);
    img.removeEventListener('mouseleave', onLeave);
    delete container._zoomHandlers;
    _zoomEnabled = false;
}

// ---- switch picture ----
function switchPic(src){
    const main = $('mainPic')?.querySelector('img');
    if(main) main.src = src;
}

// ---- quantity ----
function changeQty(n){
    const qty = $('detailQty');
    if(!qty) return;
    let v = parseInt(qty.textContent) + n;
    if(v<1) v=1;
    qty.textContent = v;
}

// ---- add to cart ----
function addToCart(){
    const qty = $('detailQty');
    if(!qty) return;
    const prodId = parseInt($('detailPage').dataset.prodId || 0);
    const q = parseInt(qty.textContent);
    addToCartInternal(prodId, q);
    alert('Added to cart!');
    closeDetail();
}

// add to cart from product grid
function addToCartFromGrid(id){
    addToCartInternal(id, 1);
    // small feedback
    const badge = $('cartCount');
    if(badge) badge.classList.add('flash');
    setTimeout(() => badge && badge.classList.remove('flash'), 300);
}

function addToCartInternal(id, qty){
    if(!id) return;
    const existing = cart.find(i => i.id === id);
    if(existing) existing.qty += qty;
    else cart.push({id, qty});
    renderCart();
}

// CART drawer UI
function toggleCartDrawer(force){
    const drawer = document.getElementById('cartDrawer');
    const toggle = document.getElementById('cartToggle');
    if(!drawer || !toggle) return;
    const open = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function renderCart(){
    const badge = $('cartCount');
    const totalLabel = $('cartTotal');
    const drawer = document.getElementById('cartDrawer');
    if(!badge || !totalLabel || !drawer) return;
    let itemsHtml = '';
    let total = 0;
    cart.forEach(ci => {
        const p = products.find(x => x.id === ci.id);
        if(!p) return;
        const line = p.price * ci.qty;
        total += line;
        itemsHtml += `<div class="cart-item flex items-center gap-3 py-3 border-b">
            <img src="${p.img}" onerror="this.src='https://via.placeholder.com/80x80?text=No'" class="w-12 h-12 object-cover rounded">
            <div class="flex-1">
                <div class="font-medium">${p.name}</div>
                <div class="text-sm text-gray-500">$${p.price}.00 x ${ci.qty} = $${line.toFixed(2)}</div>
            </div>
            <div class="flex flex-col gap-1">
                <button onclick="changeCartQty(${p.id},1)" class="text-sm">+</button>
                <button onclick="changeCartQty(${p.id},-1)" class="text-sm">-</button>
                <button onclick="removeCartItem(${p.id})" class="text-red-600 text-sm">Remove</button>
            </div>
        </div>`;
    });
    drawer.querySelector('.cart-body').innerHTML = itemsHtml || '<div class="text-sm text-gray-500 py-6 text-center">Your cart is empty.</div>';
    badge.textContent = cart.reduce((s,i)=>s+i.qty,0);
    totalLabel.textContent = '$'+total.toFixed(2);
    drawer.querySelector('.cart-footer .cart-total').textContent = '$'+total.toFixed(2);
}

function removeCartItem(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
}

function changeCartQty(id, delta){
    const it = cart.find(i => i.id === id);
    if(!it) return;
    it.qty += delta;
    if(it.qty < 1) cart = cart.filter(i => i.id !== id);
    renderCart();
}

// Toggle feature detail paragraphs in the features section
function toggleFeatureDetails(n){
    const el = document.getElementById('featureDetail'+n);
    if(!el) return;
    if(el.classList.contains('hidden')){
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

// hero rotation: swap hero image src with fade animation
function startHeroRotation(){
    const img = document.getElementById('heroImg');
    if(!img || !heroImages || heroImages.length < 2) return;
    heroTimer = setInterval(() => {
        // fade out
        img.classList.add('hidden');
        setTimeout(() => {
            heroIndex = (heroIndex + 1) % heroImages.length;
            img.src = heroImages[heroIndex];
            img.classList.remove('hidden');
        }, 500);
    }, 4000);
}

// switch between Description and Reviews panels
function switchDetailTab(which){
    const tabDesc = $('tab-desc'), tabRev = $('tab-rev');
    const panelDesc = $('panel-desc'), panelRev = $('panel-rev');
    if(!tabDesc || !tabRev || !panelDesc || !panelRev) return;
    if(which === 'rev'){
        tabDesc.setAttribute('aria-selected','false');
        tabRev.setAttribute('aria-selected','true');
        panelDesc.classList.add('hidden');
        panelRev.classList.remove('hidden');
    } else {
        tabDesc.setAttribute('aria-selected','true');
        tabRev.setAttribute('aria-selected','false');
        panelDesc.classList.remove('hidden');
        panelRev.classList.add('hidden');
    }
}