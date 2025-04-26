
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main JavaScript loaded');
    // Check if user is logged in
    const isLoggedIn = checkLoginStatus();
    updateNavigation(isLoggedIn);
    
    // Load user data on dashboard if applicable
    if (window.location.pathname.includes('dashboard')) {
        loadDashboardData();
    }
    const isConnected = checkWalletConnection();
    if (isConnected) {
        console.log('Wallet connected');
        updateWalletUI();
    }
});

/**
 * Check if user is logged in
 * @returns {boolean} Login status
 */
function checkLoginStatus() {
    // In a real application, you would check session/token from localStorage or cookies
    const token = localStorage.getItem('authToken');
    return !!token; // Convert to boolean
}

/**
 * Update navigation based on login status
 * @param {boolean} isLoggedIn - Whether user is logged in
 */
function updateNavigation(isLoggedIn) {
    const authLinks = document.querySelector('.auth-links');
    
    if (!authLinks) return; // Exit if no auth links present
    
    if (isLoggedIn) {
        // If we're not on the dashboard already, update the navigation
        if (!window.location.pathname.includes('dashboard')) {
            authLinks.innerHTML = `
                <a href="dashboard.html" class="btn">Dashboard</a>
                <a href="#" id="logout-btn" class="btn">Logout</a>
            `;
            
        }
    } else {
        // If user is not logged in and we're on a protected page, redirect to login
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = 'login.html?redirect=dashboard';
        }
    }
}

/**
 * Load user data on dashboard
 */
function loadDashboardData() {
    // In a real application, you would fetch this data from your backend
    const userData = getUserData();
    
    if (!userData) {
        // No user data found, redirect to login
        window.location.href = 'login.html?redirect=dashboard';
        return;
    }
    
    // Update UI with user data
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const accountTypeElement = document.getElementById('account-type');
    const memberSinceElement = document.getElementById('member-since');
    
    if (userNameElement) userNameElement.textContent = userData.name;
    if (userEmailElement) userEmailElement.textContent = userData.email;
    if (accountTypeElement) accountTypeElement.textContent = userData.accountType;
    if (memberSinceElement) memberSinceElement.textContent = userData.memberSince;
}

/**
 * Get stored user data
 * @returns {Object|null} User data object or null if not found
 */
function getUserData() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return null;
    
    try {
        return JSON.parse(userDataString);
    } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
    }
}


/**
 * Check if user's wallet is connected
 * @returns {boolean} Connection status
 */
function checkWalletConnection() {
    return window.walletData ? JSON.parse(window.walletData).connected : false;
}

function updateWalletUI() {
    const wallet = document.querySelector('.wallet');
    if (wallet) {
        wallet.innerHTML = `
            <a href="#" class="btn btn-small walletbtn" id="disconnect-wallet">Disconnect Wallet</a>
        `;
    }
}
