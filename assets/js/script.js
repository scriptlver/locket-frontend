document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');

    btn.classList.toggle('active');

    const basePath = location.pathname.includes('/songs/')
      ? '../'
      : '';

    img.src = btn.classList.contains('active')
      ? `${basePath}assets/images/icons/favorite.png`
      : `${basePath}assets/images/icons/desfavorite.png`;
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const btnToggle = document.getElementById('btn-toggle');
    const moreLyrics = document.getElementById('more-lyrics');

    if (btnToggle && moreLyrics) {
        btnToggle.addEventListener('click', function() {
            if (moreLyrics.style.display === 'none' || moreLyrics.style.display === '') {
                moreLyrics.style.display = 'block';
                btnToggle.textContent = 'Ver menos';
            } else {
                moreLyrics.style.display = 'none';
                btnToggle.textContent = 'Ver mais';
                
                btnToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
});

const basePath = location.pathname.includes('/songs/')
  ? '../'
  : '';

fetch(`${basePath}menu-mobile.html`)
  .then(res => res.text())
  .then(html => {
    document.getElementById('menu-mobile').innerHTML = html;

    const menu = document.getElementById('menu');
    const openBtn = document.querySelector('.menu-icon');
    const closeBtn = document.getElementById('closeMenu');

    openBtn.addEventListener('click', () => {
      menu.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
