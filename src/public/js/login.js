let togglePasswordShow = document.querySelector('.toggle-password-show');
let passwordLogin = document.querySelector('[name="password"]');
let activeShowPass = false;

togglePasswordShow.addEventListener('click', (e) => {
  if(activeShowPass) {
    activeShowPass = false;
    e.currentTarget.innerHTML = `<i class="fas fa-eye"></i>`;
    passwordLogin.type = 'password';
  } else {
    activeShowPass = true;
    e.currentTarget.innerHTML = `<i class="fas fa-eye-slash"></i>`;
    passwordLogin.type = 'text';
  }
});