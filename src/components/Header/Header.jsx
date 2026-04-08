import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import "./Header.scss";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      color="inherit"
      className="app-header"
    >
      <Toolbar className="app-header__toolbar">
        <Box className="app-header__left">
          <Box className="app-header__icon-box">
            <QrCodeScannerIcon className="app-header__icon" />
          </Box>

          <Box>
            <Typography className="app-header__title">
              Burger QR Tracker
            </Typography>
            <Typography className="app-header__subtitle">
              Track scanned items and monitor live QR activity
            </Typography>
          </Box>
        </Box>

        <Box className="app-header__right">
          <Chip
            label="Live Tracking"
            className="app-header__status-chip"
          />

          <Chip
            icon={<AccessTimeIcon />}
            label={currentTime}
            className="app-header__time-chip"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}