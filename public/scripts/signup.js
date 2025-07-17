

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Toggle optional fields
    const toggleOptional = document.getElementById('toggle-optional');
    const optionalSection = document.getElementById('optional-section');
    
    toggleOptional.addEventListener('click', function() {
        optionalSection.classList.toggle('expanded');
        this.querySelector('i').classList.toggle('fa-cog');
        this.querySelector('i').classList.toggle('fa-times');
        this.innerHTML = optionalSection.classList.contains('expanded') ? 
            '<i class="fas fa-times"></i> Fewer Options' : 
            '<i class="fas fa-cog"></i> More Options';
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
        
        // Add validation class
        if (strength >= 75) {
            this.parentElement.classList.add('valid');
        } else {
            this.parentElement.classList.remove('valid');
        }
    });
    
    // Name validation
    const nameInput = document.getElementById('full-name');
    nameInput.addEventListener('input', function() {
        if (this.value.length >= 3) {
            this.parentElement.classList.add('valid');
        } else {
            this.parentElement.classList.remove('valid');
        }
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            this.parentElement.classList.add('valid');
            this.classList.remove('pulse');
        } else {
            this.parentElement.classList.remove('valid');
            this.classList.add('pulse');
            setTimeout(() => this.classList.remove('pulse'), 500);
        }
    });
    
    // Form submission


    
    // Checkbox functionality
    const emailCheck = document.getElementById('email-check');
    emailCheck.addEventListener('click', function() {
        this.classList.toggle('checked');
    });
});