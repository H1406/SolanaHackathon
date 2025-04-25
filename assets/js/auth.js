document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth JavaScript loaded');
    
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        
        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect');
        if (redirectParam) {
            // Store redirect destination for after login
            sessionStorage.setItem('loginRedirect', redirectParam);
        }
    }
    
    // Initialize register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        
        // Setup password strength meter
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }
    }
    
    // Initialize logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showError('password', 'Password is required');
        return;
    }
    
    // In a real application, you would send a request to your backend API
    // For demo purposes, we'll simulate a successful login
    simulateLogin(email, password, rememberMe);
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
function handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const termsAccepted = document.getElementById('terms')?.checked;
    
    // Validate inputs
    if (!name) {
        showError('name', 'Name is required');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        return;
    }
    
    if (!password) {
        showError('password', 'Password is required');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
        return;
    }
    
    if (!termsAccepted) {
        showError('terms', 'You must accept the terms and conditions');
        return;
    }
    
    // In a real application, you would send a request to your backend API
    // For demo purposes, we'll simulate a successful registration
    simulateRegistration(name, email, password);
}

/**
 * Show error message for a form field
 * @param {string} fieldId - ID of the form field
 * @param {string} message - Error message
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Add error class
    formGroup.classList.add('error');
    
    // Create or update error message
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * Update password strength meter
 */
function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthMeter || !strengthText) return;
    
    const password = passwordInput.value;
    let strength = 0;
    
    // Length check
    if (password.length > 6) strength += 1;
    if (password.length > 10) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Remove all classes
    strengthMeter.classList.remove('weak', 'medium', 'strong');
    
    // Update meter and text based on strength
    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
    } else if (strength < 2) {
        strengthMeter.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength < 4) {
        strengthMeter.classList.add('medium');
        strengthText.textContent = 'Medium password';
    } else {
        strengthMeter.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

/**
 * Simulate login process
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember me option
 */
function simulateLogin(email, password, rememberMe) {
    // Show loading state
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
    }
    
    // Simulate API request delay
    setTimeout(() => {
        // For demo, we'll accept any non-empty values
        // In a real app, this would be an actual API call
        if (email && password) {
            // Create a demo user
            const userData = {
                name: email.split('@')[0], // Use part of email as name
                email: email,
                accountType: 'Standard',
                memberSince: 'April 2025',
                lastLogin: new Date().toLocaleDateString()
            };
            
            // Save auth data in localStorage
            const authToken = 'demo-token-' + Math.random().toString(36).substring(2);
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Get redirect location
            const redirectTo = sessionStorage.getItem('loginRedirect') || 'dashboard.html';
            sessionStorage.removeItem('loginRedirect'); // Clear redirect after use
            
            // Redirect to the dashboard or specified page
            window.location.href = redirectTo;
        } else {
            // Show error for demo
            showError('email', 'Invalid email or password');
            
            // Reset button
            if (submitBtn) {
                submitBtn.textContent = 'Login';
                submitBtn.disabled = false;
            }
        }
    }, 1000); // 1-second delay to simulate API call
}

/**
 * Simulate registration process
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 */
function simulateRegistration(name, email, password) {
    // Show loading state
    const submitBtn = document.querySelector('#register-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
    }
    
    // Simulate API request delay
    setTimeout(() => {
        // For demo, we'll accept any valid inputs
        // In a real app, this would be an actual API call
        
        // Create user data
        const userData = {
            name: name,
            email: email,
            accountType: 'Standard',
            memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            lastLogin: new Date().toLocaleDateString()
        };
        
        // Save auth data in localStorage
        const authToken = 'demo-token-' + Math.random().toString(36).substring(2);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message
        alert('Account created successfully! Redirecting to dashboard...');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500); // 1.5-second delay to simulate API call
}

/**
 * Logout the user
 */
function logout() {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    window.location.href = 'index.html';
}