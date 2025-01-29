import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/adminAuth/adminLogin/",
        {
          userName,
          password,
        }
      );
      if (response.status === 200 || response.status === 201) {
        const userRole = response.data.userRole;
        const token = response.data.token;

        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("token", token);

        toast.success("Login Successfull");

        setTimeout(() => {
          if (userRole === "admin") {
            window.location.href = "/";
          }
        }, 2000);
      } else {
        toast.error("Invalid Credentials.");
      }
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Invalid Credentials.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#a142f5",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom color="purple">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "purple",
                "&:hover": {
                  backgroundColor: "darkpurple",
                },
                marginTop: 2,
              }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster position="top-center" />
    </Box>
  );
};

export default Login;
