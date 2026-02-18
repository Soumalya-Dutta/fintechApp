(function () {
  function hasSession() {
    return Boolean(
      localStorage.getItem('token') ||
      localStorage.getItem('userId') ||
      localStorage.getItem('email')
    );
  }

  function clearSession() {
    [
      'token',
      'userId',
      'email',
      'phone',
      'fullname',
      'pinSet',
      'otpVerified',
      'walletBalance',
      'resetToken'
    ].forEach(function (key) {
      localStorage.removeItem(key);
    });
  }

  function wireAppbarAuth() {
    var loginButton = Array.from(document.querySelectorAll('.header-nav .nav-btn')).find(function (anchor) {
      return (anchor.textContent || '').trim().toLowerCase() === 'login';
    });

    if (!loginButton) {
      return;
    }

    if (!hasSession()) {
      loginButton.textContent = 'Login';
      return;
    }

    loginButton.textContent = 'Logout';
    loginButton.setAttribute('href', '#');

    loginButton.addEventListener('click', function (event) {
      event.preventDefault();
      clearSession();
      window.location.href = '/auth/login.html';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireAppbarAuth);
  } else {
    wireAppbarAuth();
  }
})();
