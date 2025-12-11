import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import api from "../api/axios";

const ProfilePage = () => {
  const { token, logout } = useAuth();

  // Backend profile (source of truth)
  const [profile, setProfile] = useState(null);
  // Local editable version
  const [editProfile, setEditProfile] = useState(null);

  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(""); // for immediate preview
  const [avatarFile, setAvatarFile] = useState(null);
  const [alert, setAlert] = useState("");
  const [error, setError] = useState("");

  // Load backend profile (runs only on mount or token change)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditProfile(res.data);
        setAvatarPreview(res.data.avatarUrl || "");
        setEditing(false); // ALWAYS back to read-only after profile change/fetch!
        setAvatarFile(null);
        setAlert("");
        setError("");
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Failed to load profile");
        setError("Could not load profile.");
        setEditing(false);
        // Do NOT clear profile/editProfile here!
      }
    };
    fetchProfile();
  }, [token]);

  // Start editing: copy latest profile so you always edit "fresh"
  const startEdit = () => {
    setEditProfile({ ...profile });
    setEditing(true);
    setAlert("");
    setError("");
    setAvatarFile(null);
    setAvatarPreview(profile?.avatarUrl || "");
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview(profile?.avatarUrl || "");
    setAlert("");
    setError("");
  };

  const handleChange = (e) => {
    setEditProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // File select for avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    setAvatarFile(file);
    setAvatarPreview(
      file
        ? URL.createObjectURL(file)
        : editProfile?.avatarUrl || profile?.avatarUrl || ""
    );
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    setError("");
    setAlert("");
    if (!avatarFile) {
      toast.error("Please select an image file");
      return;
    }
    
    const loadingToast = toast.loading("Uploading avatar...");
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const res = await api.post("/users/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setEditProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setAvatarPreview(res.data.avatarUrl);
      setAvatarFile(null);
      setAlert("Avatar updated!");
      toast.success("Avatar uploaded successfully!", { id: loadingToast });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to upload avatar";
      setError(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  // Save profile (PUT to backend)
  const saveProfile = async (e) => {
    e.preventDefault();
    setAlert("");
    setError("");
    // Only send if something changed
    if (
      editProfile.name === profile.name &&
      (editProfile.role !== "student" || editProfile.college === profile.college)
    ) {
      toast.info("No changes to update");
      setEditing(false);
      return;
    }
    
    const loadingToast = toast.loading("Updating profile...");
    try {
      // Only send fields you allow editing
      const payload = {
        name: editProfile.name,
        ...(editProfile.role === "student" && { college: editProfile.college }),
      };
      const res = await api.put("/users/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.user) {
        setProfile(res.data.user);
        setEditProfile(res.data.user); // immediately sync
      }
      setEditing(false);
      setAlert(res.data.message || "Profile updated.");
      toast.success("Profile updated successfully!", { id: loadingToast });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error updating profile";
      setError(errorMsg);
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  if (!profile)
    return <div className="text-center mt-8">Loading profile...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        {/* Avatar/Upload */}
        <div className="flex items-center mb-4">
          <img
            src={
              avatarPreview ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                (editing ? editProfile?.name : profile?.name) ||
                  profile?.email ||
                  ""
              )}`
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 mr-4"
          />
          {editing && (
            <form onSubmit={handleAvatarUpload} encType="multipart/form-data" className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="text-sm"
                style={{ fontSize: "12px", maxWidth: "200px" }}
              />
              <Button
                type="submit"
                className="px-3 py-1 text-xs"
                disabled={!avatarFile}
              >
                Upload Avatar
              </Button>
            </form>
          )}
        </div>
        <form onSubmit={saveProfile} className="mb-3">
          <Input
            label="Name"
            name="name"
            value={editing ? editProfile?.name || "" : profile?.name || ""}
            onChange={handleChange}
            disabled={!editing}
            required
          />
          {profile.role === "student" && (
            <Input
              label="College"
              name="college"
              value={
                editing ? editProfile?.college || "" : profile?.college || ""
              }
              onChange={handleChange}
              disabled={!editing}
              required
            />
          )}
          {profile.role === "recruiter" && (
            <Input
              label="Company"
              name="company"
              value={profile.companyName || ""}
              disabled
            />
          )}
          <Input label="Email" name="email" value={profile.email} disabled />
          <Input
            label="Role"
            name="role"
            value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            disabled
          />
          <div className="flex gap-2 mt-4">
            {editing ? (
              <>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Save Profile
                </Button>
                <Button
                  type="button"
                  className="w-full bg-gray-300 text-gray-700 hover:bg-gray-400"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button type="button" className="w-full bg-blue-500 hover:bg-blue-600" onClick={startEdit}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
        {alert && <div className="text-green-700 mt-2">{alert}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <div className="text-right mt-6 mb-2">
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600"
            onClick={logout}
          >
            Log out
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
