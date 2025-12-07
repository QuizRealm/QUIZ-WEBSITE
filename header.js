// header.js

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("qrProfileToggle");
  const menu = document.getElementById("qrProfileMenu");

  if (!toggleBtn || !menu) return;

  function closeMenu() {
    menu.classList.remove("qr-profile__menu--open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains("qr-profile__menu--open");
    if (isOpen) {
      closeMenu();
    } else {
      menu.classList.add("qr-profile__menu--open");
      toggleBtn.setAttribute("aria-expanded", "true");
    }
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== toggleBtn) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
});
