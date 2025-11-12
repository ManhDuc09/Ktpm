import React, { useState } from "react";
import "./Login.css"; // import your CSS
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
function LoginPage() {
    const navigate = useNavigate();
    const [rightPanelActive, setRightPanelActive] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!registerData.name || !registerData.email || !registerData.password) {
            alert("All fields are required!");
            return;
        }

        if (!registerData.email.includes("@")) {
            alert("Please enter a valid email!");
            return;
        }

        if (registerData.password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }
        try {
            const response = await register(registerData);
            localStorage.setItem("user", JSON.stringify(response.data));

            alert("Registration successful!");
            navigate(`/users/${response.data.id}`);
            console.log("User registered:", response.data);

            setRightPanelActive(false);
        } catch (err) {
            if (err.response) {

                if (err.response.status === 409) {
                    alert("Registration failed: " + err.response.data);
                } else {
                    alert("Registration failed: " + err.response.data || "Unknown error");
                }
            } else {
                alert("Registration failed: Network error");
            }
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
                            onChange={handleChange} />
                        <input type="email" placeholder="Email"
                            name="email"
                            value={registerData.email}
                            onChange={handleChange} />
                        <input type="password" placeholder="Password"
                            name="password"
                            value={registerData.password}
                            onChange={handleChange} />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className={`form-container sign-in-container ${rightPanelActive ? "shift" : ""}`}>
                    <form>
                        <h1>Sign in</h1>


                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button>Sign In</button>
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
