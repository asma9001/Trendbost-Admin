import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Box from "@mui/material/Box";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Paper from "@mui/material/Paper";
import { useSpring, animated } from "@react-spring/web";
import toast from "react-hot-toast";
import axiosInstance from '../axiosInstance.js';
const Home = () => {
  const [totalRevenue, setTotalRevenue] = useState();
  const [getPlatformSubscribers, setGetPlatformSubscribers] = useState([]);
  const [maxSales, setMaxSales] = useState([]);
  const { number } = useSpring({
    from: { number: 0 },
    number: totalRevenue,
    delay: 0,
    config: { duration: 2000 },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const [revenueResponse, platformSubscribers, maxSalesPlatform] =
          await Promise.all([
            axiosInstance.get("/totalRevenue"),
            axiosInstance.get("/platformSubscribers"),
            axiosInstance.get("/maxPlatformSales"),
          ]);

        setTotalRevenue(revenueResponse.data.totalRevenue);
        setGetPlatformSubscribers(platformSubscribers.data.totalSubscribers);
        setMaxSales(maxSalesPlatform.data);
      } catch (error) {
        toast.error("Failed to fetch data.");
      }
    };
    getData();
  }, []);

  const chartData = getPlatformSubscribers.map((platform) => ({
    platform: platform._id,
    subscribers: platform.totalSales,
  }));

  return (
    <>
      <Header />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, display: "flex", gap: 3, marginTop: 5 }}
          >
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <h3>Total Revenue</h3>
                <animated.p style={{ fontSize: "24px", margin: 0 }}>
                  {number.to((n) => `$${n.toFixed(0)}`)}
                </animated.p>
                <p style={{ fontSize: "12px", color: "gray" }}>
                  Total revenue generated so far by the company
                </p>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  textAlign: "center",
                }}
              >
                <h3>Max Sales Platform</h3>
                <p style={{ fontSize: "24px", margin: 0 }}>{maxSales._id}</p>
                <p style={{ fontSize: "12px", color: "gray" }}>
                  Platform with the highest sales
                </p>
              </Paper>
            </Box>

            <Paper
              elevation={3}
              sx={{
                padding: 2,
                borderRadius: 2,
                flex: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BarChart
                width={600}
                height={300}
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="subscribers" fill="#8884d8" />
              </BarChart>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
