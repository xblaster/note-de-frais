## 1. Server Expense Workflow Tests

- [x] 1.1 Create expense.service.spec.ts with test suite for status transitions
- [x] 1.2 Add tests for valid DRAFT → SUBMITTED → APPROVED workflow
- [x] 1.3 Add tests for DRAFT → SUBMITTED → REJECTED workflow
- [x] 1.4 Add tests for DRAFT → SUBMITTED → REVISION_REQUESTED workflow
- [x] 1.5 Add tests for REVISION_REQUESTED → SUBMITTED transition
- [x] 1.6 Add tests for invalid status transitions (e.g., SUBMITTED → DRAFT)
- [x] 1.7 Add tests for rejection reason storage and display
- [x] 1.8 Add tests for expense deletion constraints (only DRAFT/REJECTED/REVISION_REQUESTED)
- [x] 1.9 Add tests for expense update constraints (only DRAFT/REVISION_REQUESTED)
- [x] 1.10 Add edge case tests (missing amount, negative amount, null userId)

## 2. Server Authentication Tests

- [x] 2.1 Create auth.controller.spec.ts with test suite for login
- [x] 2.2 Add tests for successful login with valid email
- [x] 2.3 Add tests for login returning consistent userId across multiple logins
- [x] 2.4 Add tests for login validation (empty email, invalid format, missing field)
- [x] 2.5 Add tests for default EMPLOYEE role assignment on first login
- [x] 2.6 Add tests for role persistence across logins
- [x] 2.7 Add tests for user session in localStorage
- [x] 2.8 Add tests for protected route redirect when unauthenticated

## 3. Server Ollama Integration Tests

- [x] 3.1 Create ollama.service.spec.ts with test suite for receipt analysis
- [x] 3.2 Add tests for successful receipt image analysis (vendor, amount, date extraction)
- [x] 3.3 Add tests for handling Ollama timeout/unavailable service
- [x] 3.4 Add tests for extracting vendor name correctly
- [x] 3.5 Add tests for extracting amount correctly
- [x] 3.6 Add tests for extracting date correctly
- [x] 3.7 Add tests for handling incomplete receipt data (null fields)
- [x] 3.8 Add tests for mocked Ollama service setup and response handling
- [x] 3.9 Add tests for retry logic on mocked failures
- [x] 3.10 Add tests for invalid input validation (non-image files, oversized files)

## 4. Client ExpenseForm Component Tests

- [x] 4.1 Create ExpenseForm.spec.tsx with test suite for form behavior
- [x] 4.2 Add tests for form submission with complete valid data
- [x] 4.3 Add tests for form submission with optional fields
- [x] 4.4 Add tests for required field validation errors (missing amount, missing date)
- [x] 4.5 Add tests for amount validation (negative, non-numeric)
- [x] 4.6 Add tests for date validation (future dates)
- [x] 4.7 Add tests for receipt capture integration and auto-population
- [x] 4.8 Add tests for user overriding OCR extracted values
- [x] 4.9 Add tests for form with missing OCR data (user fills manually)
- [x] 4.10 Add tests for API submission error handling
- [x] 4.11 Add tests for network timeout during submission
- [x] 4.12 Add tests for form state persistence while editing
- [x] 4.13 Add tests for form clearing after successful submission
- [x] 4.14 Add tests for submit button disabled state during API call

## 5. Client API Client Tests

- [x] 5.1 Create api-client.spec.ts with test suite for request/response handling
- [x] 5.2 Add tests for GET request with userId parameter
- [x] 5.3 Add tests for POST request with multipart form data
- [x] 5.4 Add tests for PATCH request with JSON body
- [x] 5.5 Add tests for JSON response parsing
- [x] 5.6 Add tests for array response handling from list endpoint
- [x] 5.7 Add tests for 400 Bad Request error handling
- [x] 5.8 Add tests for 404 Not Found error handling
- [x] 5.9 Add tests for 500 Server Error handling
- [x] 5.10 Add tests for network timeout handling
- [x] 5.11 Add tests for automatic userId injection from localStorage
- [x] 5.12 Add tests for handling missing userId in localStorage
- [x] 5.13 Add tests for retry logic on network failures
- [x] 5.14 Add tests for no retry on 4xx client errors

## 6. Test Infrastructure and Validation

- [x] 6.1 Verify Jest test configuration for server
- [x] 6.2 Verify Vitest configuration for client
- [x] 6.3 Generate coverage reports for server
- [x] 6.4 Generate coverage reports for client
- [x] 6.5 Verify 70% coverage achieved on critical paths
- [x] 6.6 Document test setup and mocking patterns

## 7. Documentation Updates

- [x] 7.1 Update README.md with test coverage information
- [x] 7.2 Update CLAUDE.md with detailed testing guidance
- [x] 7.3 Create TEST_RESULTS.md summary document
