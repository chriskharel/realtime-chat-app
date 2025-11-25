import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Avatar from "../components/Avatar";
import { 
  getUserProfileRequest, 
  updateUserProfileRequest, 
  uploadAvatarRequest, 
  deleteAvatarRequest 
} from "../api/userApi";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getUserProfileRequest();
      setProfile(response.data);
      setEditForm({ name: response.data.name });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await uploadAvatarRequest(formData);
      setProfile(prev => ({ ...prev, avatar: response.data.avatar }));
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile.avatar) return;

    try {
      await deleteAvatarRequest();
      setProfile(prev => ({ ...prev, avatar: null }));
      toast.success("Avatar deleted successfully!");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      toast.error("Failed to delete avatar");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await updateUserProfileRequest(editForm);
      setProfile(prev => ({ ...prev, name: editForm.name }));
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{backgroundColor: '#020617'}}>
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800" style={{backgroundColor: '#0f172a'}}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/chats")}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Chats
          </button>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
          <button
            onClick={logout}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-800">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar
                src={profile?.avatar}
                name={profile?.name}
                size="xl"
                isOnline={profile?.is_online}
              />
              
              {/* Avatar upload button */}
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {uploading && (
              <div className="mt-2 text-sm text-blue-400">Uploading...</div>
            )}

            {profile?.avatar && (
              <button
                onClick={handleDeleteAvatar}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove Avatar
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Full Name
              </label>
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="flex space-x-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium text-white transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-lg text-white">{profile?.name}</span>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="text-lg text-slate-100">{profile?.email}</div>
              <div className="text-xs text-slate-400 mt-1">Email cannot be changed</div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                User ID
              </label>
              <div className="text-lg text-slate-100">#{profile?.id}</div>
              <div className="text-xs text-slate-400 mt-1">Share this ID with others to start chatting</div>
            </div>

            {/* Account Stats */}
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4 text-white">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-200">Status</div>
                  <div className="text-lg font-semibold">
                    {profile?.is_online ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      <span className="text-slate-200">Offline</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-200">Last Seen</div>
                  <div className="text-lg font-semibold text-slate-100">
                    {profile?.last_seen ? 
                      new Date(profile.last_seen).toLocaleDateString() : 
                      "Unknown"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
