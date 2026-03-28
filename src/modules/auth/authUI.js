/**
 * 🔐 authUI.js
 * Экран авторизации
 */

import { getMainContainer } from "../../core/uiContainer.js";
import { registerUser, loginUser, saveSession } from "../../core/authService.js";
import { navigate } from "../../core/router.js";

/**
 * Валидация email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация пароля
 */
function isValidPassword(password) {
  if (password.length < 6) {
    return { isValid: false, message: "Пароль должен быть не менее 6 символов" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Пароль должен содержать хотя бы одну заглавную букву" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Пароль должен содержать хотя бы одну строчную букву" };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Пароль должен содержать хотя бы одну цифру" };
  }
  return { isValid: true, message: "" };
}

export function renderAuthUI() {
  const container = getMainContainer();
  if (!container) return;

  // Скрываю нижнюю навигацию на странице входа
  const bottomNav = document.querySelector(".bottom-nav");
  if (bottomNav) {
    bottomNav.style.display = "none";
  }

  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <!-- Заголовок -->
        <h1 class="auth-title">ECOTRACKER</h1>
        
        <!-- Вкладки -->
        <div class="auth-tabs">
          <button class="tab-btn active" data-tab="login">Вход</button>
          <div class="tab-divider"></div>
          <button class="tab-btn" data-tab="register">Регистрация</button>
        </div>
        
        <!-- Форма входа -->
        <div id="login-form" class="auth-form active">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" class="auth-input" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" id="login-password" class="auth-input" placeholder="••••••">
          </div>
          <button id="login-btn" class="btn-primary">Войти</button>
          <div id="login-error" class="auth-error"></div>
        </div>
        
        <!-- Форма регистрации -->
        <div id="register-form" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="register-email" class="auth-input" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" id="register-password" class="auth-input" placeholder="••••••">
          </div>
          <div class="form-group">
            <label>Повторите пароль</label>
            <input type="password" id="register-password2" class="auth-input" placeholder="••••••">
          </div>
          <button id="register-btn" class="btn-primary">Зарегистрироваться</button>
          <div id="register-error" class="auth-error"></div>
        </div>
      </div>
    </div>
  `;

  // Получаю элементы
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabBtns = document.querySelectorAll(".tab-btn");
  
  // Показываю форму входа по умолчанию
  loginForm.classList.add("active");
  registerForm.classList.remove("active");

  // Переключение между вкладками
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Меняю активный класс у кнопок
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const tab = btn.dataset.tab;
      
      // Показываю только нужную форму
      if (tab === "login") {
        loginForm.classList.add("active");
        registerForm.classList.remove("active");
      } else {
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
      }
    });
  });

  // Логин
  document.getElementById("login-btn").addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorDiv = document.getElementById("login-error");
    
    if (!email) {
      errorDiv.textContent = "Введите email";
      return;
    }
    if (!isValidEmail(email)) {
      errorDiv.textContent = "Введите корректный email (например, name@domain.com)";
      return;
    }
    if (!password) {
      errorDiv.textContent = "Введите пароль";
      return;
    }
    
    errorDiv.textContent = "";
    const result = await loginUser(email, password);
    
    if (result.error) {
      errorDiv.textContent = result.error;
    } else if (result.session) {
      saveSession(result.session);
      if (bottomNav) bottomNav.style.display = "flex";
      navigate("/");
    }
  });

  // Регистрация
  document.getElementById("register-btn").addEventListener("click", async () => {
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const password2 = document.getElementById("register-password2").value;
    const errorDiv = document.getElementById("register-error");
    
    if (!email) {
      errorDiv.textContent = "Введите email";
      return;
    }
    if (!isValidEmail(email)) {
      errorDiv.textContent = "Введите корректный email (например, name@domain.com)";
      return;
    }
    if (!password) {
      errorDiv.textContent = "Введите пароль";
      return;
    }
    
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.isValid) {
      errorDiv.textContent = passwordCheck.message;
      return;
    }
    
    if (password !== password2) {
      errorDiv.textContent = "Пароли не совпадают";
      return;
    }
    
    errorDiv.textContent = "";
    const result = await registerUser(email, password);
    
    if (result.error) {
      errorDiv.textContent = result.error;
    } else if (result.user) {
      const loginResult = await loginUser(email, password);
      if (loginResult.session) {
        saveSession(loginResult.session);
        if (bottomNav) bottomNav.style.display = "flex";
        navigate("/");
      }
    }
  });
}