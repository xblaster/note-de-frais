## ADDED Requirements

### Requirement: Test successful API requests
The API client SHALL correctly format and send requests to backend endpoints with proper headers and authentication.

#### Scenario: GET request with userId parameter
- **WHEN** fetching expenses via GET /expenses?userId=<id>
- **THEN** the request includes the userId parameter and returns expense data

#### Scenario: POST request with multipart form data
- **WHEN** uploading an expense with receipt file via POST /expenses
- **THEN** the request is formatted as multipart/form-data and file is sent correctly

#### Scenario: PATCH request updates expense
- **WHEN** updating an expense via PATCH /expenses/:id with JSON body
- **THEN** the request is sent with correct content-type and status code 200 is received

### Requirement: Test request/response handling
The API client SHALL properly serialize/deserialize JSON data and parse response bodies.

#### Scenario: Parse JSON response from GET request
- **WHEN** the API returns a JSON response with expense array
- **THEN** the response is parsed and expense objects are available with all fields

#### Scenario: Handle array response from list endpoint
- **WHEN** fetching expenses list returns multiple items
- **THEN** all items are correctly parsed and returned as an array

### Requirement: Test error handling
The API client SHALL catch and report HTTP errors with appropriate messages.

#### Scenario: Handle 400 Bad Request error
- **WHEN** API returns 400 status with error details
- **THEN** an error is thrown with the error message accessible to caller

#### Scenario: Handle 404 Not Found error
- **WHEN** API returns 404 for a non-existent resource
- **THEN** an error is thrown indicating the resource was not found

#### Scenario: Handle 500 Server Error
- **WHEN** API returns 500 Internal Server Error
- **THEN** an error is thrown with a generic error message

#### Scenario: Handle network timeout
- **WHEN** the API request times out (no response within timeout duration)
- **THEN** an error is thrown indicating network timeout occurred

### Requirement: Test authentication and headers
The API client SHALL automatically include user identification in all requests.

#### Scenario: Auto-inject userId from localStorage
- **WHEN** making any API request
- **THEN** the userId stored in localStorage is automatically included in request headers or parameters

#### Scenario: Handle missing userId gracefully
- **WHEN** userId is not present in localStorage
- **THEN** the API client either throws an error or uses a default/null value appropriately

### Requirement: Test request retry logic
The API client SHALL retry failed requests according to configured retry policy.

#### Scenario: Retry on network failure
- **WHEN** a network request fails initially
- **THEN** the request is retried up to the configured retry count

#### Scenario: Do not retry on client errors
- **WHEN** API returns 4xx client error status
- **THEN** the request is not retried and error is returned immediately
