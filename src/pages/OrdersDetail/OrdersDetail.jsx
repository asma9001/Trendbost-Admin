import React, { useState, useEffect } from "react";
import Sidebar from "../../component/Sidebar";
import Box from "@mui/material/Box";
import Header from "../../component/Header";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Typography, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosInstance.js";
const OrdersDetail = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchFilter, setSearchFilter] = useState({
    userId: "",
    transactionId: "",
    platform_Name: "",
    planName: "",
    planPrice:"",
    paymentMethod: "",
    orderStatus: "",
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders/");
        const ordersWithId = response.data.getOrders.map((order,index) => ({
          ...order,
          id: order._id,
        }));
        setTransactions(ordersWithId);
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    };

    fetchOrders();
  }, []);
  const navigate = useNavigate();

  const getStatusColor = (orderStatus) => {
    switch (orderStatus) {
      case "Pending":
        return "#f5bc42";
      case "Processing":
        return "#2196f3";
      case "Completed":
        return "#4caf50";
      case "Declined":
        return "#f54242";
      default:
        return "inherit";
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return Object.keys(searchFilter).every((key) => {
      if (!searchFilter[key]) return true;
      return transaction[key]
        ?.toString()
        .toLowerCase()
        .includes(searchFilter[key].toLowerCase());
    });
  });

  const columns = [
    {
      field: "userId",
      headerName: "User ID",
      width: 85,
      renderHeader: () => (
        <div>
          <Typography>User ID</Typography>
          <TextField
            variant="standard"
            value={searchFilter.userId}
            onChange={(e) => handleSearchChange("userId", e.target.value)}
          />
        </div>
      ),
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Transaction ID</Typography>
          <TextField
            variant="standard"
            value={searchFilter.transactionId}
            onChange={(e) =>
              handleSearchChange("transactionId", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      field: "platform_Name",
      headerName: "Platform Name",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Platform Name</Typography>
          <TextField
            variant="standard"
            value={searchFilter.platform_Name}
            onChange={(e) =>
              handleSearchChange("platform_Name", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      field: "planName",
      headerName: "Subscription",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Subscription</Typography>
          <TextField
            variant="standard"
            value={searchFilter.planName}
            onChange={(e) => handleSearchChange("planName", e.target.value)}
          />
        </div>
      ),
    },
    {
      field: "planPrice",
      headerName: "Package Price",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Price</Typography>
          <TextField
            variant="standard"
            value={searchFilter.planPrice}
            onChange={(e) => handleSearchChange("planPrice", e.target.value)}
            
          />
        </div>
      ),
      renderCell: (params) => {
        return `$${params.value}`; // Adds dollar sign in front of the value
      },
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Payment Method</Typography>
          <TextField
            variant="standard"
            value={searchFilter.paymentMethod}
            onChange={(e) =>
              handleSearchChange("paymentMethod", e.target.value)
            }
          />
        </div>
      ),
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      width: 140,
      renderHeader: () => (
        <div>
          <Typography>Order Status</Typography>
          <TextField
            variant="standard"
            value={searchFilter.orderStatus}
            onChange={(e) => handleSearchChange("orderStatus", e.target.value)}
          />
        </div>
      ),
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: getStatusColor(params.value),
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      width: 100,
      renderCell: (params) => (
        <Link
          to={`/order-details/${params.row._id}`}
          style={{ textDecoration: "none" }}
        >
          <VisibilityIcon sx={{ cursor: "pointer", color: "gray" }} />
        </Link>
      ),
    },
  ];

  const handleEyeClick = (order) => {
    console.log(order);
  };

  return (
    <>
      <Header />
      <Toaster />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: "80vh" }}>
          <Typography variant="h4" sx={{ marginTop: 3, fontWeight: "bold" }}>
            Orders Detail
          </Typography>
          <Box
            sx={{ height: 600, width: "100%", marginTop: 3, overflowX: "auto" }}
          >
            <DataGrid
              rows={filteredTransactions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              sx={{
                "& .MuiDataGrid-cell": { padding: "8px" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
                "& .MuiDataGrid-virtualScrollerContent": { width: "100%" },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OrdersDetail;
