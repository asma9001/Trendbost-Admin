import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../../../component/Sidebar";
import Header from "../../../component/Header";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import axiosInstance from "../../../axiosInstance.js";
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [getOrderdetails, setGetOrderDetails] = useState([]);
  const [status, setStatus] = useState("");
  console.log(id);
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        setGetOrderDetails(response.data);
      } catch (error) {
        toast.error("Failed to fetch order details.");
      }
    };
    fetchOrderDetails();
  }, [id]);
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const statusToUpdate = status || orderStatus;
      await axiosInstance.put(`/orders/${id}`, {
        status: statusToUpdate,
      });
      toast.success("Order Status updated successfully!");
      navigate("/orders-detail");
      setGetOrderDetails((prev) => ({ ...prev, orderStatus: statusToUpdate }));
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const { userName, order = {} } = getOrderdetails;

  const {
    _id,
    platform_Name,
    paymentMethod,
    startDate,
    endDate,
    orderStatus,
  } = order;

  // Formatting the dates

  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  return (
    <>
      <Header />
      <Toaster />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <IconButton
            onClick={handleBackClick}
            sx={{ marginBottom: 2, marginTop: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3 }}>
            Order Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={7}>
              <Box sx={{ boxShadow: 1, border: "1px solid #ddd", padding: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Order Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="User Name"
                      defaultValue={userName}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Order ID"
                      defaultValue={_id}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Platform Name"
                      defaultValue={platform_Name}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Payment Method"
                      defaultValue={paymentMethod}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      defaultValue={formattedStartDate}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      defaultValue={formattedEndDate}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      defaultValue={orderStatus}
                      variant="standard"
                      sx={{ marginBottom: 2 }}
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ padding: 2, boxShadow: 1, border: "1px solid #ddd" }}>
                <Typography variant="h6">Update Status</Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status || orderStatus || ""}
                    onChange={handleStatusChange}
                    label="Status"
                    variant="standard"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Declined">Declined</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleUpdateStatus}>
                  Update Status
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default OrderDetail;
