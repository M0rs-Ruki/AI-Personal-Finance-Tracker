document.addEventListener('DOMContentLoaded', function () {
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
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        let strength = 0;

        if (password.length > 7) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        document.getElementById('password-strength').style.width = strength + '%';

        if (strength >= 75) {
            this.parentElement.classList.add('valid');
        } else {
            this.parentElement.classList.remove('valid');
        }
    });

    // Name validation
    const nameInput = document.getElementById('full-name');
    nameInput.addEventListener('input', function () {
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
    emailInput.addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            setTimeout(() => {
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
    const currencyInput = document.getElementById('currency-input');

    currencyOptions.forEach(option => {
        option.addEventListener('click', function () {
            currencyOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            this.classList.add('pulse');
            setTimeout(() => this.classList.remove('pulse'), 500);

            // Set hidden input's value
            const selectedCurrency = this.getAttribute('data-currency');
            currencyInput.value = selectedCurrency;

            // Optional: update display
            document.querySelector('.currency-prefix').textContent =
                this.textContent.charAt(0);
        });
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, ''); // Only digits

        if (value.startsWith("91")) value = value.slice(2); // Remove repeated 91
        if (value.length > 10) value = value.substring(0, 10);

        let formatted = "+91";
        if (value.length > 0) {
            formatted += ` ${value.substring(0, 5)}`;
            if (value.length > 5) {
                formatted += `-${value.substring(5)}`;
            }
        }
        this.value = formatted;
    });

    // Income formatting
    const incomeInput = document.getElementById('income');

    // Prevent letters or invalid characters while typing
    incomeInput.addEventListener('input', function () {
        // Keep only numbers
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Format with commas when the user leaves the field
    incomeInput.addEventListener('blur', function () {
        let value = this.value.replace(/,/g, '');
        if (value && !isNaN(value)) {
            this.value = Number(value).toLocaleString('en-IN');
        }
    });

    // Before form submission, remove commas (if using plain form submit)
    form.addEventListener('submit', function (e) {
        // Optional if you already parse on backend
        incomeInput.value = incomeInput.value.replace(/,/g, '');
    });


    // 
    const emailToggle = document.getElementById('email-toggle');
    const smsToggle = document.getElementById('sms-toggle');
    const notifPrefInput = document.getElementById('notification-preferences-input');

    function updateNotificationPreference() {
        const email = emailToggle.checked;
        const sms = smsToggle.checked;

        if (email && sms) {
            notifPrefInput.value = 'both';
        } else if (email) {
            notifPrefInput.value = 'email';
        } else if (sms) {
            notifPrefInput.value = 'sms';
        } else {
            notifPrefInput.value = 'email'; // fallback or default
        }
    }

    emailToggle.addEventListener('change', updateNotificationPreference);
    smsToggle.addEventListener('change', updateNotificationPreference);



});
