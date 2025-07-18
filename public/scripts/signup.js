

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
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
        const names = this.value.trim().split(/\s+/);
        if (names.length >= 2 && names[1].length > 0) {
            this.parentElement.classList.add('valid');
        } else {
            this.parentElement.classList.remove('valid');
        }
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    const emailHint = document.getElementById('email-hint');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            // Simulate async duplicate check
            setTimeout(() => {
                // Random result for demo
                if (Math.random() > 0.3) {
                    this.parentElement.classList.add('valid');
                    emailHint.textContent = "";
                } else {
                    this.parentElement.classList.remove('valid');
                    emailHint.textContent = "❌ This email is already registered";
                    emailHint.style.color = "#ff4d4d";
                    this.classList.add('pulse');
                    setTimeout(() => this.classList.remove('pulse'), 500);
                }
            }, 500);
        } else {
            this.parentElement.classList.remove('valid');
            emailHint.textContent = "⚠️ Please enter a valid email address";
            emailHint.style.color = "#FFD700";
        }
    });
    
    // Currency selection
    const currencyOptions = document.querySelectorAll('.currency-option');
    currencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all
            currencyOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Add pulse animation
            this.classList.add('pulse');
            setTimeout(() => this.classList.remove('pulse'), 500);
            
            // Update currency prefix
            document.querySelector('.currency-prefix').textContent = 
                this.textContent.charAt(0);
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 10) value = value.substring(0, 10);
        
        if (value.length > 0) {
            // Format as Indian phone number for demo
            let formatted = `+91 ${value.substring(0, 5)}-${value.substring(5)}`;
            this.value = formatted;
        }
    });
    
    // Income formatting
    const incomeInput = document.getElementById('income');
    incomeInput.addEventListener('blur', function() {
        let value = this.value.replace(/,/g, '');
        if (value && !isNaN(value)) {
            this.value = Number(value).toLocaleString('en-IN');
        }
    });
    
    // Form submission
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let isValid = true;
        const names = nameInput.value.trim().split(/\s+/);
        
        if (names.length < 2 || names[1].length === 0) {
            isValid = false;
            nameInput.classList.add('pulse');
            setTimeout(() => nameInput.classList.remove('pulse'), 500);
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('pulse');
            setTimeout(() => emailInput.classList.remove('pulse'), 500);
        }
        
        if (passwordInput.value.length < 8) {
            isValid = false;
            passwordInput.classList.add('pulse');
            setTimeout(() => passwordInput.classList.remove('pulse'), 500);
        }
        
        if (isValid) {
            // Success message
            alert('Account created successfully! Redirecting to your dashboard...');
            // In a real app, this would redirect to the dashboard
        }
    });
});