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

    // Ajuste para ler favoritos do MongoDB
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
            userId: usuario._id || usuario.id, // Suporta MongoDB (_id)
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
  .then((res) => {
    if (!res.ok) throw new Error("menu não encontrado");
    return res.text();
  })
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
        window.location.href = usuario
          ? `${basePath}profile.html`
          : `${basePath}login.html`;
      });
    });
  })
  .catch((err) => console.error("Erro ao carregar menu:", err));

/* ================= LOGIN ================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-field");
  if (!form) return;

  if (document.getElementById("nome-usuario")) return;

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
      window.location.href = `${basePath}locket.html`;
    } catch {
      alert("Erro de conexão com o servidor");
    }
  });
});

/* ================= CADASTRO ================= */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-field");
  if (!form || !document.getElementById("nome-usuario")) return;

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

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeUsuario,
          nome,
          email,
          senha,
          foto: fotoBase64,
          bio: "" 
        }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.error || "Erro ao criar conta");

      alert("Conta criada com sucesso!");
      window.location.href = `${basePath}login.html`;
    } catch {
      alert("Erro ao conectar com o servidor");
    }
  });
});

// Preview de Foto
document.addEventListener("DOMContentLoaded", () => {
  const inputFoto = document.getElementById("foto");
  const preview = document.getElementById("preview-foto");
  if (!inputFoto || !preview) return;

  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { preview.src = reader.result; };
      reader.readAsDataURL(file);
    }
  });
});

/* ================= PERFIL ================= */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario && currentPath.includes("profile")) {
    window.location.replace(`${basePath}login.html`);
    return;
  }

  if (!usuario) return;

  renderPerfil(usuario);

  // Validação no backend usando _id do MongoDB
  fetch(`${API_URL}/api/users/${usuario._id || usuario.id}`).catch(() => {
    console.log("Sessão offline ou erro de validação");
  });
});

function renderPerfil(usuario) {
  const profileImg = document.getElementById("profile-img");
  if (profileImg) {
    // Agora a foto é servida como string Base64 direto do Mongo ou URL antiga
    profileImg.src = usuario.foto && usuario.foto.length > 50
      ? usuario.foto 
      : usuario.foto 
        ? `${API_URL}/uploads/${usuario.foto}`
        : `${basePath}assets/images/icons/profile.png`;
  }

  const map = {
    nome: "profile-name",
    nomeUsuario: "profile-nome-usuario",
    email: "profile-email",
    bio: "profile-bio",
  };

  Object.entries(map).forEach(([campo, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = usuario[campo] || "";
  });
}

/* ================= EDITAR PERFIL ================= */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const formEdicao = document.getElementById("edit-profile-form");
  if (!formEdicao || !usuario) return;

  const preview = document.getElementById("preview-foto");
  if (preview) {
    preview.src = usuario.foto && usuario.foto.length > 50 
      ? usuario.foto 
      : usuario.foto 
        ? `${API_URL}/uploads/${usuario.foto}`
        : `${basePath}assets/images/icons/profile.png`;
  }

  const campos = ["nome-usuario", "nome", "email", "bio"];
  campos.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      const chaveUsuario = id === "nome-usuario" ? "nomeUsuario" : id;
      input.value = usuario[chaveUsuario] || "";
    }
  });

  formEdicao.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeUsuario = document.getElementById("nome-usuario")?.value.trim();
    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const bio = document.getElementById("bio")?.value.trim();

    let fotoFinal = usuario.foto;
    const fotoInput = document.getElementById("foto");

    if (fotoInput?.files[0]) {
      fotoFinal = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(fotoInput.files[0]);
      });
    }

    const dadosParaEnviar = {
      id: usuario._id || usuario.id, // Envia o ID correto para o Mongo
      nomeUsuario,
      nome,
      email,
      bio,
      foto: fotoFinal,
    };

    try {
      const response = await fetch(`${API_URL}/api/editar-perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao atualizar");

      // Atualiza o localstorage com os novos dados vindos do banco
      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

      alert("Perfil atualizado com sucesso!");
      window.location.href = "profile.html";

    } catch (err) {
      alert(err.message);
    }
  });
});

/* ================= LOGOUT E DELETE ================= */

document.addEventListener("DOMContentLoaded", () => {
  // Logout
  document.getElementById("confirm-logout")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.href = `${basePath}login.html`;
  });

  // Delete Account
  document.getElementById("confirm-delete")?.addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${usuario._id || usuario.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar");

      localStorage.removeItem("usuarioLogado");
      window.location.href = `${basePath}login.html`;
    } catch (err) {
      alert(err.message);
    }
  });
});

/* ================= MODAIS E FADE ================= */

document.addEventListener("DOMContentLoaded", () => {
  // Modal Delete
  const openDelete = document.getElementById("open-delete-modal");
  const modalDelete = document.getElementById("delete-modal");
  openDelete?.addEventListener("click", () => { if (modalDelete) modalDelete.style.display = "flex"; });
  document.getElementById("cancel-delete")?.addEventListener("click", () => { if (modalDelete) modalDelete.style.display = "none"; });

  // Modal Logout
  const openLogout = document.getElementById("logout-btn");
  const modalLogout = document.getElementById("logout-modal");
  openLogout?.addEventListener("click", () => { if (modalLogout) modalLogout.style.display = "flex"; });
  document.getElementById("cancel-logout")?.addEventListener("click", () => { if (modalLogout) modalLogout.style.display = "none"; });

  document.body.style.opacity = "1";
});