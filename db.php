<?php
require __DIR__ . '/config.php';

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["error" => "Could not connect to the database."]);
    exit;
}
?>