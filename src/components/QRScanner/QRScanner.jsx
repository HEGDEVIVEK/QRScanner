import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  TextField,
  Alert,
  Divider,
  Grid,
  InputAdornment,
  Avatar,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LunchDiningOutlinedIcon from "@mui/icons-material/LunchDiningOutlined";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";

const productDB = {
  BG101: {
    name: "Classic Burger",
    ingredients: ["Top Bun", "Bottom Bun", "Meat Patty", "Cheese Slice"],
    type: "classic",
  },
  BG102: {
    name: "Classic Burger",
    ingredients: ["Top Bun", "Bottom Bun", "Meat Patty", "Cheese Slice"],
    type: "classic",
  },
  BG103: {
    name: "Spicy Burger",
    ingredients: ["Top Bun", "Meat Patty", "Spicy Sauce", "Bottom Bun"],
    type: "spicy",
  },
  BG104: {
    name: "Spicy Burger",
    ingredients: ["Top Bun", "Meat Patty", "Spicy Sauce", "Bottom Bun"],
    type: "spicy",
  },
  BG105: {
    name: "Veggie Burger",
    ingredients: ["Top Bun", "Meat Patty", "Tomato", "Lettuce", "Bottom Bun"],
    type: "veggie",
  },
  BG106: {
    name: "Veggie Burger",
    ingredients: ["Top Bun", "Meat Patty", "Tomato", "Lettuce", "Bottom Bun"],
    type: "veggie",
  },
};

function getTimeGapInSeconds(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const diffMs = new Date(endTime) - new Date(startTime);
  return Math.max(0, Math.floor(diffMs / 1000));
}

function formatTimeGap(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours} hr ${minutes} min ${seconds} sec`;
  if (minutes > 0) return `${minutes} min ${seconds} sec`;
  return `${seconds} sec`;
}

function StageHeader({ title, subtitle, accent }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{ color: "#0f172a", lineHeight: 1.2 }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          mt: 1,
          mb: 1,
          width: "100%",
          height: 4,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 100%)`,
        }}
      />

      <Typography variant="body2" sx={{ color: "#64748b" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

function ProductStageCard({ item, accent }) {

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Stack spacing={1.3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ minWidth: 0, pr: 1 }}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: "#0f172a", lineHeight: 1.2 }}
            >
              {item.name}
            </Typography>
          </Box>

          <Chip
            label={item.code}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}30`,
              flexShrink: 0,
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {/* <Chip
            label={item.type}
            size="small"
            sx={{
              fontWeight: 700,
              color: accent,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          /> */}

          <Chip
            label={`Scans: ${item.scanCount}`}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: "#f8fafc",
              color: "#334155",
              border: "1px solid #e2e8f0",
            }}
          />
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 1.2,
            borderRadius: 2.5,
            backgroundColor: "#f8fafc",
            borderColor: "#e2e8f0",
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Ingredients
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.4, color: "#0f172a" }}>
            {item.ingredients.join(", ")}
          </Typography>
        </Paper>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.2,
                borderRadius: 2.5,
                backgroundColor: "#f8fafc",
                borderColor: "#e2e8f0",
                //height: "100%",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Last Scan
              </Typography>
              <Typography variant="body2" sx={{  color: "#0f172a" }}>
                {new Date(item.lastScan).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.2,
                borderRadius: 2.5,
                backgroundColor: "#f8fafc",
                borderColor: "#e2e8f0",
                //height: "100%",
              }}
            >
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Station Cycle Time 
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ mt: 0.4, color: accent }}
              >
                {item.totalTimeGap || "0 sec"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {item.scanEvents?.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                Scan History
              </Typography>

              <Stack spacing={0.8}>
                {item.scanEvents.map((scan, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 1.1,
                      borderRadius: 2.5,
                      backgroundColor: "#f8fafc",
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <Typography variant="body2" fontWeight={700}>
                      Scan #{index + 1}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.3 }}
                    >
                      {new Date(scan.displayDateTime).toLocaleString()}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Time Difference: {scan.timeGap}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}

function StageColumn({ title, subtitle, items, emptyText, accent }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
        backgroundColor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <StageHeader title={title} subtitle={subtitle} accent={accent} />

        {items.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
            }}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                mx: "auto",
                mb: 1.2,
                backgroundColor: `${accent}18`,
                color: accent,
              }}
            >
              <PersonOutlineIcon />
            </Avatar>

            <Typography variant="body1" fontWeight={700} sx={{ color: "#0f172a" }}>
              Empty Stage
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              {emptyText}
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {items.map((item) => (
              <ProductStageCard
                key={item.code}
                item={item}
                stageLabel={title}
                accent={accent}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

function StatMiniCard({ label, value, icon, accent }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
        height: "100%",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {label}
          </Typography>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mt: 0.3, color: "#0f172a" }}
          >
            {value}
          </Typography>
        </Box>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: `${accent}18`,
            color: accent,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}

export default function QRScanner() {
  const [scanInput, setScanInput] = useState("");
  const [scannedItems, setScannedItems] = useState(() => {
    const savedData = sessionStorage.getItem("scannedItems");
    return savedData ? JSON.parse(savedData) : {};
  });
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("scannedItems", JSON.stringify(scannedItems));
  }, [scannedItems]);

  const handleScan = (event) => {
    if (event.key !== "Enter") return;

    const code = scanInput.trim().toUpperCase();
    if (!code) return;

    const product = productDB[code];

    if (!product) {
      setErrorMessage(`Invalid QR code: ${code}`);
      setScanInput("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return;
    }

    setErrorMessage("");

    const now = new Date();
    const nowIso = now.toISOString();

    setScannedItems((prev) => {
      const previousEntry = prev[code];
      const existingScans = previousEntry?.scanEvents || [];
      const lastScanObj = existingScans[existingScans.length - 1];
      const firstScanObj = existingScans[0];

      const nextScanCount = (previousEntry?.scanCount || 0) + 1;
      const eachTimeGap = getTimeGapInSeconds(
        lastScanObj?.displayDateTime,
        nowIso
      );
      const totalTimeGap = getTimeGapInSeconds(
        firstScanObj?.displayDateTime,
        nowIso
      );

      const newScanEvent = {
        displayDateTime: nowIso,
        timeGap: formatTimeGap(eachTimeGap),
        timeGapSeconds: eachTimeGap,
      };

      return {
        ...prev,
        [code]: {
          code,
          name: previousEntry?.name || product.name,
          ingredients: previousEntry?.ingredients || product.ingredients,
          type: previousEntry?.type || product.type,
          scanCount: nextScanCount,
          lastScan: nowIso,
          totalTimeGapSeconds: totalTimeGap,
          totalTimeGap: formatTimeGap(totalTimeGap),
          scanEvents: [...existingScans, newScanEvent],
        },
      };
    });

    setScanInput("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const allItems = useMemo(() => Object.values(scannedItems), [scannedItems]);

  const stage1Items = allItems.filter((item) => item.scanCount === 1);
  const stage2Items = allItems.filter((item) => item.scanCount === 2);
  const stage3Items = allItems.filter((item) => item.scanCount === 3);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 2.5 },
        background: "linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto" }}>
        <Card
          sx={{
            mb: 2.5,
            borderRadius: 4,
            border: "1px solid #dbe7ff",
            boxShadow: "0 18px 50px rgba(37, 99, 235, 0.12)",
            background:
              "linear-gradient(135deg, #fa7272 0%, #bbc8ff 55%, #38bdf8 100%)",
            color: "#fff",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={4}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  >
                    <QrCodeScannerIcon sx={{ fontSize: 30 }} />
                  </Avatar>

                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      QR Workflow Scanner
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.88 }}>
                      Real-time stage tracking
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} lg={8}>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={3}>
                    <StatMiniCard
                      label="Preparation"
                      value={stage1Items.length}
                      icon={<Filter1Icon />}
                      accent="#16a34a"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatMiniCard
                      label="Assembly"
                      value={stage2Items.length}
                      icon={<Filter2Icon />}
                      accent="#2563eb"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatMiniCard
                      label="Packing"
                      value={stage3Items.length}
                      icon={<Filter3Icon />}
                      accent="#ea580c"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card
          sx={{
            mb: 2.5,
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.7 }}>
              Scanner Input
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 1.8 }}>
              Scan the QR code and press Enter to move the burger to the next stage.
            </Typography>

            <TextField
              fullWidth
              inputRef={inputRef}
              label="Scan QR Code"
              placeholder="Example: BG101"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyDown={handleScan}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QrCodeScannerIcon sx={{ color: "#2563eb" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "#f8fafc",
                },
              }}
            />

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>
                {errorMessage}
              </Alert>
            )}
          </CardContent>
        </Card>

        {allItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              //width: "100%",
              borderRadius: 4,
              p: 5,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Avatar
              sx={{
                width: 82,
                height: 82,
                mx: "auto",
                mb: 2.5,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <QrCodeScannerIcon sx={{ fontSize: 44 }} />
            </Avatar>

            <Typography variant="h4" fontWeight={800} gutterBottom>
              No QR Scanned Yet
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 580,
                mx: "auto",
                mb: 3,
                lineHeight: 1.8,
                color: "#64748b",
              }}
            >
              Start scanning burgers to move them through Preperation, Assembly, and Packing.
            </Typography>

            <Chip
              icon={<QrCodeScannerIcon />}
              label="Waiting for scanner input..."
              sx={{
                fontWeight: 700,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
              }}
            />
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
              alignItems: "start",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <StageColumn
                title="Preparation"
                subtitle="Person 1 is working here"
                items={stage1Items}
                emptyText="No burgers currently with Person 1."
                accent="#16a34a"
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <StageColumn
                title="Assembly"
                subtitle="Person 2 is working here"
                items={stage2Items}
                emptyText="No burgers currently with Person 2."
                accent="#2563eb"
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <StageColumn
                title="Packing"
                subtitle="Person 3 is working here"
                items={stage3Items}
                emptyText="No burgers currently with Person 3."
                accent="#ea580c"
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}