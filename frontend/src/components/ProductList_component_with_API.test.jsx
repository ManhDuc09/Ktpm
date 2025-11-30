import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import UserPage from './UserPage';

vi.mock('axios');

describe('UserPage API behavior', () => {
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

    test('IT-PD-TC-A1: Fetch và render ProductList', async () => {
        axios.get.mockResolvedValue({
            data: [{ id: 1, title: 'Product 1', description: 'Desc 1', quantity: 10 }]
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByTestId('product-item')).toBeInTheDocument();
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/products/1');
    });

    test('IT-PD-TC-A2: Handle empty list', async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] });

        render(
            <MemoryRouter initialEntries={['/users/1']}>
                <Routes>
                    <Route path="/users/:id" element={<UserPage />} />
                </Routes>
            </MemoryRouter>
        );

    await waitFor(() => {
        expect(screen.getByText('No items yet.')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8080/api/products/1');
    });

    test('IT-PD-TC-A3: Error fetching', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('No items yet.')).toBeInTheDocument();
        });

        expect(consoleSpy).toHaveBeenCalledWith(
            'Error fetching products:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });
});
