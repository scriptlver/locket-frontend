document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');

    btn.classList.toggle('active');

    img.src = btn.classList.contains('active')
      ? 'assets/images/icons/favorite.png'
      : 'assets/images/icons/desfavorite.png';
  });
});

