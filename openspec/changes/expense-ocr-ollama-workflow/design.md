## Context

The current expense creation flow is entirely manual. To improve user efficiency, we are integrating an AI-powered OCR using Ollama. This design focuses on the backend integration with Ollama and the frontend reactive workflow.

## Goals / Non-Goals

**Goals:**
- Automate extraction of `amount`, `vendor`, and `date` from receipt images.
- Provide a structured JSON response to the frontend.
- Implement a "receipt-first" UI workflow.
- Use local LLM (Ollama) to ensure data privacy.

**Non-Goals:**
- Training a custom model.
- Handling complex multi-page receipts (at this stage).
- Integrating with cloud OCR services (Stay local with Ollama).

## Decisions

### 1. Model Selection
- **Choice**: `qwen3-vl-4b`.
- **Rationale**: This model is specifically optimized for Vision-Language tasks and performs exceptionally well on OCR with a small footprint, making it ideal for local execution.

### 2. Backend Orchestration
- **Choice**: New NestJS Service `OllamaService`.
- **Logic**:
  - Receive image via multipart/form-data.
  - Convert image to base64.
  - Call Ollama API with `format: 'json'` and a schema-constrained prompt.
  - Return extracted data to frontend.

### 3. API Contract
- `POST /expenses/analyze`
  - Input: `receipt: File`
  - Output: 
    ```json
    {
      "vendor": "Starbucks",
      "amount": 15.50,
      "date": "2024-05-20",
      "screenshotUrl": "/uploads/temp_abc.png"
    }
    ```

### 4. Frontend Workflow
- **Flow**: Upload -> Show Spinner -> Analysis Complete -> Populate Form -> User Edits -> Submit.
- **State Management**: Use React state to hold the "analyzing" status and "suggested" data.

## Risks / Trade-offs

- **[Risk] Ollama Performance** —> Mitigation: Show a clear loading state with progress feedback. Ensure the server has enough RAM for the vision model.
- **[Risk] Accuracy** —> Mitigation: Always allow the user to review and edit the pre-filled fields.
- **[Risk] Model Availability** —> Mitigation: Add a check for Ollama health and fallback to manual entry if unavailable.
