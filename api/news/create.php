<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/News.php';

$database = new Database();
$db = $database->getConnection();

$news = new News($db);
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->title) &&
    !empty($data->content) &&
    !empty($data->category)
) {
    $news->title = $data->title;
    $news->slug = $data->slug;
    $news->content = $data->content;
    $news->excerpt = $data->excerpt;
    $news->image = $data->image;
    $news->category = $data->category;
    $news->author_id = $data->author_id;
    $news->published_at = date('Y-m-d H:i:s');
    $news->updated_at = date('Y-m-d H:i:s');

    if($news->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "News item was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create news item."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create news item. Data is incomplete."));
}
?>