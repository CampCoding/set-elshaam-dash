// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "antd";
import { Video } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = login(formData);
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to Matary</p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="password"
            />

            <div className="flex items-center justify-between mb-6">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="text-gray-600"
              >
                Remember me
              </Checkbox>
              <Link
                to="/forgot-password"
                className="text-primary text-sm hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} fullWidth>
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          {/* <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p> */}
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-primary-dark items-center justify-center p-12">
        <div className="text-center text-white max-w-lg">
          {/* Logo with white background */}
          <div className="w-64 mx-auto mb-8 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
            <img
              src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
              className="w-full h-full"
              alt="Matary Logo"
            />
          </div>
          <p className="text-xl text-white/80 leading-relaxed">
            Your complete platform for managing meetings, schedules, and team
            collaboration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
