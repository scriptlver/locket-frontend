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
    const openBtn = document.querySelector(".menu-icon");
    const closeBtn = document.getElementById("closeMenu");

    openBtn?.addEventListener("click", () => {
      menu.classList.add("active");
    });

    closeBtn?.addEventListener("click", () => {
      menu.classList.remove("active");
    });

    document.querySelectorAll(".perfil-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        window.location.href = usuario ? "/profile.html" : "/login.html";
      });
    });
  });

/* ================= LOGIN ================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-field");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.error || "Erro no login");

      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
      window.location.href = "../locket.html";
    } catch {
      alert("Erro de conexão com o servidor");
    }
  });
});

/* ================= CADASTRO ================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-field");
  if (!form) return;

  // ✅ só entra se for cadastro
  if (!document.getElementById("nome-usuario")) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nome-usuario").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const senha2 = document.getElementById("senha2").value;
    const termos = document.getElementById("aceitar-termos").checked;

    if (!nomeUsuario || !nome || !email || !senha || senha !== senha2) {
      alert("Preencha todos os campos corretamente");
      return;
    }

    if (!termos) {
      alert("Você precisa aceitar os termos");
      return;
    }

    let fotoBase64 = null;
    const file = document.getElementById("foto")?.files[0];

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
});

document.addEventListener("DOMContentLoaded", () => {
  const inputFoto = document.getElementById("foto");
  const preview = document.getElementById("preview-foto");

  if (!inputFoto || !preview) return;

  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
});

/* ================= PERFIL ================= */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // 🔐 Se tentar acessar perfil sem login
  if (!usuario && currentPath.includes("profile")) {
    window.location.href = "login.html";
    return;
  }

  // 🧼 Valida se usuário ainda existe no backend
  if (currentPath.includes("profile") && usuario?.id) {
    fetch(`${API_URL}/api/users/${usuario.id}`)
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("usuarioLogado");
          window.location.href = "login.html";
        }
      })
      .catch(() => {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
      });
  }

  // 🖼️ Foto de perfil (corrigido)
  const profileImg = document.getElementById("profile-img");
  if (profileImg) {
    if (usuario?.foto) {
      profileImg.src = usuario.foto.startsWith("data:image")
        ? usuario.foto
        : `${API_URL}/uploads/${usuario.foto}`;
    } else {
      profileImg.src = `${basePath}assets/images/icons/profile.png`;
    }
  }

  // 🧾 Dados do perfil
  const map = {
    nome: "profile-name",
    nomeUsuario: "profile-nome-usuario",
    email: "profile-email",
    bio: "profile-bio",
  };

  Object.entries(map).forEach(([campo, id]) => {
    const el = document.getElementById(id);
    if (el && usuario) el.textContent = usuario[campo] || "";
  });
});

/* ================= EDITAR PERFIL ================= */
document.addEventListener("DOMContentLoaded", () => {
  if (!currentPath.includes("edit-profile")) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  // Preenche campos
  document.getElementById("nome-usuario").value = usuario.nomeUsuario || "";
  document.getElementById("nome").value = usuario.nome || "";
  document.getElementById("email").value = usuario.email || "";
  document.getElementById("bio").value = usuario.bio || "";

  // Preview da foto (corrigido)
  const preview = document.getElementById("preview-foto");
  if (preview && usuario.foto) {
    preview.src = usuario.foto.startsWith("data:image")
      ? usuario.foto
      : `${API_URL}/uploads/${usuario.foto}`;
  }

  // Preview ao trocar a imagem
  const inputFoto = document.getElementById("foto");
  inputFoto?.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
});

// Submit do formulário
document
  .getElementById("profile-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return;

    let foto = usuario.foto;
    const file = document.getElementById("foto").files[0];

    // Converte imagem para base64 se mudou
    if (file) {
      foto = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const payload = {
      id: usuario.id,
      nomeUsuario: document.getElementById("nome-usuario").value.trim(),
      nome: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      bio: document.getElementById("bio").value.trim(),
      senha: document.getElementById("senha").value,
      foto,
    };

    const response = await fetch(`${API_URL}/api/editar-perfil`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao atualizar perfil");
      return;
    }

    // 🔥 ATUALIZA LOCALSTORAGE
    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioLogado"));

    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        ...usuarioAtual,
        ...data.usuario,
      }),
    );

    alert("Perfil atualizado com sucesso!");
    window.location.href = `${basePath}profile.html`;
  });

/* ================= LOGOUT PERFIL (MODAL) ================= */

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("logout-modal");
  const cancelBtn = document.getElementById("cancel-logout");
  const confirmBtn = document.getElementById("confirm-logout");

  // abrir modal
  logoutBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // cancelar
  cancelBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // CONFIRMAR LOGOUT (AQUI É O REAL)
  confirmBtn?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = basePath + "login.html";
  });
});

/* ================= DELETAR CONTA ================= */

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("confirm-delete")
    ?.addEventListener("click", async () => {
      const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (!usuario) return;

      const response = await fetch(`${API_URL}/api/users/${usuario.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Erro ao deletar conta");
        return;
      }

      localStorage.removeItem("usuarioLogado");
      window.location.href = basePath + "login.html";
    });
});

/* ================= MODAL DE DELETAR CONTA ================= */

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-delete-modal");
  const modal = document.getElementById("delete-modal");
  const cancelBtn = document.getElementById("cancel-delete");

  // Abrir modal
  openBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Cancelar
  cancelBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

/* ================= FADE IN ================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "1";
});
