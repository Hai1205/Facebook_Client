import type React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "./components/PasswordInput";
import LoadingButton from "../../layout/components/LoadingButton";
import { useAuthStore } from "@/stores/useAuthStore";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || "";

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    rePassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isLoading, forgotPassword } = useAuthStore();

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
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.rePassword) {
      newErrors.rePassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.rePassword) {
      newErrors.rePassword = "Passwords do not match";
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
    data.append("newPassword", formData.newPassword);
    data.append("rePassword", formData.rePassword);

    const res = await forgotPassword(email, data);

    if (!res) {
      return;
    }

    navigate("/login");
  };

  return (
    <>
      <h1 className="text-[#1877F2] text-2xl font-bold text-center mb-6">
        Reset your password
      </h1>

      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="New password"
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />

        <PasswordInput
          label="Confirm password"
          name="rePassword"
          placeholder="Confirm new password"
          value={formData.rePassword}
          onChange={handleChange}
          error={errors.rePassword}
        />

        <LoadingButton
          type="submit"
          variant="primary"
          fullWidth
          className="mt-6 mb-4 bg-[#1877F2] hover:bg-[#166FE5]"
          isLoading={isLoading}
        >
          Reset Password
        </LoadingButton>
      </form>
    </>
  );
};

export default ResetPasswordPage;
