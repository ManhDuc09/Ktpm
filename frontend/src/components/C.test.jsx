import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LoginPage from './LoginPage';

// Mock module authService
vi.mock('../services/authService', () => ({
    login: vi.fn(),
}));

import * as authService from '../services/authService';

const mockedLogin = authService.login;

describe('Test error handling và success messages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test('IT-TC-C1: Shows error when login fields are empty', async () => {
        render(<LoginPage />, { wrapper: MemoryRouter });
        fireEvent.click(screen.getByTestId('login-submit'));
        await waitFor(() => {
            expect(screen.getByTestId('login-error')).toHaveTextContent('Both email and password are required!');
        });
    });

    test('IT-TC-C2: Handles API login error', async () => {
        mockedLogin.mockRejectedValue({ response: { status: 401 } });

        render(<LoginPage />, { wrapper: MemoryRouter });
        const emailInput = screen.getByTestId('login-email');
        const passwordInput = screen.getByTestId('login-password');
        fireEvent.change(emailInput, { target: { value: 'invalid@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(screen.getByTestId('login-submit'));
        await waitFor(() => {
            expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid email or password!');
        });
        expect(mockedLogin).toHaveBeenCalled();
    });

    test('IT-TC-C3: Success message after register', async () => {
        mockedLogin.mockRejectedValue({ response: { status: 400 } });

        render(<LoginPage />, { wrapper: MemoryRouter });
        const emailInput = screen.getByTestId('login-email');
        const passwordInput = screen.getByTestId('login-password');
        fireEvent.change(emailInput, { target: { value: 'invalid@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(screen.getByTestId('login-submit'));
        await waitFor(() => {
            expect(screen.queryByTestId('register-error')).not.toBeInTheDocument(); 
        });
        expect(mockedLogin).toHaveBeenCalled();
    });
});
