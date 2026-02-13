const basePath = location.pathname.split("/").length > 2 ? "../" : "";

/* favoritos */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const favButtons = document.querySelectorAll(".fav-btn");

  /* coração mudando de cor */

  favButtons.forEach((btn) => {
    const musicaId = btn.dataset.musica;
    const img = btn.querySelector("img");

    if (usuario?.favoritos?.includes(musicaId)) {
      img.src = `${basePath}assets/images/icons/favorite.png`;
      btn.classList.add("active");
    }

    btn.addEventListener("click", async () => {
      if (!usuario) {
        alert("Faça login para favoritar");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: usuario.id,
            musicaId,
          }),
        });

        const data = await response.json();

        usuario.favoritos = data.favoritos;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        const ativo = data.favoritos.includes(musicaId);

        img.src = ativo
          ? `${basePath}assets/images/icons/favorite.png`
          : `${basePath}assets/images/icons/desfavorite.png`;
      } catch {
        alert("Erro ao salvar favorito");
      }
    });
  });

  /* filtrar favoritos */

  if (window.location.pathname.includes("favorites")) {
    if (!usuario?.favoritos) return;

    const songs = document.querySelectorAll(".song-item");

    songs.forEach((song) => {
      const btn = song.querySelector(".fav-btn");
      const musicaId = btn?.dataset.musica;

      if (!usuario.favoritos.includes(musicaId)) {
        song.style.display = "none";
      }
    });
  }
});

/* ver mais (letras) */

document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const moreLyrics = document.getElementById("more-lyrics");

  if (btnToggle && moreLyrics) {
    btnToggle.addEventListener("click", () => {
      const hidden =
        moreLyrics.style.display === "none" || moreLyrics.style.display === "";

      moreLyrics.style.display = hidden ? "block" : "none";
      btnToggle.textContent = hidden ? "Ver menos" : "Ver mais";
    });
  }
});

/* menu mobile */

fetch(`${basePath}menu-mobile.html`)
  .then((res) => res.text())
  .then((html) => {
    const menuMobile = document.getElementById("menu-mobile");
    if (!menuMobile) return;

    menuMobile.innerHTML = html;

    const menu = document.getElementById("menu");
    const openBtn = document.querySelector(".menu-icon");
    const closeBtn = document.getElementById("closeMenu");

    const perfilLinks = document.querySelectorAll("#perfil-link");

    perfilLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        window.location.href = usuario
          ? `${basePath}profile.html`
          : `${basePath}login.html`;
      });
    });

    /* menu */
    if (openBtn && closeBtn && menu) {
      openBtn.addEventListener("click", () => menu.classList.add("active"));

      closeBtn.addEventListener("click", () => menu.classList.remove("active"));
    }
  })
  .catch((err) => console.error("Erro menu mobile:", err));

const currentPath = location.pathname;
const isLoginPage = currentPath.includes("login.html");
const isAccountPage = currentPath.includes("account.html");

/* login */

if (isLoginPage) {
  const loginForm = document.getElementById("login-field");

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) return alert("Preencha todos os campos");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) return alert(data.error || "Erro no login");

      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

      window.location.href = "../locket.html";
    } catch (err) {
      alert("Erro no login");
    }
  });
}

/* cadastro */

if (isAccountPage) {
  const registerForm = document.getElementById("login-field");

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nome-usuario").value.trim();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const senha2 = document.getElementById("senha2").value;
    const termos = document.getElementById("aceitar-termos");

    if (!nomeUsuario || !nome || !email || !senha || !senha2)
      return alert("Preencha todos os campos");

    if (senha !== senha2) return alert("As senhas não coincidem");

    if (!termos.checked) return alert("Aceite os termos");

    const inputFoto = document.getElementById("foto");
    let fotoBase64 = null;

    if (inputFoto.files[0]) {
      fotoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(inputFoto.files[0]);
      });
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          nome,
          email,
          senha,
          foto: fotoBase64,
        }),
      });

      const data = await response.json();

      if (!response.ok) return alert(data.error || "Erro ao criar conta");

      alert("Conta criada com sucesso!");
      window.location.href = "../login.html";
    } catch {
      alert("Erro ao criar conta");
    }
  });
}

/* perfil */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario && currentPath.includes("profile")) {
    window.location.href = "login.html";
    return;
  }

  const profileImg = document.getElementById("profile-img");
  const profileName = document.getElementById("profile-name");
  const profileBio = document.getElementById("profile-bio");
  const profileUsername = document.getElementById("profile-nome-usuario");
  const profileEmail = document.getElementById("profile-email");

  if (profileName) profileName.textContent = usuario?.nome || "";
  if (profileUsername) profileUsername.textContent = usuario?.nomeUsuario || "";
  if (profileEmail) profileEmail.textContent = usuario?.email || "";
  if (profileBio) profileBio.textContent = usuario?.bio || "";

  if (profileImg) {
    profileImg.src = usuario?.foto
      ? `http://localhost:3000/uploads/${usuario.foto}`
      : `${basePath}assets/images/icons/profile.png`;
  }

  const inputFoto = document.getElementById("foto");
  const previewFoto = document.getElementById("preview-foto");

  if (inputFoto && previewFoto) {
    inputFoto.addEventListener("change", () => {
      const file = inputFoto.files[0];
      if (file) previewFoto.src = URL.createObjectURL(file);
    });
  }
});

/* editar perfil */

const profileForm = document.getElementById("profile-form");

profileForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  const nomeUsuario = document.getElementById("nome-usuario").value.trim();

  const nome = document.getElementById("nome").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const inputFoto = document.getElementById("foto");
  let foto = usuario.foto;

  if (inputFoto.files[0]) {
    foto = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(inputFoto.files[0]);
    });
  }

  const response = await fetch("http://localhost:3000/api/editar-perfil", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: usuario.id,
      nomeUsuario,
      nome,
      bio,
      email,
      senha,
      foto,
    }),
  });

  const data = await response.json();

  if (!response.ok) return alert(data.error);

  localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

  alert("Perfil atualizado!");
  window.location.href = "profile.html";
});

document.addEventListener("DOMContentLoaded", () => {
  if (!window.location.pathname.includes("edit-profile")) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  document.getElementById("nome-usuario").value = usuario.nomeUsuario || "";
  document.getElementById("nome").value = usuario.nome || "";
  document.getElementById("bio").value = usuario.bio || "";
  document.getElementById("email").value = usuario.email || "";

  const preview = document.getElementById("preview-foto");
  if (preview && usuario.foto) {
    preview.src = `http://localhost:3000/uploads/${usuario.foto}`;
  }
});

/* logout */
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logout-modal");
  const cancelLogout = document.getElementById("cancel-logout");
  const confirmLogout = document.getElementById("confirm-logout");

  /* abrir */
  logoutBtn?.addEventListener("click", () => {
    logoutModal.style.display = "flex";
  });

  /* cancelar */
  cancelLogout?.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });

  /* confirmar logout */
  confirmLogout?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = basePath + "login.html";
  });
});

/* deletar conta */

document.getElementById("open-delete-modal")?.addEventListener("click", () => {
  document.getElementById("delete-modal").style.display = "flex";
});

document.getElementById("cancel-delete")?.addEventListener("click", () => {
  document.getElementById("delete-modal").style.display = "none";

  window.location.href = basePath + "profile.html";
});

document
  .getElementById("confirm-delete")
  ?.addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    try {
      await fetch(`http://localhost:3000/api/users/${usuario.id}`, {
        method: "DELETE",
      });

      localStorage.clear();
      window.location.href = "../profile.html";
    } catch {
      alert("Erro ao deletar conta");
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
});
