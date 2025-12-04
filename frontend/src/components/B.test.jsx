import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LoginPage from './LoginPage';

// Mock module authService
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

import * as authService from '../services/authService';

const mockedLogin = authService.login;
const mockedRegister = authService.register;

describe('Kiểm thử submit form và gọi API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test('TC-B1: Submit login thành công và gọi API', async () => {
        const mockUser = { id: 1, email: 'test@example.com' };
        mockedLogin.mockResolvedValue({ data: mockUser });

        render(<LoginPage />, { wrapper: MemoryRouter });

        const emailInput = screen.getByTestId('login-email');
        const passwordInput = screen.getByTestId('login-password');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });

        fireEvent.click(screen.getByTestId('login-submit'));

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' });
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        });
    });

    test('TC-B2: Submit register thành công và gọi API', async () => {
        const mockUser = { id: 1, name: 'Nguyen Bao' };
        mockedRegister.mockResolvedValue({ data: mockUser });

        render(<LoginPage />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByTestId('toggle-signup'));

        const nameInput = screen.getByPlaceholderText('Name');
        const emailInput = screen.getByTestId('register-email');
        const passwordInput = screen.getByTestId('register-password');
        fireEvent.change(nameInput, { target: { value: 'Nguyen Bao' } });
        fireEvent.change(emailInput, { target: { value: 'bao@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'abcdef' } });

        fireEvent.click(screen.getByTestId('register-submit'));

        await waitFor(() => {
            expect(mockedRegister).toHaveBeenCalledWith({ name: 'Nguyen Bao', email: 'bao@test.com', password: 'abcdef' });
            expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
        });
    });
});
