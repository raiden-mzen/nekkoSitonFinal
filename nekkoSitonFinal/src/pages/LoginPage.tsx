import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Camera,
  Heart,
  Star,
} from "lucide-react";
import "../styles/LoginPage.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"client" | "admin">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const closePopup = () => {
    setPopup(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setPopup({ message: "Please fill in all required fields.", type: "error" });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) {
        setPopup({ message: error.message, type: "error" });
        return;
      }
      setPopup({ message: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => {
        closePopup();
        navigate(userType === "admin" ? "/admin" : "/");
      }, 2000);
    } else {
      if (!formData.email || !formData.password || !formData.name) {
        setPopup({ message: "Please complete all required fields.", type: "error" });
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone_number: formData.phone,
          },
        },
      });
      if (error) {
        setPopup({ message: error.message, type: "error" });
        return;
      }
      if (userType === "admin") {
        setPopup({
          message: "Your request to register as an admin has been submitted for approval.",
          type: "info",
        });
      } else {
        setPopup({ message: "Account created successfully! Please check your email to verify your account.", type: "success" });
      }
      setTimeout(() => {
        closePopup();
        setIsLogin(true);
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      {popup && (
        <div className={`popup-overlay ${popup.type}`}>
          <div className="popup-content">
            <p>{popup.message}</p>
            <button onClick={closePopup} className="popup-close-btn">
              Close
            </button>
          </div>
        </div>
      )}
      <div className="login-brand">
        <div className="brand-content">
          <h1 className="brand-logo">NEKKO SITON</h1>
          <p className="brand-tagline">Capturing Moments, Creating Memories</p>
          <div className="brand-features">
            <div className="feature">
              <span className="feature-icon"><Camera size={20} /></span>
              <span>Professional Photography Services</span>
            </div>
            <div className="feature">
              <span className="feature-icon"><Heart size={20} /></span>
              <span>Personalized Experience</span>
            </div>
            <div className="feature">
              <span className="feature-icon"><Star size={20} /></span>
              <span>Award-Winning Quality</span>
            </div>
          </div>
        </div>
      </div>
      <div className="login-form-section">
        <div className="login-form-container">
          <div className="user-type-toggle">
            <button
              className={`toggle-btn ${userType === "client" ? "active" : ""}`}
              onClick={() => setUserType("client")}
            >
              Client
            </button>
            <button
              className={`toggle-btn ${userType === "admin" ? "active" : ""}`}
              onClick={() => setUserType("admin")}
            >
              Admin
            </button>
          </div>
          <div className="form-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p>{isLogin ? `Sign in to your ${userType} account` : `Sign up as a ${userType}`}</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User className={`input-icon ${formData.name ? "hide" : ""}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail className={`input-icon ${formData.email ? "hide" : ""}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>
            </div>
            {!isLogin && (
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone className={`input-icon ${formData.phone ? "hide" : ""}`} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>
            )}
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock className={`input-icon ${formData.password ? "hide" : ""}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>
          <div className="form-footer">
            <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;