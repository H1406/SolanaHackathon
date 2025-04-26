// Constants and state management
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

// Check login status
export const isLoggedIn = () => !!localStorage.getItem(AUTH_TOKEN_KEY);

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in and on a page that requires auth redirection
    handleAuthRedirection();
    
    // Initialize form listeners
    initializeFormListeners();
});

/**
 * Redirect based on auth state
 */
function handleAuthRedirection() {
    const currentPage = window.location.pathname.split('/').pop();
    const loggedIn = isLoggedIn();
    
    // Redirect logged-in users away from auth pages
    if (loggedIn && (currentPage === 'login.html' || currentPage === 'register.html')) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Redirect non-logged-in users away from protected pages
    const protectedPages = ['dashboard.html', 'profile.html', 'settings.html'];
    if (!loggedIn && protectedPages.includes(currentPage)) {
        window.location.href = `login.html?redirect=${currentPage}`;
        return;
    }
}

/**
 * Initialize form event listeners
 */
function initializeFormListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        console.log('Logout button found');
        logoutButton.addEventListener('click', handleLogout);
    }
}

/**
 * Handle login form submission
 * @param {Event} e 
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Get form elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('#login-form button[type="submit"]');
    
    // Form validation
    if (!emailInput || !passwordInput) {
        console.error('Form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Disable form during submission
    if (submitButton) submitButton.disabled = true;
    
    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Store auth data
            localStorage.setItem(AUTH_TOKEN_KEY, data.token || 'mock-token');
            localStorage.setItem(USER_DATA_KEY, JSON.stringify({
                name: data.name || 'User',
                email: email,
                accountType: data.accountType || 'Standard',
                memberSince: data.memberSince || new Date().getFullYear().toString()
            }));

            // Success notification
            // alert(data.message || 'Login successful!');
            
            // Redirect to dashboard or specified page
            const urlParams = new URLSearchParams(window.location.search);
            const redirectPage = urlParams.get('redirect') || 'dashboard.html';
            window.location.href = redirectPage;
        } else {
            // Handle error responses from the server
            alert(data.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Connection error. Please try again later.');
    } finally {
        // Re-enable form
        if (submitButton) submitButton.disabled = false;
    }
}

/**
 * Handle register form submission
 * @param {Event} e 
 */
async function handleRegister(e) {
    e.preventDefault();

    // Get form elements
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitButton = document.querySelector('#register-form button[type="submit"]');
    
    // Form validation
    if (!emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Password strength
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
    }

    // Disable form during submission
    if (submitButton) submitButton.disabled = true;

    try {
        const res = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message || 'Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Connection error. Please try again later.');
    } finally {
        // Re-enable form
        if (submitButton) submitButton.disabled = false;
    }
}

/**
 * Handle user logout
 * @param {Event} e
 */
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = 'login.html';
}

/**
 * Get user data if logged in
 * @returns {Object|null} User data or null if not logged in
 */
export function getUserData() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
}