const basePath = location.pathname.includes("/songs/") ? "../" : "";

document.querySelectorAll(".fav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");

    btn.classList.toggle("active");

    img.src = btn.classList.contains("active")
      ? `${basePath}assets/images/icons/favorite.png`
      : `${basePath}assets/images/icons/desfavorite.png`;
  });
});

/* ================= VER MAIS LETRAS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const moreLyrics = document.getElementById("more-lyrics");

  if (btnToggle && moreLyrics) {
    btnToggle.addEventListener("click", () => {
      const isHidden =
        moreLyrics.style.display === "none" || moreLyrics.style.display === "";

      moreLyrics.style.display = isHidden ? "block" : "none";
      btnToggle.textContent = isHidden ? "Ver menos" : "Ver mais";

      if (!isHidden) {
        btnToggle.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
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

    if (openBtn && closeBtn && menu) {
      openBtn.addEventListener("click", () => menu.classList.add("active"));
      closeBtn.addEventListener("click", () => menu.classList.remove("active"));
    }
  });

/* ================= DETECTAR PÁGINAS ================= */
const path = location.pathname;
const isLoginPage = path.includes("login.html");
const isAccountPage = path.includes("account.html");

/* ================= LOGIN ================= */
if (isLoginPage) {
  const loginForm = document.getElementById("login-field");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;

      if (!email || !senha) {
        return alert("Preencha todos os campos");
      }

      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
          return alert(data.error || "Erro no login");
        }

        localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));
        window.location.href = "../index.html";
      } catch (err) {
        console.error(err);
        alert("Erro no login");
      }
    });
  }
}

/* ================= CADASTRO ================= */
if (isAccountPage) {
  const registerForm = document.getElementById("login-field");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nomeUsuario = document.getElementById("nome-usuario").value.trim();
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const senha = document.getElementById("senha").value;
      const senha2 = document.getElementById("senha2").value;
      const termos = document.getElementById("aceitar-termos");

      if (!nomeUsuario || !nome || !email || !senha || !senha2) {
        return alert("Preencha todos os campos");
      }

      if (senha !== senha2) {
        return alert("As senhas não coincidem");
      }

      if (!termos.checked) {
        return alert("Você precisa aceitar os termos");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return alert("Digite um email válido");
      }

      if (senha.length < 6) {
        return alert("A senha deve ter no mínimo 6 caracteres");
      }

      const inputFoto = document.getElementById("foto");
      let fotoBase64 = null;

      if (inputFoto && inputFoto.files[0]) {
        fotoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
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

        if (!response.ok) {
          return alert(data.error || "Erro ao criar conta");
        }

        alert("Conta criada com sucesso! Faça login agora.");
        window.location.href = "../login.html";
      } catch (err) {
        console.error(err);
        alert("Erro ao criar conta");
      }
    });
  }
}

/* ================= PREVIEW FOTO ================= */
const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("preview-foto");

if (inputFoto && previewFoto) {
  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];

    if (file) {
      const tempUrl = URL.createObjectURL(file);
      previewFoto.src = tempUrl;

      previewFoto.onload = () => URL.revokeObjectURL(tempUrl);
    }
  });
}

/* ================= MOSTRAR USUÁRIO LOGADO ================= */
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  const profileImg = document.getElementById("profile-img");
  const profileName = document.getElementById("profile-name");
  const profileNomeUsuario = document.getElementById("profile-nome-usuario");
  const profileEmail = document.getElementById("profile-email");

  if (profileName) profileName.textContent = usuario.nome;
  if (profileNomeUsuario)
    profileNomeUsuario.textContent = usuario.nomeUsuario;
  if (profileEmail) profileEmail.textContent = usuario.email;

  if (profileImg && usuario.foto) {
    profileImg.src = `http://localhost:3000/api/uploads/${usuario.foto}`;
  }
});

/* ================= PREENCHER FORM PERFIL ================= */
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) return;

  const nomeUsernameInput = document.getElementById("nome-usuario");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const fotoPreview = document.getElementById("preview-foto");

  if (nomeUsernameInput) nomeUsernameInput.value = usuario.nomeUsuario;
  if (nomeInput) nomeInput.value = usuario.nome;
  if (emailInput) emailInput.value = usuario.email;

  if (fotoPreview && usuario.foto) {
    fotoPreview.src = `http://localhost:3000/api/uploads/${usuario.foto}`;
  }
});

/* ================= EDITAR PERFIL ================= */
const profileForm = document.getElementById("profile-form");

if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    const nomeUsuario = document.getElementById("nome-usuario").value.trim();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const inputFoto = document.getElementById("foto");

    let foto = usuario.foto;

    if (inputFoto.files[0]) {
      foto = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(inputFoto.files[0]);
      });
    }

    const response = await fetch(
      "http://localhost:3000/api/editar-perfil",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: usuario.id,
          nomeUsuario,
          nome,
          email,
          senha,
          foto,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return alert(data.error || "Erro ao atualizar perfil");
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

    alert("Perfil atualizado com sucesso");
    window.location.href = "profile.html";
  });
}
