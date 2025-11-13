document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  function showError(input, message) {
    input.classList.add("error");
    let errorEl = input.nextElementSibling;
    if (!errorEl || !errorEl.classList.contains("error-msg")) {
      errorEl = document.createElement("div");
      errorEl.className = "error-msg";
      input.parentNode.insertBefore(errorEl, input.nextSibling);
    }
    errorEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("error");
    const errorEl = input.nextElementSibling;
    if (errorEl && errorEl.classList.contains("error-msg")) {
      errorEl.textContent = "";
    }
  }

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      let valid = true;

      clearError(email);
      clearError(password);

      if (!email.value.includes("@")) {
        showError(email, "Please enter a valid email.");
        valid = false;
      }

      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters.");
        valid = false;
      }

      if (!valid) return;

      showToast("Login successful! (Stub only)");
      loginForm.reset();
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      let valid = true;

      clearError(name);
      clearError(email);
      clearError(password);

      if (name.value.trim() === "") {
        showError(name, "Please enter your name.");
        valid = false;
      }

      if (!email.value.includes("@")) {
        showError(email, "Please enter a valid email.");
        valid = false;
      }

      if (password.value.length < 6) {
        showError(password, "Password must be at least 6 characters.");
        valid = false;
      }

      if (!valid) return;

      showToast("Signup successful! (Stub only)");
      signupForm.reset();
    });
  }
});
