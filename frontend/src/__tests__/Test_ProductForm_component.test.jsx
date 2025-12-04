import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import UserPage from '../components/UserPage';

jest.mock('axios');

describe('UserPage CRUD behavior', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
        axios.get.mockResolvedValue({ data: [] });
        const mockNewProduct = { id: 2, title: 'New Product', description: 'New Desc', quantity: 5 };
        axios.post.mockResolvedValue({ data: mockNewProduct });

        renderWithRouter();
        fireEvent.click(screen.getByTestId('add-product-btn'));

        const nameInput = await screen.findByTestId('product-name');
        fireEvent.change(nameInput, { target: { value: 'New Product' } });
        fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'New Desc' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '5' } });

        fireEvent.click(screen.getByTestId('submit-btn'));

        const toast = await screen.findByTestId('success-message');
        expect(toast).toHaveTextContent('Product created successfully!');
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/products/1',
            expect.objectContaining({ title: 'New Product' })
        );
    });

    test('IT-PD-TC-B2: Edit product', async () => {
        const mockProducts = [{ id: 1, title: 'Old', description: 'Old Desc', quantity: 10 }];
        axios.get.mockResolvedValue({ data: mockProducts });
        const mockUpdated = { id: 1, title: 'Updated', description: 'Updated Desc', quantity: 20 };
        axios.put.mockResolvedValue({ data: mockUpdated });

        renderWithRouter();
        const editBtn = await screen.findByTestId('edit-btn');
        fireEvent.click(editBtn);

        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Updated' } });
        fireEvent.change(screen.getByTestId('product-description'), { target: { value: 'Updated Desc' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '20' } });

        fireEvent.click(screen.getByTestId('submit-btn'));

        const toast = await screen.findByTestId('success-message');
        expect(toast).toHaveTextContent('Product updated successfully!');
        expect(axios.put).toHaveBeenCalledWith(
            'http://localhost:8080/api/products/1',
            expect.objectContaining({ title: 'Updated' })
        );
    });

    test('IT-PD-TC-B3: Cancel form', async () => {
        renderWithRouter();
        fireEvent.click(screen.getByTestId('add-product-btn'));
        expect(await screen.findByTestId('product-name')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Cancel'));
        expect(screen.queryByTestId('product-name')).not.toBeInTheDocument();
        expect(axios.post).not.toHaveBeenCalled();
    });

    test('IT-PD-TC-B4: Form validation error', async () => {
        axios.post.mockRejectedValue(new Error('Validation failed'));
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        renderWithRouter();
        fireEvent.click(screen.getByTestId('add-product-btn'));
        fireEvent.click(screen.getByTestId('submit-btn'));

        const toast = await screen.findByTestId('success-message').catch(() => null);
        expect(alertSpy).toHaveBeenCalledWith('Failed to save product.');
        alertSpy.mockRestore();
    });
});
