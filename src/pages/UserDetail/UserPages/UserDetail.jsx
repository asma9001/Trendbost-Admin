import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../component/Header";
import Sidebar from "../../../component/Sidebar";
import toast from "react-hot-toast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../../../axiosInstance.js";

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewUserDetails, setViewUserDetails] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [userHistory, setUserHistory] = useState([]);
  const [getSubscriptions, setGetSubscriptions] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        const formattedDate = formatDate(response.data.user.date);
        setViewUserDetails({ ...response.data.user, date: formattedDate });

        if (
          response.data.orderOfThatUser &&
          response.data.orderOfThatUser.length > 0
        ) {
          setUserHistory(response.data.orderOfThatUser);
        } else {
          setUserHistory([]);
        }
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (viewUserDetails.userId) {
        try {
          const subscriptionResponse = await axiosInstance.get(
            `/userSubscribe/${viewUserDetails.userId}`
          );
          setGetSubscriptions(subscriptionResponse.data);
        } catch (error) {
          toast.error("Failed to fetch subscriptions.");
        }
      }
    };

    fetchSubscriptions();
  }, [viewUserDetails.userId]);
  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const response = await axiosInstance.get(`/userHistory/${id}`);
        setUserHistory(response.data); // Assuming setUserHistory is defined in your state
      } catch (error) {
        toast.error("Failed to fetch user history.");
      }
    };
  
    fetchUserHistory();
  }, [id]);
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const statusToUpdate = selectedStatus || viewUserDetails.userStatus;
      await axiosInstance.put(`/users/${id}`, {
        status: statusToUpdate,
      });
      toast.success("Status updated successfully!");
      navigate("/users-detail");
      setViewUserDetails((prev) => ({ ...prev, userStatus: statusToUpdate }));
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handlePreviewClick = (transaction) => {
    navigate(
      `/users-detail/user/${transaction.id}/transaction/${transaction.id}`,
      {
        state: { transaction, viewUserDetails, userHistory, getSubscriptions },
      }
    );
  };
  console.log(getSubscriptions);

  const rows =
    getSubscriptions.map((historyItem, index) => ({

      id: index + 1,
      transactionId: userHistory[0].transactionId,
      planName: historyItem.subscriptionId.planName || "N/A",
      platform: historyItem.subscriptionId.platform || "N/A",
      status: historyItem.status || "N/A",
      startDate: formatDate(historyItem.startDate),
      endDate:
        historyItem.endDate === "Ongoing"
          ? "Ongoing"
          : formatDate(historyItem.endDate),
    })) || [];

  const columns = [
    { field: "transactionId", headerName: "Transaction ID", width: 150 },
    { field: "planName", headerName: "Package Name", width: 150 },
    { field: "platform", headerName: "Platform Name", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "preview",
      headerName: "Preview",
      width: 100,
      renderCell: (params) => (
        <VisibilityIcon
          sx={{ cursor: "pointer", color: "gray" }}
          onClick={() => handlePreviewClick(params.row)}
        />
      ),
    },
  ];

  return (
    <>
      <Header />
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
            User Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Box sx={{ boxShadow: 1, border: "1px solid #ddd", padding: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  User Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="User ID"
                      value={viewUserDetails.userId}
                      variant="standard"
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
                      label="User Name"
                      value={viewUserDetails.userName}
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
                      label="Registration Date"
                      defaultValue={viewUserDetails.date}
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
                      label="Phone"
                      value={viewUserDetails.phoneNo}
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
                      label="Email"
                      value={viewUserDetails.email}
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
                      label="Current Status"
                      value={viewUserDetails.userStatus}
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
                <Typography variant="h6">Status</Typography>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus || viewUserDetails.userStatus || ""}
                    onChange={handleStatusChange}
                    label="Status"
                    variant="standard"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleUpdateStatus}>
                  Update Status
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 2 }}
              >
                User History
              </Typography>
              <Box sx={{ height: 400, width: "100%", margin: "0 auto" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default UserDetail;
