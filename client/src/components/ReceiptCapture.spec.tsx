import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReceiptCapture from './ReceiptCapture';

// Mock URL.createObjectURL
vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'mock-url'),
    revokeObjectURL: vi.fn(),
});

describe('ReceiptCapture', () => {
    const mockOnCapture = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial state with "Caméra" and "Fichier" buttons', () => {
        render(<ReceiptCapture onCapture={mockOnCapture} />);

        expect(screen.getByText(/Justificatif/i)).toBeDefined();
        expect(screen.getByText('Caméra')).toBeDefined();
        expect(screen.getByText('Fichier')).toBeDefined();
    });

    it('displays the preview when initialPreview is provided', () => {
        render(<ReceiptCapture onCapture={mockOnCapture} initialPreview="https://example.com/receipt.jpg" />);

        const img = screen.getByAltText('Receipt preview');
        expect(img).toBeDefined();
        expect((img as HTMLImageElement).src).toBe('https://example.com/receipt.jpg');
    });

    it('triggers file upload when a file is selected', async () => {
        render(<ReceiptCapture onCapture={mockOnCapture} />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByLabelText(/Fichier/i).closest('label')?.querySelector('input') as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        expect(mockOnCapture).toHaveBeenCalledWith(file);

        // Use findBy which uses waitFor internally
        const img = await screen.findByAltText('Receipt preview');
        expect(img).toBeDefined();
    });

    it('clears the capture when the clear button is clicked', async () => {
        render(<ReceiptCapture onCapture={mockOnCapture} initialPreview="some-url" />);

        const clearButton = screen.getByTitle('Supprimer');
        fireEvent.click(clearButton);

        expect(mockOnCapture).toHaveBeenCalledWith(null);

        await waitFor(() => {
            expect(screen.queryByAltText('Receipt preview')).toBeNull();
        });
    });

    it('shows an error message if a non-image file is uploaded', async () => {
        render(<ReceiptCapture onCapture={mockOnCapture} />);

        const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/Fichier/i).closest('label')?.querySelector('input') as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        expect(mockOnCapture).not.toHaveBeenCalled();
        expect(screen.getByText(/Le fichier doit être une image/i)).toBeDefined();
    });
});
