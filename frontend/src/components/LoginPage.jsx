import { useState } from "react";
import "./Login.css";
import { register, login } from "../services/authService";
import {
  validateUsername,
  validatePassword,
  validateEmail,
} from "../services/validation";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setRegisterError("");
  };

  // -----------
  // FORM LOGIN
  // -----------
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate username
    const emailCheck = validateEmail(loginData.email);
    if (!emailCheck.valid) {
      setLoginError(emailCheck.message);
      return;
    }

    // Validate password
    const passwordCheck = validatePassword(loginData.password);
    if (!passwordCheck.valid) {
      setLoginError(passwordCheck.message);
      return;
    }

    try {
      const response = await login(loginData);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate(`/users/${response.data.id}`);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setLoginError("Email hoặc mật khẩu không hợp lệ!");
        } else {
          setLoginError(
            "Đăng nhập thất bại: " + (err.response.data || "Lỗi không xác định")
          );
        }
      } else {
        setLoginError("Lỗi mạng");
      }
    }
  };

  // --------------
  // FORM REGISTER
  // --------------
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate username (name)
    const usernameCheck = validateUsername(registerData.name);
    if (!usernameCheck.valid) {
      setRegisterError(usernameCheck.message);
      return;
    }

    // Validate email
    const emailCheck = validateEmail(registerData.email);
    if (!emailCheck.valid) {
      setRegisterError(emailCheck.message);
      return;
    }

    // Validate password
    const passwordCheck = validatePassword(registerData.password);
    if (!passwordCheck.valid) {
      setRegisterError(passwordCheck.message);
      return;
    }

    try {
      const response = await register(registerData);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate(`/users/${response.data.id}`);
      setRightPanelActive(false);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setRegisterError("Đăng ký thất bại: " + err.response.data);
        } else {
          setRegisterError(
            "Đăng ký thất bại: " + (err.response.data || "Lỗi không xác định")
          );
        }
      } else {
        setRegisterError("Lỗi mạng");
      }
    }
  };

  const handleSignUp = () => setRightPanelActive(true);
  const handleSignIn = () => setRightPanelActive(false);

  return (
    <div className="login-page-wrapper">
      <div
        className={`container ${rightPanelActive ? "right-panel-active" : ""}`}>
        {/* REGISTER */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={registerData.name}
              onChange={handleRegisterChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              data-testid="register-email"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleRegisterChange}
              data-testid="register-password"
            />

            {registerError && (
              <p className="error-message" data-testid="register-error">
                {registerError}
              </p>
            )}

            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* LOGIN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} data-testid="login-form">
            <h1>Sign in</h1>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              data-testid="login-email"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              data-testid="login-password"
            />

            {loginError && (
              <p className="error-message" data-testid="login-error">
                {loginError}
              </p>
            )}

            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div
            className={`overlay ${
              rightPanelActive ? "right-panel-active" : ""
            }`}>
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
