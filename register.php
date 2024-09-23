<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        throw new Exception('Username and password are required.');
    }

    $usersFile = 'users.json';
    
    if (file_exists($usersFile)) {
        $users = json_decode(file_get_contents($usersFile), true);
    } else {
        $users = [];
    }

    if (isset($users[$username])) {
        throw new Exception('Username already exists.');
    }

    $users[$username] = [
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'first_half_key' => bin2hex(random_bytes(16)),
        'second_half_key' => ''
    ];

    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}