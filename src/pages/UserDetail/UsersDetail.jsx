import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header";
import Sidebar from "../../component/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance.js";
const UsersDetail = () => {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    return `${year}-${month}-${day}`;
  };
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({
    userId: "",
    userName: "",
    email: "",
    startDate: "",
    userStatus: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users");
        const usersWithId = response.data.getDetails.map((user) => ({
          ...user,
          id: user._id,
          date: formatDate(user.date),
        }));

        setUsers(usersWithId);
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle search field changes
  const handleSearchChange = (field, value) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [field]: value,
    }));
  };

  const handleEyeClick = (data) => {
    console.log(data);
  };

  const filteredUsers = users.filter((user) => {
    return Object.keys(search).every((key) => {
      if (!search[key]) return true;
      return user[key]
        ?.toString()
        .toLowerCase()
        .includes(search[key].toLowerCase());
    });
  });

  const columns = [
    { field: "userId", headerName: "User ID", width: 150 },
    { field: "userName", headerName: "User Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "date", headerName: "Registration Date", width: 150 },
    { field: "userStatus", headerName: "User Status", width: 150 },
    {
      field: "preview",
      headerName: "Preview",
      width: 100,
      renderCell: (params) => {
        return (
          <Link
            to={`/users-details/users/${params.row._id}`}
            style={{ textDecoration: "none" }}
          >
            <VisibilityIcon sx={{ cursor: "pointer", color: "gray" }} />
          </Link>
        );
      },
    },
  ];

  return (
    <>
      <Header />
      <Toaster />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: "90vh" }}>
          <Typography
            variant="h4"
            sx={{ marginBottom: 3, marginTop: 3, fontWeight: "bold" }}
          >
            Users
          </Typography>

          <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
            <TextField
              label="User ID"
              variant="outlined"
              size="small"
              value={search.userId}
              onChange={(e) => handleSearchChange("userId", e.target.value)}
            />
            <TextField
              label="User Name"
              variant="outlined"
              size="small"
              value={search.userName}
              onChange={(e) => handleSearchChange("userName", e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              size="small"
              value={search.email}
              onChange={(e) => handleSearchChange("email", e.target.value)}
            />
            <TextField
              label="Registration Date"
              variant="outlined"
              size="small"
              value={search.startDate}
              onChange={(e) => handleSearchChange("startDate", e.target.value)}
            />
            <TextField
              label="User Status"
              variant="outlined"
              size="small"
              value={search.userStatus}
              onChange={(e) => handleSearchChange("userStatus", e.target.value)}
            />
          </Box>

          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
              getRowId={(row) => row._id}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UsersDetail;
