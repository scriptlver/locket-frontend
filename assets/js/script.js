/* ================= FAVORITOS ================= */
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


/* ================= LETRAS ================= */
document.addEventListener('DOMContentLoaded', () => {
  const btnToggle = document.getElementById('btn-toggle');
  const moreLyrics = document.getElementById('more-lyrics');

  if (btnToggle && moreLyrics) {
    btnToggle.addEventListener('click', () => {
      const isHidden =
        moreLyrics.style.display === 'none' ||
        moreLyrics.style.display === '';

      moreLyrics.style.display = isHidden ? 'block' : 'none';
      btnToggle.textContent = isHidden ? 'Ver menos' : 'Ver mais';

      if (!isHidden) {
        btnToggle.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});


/* ================= MENU MOBILE ================= */
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

    if (openBtn && closeBtn) {
      openBtn.addEventListener('click', () => menu.classList.add('active'));
      closeBtn.addEventListener('click', () => menu.classList.remove('active'));
    }
  });


/* ================= LOGIN ================= */
const loginForm = document.getElementById("login-field");

if (loginForm && !document.getElementById("btn-criar-conta")) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert(data.message);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      window.location.href = "../index.html";

    } catch {
      alert("Erro no login");
    }
  });
}


/* ================= CRIAR CONTA ================= */
const criarContaBtn = document.getElementById("btn-criar-conta");

if (criarContaBtn) {
  criarContaBtn.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const termos = document.getElementById("aceitar-termos");

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    if (!termos.checked) {
      alert("Você precisa aceitar os termos para criar a conta.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Conta criada com sucesso!");
      window.location.href = "../login.html";

    } catch {
      alert("Erro ao criar conta");
    }
  });
}

const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("preview-foto");

if (inputFoto && previewFoto) {
  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        previewFoto.src = reader.result;
      };

      reader.readAsDataURL(file);
    }
  });
}



