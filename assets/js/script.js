/* ================= CONFIG ================= */

const basePath = location.pathname.split("/").length > 2 ? "../" : "";

const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://locket-backend-78sy.onrender.com";

const currentPath = location.pathname;

/* ================= FAVORITOS ================= */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const favButtons = document.querySelectorAll(".fav-btn");

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
        const response = await fetch(`${API_URL}/api/favoritos`, {
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

  if (currentPath.includes("favorites") && usuario?.favoritos) {
    document.querySelectorAll(".song-item").forEach((song) => {
      const musicaId = song.querySelector(".fav-btn")?.dataset.musica;
      if (!usuario.favoritos.includes(musicaId)) {
        song.style.display = "none";
      }
    });
  }
});

/* ================= VER MAIS ================= */

document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const moreLyrics = document.getElementById("more-lyrics");

  if (!btnToggle || !moreLyrics) return;

  btnToggle.addEventListener("click", () => {
    const hidden =
      moreLyrics.style.display === "none" || moreLyrics.style.display === "";

    moreLyrics.style.display = hidden ? "block" : "none";
    btnToggle.textContent = hidden ? "Ver menos" : "Ver mais";
  });
});

/* ================= MENU MOBILE ================= */

fetch(`${basePath}menu-mobile.html`)
  .then((res) => res.text())
  .then((html) => {
    const menuMobile = document.getElementById("menu-mobile");
    if (!menuMobile) return;

    menuMobile.innerHTML = html;

    const menu = document.getElementById("menu");
    document
      .querySelector(".menu-icon")
      ?.addEventListener("click", () => menu.classList.add("active"));
    document
      .getElementById("closeMenu")
      ?.addEventListener("click", () => menu.classList.remove("active"));

    document.querySelectorAll(".perfil-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

        window.location.href = usuario
          ? `${basePath}profile.html`
          : `${basePath}login.html`;
      });
    });
  });

/* ================= LOGIN ================= */

if (currentPath.includes("login.html")) {
  document
    .getElementById("login-field")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      if (!email || !senha) return alert("Preencha todos os campos");

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.error || "Erro no login");

      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
      window.location.href = "../locket.html";
    });
}

/* ================= CADASTRO ================= */

if (currentPath.includes("account.html")) {
  document
    .getElementById("login-field")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nomeUsuario = document.getElementById("nome-usuario").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;
      const senha2 = document.getElementById("senha2").value;

      if (!nomeUsuario || !nome || !email || !senha || senha !== senha2) {
        return alert("Dados inválidos");
      }

      let fotoBase64 = null;
      const file = document.getElementById("foto").files[0];

      if (file) {
        fotoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const response = await fetch(`${API_URL}/api/register`, {
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
    });
}

/* ================= PERFIL ================= */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario && currentPath.includes("profile")) {
    window.location.href = "login.html";
    return;
  }

  const profileImg = document.getElementById("profile-img");
  if (profileImg) {
    profileImg.src = usuario?.foto
      ? `${API_URL}/uploads/${usuario.foto}`
      : `${basePath}assets/images/icons/profile.png`;
  }

  const map = {
    nome: "profile-name",
    nomeUsuario: "profile-username",
    email: "profile-email",
    bio: "profile-bio",
  };

  Object.entries(map).forEach(([campo, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = usuario?.[campo] || "";
  });
});

/* ================= EDITAR PERFIL ================= */

document.addEventListener("DOMContentLoaded", () => {
  if (!currentPath.includes("edit-profile")) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  document.getElementById("nome-usuario").value = usuario.nomeUsuario || "";
  document.getElementById("nome").value = usuario.nome || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("bio").value = usuario.bio || "";

  const preview = document.getElementById("preview-foto");
  if (preview && usuario.foto) {
    preview.src = `${API_URL}/uploads/${usuario.foto}`;
  }
});

document
  .getElementById("profile-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    let foto = usuario.foto;
    const file = document.getElementById("foto").files[0];

    if (file) {
      foto = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const response = await fetch(`${API_URL}/api/editar-perfil`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: usuario.id,
        nomeUsuario: document.getElementById("nome-usuario").value.trim(),
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        bio: document.getElementById("bio").value.trim(),
        senha: document.getElementById("senha").value,
        foto,
      }),
    });

    const data = await response.json();
    if (!response.ok) return alert(data.error || "Erro ao atualizar");

    const usuarioAtualizado = {
      ...usuario,
      ...data.usuario,
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

    alert("Perfil atualizado!");
    window.location.href = "profile.html";
  });

/* ================= LOGOUT ================= */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("confirm-logout")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = basePath + "login.html";
  });
});

/* ================= DELETAR CONTA ================= */

document
  .getElementById("confirm-delete")
  ?.addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    await fetch(`${API_URL}/api/users/${usuario.id}`, {
      method: "DELETE",
    });

    localStorage.removeItem("usuarioLogado");
    window.location.href = basePath + "login.html";
  });

/* ================= FADE IN ================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
});
