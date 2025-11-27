import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Avatar from "./Avatar.jsx";
import ConnectionStatus from "./ConnectionStatus.jsx";
import { getUserProfileRequest } from "../api/userApi.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getUserProfileRequest()
        .then(response => setUserProfile(response.data))
        .catch(error => console.error("Error loading user profile:", error));
    }
  }, [user?.id]);

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Realtime Chat
          </p>
          <h1 className="text-xl font-semibold text-white">ConnectNow</h1>
        </div>
        <ConnectionStatus />
      </div>

      <div className="flex items-center space-x-4">
        {/* User Profile Section */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-900"
        >
          <Avatar 
            src={userProfile?.avatar} 
            name={user?.name}
            size="sm"
            isOnline={userProfile?.is_online}
          />
          <div className="text-right">
            <p className="text-sm text-slate-200">Signed in as</p>
            <p className="text-white font-medium">{user?.name}</p>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-600 hover:text-white hover:border-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

