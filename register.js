function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Server response:', text);
            throw new Error('Invalid JSON in server response');
        }
    })
    .then(data => {
        if (data.success) {
            alert('Registration successful. You can now log in.');
            window.location.href = 'index.php';
        } else {
            alert(data.message || 'Registration failed.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
}