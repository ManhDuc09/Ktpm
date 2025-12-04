import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';

// Mock the authService module using Jest
jest.mock('../services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

describe('Kiểm thử render và tương tác người dùng', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('IT-TC-A1: Hiển thị form đăng nhập và đăng ký ban đầu', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId('login-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();

    expect(screen.getByTestId('register-email')).toBeInTheDocument();
    expect(screen.getByTestId('register-password')).toBeInTheDocument();
    expect(screen.getByTestId('register-submit')).toBeInTheDocument();
  });

  test('IT-TC-A2: Thay đổi giá trị input trong form đăng nhập', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('123456');

    expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
  });

  test('IT-TC-A3: Chuyển sang panel Đăng ký', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByTestId('toggle-signup'));

    const nameInput = screen.getByPlaceholderText('Name');
    expect(nameInput).toBeInTheDocument();
  });

  test('IT-TC-A4: Thay đổi giá trị input trong form đăng ký', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByTestId('toggle-signup'));

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');

    fireEvent.change(nameInput, { target: { value: 'Nguyen Bao' } });
    fireEvent.change(emailInput, { target: { value: 'bao@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'abcdef' } });

    expect(nameInput).toHaveValue('Nguyen Bao');
    expect(emailInput).toHaveValue('bao@test.com');
    expect(passwordInput).toHaveValue('abcdef');

    expect(screen.queryByTestId('register-error')).not.toBeInTheDocument();
  });
});
