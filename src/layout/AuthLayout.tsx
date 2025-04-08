import type React from "react";
import { Header } from "./components/Header";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <>
      <Header />

      <div className="h-[calc(100vh-4rem)] bg-black flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#121212] p-8 rounded-lg">
            <h1 className="text-[#1DB954] text-2xl font-bold text-center mb-8">
              {title}
            </h1>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
