import React, { useState } from "react";
import "./Login.css"; // import your CSS

function LoginPage() {
    const [rightPanelActive, setRightPanelActive] = useState(false);

    const handleSignUp = () => setRightPanelActive(true);
    const handleSignIn = () => setRightPanelActive(false);

    return (
        <div className={`container ${rightPanelActive ? "right-panel-active" : ""}`}>
            <div className="form-container sign-up-container">
                <form>
                    <h1>Create Account</h1>

                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button>Sign Up</button>
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
    );
}

export default LoginPage;
