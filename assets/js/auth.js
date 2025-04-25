document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    // Redirect to dashboard or homepage
                    window.location.href = 'index.html';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Something went wrong. Try again later.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Register error:', error);
                alert('Something went wrong. Try again later.');
            }
        });
    }
});

