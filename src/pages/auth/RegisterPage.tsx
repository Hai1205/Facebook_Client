import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./components/Input";
import LoadingButton from "../../layout/components/LoadingButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_CHOICE } from "@/utils/choices";
import { GoogleLoginButton } from "@/pages/auth/components/Oauth";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
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

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
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
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender);

    data.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const res = await register(data);

    if (!res) {
      return;
    }

    navigate("/verify-otp", {
      state: { email: formData.email, isPasswordReset: false },
    });
  };

  return (
    <>
      <h1 className="text-[#1877F2] text-2xl font-bold text-center mb-8">
        Register for Facebook
      </h1>

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
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

        <div className="flex gap-4 mt-4">
          <div className="w-1/2">
            <Input
              label="Date of birth"
              type="date"
              name="dateOfBirth"
              className="cursor-pointer"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />
          </div>

          <div className="w-1/2">
            <Label htmlFor="edit-gender">Gender</Label>

            <Select
              value={formData.gender || ""}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, gender: value }));
                if (errors.gender) {
                  setErrors((prev) => ({ ...prev, gender: "" }));
                }
              }}
            >
              <SelectTrigger id="edit-gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                {GENDER_CHOICE.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <LoadingButton
          type="submit"
          variant="primary"
          fullWidth
          className="mt-4 bg-[#1877F2] hover:bg-[#166FE5]"
          isLoading={isLoading}
        >
          REGISTER
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
            className={`text-[#1877F2] hover:text-[#166FE5] underline cursor-pointer ${
              isLoading ? "pointer-events-none opacity-70" : ""
            }`}
          >
            Log in
          </a>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;
