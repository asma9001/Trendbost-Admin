import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppStore } from "../appStore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#6a1b9a",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#6a1b9a",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const open = useAppStore((state) => state.dopen);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getButtonStyles = (path) => ({
    backgroundColor: isActive(path) ? "white" : "transparent",
    color: isActive(path) ? "#6a1b9a" : "white",
    "&:hover": {
      backgroundColor: isActive(path) ? "white" : "#8e24aa",
    },
  });

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box height={30} />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "Dashboard", icon: <HomeIcon />, path: "/" },
            {
              text: "Users",
              icon: <PersonOutlineIcon />,
              path: "/users-detail",
            },
            {
              text: "Orders Detail",
              icon: <DataSaverOffIcon />,
              path: "/orders-detail",
            },
            {
              text: "Package Management",
              icon: <LocalPostOfficeIcon />,
              path: "/package-management",
            },
            {
              text: "Financial Overview",
              icon: <AccountBalanceIcon />,
              path: "/financial-overview",
            },
            {
              text: "Profile Settings",
              icon: <SettingsIcon />,
              path: "/profile-settings",
            },
          ].map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate(item.path)}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                  getButtonStyles(item.path),
                ]}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    color: isActive(item.path) ? "#6a1b9a" : "white",
                    mr: open ? 3 : "auto",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: isActive(item.path) ? "#6a1b9a" : "white",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={logoutHandler}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: "initial",
                    }
                  : {
                      justifyContent: "center",
                    },
                getButtonStyles("/logout"),
              ]}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  color: "white",
                  mr: open ? 3 : "auto",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  opacity: open ? 1 : 0,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
