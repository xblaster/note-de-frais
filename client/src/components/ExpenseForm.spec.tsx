import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExpenseForm from './ExpenseForm';

// Mock the ReceiptCapture component
vi.mock('./ReceiptCapture', () => ({
  default: ({ onCapture }: any) => (
    <div data-testid="receipt-capture">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onCapture(e.target.files[0]);
          }
        }}
        aria-label="receipt-file"
      />
    </div>
  ),
}));

// Mock the API client
vi.mock('../api/api-client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('ExpenseForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with all fields', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/Montant/i)).toBeDefined();
    expect(screen.getByLabelText(/Date/i)).toBeDefined();
    expect(screen.getByLabelText(/Marchand/i)).toBeDefined();
  });

  it('should display error when submitting without amount', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/montant et la date sont requis/i)).toBeDefined();
    });
  });

  it('should display error when submitting without date', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '100' } });
    // Clear the date field
    fireEvent.change(dateInput, { target: { value: '' } });

    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/montant et la date sont requis/i)).toBeDefined();
    });
  });

  it('should submit form with valid data', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '50.00' } });
    fireEvent.change(dateInput, { target: { value: '2024-02-04' } });

    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData), 'SUBMITTED');
  });

  it('should populate all fields when initialData is provided', () => {
    const initialData = {
      amount: '75.50',
      date: '2024-02-03',
      vendor: 'Test Vendor',
    };

    render(
      <ExpenseForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect((screen.getByLabelText(/Montant/i) as HTMLInputElement).value).toBe('75.50');
    expect((screen.getByLabelText(/Date/i) as HTMLInputElement).value).toBe('2024-02-03');
    expect((screen.getByLabelText(/Marchand/i) as HTMLInputElement).value).toBe('Test Vendor');
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should save draft when draft button is clicked', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(dateInput, { target: { value: '2024-02-04' } });

    const draftButton = screen.getByText(/Brouillon/i);
    fireEvent.click(draftButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData), 'DRAFT');
  });

  it('should accept loading prop', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
      />
    );

    // Form should still render when loading
    expect(screen.getByLabelText(/Montant/i)).toBeDefined();
  });

  it('should render ReceiptCapture component', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const receiptCapture = screen.getByTestId('receipt-capture');
    expect(receiptCapture).toBeDefined();
  });

  it('should allow user to modify field values', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const vendorInput = screen.getByLabelText(/Marchand/i) as HTMLInputElement;
    fireEvent.change(vendorInput, { target: { value: 'Starbucks' } });

    expect(vendorInput.value).toBe('Starbucks');

    fireEvent.change(vendorInput, { target: { value: 'Amazon' } });
    expect(vendorInput.value).toBe('Amazon');
  });

  it('should use custom submitLabel', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        submitLabel="Valider"
      />
    );

    expect(screen.getByText('Valider')).toBeDefined();
  });

  it('should have proper form structure with required fields', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    expect(amountInput.required).toBe(true);
    expect(dateInput.required).toBe(true);
  });

  it('should accept decimal amount values', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '25.99' } });
    fireEvent.change(dateInput, { target: { value: '2024-02-04' } });

    const submitButton = screen.getByText('Soumettre');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData), 'SUBMITTED');
  });

  it('should set default date to today', () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];

    expect(dateInput.value).toBe(today);
  });

  it('should handle form submission via Enter key', async () => {
    render(
      <ExpenseForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const amountInput = screen.getByLabelText(/Montant/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date/i) as HTMLInputElement;

    fireEvent.change(amountInput, { target: { value: '50' } });
    fireEvent.change(dateInput, { target: { value: '2024-02-04' } });

    const form = screen.getByLabelText(/Montant/i).closest('form');
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledWith(expect.any(FormData), 'SUBMITTED');
  });
});
