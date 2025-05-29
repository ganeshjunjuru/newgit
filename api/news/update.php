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

$news->id = $data->id;
$news->title = $data->title;
$news->slug = $data->slug;
$news->content = $data->content;
$news->excerpt = $data->excerpt;
$news->image = $data->image;
$news->category = $data->category;
$news->updated_at = date('Y-m-d H:i:s');

if($news->update()) {
    http_response_code(200);
    echo json_encode(array("message" => "News item was updated."));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to update news item."));
}
?>