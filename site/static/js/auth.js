(() => {
  let modal = null;
  let formLogin = null;
  let formRegister = null;

  let logoutButton = null;

  document.addEventListener('dpl_loaded', () => {
    modal = document.getElementById('navbarLogin');
    formLogin = document.querySelector('form#login');
    formRegister = document.querySelector('form#register');

    logoutButton = document.querySelector('[data-logout-button-ref]');

    bindAuthModalEvents();

    formLogin.addEventListener('submit', (e) => onSubmit(e));
    formRegister.addEventListener('submit', (e) => onSubmit(e, true));
    if (!logoutButton) {
      return;
    }
    logoutButton.addEventListener('click', (e) => logout(e));
  });

  function bindAuthModalEvents() {
    document.querySelectorAll('.auth-modal-toggle[data-auth-modal-tab]').forEach((el) => {
      el.addEventListener('click', (e) => {
        te.Modal.getOrCreateInstance(modal).show();
      });
    });
  }

  function onSubmit(e, isRegisterForm) {
    e.preventDefault();

    const form = e.target;

    const valid = _validate(form);
    const validPasswords = isRegisterForm ? _comparePasswords(form) : true;

    document.getElementById('repeat-password-feedback').style.display = !validPasswords ? 'block' : 'none';

    form.classList.add('was-validated');

    if (!valid || !validPasswords) return;

    if (isRegisterForm) register();
    else login();
  }

  function register() {
    _showStatus(formRegister, 'Processing data. Please wait...');

    const payload = {
      name: formRegister.querySelector('#signonname').value,
      username: formRegister.querySelector('#signonusername').value,
      password: formRegister.querySelector('#signonpassword').value,
      repeatPassword: formRegister.querySelector('#password2').value,
      email: formRegister.querySelector('#signonemail').value,
      newsletter: formRegister.querySelector('#newsletter').value === 'on',
    };
    _doSubmit(formRegister, payload);
  }

  function login() {
    _showStatus(formLogin, 'Processing data. Please wait...');

    const payload = {
      username: formLogin.querySelector('#username').value,
      password: formLogin.querySelector('#password').value,
    };
    _doSubmit(formLogin, payload);
  }

  function logout(e) {
    e.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${CONFIG.docsApiUrl}/user/logout`, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status >= 200 && this.status < 300) {
        location.reload();
      } else if (this.readyState === XMLHttpRequest.DONE) {
        console.error(this.response);
      }
    };

    xhr.send(null);
  }

  function _doSubmit(form, payload) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `${CONFIG.docsApiUrl}/user/${form.getAttribute('name') === 'login-form' ? 'login' : 'register'}`,
      true
    );
    xhr.withCredentials = true;

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status >= 200 && this.status < 300) {
        _showStatus(form, 'Success! Redirecting...', 'success');

        if (form.getAttribute('name') === 'register') {
          window.open('/newsletter', '_blank');
        }

        location.reload();
      } else if (this.readyState === XMLHttpRequest.DONE) {
        _showStatus(form, this.response, 'error');
      }
    };

    xhr.send(JSON.stringify(payload));
  }

  function _validate(form) {
    return form.checkValidity();
  }

  function _showStatus(form, text, status = 'info') {
    const statusElement = form.querySelector('p.status');
    statusElement.style.display = 'block';

    if (status === 'error') {
      statusElement.classList.add('text-danger');
      statusElement.classList.remove('text-success');
    } else if (status === 'success') {
      statusElement.classList.add('text-success');
      statusElement.classList.remove('text-danger');
    } else {
      statusElement.classList.remove('text-success');
      statusElement.classList.remove('text-danger');
    }

    statusElement.innerText = text;
  }

  function _comparePasswords(form) {
    return form.querySelector('#signonpassword').value === form.querySelector('#password2').value;
  }
})();
