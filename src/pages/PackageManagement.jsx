import React, { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "../component/Header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTiktok, faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from "../axiosInstance.js";

const PackageManagement = () => {
  const platforms = [
    { name: "TikTok", icon: faTiktok, description: "Manage and boost your TikTok account." },
    { name: "TikTok Live", icon: faTiktok, description: "Enhance your TikTok Live experience." },
    { name: "Facebook", icon: faFacebook, description: "Optimize your Facebook growth strategy." },
    { name: "Instagram", icon: faInstagram, description: "Boost your Instagram followers and engagement." },
    { name: "Twitter", icon: faTwitter, description: "Enhance your Twitter presence and engagement." },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [packageDetails, setPackageDetails] = useState({});
  const [availablePackages, setAvailablePackages] = useState({});
  const [monthlyCustomizePackage, setMonthlyCustomizePackage] = useState([]);
  const [yearlyCustomizePackage, setYearlyCustomizePackage] = useState([]);

  const handleManageClick = async (platformName) => {
    try {
      const encodedPlatformName = encodeURIComponent(platformName);
      const subscriptionPlansUrl = `/subscriptionPlans/${encodedPlatformName}`;
      const customizedPlansUrl = `/customizedPlan/platform/${encodedPlatformName}`;

      const [subscriptionResponse, customizeResponse] = await Promise.all([
        axiosInstance.get(subscriptionPlansUrl),
        axiosInstance.get(customizedPlansUrl),
      ]);

      if (!subscriptionResponse.data || subscriptionResponse.data.length === 0) {
        toast.warning(`No subscription plans found for ${platformName}`);
        return;
      }

      const monthlyPlans = customizeResponse.data.filter(pkg => pkg.planType === "monthly");
      const yearlyPlans = customizeResponse.data.filter(pkg => pkg.planType === "yearly");

      setMonthlyCustomizePackage(monthlyPlans);
      setYearlyCustomizePackage(yearlyPlans);

      const packages = subscriptionResponse.data.reduce((acc, pkg) => {
        if (!acc[pkg.planName]) {
          acc[pkg.planName] = {
            id: pkg._id,
            Likes: pkg.likes,
            Comments: pkg.comments,
            Followers: pkg.followers,
            "Live Audience": pkg.live_audience || 0,
            monthlyPrice: 0,
            yearlyPrice: 0,
          };
        }
        if (pkg.planType === "monthly") {
          acc[pkg.planName].monthlyPrice = pkg.price;
        } else if (pkg.planType === "yearly") {
          acc[pkg.planName].yearlyPrice = pkg.price;
        }
        return acc;
      }, {});

      setAvailablePackages((prevPackages) => ({
        ...prevPackages,
        [platformName]: packages,
      }));

      setPackageDetails((prevDetails) => ({
        ...prevDetails,
        [platformName]: subscriptionResponse.data,
      }));

      setSelectedPlatform(platformName);
    } catch (error) {
      toast.error("Failed to fetch package data");
      console.error("Error fetching package data:", error);
    }
  };

  const handleDetailChange = (index, key, value, planType) => {
    if (planType === "monthly") {
      setMonthlyCustomizePackage((prevPackages) =>
        prevPackages.map((pkg, i) => {
          if (i === index) {
            return { ...pkg, [key]: value };
          }
          return pkg;
        })
      );
    } else if (planType === "yearly") {
      setYearlyCustomizePackage((prevPackages) =>
        prevPackages.map((pkg, i) => {
          if (i === index) {
            return { ...pkg, [key]: value };
          }
          return pkg;
        })
      );
    }
  };

  const handlePackageChange = (plan, key, value) => {
    const updatedPackages = { ...availablePackages };
    updatedPackages[selectedPlatform][plan][key] = value;
    setAvailablePackages(updatedPackages);
  };

  const handleUpdateClick = async (table) => {
    try {
      const updatedData = Object.values(availablePackages[selectedPlatform]).map((pkg) => ({
        id: pkg.id,
        planName: pkg.planName,
        likes: pkg.Likes,
        comments: pkg.Comments,
        followers: pkg.Followers,
        live_audience: pkg["Live Audience"],
        planType: table.toLowerCase(),
        price: table === "Monthly" ? pkg.monthlyPrice : pkg.yearlyPrice,
      }));

      if (!Array.isArray(updatedData)) {
        throw new Error("Updated data is not an array");
      }

      const updatePromises = updatedData.map((pkg) =>
        axiosInstance.put(`/subscriptionPlans/${pkg.id}`, pkg)
      );

      await Promise.all(updatePromises);

      toast.success(`Updated ${table} package details`);
    } catch (error) {
      toast.error("Failed to update package data");
      console.error("Error updating package data:", error);
    }
  };

  const handleUpdateMonthlyCustomizeClick = async () => {
    try {
      const updatePromises = monthlyCustomizePackage.map((pkg) =>
        axiosInstance.put(`/customizedPlan/${pkg._id}`, pkg)
      );

      await Promise.all(updatePromises);

      toast.success("Updated Monthly Customized package details");
    } catch (error) {
      toast.error("Error updating monthly customized package");
      console.error("Error updating monthly customized package:", error);
    }
  };

  const handleUpdateYearlyCustomizeClick = async () => {
    try {
      const updatePromises = yearlyCustomizePackage.map((pkg) =>
        axiosInstance.put(`/customizedPlan/${pkg._id}`, pkg)
      );

      await Promise.all(updatePromises);

      toast.success("Updated Yearly Customized package details");
    } catch (error) {
      toast.error("Error updating yearly customized package");
      console.error("Error updating yearly customized package:", error);
    }
  };

  const renderCustomizeTable = (customizePackage, planType) => {
    return customizePackage.map((detail, index) => (
      <TableContainer component={Paper} key={index}>
        <Table>
          <TableHead style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
            <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell>Package/per</TableCell>
              <TableCell>Package Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detail.platform_Name === "Tiktok Live" ? (
              <TableRow>
                <TableCell>Live Audience</TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    value="1"
                    onChange={(e) =>
                      handleDetailChange(index, "liveAudience", e.target.value, planType)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    value={detail.pricePerAudience || ""}
                    onChange={(e) =>
                      handleDetailChange(index, "pricePerAudience", e.target.value, planType)
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              <>
                <TableRow>
                  <TableCell>Likes</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value="1"
                      onChange={(e) =>
                        handleDetailChange(index, "likes", e.target.value, planType)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={detail.pricePerLike || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "pricePerLike", e.target.value, planType)
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Comments</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value="1"
                      onChange={(e) =>
                        handleDetailChange(index, "comments", e.target.value, planType)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={detail.pricePerComment || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "pricePerComment", e.target.value, planType)
                      }
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Followers</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value="1"
                      onChange={(e) =>
                        handleDetailChange(index, "followers", e.target.value, planType)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={detail.pricePerFollower || ""}
                      onChange={(e) =>
                        handleDetailChange(index, "pricePerFollower", e.target.value, planType)
                      }
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    ));
  };

  const renderAdditionalTable = (platform) => {
    const features =
      platform.name === "TikTok Live" ? ["Live Audience"] : ["Likes", "Comments", "Followers"];
    const plans = Object.keys(availablePackages[platform.name] || {});

    return (
      <>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Monthly Packages Available Prices
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
              <TableRow>
                <TableCell>Plans</TableCell>
                {features.map((feature, index) => (
                  <TableCell key={index}>{feature}</TableCell>
                ))}
                <TableCell>Monthly Package Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan}>
                  <TableCell>{plan}</TableCell>
                  {features.map((feature, index) => (
                    <TableCell key={index}>
                      <TextField
                        variant="standard"
                        value={availablePackages[platform.name][plan][feature]}
                        onChange={(e) => handlePackageChange(plan, feature, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={availablePackages[platform.name][plan].monthlyPrice}
                      onChange={(e) => handlePackageChange(plan, "monthlyPrice", e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => handleUpdateClick("Monthly")}>
            Update Monthly Packages
          </Button>
        </Box>
        <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
          Yearly Packages Available Prices
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
              <TableRow>
                <TableCell>Plans</TableCell>
                {features.map((feature, index) => (
                  <TableCell key={index}>{feature}</TableCell>
                ))}
                <TableCell>Yearly Package Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan}>
                  <TableCell>{plan}</TableCell>
                  {features.map((feature, index) => (
                    <TableCell key={index}>
                      <TextField
                        variant="standard"
                        value={availablePackages[platform.name][plan][feature]}
                        onChange={(e) => handlePackageChange(plan, feature, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={availablePackages[platform.name][plan].yearlyPrice}
                      onChange={(e) => handlePackageChange(plan, "yearlyPrice", e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => handleUpdateClick("Yearly")}>
            Update Yearly Packages
          </Button>
        </Box>
      </>
    );
  };

  return (
    <>
      <Header />
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center" }}>
          <Toaster />
          {!selectedPlatform ? (
            <Box sx={{ width: "100%", maxWidth: 1000 }}>
              <Typography variant="h4" style={{ fontWeight: "bold" }} sx={{ marginBottom: 3 }}>
                Package Management
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {platforms.map((platform) => (
                  <Grid item xs={12} md={6} lg={4} key={platform.name} sx={{ display: "flex", justifyContent: "center" }}>
                    <Card sx={{ width: 300 }}>
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
                          <FontAwesomeIcon icon={platform.icon} size="2x" />
                          <Typography variant="h6">{platform.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {platform.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Button size="small" variant="contained" color="secondary" onClick={() => handleManageClick(platform.name)}>
                          Package List
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ width: "100%", maxWidth: 1000 }}>
              <Button variant="contained" color="secondary" onClick={() => setSelectedPlatform(null)} sx={{ marginBottom: 3 }}>
                Back
              </Button>
              <Typography variant="h5" style={{ fontWeight: "bold" }} sx={{ marginBottom: 3 }}>
                {decodeURIComponent(selectedPlatform)} Package Details
              </Typography>
              {renderAdditionalTable({ name: selectedPlatform })}
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Customized Monthly Packages Prices
              </Typography>
              {renderCustomizeTable(monthlyCustomizePackage, "monthly")}
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleUpdateMonthlyCustomizeClick}>
                  Update Monthly Customized Packages
                </Button>
              </Box>
              <Typography variant="h6" sx={{ marginTop: 4, marginBottom: 2 }}>
                Customized Yearly Packages Prices
              </Typography>
              {renderCustomizeTable(yearlyCustomizePackage, "yearly")}
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button variant="contained" color="secondary" onClick={handleUpdateYearlyCustomizeClick}>
                  Update Yearly Customized Packages
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PackageManagement;