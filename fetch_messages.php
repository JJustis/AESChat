<?php
error_reporting(E_ERROR | E_PARSE);
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$todayFile = 'conversations/' . date('Y-m-d') . '.json';

if (file_exists($todayFile)) {
    $conversation = json_decode(file_get_contents($todayFile), true);
    echo json_encode($conversation);
} else {
    echo json_encode([]);
}