import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./components/Input";
import LoadingButton from "../../layout/components/LoadingButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { GoogleLoginButton } from "@/pages/auth/components/Oauth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, login } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    const { user, isActive } = await login(data);

    if (!user) {
      return;
    }

    if (!isActive) {
      navigate("/verify-otp", {
        state: { email: user?.email, isPasswordReset: false },
      });

      return;
    }

    navigate("/");
  };

  return (
    <>
      <h1 className="text-facebook text-2xl font-bold text-center mb-8">
        Log in to Facebook
      </h1>

      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <Input
          label="Email"
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="mb-6">
          <a
            onClick={(e) => {
              e.preventDefault();

              if (!isLoading) navigate("/forgot-password");
            }}
            className={`text-white hover:text-facebook text-sm underline cursor-pointer ${
              isLoading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            Forgot your password?
          </a>
        </div>

        <LoadingButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full login-button"
        >
          LOG IN
        </LoadingButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-[#121212] px-4 text-sm text-gray-400">OR</span>
        </div>
      </div>

      <GoogleLoginButton />

      <div className="text-center">
        <p className="text-white text-sm">
          Don't have an account?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-white hover:text-facebook underline cursor-pointer"
          >
            Register for Facebook
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginPage;
