<?php

class CSVReader {

    private $delimiter;
    private $rowDelimiter;
    private $fileHandle = null;
    private $data = [];
	private $headerOfCsv = [];
	private $uniqueId;
	private $filename;
	
	// constructor
	// @param string $filename
	// @param string $delimiter
	// @param string $rowDelimiter
	// @param string $uniqueId
	// @throws Exception	
    public function __construct($filename, $delimiter = ",", $rowDelimiter = "a+", $uniqueId = 'id') {
        $this->delimiter = $delimiter;
        $this->rowDelimiter = $rowDelimiter;
		$this->filename = $filename;
		$this->uniqueId = $uniqueId;
		
		// throw an exception if file not exists.
		if(!file_exists($filename)) {
			throw new \Exception("file: {$filename} not exists");
		}		
        $this->fileHandle = fopen($filename, $this->rowDelimiter);
		// throw an exception if unable to open file.
        if ($this->fileHandle === FALSE) {
            throw new \Exception("Unable to open file: {$filename}");
        }
		
		// assign first row as column
		$this->headerOfCsv = $header = fgetcsv($this->fileHandle, 1, $this->delimiter);
    }
	
	// Return array of all record
	public function getAllRecord() {
		
		$recordArr = [];
		$flag = true;
		$num = count($this->headerOfCsv);		
		$this->rewindFilePointer();		
		while(($data = fgetcsv($this->fileHandle, 0, $this->delimiter)) !== FALSE) {
			
			//skipping first row
			if($flag) { 
				$flag = false; continue; 
			}			
			$internalArr = [];			
			for ($c = 0; $c < $num; $c++) {	
				// creating an array with key and value
				$internalArr[$this->headerOfCsv[$c]] = isset($data[$c]) ? $data[$c] : '';				
			}
			// push record into array
			array_push($recordArr, $internalArr);
		}		
		return $recordArr;
	}
	
	// save data to csv file
	public function saveRecord($data = []) {
		
		// throw an exception if data is empty
		if(empty($data)) {
			throw new \Exception("Please provide some data to write in csv.");
		}
		
		//Rewind file pointer to the beginning
		$this->rewindFilePointer();	
		$lastRecord = [];		
		//get all record from the list 
		$allRecord = $this->getAllRecord();
		
		if(count($allRecord) > 0) {
			// assign last record to lastRecord array;
			$lastRecord = $allRecord[count($allRecord) - 1];
		}		
		$newarr = [];
		if(count($lastRecord) == 0) {
			// if last record is empty then assign the value of id to 1
			$newarr[$this->uniqueId] = 1;
		} else {
			// if lastrecord is not empty then assign the value of id to one more than last id
			$newarr[$this->uniqueId] = $lastRecord[$this->uniqueId] + 1;
		}		
		$data = $newarr + $data;		
		// write data in csv file
		if(!fwrite($this->fileHandle, PHP_EOL . $this->arrayToCsv($data))) {
			// throw an exception if not able to write
			throw new \Exception("Unable to write in file: {$this->filename}");
		}
		return true;
	}
	
	// convert array to csv file format
	private function arrayToCsv( array &$fields, $delimiter = ',', $enclosure = '"', $encloseAll = true, $nullToMysqlNull = false ) {
		//Quote regular expression characters
		$delimiter_esc = preg_quote($delimiter, '/');
		$enclosure_esc = preg_quote($enclosure, '/');

		$output = array();
		foreach ( $fields as $field ) {
			if ($field === null && $nullToMysqlNull) {
				$output[] = 'NULL';
				continue;
			}
			// Enclose fields containing $delimiter, $enclosure or whitespace
			if ( $encloseAll || preg_match( "/(?:${delimiter_esc}|${enclosure_esc}|\s)/", $field ) ) {
				$output[] = trim($enclosure . str_replace($enclosure, $enclosure . $enclosure, $field) . $enclosure);
			}
			else {
				$output[] = trim($field);
			}
		}
		return implode( $delimiter, $output );
	}
	
	// update data to csv file
	public function updateRecord($id, $list = []) {
		
		// throw an exception if list is empty
		if(empty($list)) {
			throw new \Exception("Please provide some data to update");
		}		
		// create an array for holding new data
		$newdata = [];
		array_push($newdata, $this->headerOfCsv);		
		$recordArr = [];
		$flag = true;
		// rewind file pointer to the beginning
		$this->rewindFilePointer();		
		while(($data = fgetcsv($this->fileHandle, 0, $this->delimiter)) !== FALSE) {			
			// skipping first line
			if($flag) { 
				$flag = false; 
				continue; 
			}			
			// updating data if id matches
			if($data[0] == $id) {
				$data[0] = $id;
				$data[1] = isset($list['name']) ? $list['name'] : '';
				$data[2] = isset($list['state']) ? $list['state'] : '';
				$data[3] = isset($list['zip']) ? $list['zip'] : '';
				$data[4] = isset($list['name']) ? $list['amount'] : '';
				$data[5] = isset($list['qty']) ? $list['qty'] : '';
				$data[6] = isset($list['item']) ? $list['item'] : '';
			}			
			// push data into new array;
			array_push($newdata, $data);			
		}
		
		$counter = 0;
		if(count($newdata) > 1) {
			// making file empty here
			file_put_contents($this->filename, "");
			$this->rewindFilePointer();			
			$str = '';
			// creating string for file		
			foreach ($newdata as $rows) {
				$str .= ($counter == 0) ? $this->arrayToCsv($rows) : PHP_EOL . $this->arrayToCsv($rows);
				$counter++;
			}			
			if(!fwrite($this->fileHandle, $str)) {
				// throw an exception if not able to write
				throw new \Exception("Unable to update in file: {$this->filename}");
			}
		}		
		return true;
    }
	
	// delete from csv file
    public function deleteRecord($ids) {
		// create an array for holding new data
		$newdata = [];
		array_push($newdata, $this->headerOfCsv);		
		$flag = true;
		$this->rewindFilePointer();		
		while(($data = fgetcsv($this->fileHandle, 0, $this->delimiter)) !== FALSE) {			
			// skipping first line
			if($flag) { 
				$flag = false; continue; 
			}
			// push only those records for which id doesn't match
			if(!in_array($data[0], $ids)) {
				array_push($newdata, $data);	
			} 
		}		
		$counter = 0;
		if(count($newdata) > 0) {
			// making file empty here
			file_put_contents($this->filename, "");
			$this->rewindFilePointer();
			// creating string for file
			$str = '';
			foreach ($newdata as $rows) {
				$str .= ($counter == 0) ? $this->arrayToCsv($rows) : PHP_EOL . $this->arrayToCsv($rows);
				$counter++;
			}			
			if(!fwrite($this->fileHandle, $str)) {
				throw new \Exception("Unable to delete in file: {$this->filename}");
			}
		}			
		return true;
    }
		
	//Rewind the position of the file pointer to the beginning
	private function rewindFilePointer() {
		if ($this->fileHandle) {
			rewind($this->fileHandle);
		}		
	}
	
	// destructor	
    public function __destruct() {
        if ($this->fileHandle) {
            fclose($this->fileHandle);
            $this->fileHandle = null;
        }
    }
		
}