// Mobile nav toggle
document.querySelectorAll('[data-hamburger]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelector('.mobile-nav').classList.toggle('open');
  });
});

// Mock cart counter (prototype only — real build wires to WooCommerce cart)
let cartCount = 0;
const cartBadges = document.querySelectorAll('[data-cart-count]');
function updateCartCount(){
  cartBadges.forEach(b=> b.textContent = cartCount);
}
document.querySelectorAll('[data-add-cart]').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    cartCount++;
    updateCartCount();
    const original = btn.innerHTML;
    btn.innerHTML = 'Added ✓';
    setTimeout(()=>{ btn.innerHTML = original; }, 1100);
  });
});

// Product grid filter/search/sort (client-side demo over sample dataset)
const grid = document.getElementById('productGrid');
if(grid){
  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const searchInput = document.getElementById('productSearch');
  const catSelect = document.getElementById('categorySelect');
  const sortSelect = document.getElementById('sortSelect');
  const saleToggle = document.getElementById('saleToggle');
  const emptyState = document.getElementById('emptyState');
  let saleOnly = false;

  function applyFilters(){
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = catSelect?.value || 'all';
    let visibleCount = 0;

    cards.forEach(card=>{
      const name = card.dataset.name.toLowerCase();
      const cardCat = card.dataset.category;
      const isSale = card.dataset.sale === 'true';
      const matchesSearch = name.includes(q);
      const matchesCat = cat === 'all' || cardCat === cat;
      const matchesSale = !saleOnly || isSale;
      const visible = matchesSearch && matchesCat && matchesSale;
      card.style.display = visible ? '' : 'none';
      if(visible) visibleCount++;
    });

    if(sortSelect){
      const val = sortSelect.value;
      const sorted = cards.slice().sort((a,b)=>{
        const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
        if(val === 'price-asc') return pa - pb;
        if(val === 'price-desc') return pb - pa;
        return 0; // default / popularity / newest = keep catalog order in this demo
      });
      sorted.forEach(c=> grid.appendChild(c));
    }

    emptyState?.classList.toggle('show', visibleCount === 0);
  }

  searchInput?.addEventListener('input', applyFilters);
  catSelect?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);
  saleToggle?.addEventListener('click', ()=>{
    saleOnly = !saleOnly;
    saleToggle.classList.toggle('active', saleOnly);
    applyFilters();
  });
}
