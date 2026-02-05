## ADDED Requirements

### Requirement: Test successful receipt analysis
The OllamaService SHALL analyze receipt images and extract vendor, amount, and date information.

#### Scenario: Valid receipt image analyzed successfully
- **WHEN** a valid receipt image (jpg/png) is sent for OCR analysis
- **THEN** the system returns an object with vendor, amount, and date fields populated

#### Scenario: Receipt analysis with Ollama timeout
- **WHEN** the Ollama service times out during analysis
- **THEN** the system returns an error indicating the service is unavailable

### Requirement: Test OCR data extraction accuracy
The OllamaService SHALL correctly parse vendor names, monetary amounts, and dates from receipt images.

#### Scenario: Extract vendor name from receipt
- **WHEN** a receipt image containing a vendor name is analyzed
- **THEN** the vendor field is populated with the correct business name

#### Scenario: Extract amount from receipt
- **WHEN** a receipt image containing a total amount is analyzed
- **THEN** the amount field is populated with the correct numerical value

#### Scenario: Extract date from receipt
- **WHEN** a receipt image containing a transaction date is analyzed
- **THEN** the date field is populated with the correct date value

### Requirement: Test handling of incomplete receipt data
The OllamaService SHALL gracefully handle receipts with missing information and return null for unextracted fields.

#### Scenario: Receipt without visible vendor name returns null
- **WHEN** a receipt image without a visible vendor is analyzed
- **THEN** the vendor field is null while other fields are populated

#### Scenario: Receipt with unreadable amount returns null
- **WHEN** a receipt image with an illegible total amount is analyzed
- **THEN** the amount field is null while other fields are populated

#### Scenario: Receipt without date returns null
- **WHEN** a receipt image without a visible date is analyzed
- **THEN** the date field is null while other fields are populated

### Requirement: Test mocked Ollama service
The test suite SHALL use mock Ollama responses to avoid dependency on external services during tests.

#### Scenario: Mock Ollama service for unit tests
- **WHEN** running unit tests for OllamaService
- **THEN** Ollama HTTP calls are mocked and return predetermined responses

#### Scenario: Test retry logic with mocked failures
- **WHEN** the mocked Ollama service returns a failure response
- **THEN** the retry logic is triggered and tested appropriately

### Requirement: Test error handling for invalid inputs
The OllamaService SHALL reject invalid image formats and oversized files.

#### Scenario: Reject non-image file formats
- **WHEN** a non-image file is submitted for OCR analysis
- **THEN** the system returns an error indicating invalid file type

#### Scenario: Reject oversized images
- **WHEN** an image exceeding the 5MB size limit is submitted
- **THEN** the system returns an error indicating file size constraint violation
