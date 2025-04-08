import { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLayout from "@/layout/UserLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "./pages/auth/OTPVerificationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import HomePage from "@/pages/home/HomePage";
import ChatPage from "@/pages/chat/ChatPage";
import NotFoundPage from "@/pages/404/NotFoundPage";
import SettingPage from "./pages/settings/SettingPage";
import SearchResult from "./pages/search/SearchResults";
import AdminDashboardPage from "./pages/admin/adminDashboard/AdminDashboardPage";
import AdminLayout from "./layout/AdminLayout";
import AlbumManagementPage from "./pages/admin/albumManagement/AlbumManagementPage";
import ArtistApplicationManagementPage from "./pages/admin/artistApplicationManagement/ArtistApplicationManagementPage";
import SongManagementPage from "./pages/admin/songManagement/SongManagementPage";
import UserManagementPage from "./pages/admin/userManagement/UserManagementPage";
import PrivateRoute from "./layout/components/PrivateRoute";
import AuthRoute from "./layout/components/AuthRoute";
import AdminRoute from "./layout/components/AdminRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import MusicUploaderPage from "./pages/music/MusicUploaderPage";
import MusicPlayer from "./pages/music/MusicPlayer";
import { useAuthStore } from "./stores/useAuthStore";
import FavoriteSongs from "./pages/music/song/FavoriteSongsPage";
import SongDetailsPage from "./pages/music/song/SongDetailsPage";
import AlbumDetailsPage from "@/pages/music/album/AlbumDetailsPage";

function App() {
  const { isAuth, refreshToken } = useAuthStore();

  const stableRefreshToken = useCallback(() => {
    refreshToken();
  }, [refreshToken]);

  useEffect(() => {
    if (!isAuth) return;

    const fourMinutes = 240000;

    const intervalId = setInterval(stableRefreshToken, fourMinutes);

    return () => clearInterval(intervalId);
  }, [isAuth, stableRefreshToken]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/verify-otp" element={<OTPVerificationPage />} />

          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/search" element={<SearchResult />} />

          <Route path="/music-uploader" element={<MusicUploaderPage />} />

          <Route path="/favorite-songs" element={<FavoriteSongs />} />

          <Route path="/song-details/:songId" element={<SongDetailsPage />} />

          <Route path="/album-details/:albumId" element={<AlbumDetailsPage />} />

          <Route path="/song-player/:songId" element={<MusicPlayer />} />

          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/chat" element={<ChatPage />} />


            <Route path="/settings" element={<SettingPage />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route index element={<AdminDashboardPage />} />

            <Route path="user-management" element={<UserManagementPage />} />

            <Route path="search" element={<SearchResult />} />

            <Route path="song-management" element={<SongManagementPage />} />

            <Route path="album-management" element={<AlbumManagementPage />} />

            <Route
              path="artist-application-management"
              element={<ArtistApplicationManagementPage />}
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
    </Router>
  );
}

export default App;
