<?php
session_start();
header('Content-Type: application/json');

$users = json_decode(file_get_contents('users.json'), true);

$username = $_POST['username'];
$password = $_POST['password'];

if (isset($users[$username]) && password_verify($password, $users[$username]['password_hash'])) {
    $_SESSION['user_id'] = $username;
    
    $secondHalfKey = bin2hex(random_bytes(16));
    $users[$username]['second_half_key'] = $secondHalfKey;
    file_put_contents('users.json', json_encode($users));
    
    setcookie('key2', $secondHalfKey, time() + 3600, '/', '', true, true);
    
    echo json_encode([
        'success' => true, 
        'firstHalfKey' => $users[$username]['first_half_key']
    ]);
} else {
    echo json_encode(['success' => false]);
}