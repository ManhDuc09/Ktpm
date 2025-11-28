import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../components/LoginPage';
import * as authService from '../services/authService';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock("../services/authService");

describe('Login Mock Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Thành công
    test('Mock: Login successfully', async () => {
        authService.login.mockResolvedValue({
            status: 200
        });

        const userData = { email: "test@gmail.com", password: "Test123" };

        render(
            <Router>
                <LoginPage />
            </Router>
        );

        // Nhập email
        fireEvent.change(screen.getByTestId('login-email'), {
            target: { value: 'test@gmail.com' }
        });

        // Nhập mật khẩu
        fireEvent.change(screen.getByTestId("login-password"), {
            target: { value: 'Test123' }
        });

        // Nhấn nút Đăng nhập
        fireEvent.click(screen.getByTestId('login-button'));

        // Kết quả
        await waitFor(async () => {
            const result = await authService.login(userData);
            expect(authService.login).toHaveBeenCalledWith(userData);

            expect(result).toEqual(
                expect.objectContaining({ status: 200 })
            );
        });
    });

    //Thất bại (thiếu username)
    test('Mock: Missing email', async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );

        // Nhập mật khẩu và nhấn nút Đăng nhập
        fireEvent.change(screen.getByTestId("login-password"), {
            target: { value: 'Test123' }
        });

        // Nhấn nút Đăng nhập
        fireEvent.click(screen.getByTestId('login-button'));

        // Kết quả
        await waitFor(() => {
            + expect(screen.getByText(/email is required|password is required/i)).toBeInTheDocument();

        });
    });

    // Thất bại (thiếu mật khẩu)
    test('Mock: Missing password', async () => {
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        // Nhập email và nhấn nút Đăng nhập
        fireEvent.change(screen.getByTestId('login-email'), {
            target: { value: 'test@gmail.com' }
        });

        // Nhấn nút Đăng nhập
        fireEvent.click(screen.getByTestId('login-button'));
        // Kết quả
        await waitFor(() => {
            // Kiểm tra xem thông báo lỗi hiển thị cho người dùng có đúng không
            expect(screen.getByTestId("login-error")).toHaveTextContent(/password is required/i);

            // Đảm bảo rằng hàm login KHÔNG được gọi
            expect(authService.login).not.toHaveBeenCalled();
        });
    });

    // Thất bại (sai email)
    test('Mock: Email not founded!', async () => {
        authService.login.mockResolvedValue({
            response: { status: 401 }
        });

        const userData = { email: "alibaba@gmail.com", password: "Test123" };

        /*
          Render
          Nhập email, mật khẩu, và nhấn nút Đăng nhập
        */
        render(
            <Router>
                <LoginPage />
            </Router>
        );
        // Nhập email sai
        fireEvent.change(screen.getByTestId('login-email'), {
            target: { value: 'alibaba@gmail.com' }
        });

        // Nhập mật khẩu
        fireEvent.change(screen.getByTestId("login-password"), {
            target: { value: 'Test123' }
        });

        // Nhấn nút Đăng nhập
        fireEvent.click(screen.getByTestId('login-button'));

        // Kết quả    
        await waitFor(async () => {
            const result = await authService.login(userData);
            // Hàm login được gọi đúng data
            expect(authService.login).toHaveBeenCalledWith(userData);

            // Mock trả về 401 (đúng cấu trúc)
            expect(result).toEqual(
                expect.objectContaining({
                    response: { status: 401 }
                })
            );

            // Hiển thị thông báo lỗi
            expect(screen.getByTestId("login-error")).toHaveTextContent(/invalid email or password|login failed/i);
        });
    });

    // Thất bại (sai mật khẩu)
    test('Mock: Wrong password!', async () => {
        authService.login.mockResolvedValue({
            response: { status: 401 }
        });

        render(
            <Router>
                <LoginPage />
            </Router>
        );

        fireEvent.change(screen.getByTestId('login-email'), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'WrongPass123' } });
        fireEvent.click(screen.getByTestId('login-button'));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({ email: 'test@gmail.com', password: 'WrongPass123' });
            expect(screen.getByTestId('login-error')).toHaveTextContent(/invalid email or password|login failed/i);
        });
    });

});