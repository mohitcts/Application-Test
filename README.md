# Application-Test

## Application Version Requirements
1. Frontend must be in Anguar 10+
2. Backend must be in PHP 7.2+

## Backend Explain
1. In backend directory we have the following files and directory
	- index.php [handling the HTTP request and call the corresponding method of API class.]
	- api.php [Class for handling REST Request and Response.]
	- response.php [Class for handling JSON response & headers.]
	- data.csv [CSV file for store and fetch records.]
	- lib/CSVReader [Class for performing READ, WRITE, UPDATE records in CSV file.]

## Frontend Explain
1. Showing list of all record in BASE_URL == http://localhost:4200
2. Using ag-grid for Table [https://www.ag-grid.com/angular-data-grid/getting-started/]
3. Using ng-bootstrap for modal [https://ng-bootstrap.github.io/#/home]
4. Using Modal for add & edit record.
5. Create CsvService for get, store, update and delete API call.
6. Create Test Cases for Add & Edit and delete record.

## Extra
Note:- 
Please change the API BASE URL as per backend setup.
Please find api_description.txt file in backend directory for API request call.