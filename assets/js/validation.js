/**
 * Form validation functions
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Validation JavaScript loaded');
    
    // Add input validation listeners to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Add blur event listener for validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Add input event listener to clear errors as user types
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
});

/**
 * Validate a single form field
 * @param {HTMLElement} field - The field to validate
 * @returns {boolean} Whether the field is valid
 */
function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    // Clear previous errors
    clearError(field);
    
    // Validate based on field type and id
    switch(fieldId) {
        case 'name':
            if (!value) {
                showError(fieldId, 'Name is required');
                return false;
            }
            return true;
            
        case 'email':
            if (!validateEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            return true;
            
        case 'password':
            if (!value) {
                showError(fieldId, 'Password is required');
                return false;
            }
            if (value.length < 8) {
                showError(fieldId, 'Password must be at least 8 characters');
                return false;
            }
            return true;
            
        case 'confirm-password':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showError(fieldId, 'Passwords do not match');
                return false;
            }
            return true;
            
        case 'terms':
            if (field.type === 'checkbox' && !field.checked) {
                showError(fieldId, 'You must accept the terms and conditions');
                return false;
            }
            return true;
            
        default:
            // For any other required fields
            if (field.hasAttribute('required') && !value) {
                showError(fieldId, 'This field is required');
                return false;
            }
            return true;
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Show error message for a field
 * @param {string} fieldId - ID of the field
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
 * Clear error for a field
 * @param {HTMLElement} field - Field to clear error for
 */
function clearError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
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
    const strength = calculatePasswordStrength(password);
    
    // Remove all classes
    strengthMeter.classList.remove('weak', 'medium', 'strong');
    
    // Update meter and text based on strength
    if (password.length === 0) {
        strengthText.textContent = 'Password strength';
    } else if (strength < 3) {
        strengthMeter.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength < 6) {
        strengthMeter.classList.add('medium');
        strengthText.textContent = 'Medium password';
    } else {
        strengthMeter.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

/**
 * Calculate password strength score (0-8)
 * @param {string} password - Password to check
 * @returns {number} Strength score
 */
function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters
    
    // Complexity checks
    if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 1; // mix of upper and lowercase
    if (/[0-9].*[a-zA-Z]|[a-zA-Z].*[0-9]/.test(password)) score += 1; // mix of letters and numbers
    
    return score;
}