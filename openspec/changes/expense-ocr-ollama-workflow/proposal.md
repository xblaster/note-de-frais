## Why

Currently, users must manually enter expense details (amount, date, vendor) after uploading a receipt. This manual process is time-consuming and prone to errors. Integrating Ollama's vision-language model (Qwen3-VL-4B) allows for automated extraction of this data, significantly improving the user experience by pre-filling forms directly from the receipt image.

## What Changes

- **OCR API Endpoint**: A new backend endpoint `/expenses/analyze` that accepts a receipt image and returns a structured JSON object containing extracted data.
- **Ollama Integration**: Implementation of a service to communicate with a local Ollama instance, specifically using a Vision-Language model (e.g., `qwen3-vl:4b`) with JSON mode constraint.
- **Frontend Workflow Overhaul**:
  - The "Add Expense" flow will now start with a receipt upload/capture.
  - Upon upload, the backend analysis is triggered.
  - The existing expense form will be automatically populated with the returned data for user verification and correction.
- **Enhanced Data Extraction**: Automated identification of the vendor, total amount, and date from the receipt.

## Capabilities

### New Capabilities

- `receipt-ocr-analysis`: System to process images via VLM (Vision Language Models) and extract structured data for expenses.
- `ai-prefilled-form`: Frontend logic to handle analysis results and populate form fields dynamically.

### Modified Capabilities

- `expense-management`: Extending the expense creation flow to support an initial "analysis" phase.

## Impact

- **Backend**: New NestJS service and controller methods for image processing and Ollama API interaction.
- **Frontend**: Modification of the `AddExpense` page to introduce the image-first workflow.
- **Dependencies**: Requires `ollama` and a VL model (e.g., `qwen3-vl:4b`).
