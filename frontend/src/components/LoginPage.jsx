import React, { useState } from "react";
import "./Login.css"; // import your CSS
import { register, login } from "../services/authService";
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
        setLoginError("")
    };

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setRegisterError("")
    };


    const validateRegister = (data) => {
        if (!data.name) return "Name is required";
        if (!data.email) return "Email is required";
        if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(data.email)) return "Invalid email format";
        if (!data.password) return "Password is required";
        if (data.password.length < 6) return "Password must be at least 6 characters";
        return null;
    };

    const validateLogin = (data) => {
        if (!data.email) return "Email is required";
        if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(data.email)) return "Invalid email format";
        if (!data.password) return "Password is required";
        return null;
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        const error = validateLogin(loginData);
        if (error) {
            setLoginError(error);
            return;
        }
        try {
            const response = await login(loginData);
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate(`/users/${response.data.id}`);
        } catch (err) {
            if (err.response?.status === 401) setLoginError("Invalid email or password!");
            else setLoginError("Login failed: " + (err.response?.data || "Unknown error"));
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        const error = validateRegister(registerData);
        if (error) {
            setRegisterError(error);
            return;
        }
        try {
            const response = await register(registerData);
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate(`/users/${response.data.id}`);
            setRightPanelActive(false);
        } catch (err) {
            setRegisterError(err.response?.data || "Registration failed");
        }
    };
    const handleSignUp = () => setRightPanelActive(true);
    const handleSignIn = () => setRightPanelActive(false);

    return (
        <div className="login-page-wrapper"> {/* <-- new wrapper */}

            <div className={`container ${rightPanelActive ? "right-panel-active" : ""}`}>
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegister}>
                        <h1>Create Account</h1>

                        <input type="text"
                            name="name"
                            placeholder="Name"
                            value={registerData.name}
                            onChange={handleChange}

                        />
                        <input type="email" placeholder="Email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange}
                            data-testid="register-email" />
                        <input type="password" placeholder="Password"
                            name="password"
                            value={registerData.password}
                            data-testid="register-password"
                            onChange={handleChange} />
                        {registerError && <p data-testid="register-error" className="error-message">{registerError}</p>}

                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className={`form-container sign-in-container ${rightPanelActive ? "shift" : ""}`}>
                    <form onSubmit={handleLogin} data-testid="login-form">
                        <h1>Sign in</h1>


                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            data-testid="login-email"
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            data-testid="login-password"
                            placeholder="Password"
                        />
                        {loginError && <p data-testid="login-error" className="error-message">{loginError}</p>}

                        <button type="submit" data-testid="login-button">Sign In</button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className={`overlay ${rightPanelActive ? "right-panel-active" : ""}`}>
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={handleSignIn}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" onClick={handleSignUp}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
