import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import UserPage from './UserPage';

vi.mock('axios');

describe('UserPage Product Detail Behavior', () => {

    const renderPage = () => {
        return render(
            <MemoryRouter initialEntries={['/users/1']}>
                <Routes>
                    <Route path="/users/:id" element={<UserPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test('IT-PD-TC-C1: View product detail', async () => {
        const mockProducts = [
            { id: 1, title: 'Detail Product', description: 'Detail Desc', quantity: 15 }
        ];
        vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });

        renderPage();

        await waitFor(() => screen.getByTestId('edit-btn'));
        fireEvent.click(screen.getAllByTestId('edit-btn')[0]);

        expect(screen.getByTestId('product-name')).toHaveValue('Detail Product');
        expect(screen.getByTestId('product-description')).toHaveValue('Detail Desc');
        expect(screen.getByTestId('product-quantity')).toHaveValue(15);
    });

    test('IT-PD-TC-C2: Detail read-only', async () => {
        const mockProducts = [
            { id: 1, title: 'Unchanged', description: 'Unchanged Desc', quantity: 10 }
        ];
        vi.mocked(axios.get).mockResolvedValue({ data: mockProducts });

        renderPage();

        await waitFor(() => screen.getByTestId('edit-btn'));
        fireEvent.click(screen.getAllByTestId('edit-btn')[0]);

        expect(screen.getByTestId('product-name')).toHaveValue('Unchanged');
        expect(screen.getByTestId('product-description')).toHaveValue('Unchanged Desc');
        expect(screen.getByTestId('product-quantity')).toHaveValue(10);

        expect(axios.put).not.toHaveBeenCalled();
    });

});
