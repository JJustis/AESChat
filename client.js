let username = '';
let firstHalfKey = '';

function login() {
    username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('chat').style.display = 'block';
            firstHalfKey = data.firstHalfKey;
            alert('Please accept the cookie for the second half of the key.');
            setInterval(fetchMessages, 1000);
        } else {
            alert('Login failed.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    });
}

async function sendMessage() {
    const message = document.getElementById('message').value;
    const encryptedMessage = await encryptMessage(message);

    fetch('send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${encodeURIComponent(username)}&message=${encodeURIComponent(encryptedMessage)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('message').value = '';
        } else {
            alert('Failed to send message.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while sending the message: ' + error.message);
    });
}

function fetchMessages() {
    fetch('fetch_messages.php')
    .then(response => response.json())
    .then(async data => {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        for (const msg of data) {
            const li = document.createElement('li');
            try {
                const decryptedMessage = await decryptMessage(msg.message);
                li.textContent = `${msg.username}: ${decryptedMessage}`;
            } catch (error) {
                console.error('Error decrypting message:', error);
                li.textContent = `${msg.username}: [Encrypted Message]`;
            }
            messagesContainer.appendChild(li);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function encryptMessage(message) {
    const key = await getKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedMessage = new TextEncoder().encode(message);

    const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedMessage
    );

    const encryptedContentArray = Array.from(new Uint8Array(encryptedContent));
    const ivArray = Array.from(iv);

    return btoa(JSON.stringify({
        iv: ivArray,
        content: encryptedContentArray
    }));
}

async function decryptMessage(encryptedMessage) {
    const key = await getKey();
    const { iv, content } = JSON.parse(atob(encryptedMessage));

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        new Uint8Array(content)
    );

    return new TextDecoder().decode(decrypted);
}

async function getKey() {
    const secondHalfKey = getCookie('secondHalfKey');
    const fullKey = firstHalfKey + secondHalfKey;
    const keyData = new Uint8Array(fullKey.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    return await window.crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.querySelector('#login button');
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }

    const messageInput = document.getElementById('message');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});