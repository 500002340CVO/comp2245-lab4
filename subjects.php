<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

$stmt = $pdo->query("SELECT id, name FROM subjects ORDER BY name ASC");
$subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($subjects);
?>