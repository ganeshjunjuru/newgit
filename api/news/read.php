<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../config/database.php';
include_once '../models/News.php';

$database = new Database();
$db = $database->getConnection();

$news = new News($db);
$stmt = $news->read();
$num = $stmt->rowCount();

if($num > 0) {
    $news_arr = array();
    $news_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $news_item = array(
            "id" => $id,
            "title" => $title,
            "slug" => $slug,
            "content" => $content,
            "excerpt" => $excerpt,
            "image" => $image,
            "category" => $category,
            "author_id" => $author_id,
            "published_at" => $published_at,
            "updated_at" => $updated_at
        );

        array_push($news_arr["records"], $news_item);
    }

    http_response_code(200);
    echo json_encode($news_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No news found."));
}
?>