import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Box from "@mui/material/Box";
import { Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AnimatedRevenue from "./AnimatedRevinew"; // Import the new component
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../axiosInstance.js";
const FinancialOverview = () => {
  const [search, setSearch] = useState({
    userId: "",
    userName: "",
    platform_Name: "",
    planName: "",
    planPrice: "",
    transactionId: "",
    paymentMethod: "",
  });

  const [subscriptionData, setSubscriptionData] = useState([]);
  const [platformRevenue, setPlatformRevenue] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const [packageDetails, revenue] = await Promise.all([
          axiosInstance.get("/getPackageDetails"),
          axiosInstance.get("/platformRevenue"),
        ]);
        const subscriptionsWithId = packageDetails.data.map((user) => ({
          ...user,
          id: user._id,
        }));

        setSubscriptionData(subscriptionsWithId);
        setPlatformRevenue(revenue.data.platformRevenue);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    };
    getData();
  }, []);

  console.log(subscriptionData);
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const filteredData = subscriptionData.filter((Subscription) => {
    return Object.keys(search).every((key) => {
      if (!search[key]) return true;
      return Subscription[key]
        ?.toString()
        .toLowerCase()
        .includes(search[key].toLowerCase());
    });
  });
  const columns = [
    {
      field: "userId",
      headerName: "User ID",
      width: 150,
      renderHeader: () => (
        <>
          <TextField
            label="Search User ID"
            name="userId"
            value={search.userId}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
    {
      field: "userName",
      headerName: "Username",
      width: 150,
      renderHeader: () => (
        <>
          <TextField
            label="Search Username"
            name="userName"
            value={search.userName}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
    {
      field: "platform_Name",
      headerName: "Platform",
      width: 150,
      renderHeader: () => (
        <>
          <TextField
            label="Search Platform"
            name="platform_Name"
            value={search.platform_Name}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
    {
      field: "planName",
      headerName: "Package Name",
      width: 150,
      renderHeader: () => (
        <>
          <TextField
            label="Search Package"
            name="planName"
            value={search.planName}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
    {
      field: "planPrice",
      headerName: "Price",
      width: 150,
      renderHeader: () => (
        <>
          <TextField
            label="Search Price"
            name="planPrice"
            value={search.planPrice}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
      renderCell: (params) => {
        return `$${params.value}`; // Adds dollar sign in front of the value
      },
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      width: 180,
      renderHeader: () => (
        <>
          <TextField
            label="Search Transaction ID"
            name="transactionId"
            value={search.transactionId}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 180,
      renderHeader: () => (
        <>
          <TextField
            label="Search Payment Method"
            name="paymentMethod"
            value={search.paymentMethod}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            fullWidth
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: "80%" }}>
          <h1>Financial Overview</h1>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 3 }}
          >
            {platformRevenue.map((platform) => (
              <Box key={platform._id} sx={{ flex: "1 1 calc(33.33% - 16px)" }}>
                <AnimatedRevenue
                  platform={platform._id}
                  revenue={platform.total}
                />
              </Box>
            ))}
          </Box>
          <h2>Platform Package Detail</h2>
          <Box sx={{ height: 400, overflowX: "auto" }}>
            <Box sx={{ minWidth: 900 }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                disableColumnMenu
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FinancialOverview;
