import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./pages/Navbar";
import Feed from "./pages/feed";
import Profile from "./pages/profile";
import FollowList from "./pages/followlist";
import "./styles/theme.css"

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        } else {
          window.location.href = "/api/auth/login";
        }
      })
      .catch(() => {
        window.location.href = "/api/auth/login";
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <style>{`
          .spinner-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: var(--color-background, #f8fafc);
            color: var(--color-text-primary, #0f172a);
            font-family: var(--font-family, sans-serif);
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid var(--color-border, #e2e8f0);
            border-top-color: var(--color-primary, #2563eb);
            border-radius: 50%;
            animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            margin-bottom: 16px;
          }
          .loading-text {
            font-size: var(--font-size-base, 14px);
            font-weight: var(--font-weight-medium, 500);
            letter-spacing: 0.5px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="spinner"></div>
        <div className="loading-text">Loading MySocial...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {currentUser && <Navbar currentUser={currentUser} />}
      <main id="main-content">
        <Routes>
          <Route path="/app/feed" element={<Feed />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/profile/:id" element={<Profile />} />
          <Route path="/app/profile/:id/:type" element={<FollowList />} />
          <Route path="*" element={<Navigate to="/app/feed" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
