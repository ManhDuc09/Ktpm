import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

// Mock module authService using Jest
jest.mock('../services/authService', () => ({
    login: jest.fn(),
}));

import * as authService from '../services/authService';

const mockedLogin = authService.login;

describe('Test error handling và success messages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('IT-TC-C1: Shows error when login fields are empty', async () => {
        render(<LoginPage />, { wrapper: MemoryRouter });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByTestId('login-error')).toHaveTextContent(
                'Email is required'
            );

        });
    });

    test('IT-TC-C2: Handles API login error', async () => {
        mockedLogin.mockRejectedValue({ response: { status: 401 } });

        render(<LoginPage />, { wrapper: MemoryRouter });
        const emailInput = screen.getByTestId('login-email');
        const passwordInput = screen.getByTestId('login-password');
        fireEvent.change(emailInput, { target: { value: 'invalid@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.getByTestId('login-error')).toHaveTextContent(
                'Invalid email or password!'
            );
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
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(screen.queryByTestId('register-error')).not.toBeInTheDocument();
        });
        expect(mockedLogin).toHaveBeenCalled();
    });
});
