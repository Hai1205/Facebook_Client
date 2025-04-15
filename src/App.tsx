import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "./pages/auth/OTPVerificationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import HomePage from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/404/NotFoundPage";
import AuthRoute from "./layout/components/protected-route/AuthRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import UserLayout from "./layout/UserLayout";
import AuthLayout from "./layout/AuthLayout";
// import AdminLayout from "./layout/AdminLayout";
// import AdminRoute from "./layout/components/AdminRoute";
// import AdminDashboardPage from "./pages/admin/adminDashboard/AdminDashboardPage";
// import UserManagementPage from "./pages/admin/userManagement/UserManagementPage";
import FriendPage from "./pages/friend/FriendPage";
import VideoPage from "./pages/video/VideoPage";
import PrivateRoute from "./layout/components/protected-route/PrivateRoute";
import SettingPage from "./pages/settings/SettingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/verify-otp" element={<OTPVerificationPage />} />

            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />

          {/* <Route path="/search" element={<SearchResult />} /> */}

          <Route path="/profile/:userId" element={<ProfilePage />} />

          <Route path="/friends-list" element={<FriendPage />} />

          <Route path="/video-feed" element={<VideoPage />} />

          <Route element={<PrivateRoute />}>
            {/* <Route path="/notifications" element={< />} /> */}

            {/* <Route path="/messages" element={< />} /> */}

            <Route path="/settings" element={<SettingPage />} />
          </Route>
        </Route>

        {/* <Route path="/admin-dashboard" element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />

            <Route path="user-management" element={<UserManagementPage />} />

            <Route path="search" element={<SearchResult />} />

            <Route path="song-management" element={<SongManagementPage />} />
          </Route>
        </Route> */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </Router>
  );
}

export default App;
