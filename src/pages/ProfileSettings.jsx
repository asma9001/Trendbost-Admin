import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "../component/Header";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../axiosInstance.js";
const ProfileSettings = () => {
  const [user, setUser] = useState([]);
  const userId = localStorage.getItem("userId");
  const [file, setFile] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, [userId]);
  console.log(userId);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("phoneNo", user.phoneNo);
      if (file) {
        formData.append("image", file);
      }

      const response = await axiosInstance.put(`/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          picture: file ? URL.createObjectURL(file) : prevUser.picture,
        }));
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };
  console.log(user);
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (
      !user ||
      !user.oldPassword ||
      !user.newPassword ||
      !user.confirmNewPassword
    ) {
      toast.error("Please fill in both the old and new password fields.");
      return;
    }

    if (user.newPassword !== user.confirmNewPassword) {
      setPasswordsMismatch(true);
      toast.error(
        "Your new password and confirm new password are not the same"
      );
      return;
    }

    setPasswordsMismatch(false);

    const passwordData = {
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };

    try {
      const response = await axiosInstance.put(
        `/change-password/${userId}`,
        passwordData
      );

      if (response.status === 200) {
        toast.success("Password updated successfully");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update password");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevShowPasswords) => ({
      ...prevShowPasswords,
      [field]: !prevShowPasswords[field],
    }));
  };

  return (
    <>
      <Header />
      <Toaster />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              boxShadow: 2,
              padding: 3,
              borderRadius: 2,
              width: "80%",
              minWidth: 300,
              marginBottom: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", marginBottom: 3 }}
            >
              Account Settings
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  variant="standard"
                  value={user.firstName}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  variant="standard"
                  value={user.lastName}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  variant="standard"
                  value={user.email}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Phone"
                  name="phoneNo"
                  variant="standard"
                  value={user.phoneNo}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  fullWidth
                  inputProps={{ accept: "image/*" }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="secondary">
                  Update
                </Button>
              </Box>
            </form>
          </Box>

          <Box
            sx={{
              boxShadow: 2,
              padding: 3,
              borderRadius: 2,
              width: "80%",
              minWidth: 300,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 3 }}
            >
              Change Password
            </Typography>
            <form onSubmit={handlePasswordUpdate}>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <TextField
                  label="Old Password"
                  name="oldPassword"
                  type={showPasswords.oldPassword ? "text" : "password"}
                  variant="standard"
                  value={user.oldPassword}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.newPassword ? "text" : "password"}
                  variant="standard"
                  value={user.newPassword}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type={showPasswords.confirmNewPassword ? "text" : "password"}
                  variant="standard"
                  value={user.confirmNewPassword}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="secondary">
                  Update Password
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfileSettings;
