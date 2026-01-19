document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');

    btn.classList.toggle('active');

    img.src = btn.classList.contains('active')
      ? 'assets/images/icons/favorite.png'
      : 'assets/images/icons/desfavorite.png';
  });
});

const menu = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');

closeMenu.addEventListener('click', () => {
  menu.style.display = 'none';
});


