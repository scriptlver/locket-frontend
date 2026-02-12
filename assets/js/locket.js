document.addEventListener("DOMContentLoaded", () => {
  const medalhao = document.getElementById("medalhao");

  medalhao.addEventListener("click", () => {
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 300); // mesmo tempo do CSS
  });
});
