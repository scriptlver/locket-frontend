/* ================= FAVORITOS ================= */
document.querySelectorAll(".fav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");

    btn.classList.toggle("active");

    const basePath = location.pathname.includes("/songs/")
      ? "../"
      : "";

    img.src = btn.classList.contains("active")
      ? `${basePath}assets/images/icons/favorite.png`
      : `${basePath}assets/images/icons/desfavorite.png`;
  });
});


/* ================= LETRAS ================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnToggle = document.getElementById("btn-toggle");
  const moreLyrics = document.getElementById("more-lyrics");

  if (btnToggle && moreLyrics) {
    btnToggle.addEventListener("click", () => {
      const isHidden =
        moreLyrics.style.display === "none" ||
        moreLyrics.style.display === "";

      moreLyrics.style.display = isHidden ? "block" : "none";
      btnToggle.textContent = isHidden ? "Ver menos" : "Ver mais";

      if (!isHidden) {
        btnToggle.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
});


/* ================= MENU MOBILE ================= */
const basePath = location.pathname.includes("/songs/")
  ? "../"
  : "";

fetch(`${basePath}menu-mobile.html`)
  .then(res => res.text())
  .then(html => {
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


/* ================= LOGIN ================= */
const loginForm = document.getElementById("login-field");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("submit login disparado");

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro no login");
        return;
      }

      alert("Login realizado com sucesso!");
      window.location.href = "../index.html";

    } catch (err) {
      console.error(err);
      alert("Erro no login");
    }
  });
}


/* ================= CRIAR CONTA ================= */
const registerForm = document.getElementById("login-field");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("submit cadastro disparado");

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const senha2 = document.getElementById("senha2").value;
    const termos = document.getElementById("aceitar-termos");

    if (!nome || !email || !senha || !senha2) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== senha2) {
      alert("As senhas não coincidem");
      return;
    }

    if (!termos.checked) {
      alert("Você precisa aceitar os termos");
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
        alert(data.error || "Erro ao criar conta");
        return;
      }

      alert("Conta criada com sucesso!");
      window.location.href = "../login.html";

    } catch (err) {
      console.error(err);
      alert("Erro ao criar conta");
    }
  });
}


/* ================= FOTO DE PERFIL (PREVIEW) ================= */
const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("preview-foto");

if (inputFoto && previewFoto) {
  inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0];

    if (file) {
      const tempUrl = URL.createObjectURL(file);
      previewFoto.src = tempUrl;

      previewFoto.onload = () => {
        URL.revokeObjectURL(tempUrl);
      };
    }
  });
}
