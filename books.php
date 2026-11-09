<?php
header('Content-Type: application/json; charset=UTF-8');
require __DIR__ . '/db.php';

$q = $_GET['q'] ?? '';
if (!is_string($q)) {
    $q = '';
}
$search = '%' . trim($q) . '%';

$sql = "SELECT books.title, books.author, books.year, subjects.name AS subject, 
               books.copies, (books.copies - books.on_loan) AS available 
        FROM books 
        JOIN subjects ON books.subject_id = subjects.id 
        WHERE (books.title LIKE :title OR books.author LIKE :author)";

$params = [
    'title' => $search,
    'author' => $search
];

$subject = filter_input(INPUT_GET, 'subject', FILTER_VALIDATE_INT);
if ($subject !== false && $subject !== null && $subject > 0) {
    $sql .= " AND books.subject_id = :subject";
    $params['subject'] = $subject;
}

$available = filter_input(INPUT_GET, 'available', FILTER_VALIDATE_INT);
if ($available === 1) {
    $sql .= " AND (books.copies - books.on_loan) > 0";
}

$sql .= " ORDER BY books.title ASC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$books = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($books);
?>