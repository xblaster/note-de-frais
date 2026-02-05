## 1. Backend: Ollama Integration

- [x] 1.1 Install `ollama` dependency in the `server` directory
- [x] 1.2 Create `OllamaService` in `server/src/ollama/` to encapsulate Ollama API calls
- [x] 1.3 Implement `analyzeReceipt` method in `OllamaService` using `qwen3-vl-4b` and structured JSON prompt
- [x] 1.4 Add `POST /expenses/analyze` endpoint in `ExpensesController` with `FileInterceptor`
- [x] 1.5 Update `ExpensesService` to handle temporary storage and cleanup of analyzed images

## 2. Frontend: Workflow & UI

- [x] 2.1 Update `client/src/services/api.ts` (or equivalent) with the new analysis endpoint
- [x] 2.2 Re-structure `AddExpense` page to show a large upload/camera area as the primary step
- [x] 2.3 Implement `AnalyzeOverlay` component to show processing status with micro-animations
- [x] 2.4 Add logic to populate the Shadcn/UI form fields when analysis response arrives
- [x] 2.5 Ensure validation logic works correctly with pre-filled vs manually entered data

## 3. Verification & Polish

- [x] 3.1 Test end-to-end flow with a physical receipt or valid image
- [x] 3.2 Implement fallback to manual form if Ollama analysis fails or times out
- [x] 3.3 Add visual cues (e.g., sparkles or "AI detected") to pre-filled fields
- [x] 3.4 Cleanup any temporary files or debug logs
