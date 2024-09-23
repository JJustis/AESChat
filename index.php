<!DOCTYPE html>
<html>
<head>
    <title>Encrypted Chat</title>
</head>
<body>
    <div id="login">
        <input id="username" type="text" placeholder="Username">
        <input id="password" type="password" placeholder="Password">
        <button onclick="login()">Login</button>
    </div>
    <p>Don't have an account? <a href="register.html">Register</a></p>
    <div id="chat" style="display:none;">
        <ul id="messages"></ul>
        <input id="message" type="text" placeholder="Message">
        <button onclick="sendMessage()">Send</button>
    </div>
    <script src="client.js"></script>
</body>
</html>