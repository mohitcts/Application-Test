<?php
require_once __DIR__ . '/lib/CSVReader.php';
require_once __DIR__ . '/Response.php';

class Api {
	
	private $CSVReader;
	private $response;
	
	public function __construct() {		
		$this->response = new Response;
		try {
			$this->CSVReader = new CSVReader(__DIR__ . '/data.csv');
		} catch (Exception $e) {
			echo $e->getMessage(); die;
		}		
	}
	
	//action to get all record from CSV
	public function getAllRecord() {
		$data = [];	
		$errors = [];
		$data = $this->CSVReader->getAllRecord();
		$this->response->jsonResponse($data, $errors, 200, 'Data list.');
	}
	
	//action to save a new record to csv.
	public function saveRecordPost($list = []) {
		$data = [];	
		$errors = [];		
		// checking validations
		if(empty($list)) {
			$this->response->jsonResponse([], [
				'name' => 'Name is required field',
				'state' => 'State is required field',
				'zip' => 'Zip is required field',
				'amount' => 'Amount is required field',
				'qty' => 'Qty is required field',
				'item' => 'Item is required field',
			], 400, 'Please fill all the required fields.');
		}
		
		if(!isset($list['name']) || $list['name'] == '') {
			$errors['name'] = 'Name is required field';
		}
		
		if(!isset($list['state']) || $list['state'] == '') {
			$errors['state'] = 'State is required field';
		}
		
		if(!isset($list['zip']) || $list['zip'] == '') {
			$errors['zip'] = 'Zip is required field';
		}
		
		if(!isset($list['amount']) || $list['amount'] == '') {
			$errors['amount'] = 'Amount is required field';
		} else if (!is_numeric($list['amount'])) {
			$errors['amount'] = 'Amount should be numeric.';
		}
		
		if(!isset($list['qty']) || $list['qty'] == '') {
			$errors['qty'] = 'Qty is required field';
		} else if (!is_numeric($list['qty'])) {
			$errors['qty'] = 'Quantity should be numeric.';
		}
		
		if(!isset($list['item']) || $list['item'] == '') {
			$errors['item'] = 'Item is required field';
		}
		
		if(!empty($errors)) {
			// return 400 bad request if validation fails
			$this->response->jsonResponse([], $errors, 400, 'Please fill all the required fields.');
		}
		
		//save record to csv file
		try {
			$this->CSVReader->saveRecord($list);
			$data = $this->CSVReader->getAllRecord();
			$this->response->jsonResponse($data, $errors, 200, 'Data added successfully.');
		} catch (Exception $e) {
			$this->response->jsonResponse($data, $errors, 400, $e->getMessage());	
		}		
		$this->response->jsonResponse($data, $errors, 400, 'Something went wrong.');
	}
	
	//action to update the record in csv.
	public function updateRecordPost($id, $list) {
		$data = [];	
		$errors = [];		
		// checking validations
		if(empty($list)) {
			$this->response->jsonResponse([], [
				'id' => 'Id is required field.',
				'name' => 'Name is required field.',
				'state' => 'State is required field.',
				'zip' => 'Zip is required field.',
				'amount' => 'Amount is required field.',
				'qty' => 'Qty is required field.',
				'item' => 'Item is required field.',
			], 400, 'Please fill all the required fields.');
		}		
		
		if(!isset($list['id']) || $list['id'] == '') {
			$errors['id'] = 'Id is required field.';
		} else if(!is_numeric($list['id'])) {
			$errors['id'] = 'Id should be numeric.';
		}
		
		if(!isset($list['name']) || $list['name'] == '') {
			$errors['name'] = 'Name is required field.';
		}
		
		if(!isset($list['state']) || $list['state'] == '') {
			$errors['state'] = 'State is required field.';
		}
		
		if(!isset($list['zip']) || $list['zip'] == '') {
			$errors['zip'] = 'Zip is required field.';
		}
		
		if(!isset($list['amount']) || $list['amount'] == '') {
			$errors['amount'] = 'Amount is required field';
		} else if (!is_numeric($list['amount'])) {
			$errors['amount'] = 'Amount should be numeric.';
		}
		
		if(!isset($list['qty']) || $list['qty'] == '') {
			$errors['qty'] = 'Qty is required field';
		} else if (!is_numeric($list['qty'])) {
			$errors['qty'] = 'Quantity should be numeric.';
		}
		
		if(!isset($list['item']) || $list['item'] == '') {
			$errors['item'] = 'Item is required field.';
		}
		
		if(!empty($errors)) {
			// return 400 bad request if validation fails
			$this->response->jsonResponse([], $errors, 400, 'Please fill all the required fields.');
		}		
		// update the record in csv
		try {
			$this->CSVReader->updateRecord($id, $list);
			$data = $this->CSVReader->getAllRecord();
			$this->response->jsonResponse($data, $errors, 200, 'Data updated successfully.');
		} catch (Exception $e) {
			$this->response->jsonResponse($data, $errors, 400, $e->getMessage());	
		}
		$this->response->jsonResponse($data, $errors, 400, 'Something went wrong.');
	}
	
	//action to delete the record from csv.
	public function deleteRecordPost($ids = []) {
		
		$data = [];		
		$errors = [];		
		// check validation
		if(!isset($ids) || (!is_array($ids))) {
			$errors['ids'] = 'Id is required field.';
		}
		
		if(!empty($errors)) {
			// return 400 bad request if validation fails
			$this->response->jsonResponse([], $errors, 400, 'Please fill all the required fields.');
		}
		// delete the record from csv
		try {
			$this->CSVReader->deleteRecord($ids);
			$data = $this->CSVReader->getAllRecord();
			$this->response->jsonResponse($data, $errors, 200, 'Data deleted successfully.');
		} catch (Exception $e) {
			$this->response->jsonResponse($data, $errors, 400, $e->getMessage());	
		}
		$this->response->jsonResponse($data, $errors, 400, 'Something went wrong.');		
	}
	
}
?>