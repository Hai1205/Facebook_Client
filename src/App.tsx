import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AuthLayout from "./layout/AuthLayout";
import FriendPage from "./pages/friend/FriendPage";
import VideoPage from "./pages/video/VideoPage";
import PrivateRoute from "./layout/components/protected-route/PrivateRoute";
import SettingPage from "./pages/settings/SettingPage";
import { IncomingCallNotification } from "./pages/chat/VoiceCallComponents/components/IncomingCallNotification";
import { CallManager } from "./pages/chat/CallManager";
import AdminRoute from "./layout/components/protected-route/AdminRoute";
import AdminDashboardPage from "./pages/admin/adminDashboard/AdminDashboardPage";
import UserManagementPage from "./pages/admin/userManagement/UserManagementPage";
import ReportManagementPage from "./pages/admin/reportManagement/ReportManagementPage";
import PostManagementPage from "./pages/admin/postManagement/PostManagementPage";
import Layout from "./layout/Layout";

function App() {
  return (
    <BrowserRouter>
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

        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* <Route path="/search" element={<SearchResult />} /> */}

          <Route path="/profile/:userId" element={<ProfilePage />} />

          <Route
            path="/friends"
            element={<Navigate to="/friends/requests" replace />}
          />
          <Route path="/friends/:tab" element={<FriendPage />} />

          <Route path="/video-feed" element={<VideoPage />} />

          <Route element={<PrivateRoute />}>
            {/* <Route path="/notifications" element={< />} /> */}

            {/* <Route path="/messages" element={< />} /> */}

            <Route path="/settings" element={<SettingPage />} />
          </Route>
        </Route>

        <Route path="/admin" element={<Layout />}>
          <Route element={<AdminRoute />}>
            <Route path="dashboard" index element={<AdminDashboardPage />} />

            <Route path="user-management" element={<UserManagementPage />} />

            <Route path="post-management" element={<PostManagementPage />} />

            <Route
              path="report-management"
              element={<ReportManagementPage />}
            />
          </Route>
        </Route>

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

      <CallManager />
      <IncomingCallNotification />
    </BrowserRouter>
  );
}

export default App;
