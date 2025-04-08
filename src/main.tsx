import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId="707903324299-u3vpk78j2q0vu1j2c5hgq59jlcbbui92.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>
);
