import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../../component/Header";
import Sidebar from "../../../component/Sidebar";
import axiosInstance from "../../../axiosInstance.js";

const TransactionDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, viewUserDetails, userHistory, getSubscriptions } =
    location.state;
  const [getStats, setGetStats] = useState([]);
  const [getDetailsOfConsumption, setGetDetailsOfConsumption] = useState([]);
  useEffect(() => {
    const fetchConsumptionStats = async () => {
      try {
        const subscriptionId = userHistory[0].subscriptionId._id;

        const response = await axiosInstance.get(
          "/subscriptionConsumption/stats",
          {
            params: {
              userId: viewUserDetails._id,
              subscriptionId: subscriptionId,
            },
          }
        );
        setGetStats(response.data);
        const getAllConsumption = await axiosInstance.get(
          "/subscriptionConsumption/getSubscriptionConsumption",
          {
            params: {
              userId: viewUserDetails.userId,
              subscriptionId: subscriptionId,
            },
          }
        );
        setGetDetailsOfConsumption(getAllConsumption.data);
      } catch (error) {
        console.error("Error fetching consumption stats:", error);
      }
    };

    if (viewUserDetails && userHistory) {
      fetchConsumptionStats();
    }
  }, [viewUserDetails, userHistory]);

  const rows = getDetailsOfConsumption.map((historyItem, index) => ({
    id: index + 1,
    transactionId: historyItem.transactionId,
    likes: historyItem.consumedLikes || 0,
    comments: historyItem.consumedComments || 0,
    followers: historyItem.consumedFollowers || 0,
    postLink: historyItem.postLink || 0,
    status: historyItem.status || 0,
  }));

  const columns =
    transaction.platform === "TikTok Live"
      ? [
          { field: "id", headerName: "Transaction ID", width: 150 },
          {
            field: "liveAudience",
            headerName: "No. of Live Audience",
            width: 200,
          },
          { field: "postLink", headerName: "Dummy URL", width: 250 },
          { field: "status", headerName: "Status", width: 150 },
        ]
      : [
          { field: "id", headerName: "Transaction ID", width: 150 },
          { field: "likes", headerName: "No. of Likes", width: 150 },
          { field: "comments", headerName: "No. of Comments", width: 150 },
          { field: "followers", headerName: "No. of Followers", width: 150 },
          { field: "postLink", headerName: "Dummy URL", width: 250 },
          { field: "status", headerName: "Status", width: 150 },
        ];

  return (
    <>
      <Header />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: "90vh" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ marginBottom: 2, marginTop: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3 }}>
            Transaction Details
          </Typography>
          <Typography variant="h6">
            {transaction.platform} - {transaction.planName}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {transaction.platform !== "TikTok Live" ? (
              <>
                <Grid item xs={4}>
                  <Box
                    sx={{ padding: 2, boxShadow: 1, border: "1px solid #ddd" }}
                  >
                    <Typography variant="h6">Likes</Typography>
                    <Typography>
                      Consumed: {getStats.consumedLikes || 0}
                    </Typography>
                    <Typography>
                      Remaining: {getStats.remainingLikes || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{ padding: 2, boxShadow: 1, border: "1px solid #ddd" }}
                  >
                    <Typography variant="h6">Comments</Typography>
                    <Typography>
                      Consumed: {getStats.consumedComments || 0}
                    </Typography>
                    <Typography>
                      Remaining: {getStats.remainingComments || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={{ padding: 2, boxShadow: 1, border: "1px solid #ddd" }}
                  >
                    <Typography variant="h6">Followers</Typography>
                    <Typography>
                      Consumed: {getStats.consumedFollowers || 0}
                    </Typography>
                    <Typography>
                      Remaining: {getStats.remainingFollowers || 0}
                    </Typography>
                  </Box>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Box
                  sx={{ padding: 2, boxShadow: 1, border: "1px solid #ddd" }}
                >
                  <Typography variant="h6">No. of Live Audience</Typography>
                  <Typography>
                    Consumed:{" "}
                    {transaction.totalAudience - transaction.remainingAudience}
                  </Typography>
                  <Typography>
                    Remaining: {transaction.remainingAudience}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginTop: 3 }}>
            Transaction Details
          </Typography>
          <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TransactionDetail;
