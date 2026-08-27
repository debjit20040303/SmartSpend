import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  // Decide which panel should be visible initially
  const [isRegister, setIsRegister] = useState(
    location.pathname === "/register"
  );

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // LOGIN INPUT
  // -----------------------------
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // REGISTER INPUT
  // -----------------------------
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // SWITCH TO REGISTER
  // -----------------------------
  const showRegister = () => {
    setError("");
    setIsRegister(true);
    window.history.replaceState({}, "", "/register");
  };

  // -----------------------------
  // SWITCH TO LOGIN
  // -----------------------------
  const showLogin = () => {
    setError("");
    setIsRegister(false);
    window.history.replaceState({}, "", "/login");
  };

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(loginData);

      // Save token if backend returns one
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Save user if backend returns one
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser(registerData);

      // Registration successful
      // Move to login panel
      setIsRegister(false);

      setLoginData({
        email: registerData.email,
        password: "",
      });

      window.history.replaceState({}, "", "/login");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Main Authentication Container */}
      <div className={`auth-wrapper ${isRegister ? "toggled" : ""}`}>

        {/* ================================
            LOGIN FORM
        ================================= */}

        <div className="credentials-panel signin">

          <form onSubmit={handleLogin}>

            <h2 className="slide-element">
              Welcome Back
            </h2>

            <p className="auth-subtitle slide-element">
              Sign in to continue managing your finances
            </p>

            {error && !isRegister && (
              <div className="error-message slide-element">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="field-wrapper slide-element">

              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />

              <label>Email Address</label>

              <span className="field-icon">
                ✉
              </span>

            </div>

            {/* Password */}
            <div className="field-wrapper slide-element">

              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />

              <label>Password</label>

              <span className="field-icon">
                🔒
              </span>

            </div>

            {/* Forgot password */}
            <div className="forgot-password slide-element">
              <button type="button">
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="submit-button slide-element"
              disabled={loading}
            >
              {loading ? "Signing in..." : "LOGIN"}
            </button>

            {/* Switch */}
            <div className="switch-link slide-element">

              Don't have an account?

              <button
                type="button"
                className="switch-button login-trigger"
                onClick={showRegister}
              >
                Register
              </button>

            </div>

          </form>

        </div>


        {/* ================================
            REGISTER FORM
        ================================= */}

        <div className="credentials-panel signup">

          <form onSubmit={handleRegister}>

            <h2 className="slide-element">
              Create Account
            </h2>

            <p className="auth-subtitle slide-element">
              Start your smarter financial journey
            </p>

            {error && isRegister && (
              <div className="error-message slide-element">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="field-wrapper slide-element">

              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />

              <label>Full Name</label>

              <span className="field-icon">
                👤
              </span>

            </div>

            {/* Email */}
            <div className="field-wrapper slide-element">

              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />

              <label>Email Address</label>

              <span className="field-icon">
                ✉
              </span>

            </div>

            {/* Password */}
            <div className="field-wrapper slide-element">

              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                minLength={6}
                required
              />

              <label>Password</label>

              <span className="field-icon">
                🔒
              </span>

            </div>

            {/* Register button */}
            <button
              type="submit"
              className="submit-button slide-element"
              disabled={loading}
            >
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </button>

            {/* Switch */}
            <div className="switch-link slide-element">

              Already have an account?

              <button
                type="button"
                className="switch-button register-trigger"
                onClick={showLogin}
              >
                Login
              </button>

            </div>

          </form>

        </div>


        {/* ================================
            LOGIN WELCOME SECTION
        ================================= */}

        <div className="welcome-section signin">

          <div className="slide-element">

            <div className="brand-logo">
              <span>₹</span>
              SmartSpend <strong>AI</strong>
            </div>

            <h2>
              Welcome Back!
            </h2>

            <p>
              Your money. Your goals.
              <br />
              Your smarter future.
            </p>

          </div>

        </div>


        {/* ================================
            REGISTER WELCOME SECTION
        ================================= */}

        <div className="welcome-section signup">

          <div className="slide-element">

            <div className="brand-logo">
              <span>₹</span>
              SmartSpend <strong>AI</strong>
            </div>

            <h2>
              Join SmartSpend AI
            </h2>

            <p>
              Track your expenses,
              <br />
              control your budget,
              <br />
              and spend smarter.
            </p>

          </div>

        </div>


        {/* Animated Background Shapes */}

        <div className="background-shape"></div>

        <div className="secondary-shape"></div>

      </div>


      {/* Footer */}

      <div className="auth-footer">
        © 2026 SmartSpend AI • Intelligent Personal Finance
      </div>

    </div>
  );
}

export default Auth;