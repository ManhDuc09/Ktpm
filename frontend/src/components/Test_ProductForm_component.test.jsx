import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import UserPage from './UserPage';

vi.mock('axios');

describe('UserPage CRUD behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderWithRouter = () => {
        render(
        <MemoryRouter initialEntries={['/users/1']}>
            <Routes>
                <Route path="/users/:id" element={<UserPage />} />
            </Routes>
        </MemoryRouter>
        );
    };

    test('IT-PD-TC-B1: Create product', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] });

        const mockNewProduct = { id: 2, title: 'New Product', description: 'New Desc', quantity: 5 };
        vi.mocked(axios.post).mockResolvedValue({ data: mockNewProduct });

        renderWithRouter();

        fireEvent.click(screen.getByTestId('add-product-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('product-name')).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'New Product' } });
        fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'New Desc' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '5' } });
        fireEvent.click(screen.getByTestId('submit-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('success-message')).toHaveTextContent('Product created successfully!');
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:8080/api/products/1',
                expect.objectContaining({ title: 'New Product' })
            );
        });
    });

    test('IT-PD-TC-B2: Edit product', async () => {
        const mockProducts = [{ id: 1, title: 'Old', description: 'Old Desc', quantity: 10 }];
        vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });
        const mockUpdated = { id: 1, title: 'Updated', description: 'Updated Desc', quantity: 20 };
        vi.mocked(axios.put).mockResolvedValue({ data: mockUpdated });

        renderWithRouter();

        await waitFor(() => screen.getByTestId('edit-btn'));
        fireEvent.click(screen.getAllByTestId('edit-btn')[0]); // First row

        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Updated' } });
        await waitFor(() => {
            expect(screen.getByTestId('product-name')).toBeInTheDocument();
        });
        
        fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'Updated Desc' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '20' } });
        fireEvent.click(screen.getByTestId('submit-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('success-message')).toHaveTextContent('Product updated successfully!');
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:8080/api/products/1',
                expect.objectContaining({ title: 'Updated' })
            );
        });
    });

    test('IT-PD-TC-B3: Cancel form', async () => {
        renderWithRouter();

        fireEvent.click(screen.getByTestId('add-product-btn'));
        expect(screen.getByTestId('product-name')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByTestId('product-name')).not.toBeInTheDocument(); // Modal closed
        expect(axios.post).not.toHaveBeenCalled();
    });

    test('IT-PD-TC-B4: Form validation error', async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error('Validation failed'));
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

        renderWithRouter();

        fireEvent.click(screen.getByTestId('add-product-btn'));

        fireEvent.click(screen.getByTestId('submit-btn'));

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Failed to save product.');
        });

        expect(alertSpy).toHaveBeenCalledWith('Failed to save product.');
        alertSpy.mockRestore();
    });
});
