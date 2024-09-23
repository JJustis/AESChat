<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false]);
    exit;
}

$username = $_POST['username'];
$message = $_POST['message'];

$todayFile = 'conversations/' . date('Y-m-d') . '.json';

if (!file_exists(dirname($todayFile))) {
    mkdir(dirname($todayFile), 0777, true);
}

if (file_exists($todayFile)) {
    $conversation = json_decode(file_get_contents($todayFile), true);
} else {
    $conversation = [];
}

$conversation[] = [
    'username' => $username,
    'message' => $message,
    'timestamp' => time()
];

file_put_contents($todayFile, json_encode($conversation));

echo json_encode(['success' => true]);