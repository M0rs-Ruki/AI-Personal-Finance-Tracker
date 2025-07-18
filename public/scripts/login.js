

document.addEventListener('DOMContentLoaded', function() {
    const vaultDoor = document.getElementById('vault-door');
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    const loadingRing = document.getElementById('loading-ring');
    const errorAlert = document.getElementById('error-alert');
    const alertText = document.getElementById('alert-text');
    const guestBtn = document.getElementById('guest-btn');
    const guestBanner = document.getElementById('guest-banner');
    const rememberCheck = document.getElementById('remember-check');
    const lastLogin = document.getElementById('last-login');
    
    // Check if user has saved credentials
    if(localStorage.getItem('rememberedEmail')) {
        document.getElementById('login-credential').value = localStorage.getItem('rememberedEmail');
        rememberCheck.classList.add('checked');
    }
    
    // Toggle password visibility
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('active');

        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    });
    
    // Password strength meter
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length > 7) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        document.getElementById('password-strength').style.width = strength + '%';
    });
    
    // Remember me functionality
    rememberCheck.addEventListener('click', function() {
        this.classList.toggle('checked');
    });
    


});