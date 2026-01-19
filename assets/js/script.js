document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');

    btn.classList.toggle('active');

    img.src = btn.classList.contains('active')
      ? '../assets/images/icons/favorite.png'
      : '../assets/images/icons/desfavorite.png';
  });
});

const isInsideFolder = window.location.pathname.includes('/songs/');

const menuPath = isInsideFolder
  ? '../menu-mobile.html'
  : 'menu-mobile.html';

fetch(menuPath)
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
