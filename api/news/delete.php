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

if($news->delete()) {
    http_response_code(200);
    echo json_encode(array("message" => "News item was deleted."));
} else {
    http_response_code(503);
    echo json_encode(array("message" => "Unable to delete news item."));
}
?>