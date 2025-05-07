import { useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

export interface UserData {
  family_name?: string;
  given_name?: string;
  email?: string;
  picture?: string;
}

const GoogleLoginButton = () => {
  const { loginGoogle } = useAuthStore();

  const navigate = useNavigate();

  const handleSuccess = useCallback(
    async (response: any) => {
      if (response.credential) {
        const user: UserData = jwtDecode<UserData>(response.credential);

        if (
          !user.email ||
          !user.family_name ||
          !user.given_name ||
          !user.picture
        ) {
          return;
        }

        const fullName = user.family_name + " " + user.given_name;

        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("fullName", fullName);
        formData.append("avatarPhotoUrl", user.picture);

        const res = await loginGoogle(formData);

        if (res) {
          navigate("/");
        }
      } else {
        console.warn("No credential received from Google.");
      }
    },
    [loginGoogle, navigate]
  );

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => initializeGoogleLogin();
        document.body.appendChild(script);
      } else {
        initializeGoogleLogin();
      }
    };

    const initializeGoogleLogin = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_CLIENT_ID as string,
          callback: handleSuccess,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large" }
        );
      }
    };

    loadGoogleScript();
  }, [handleSuccess]);

  return (
    <div id="google-login-button" className="mb-4  flex justify-center"></div>
  );
};

export { GoogleLoginButton };
