import { Outlet } from "react-router-dom";
import Header from "./components/navbar/Header";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="h-[calc(100vh)] flex flex-col items-center justify-center px-4 mt-8">
      {/* <div className="h-[calc(100vh-(-9rem))] flex flex-col items-center justify-center px-4 mt-8"> */}
        <div className="w-full max-w-md">
          <div className="bg-[#121212] p-8 rounded-lg border border-gray-800">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
