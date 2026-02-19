import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./pages/Navbar";
import Feed from "./pages/feed";
import Profile from "./pages/profile";
import FollowList from "./pages/followlist";
import "./styles/theme.css"

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

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
