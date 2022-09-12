<?php
// this will be your backend
// some things this file should do
// get query string 
// handle get requests
// open and read data.csv file
// handle post requests
// (optional) write to csv file. 
// format data into an array of objects 
// return all data for every request. 
// set content type of response.
// return JSON encoded data

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// required files array
$requiredFiles = [
	//'/lib/CSVReader.php',
	'/api.php',
];

foreach ($requiredFiles as $file) {
	require_once __DIR__ . $file;
}

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP array
$data = json_decode($json, true);

// creating object of Api class
$apiObj = new Api();

// getting server method
$method = $_SERVER['REQUEST_METHOD'];

if(isset($_GET['action']) && ($_GET['action'] == 'getAllRecord') && ($method == 'GET')) {
	//call getAll_get method of api class
	call_user_func_array(array($apiObj, "getAllRecord"), []);
	
} else if (isset($_GET['action']) && ($_GET['action'] == 'saveRecord') && ($method == 'POST')) {
	//call store_post method of api class
	call_user_func_array(array($apiObj, "saveRecordPost"), [$data]);
	
} else if (isset($_GET['action']) && ($_GET['action'] == 'updateRecord') && ($method == 'POST')) {
	if(isset($_GET['id'])) {
		//call update_post method of api class
		call_user_func_array(array($apiObj, "updateRecordPost"), [$_GET['id'], $data]);
	} else {
		echo 'Id is required field.'; die;
	}		
} else if (isset($_GET['action']) && ($_GET['action'] == 'deleteRecord') && ($method == 'POST')) {
	if(isset($_GET['ids'])) {
		//call delete_post method of api class
		call_user_func_array(array($apiObj, "deleteRecordPost"), [explode(',', $_GET['ids'])]);
	} else {
		echo 'Id is required field.'; die;
	}	
	
} else {
	echo 'Method not allow'; die;
}




?>