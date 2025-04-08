import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/AuthLayout";
import Input from "./components/Input";
import LoadingButton from "../../layout/components/LoadingButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { GoogleLoginButton } from "@/pages/auth/components/Oauth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, register } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (validate()) {
      return;
    }

    const res = await register(data);

    if (!res) {
      return;
    }

    navigate("/verify-otp", {
      state: { email: formData.email, isPasswordReset: false },
    });
  };

  return (
    <AuthLayout title="Register for Facebook">
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          placeholder="Create a username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <LoadingButton
          type="submit"
          variant="primary"
          fullWidth
          className="mt-4"
          isLoading={isLoading}
        >
          Register
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
          Already have an account?{" "}
          <a
            onClick={(e) => {
              e.preventDefault();

              if (!isLoading) navigate("/login");
            }}
            className={`text-white hover:text-[#1DB954] underline cursor-pointer ${
              isLoading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            Log in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
