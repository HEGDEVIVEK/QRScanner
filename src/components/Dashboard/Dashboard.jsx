import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import * as XLSX from "xlsx";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

function formatSeconds(totalSeconds) {
  const safeSeconds = Number(totalSeconds) || 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) return `${hours} hr ${minutes} min ${seconds} sec`;
  if (minutes > 0) return `${minutes} min ${seconds} sec`;
  return `${seconds} sec`;
}

function SummaryAccordion({ title, data, color }) {
  return (
    <Accordion
      disableGutters
      sx={{
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #e8ecf3",
        overflow: "hidden",
        backgroundColor: "#fff",
        "&:before": { display: "none" },
        height: "100%",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 64,
          "& .MuiAccordionSummary-content": {
            my: 1,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pr: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>

          <Chip
            label={data.count}
            size="small"
            sx={{
              fontWeight: 700,
              color: color,
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ backgroundColor: "#f8fafc" }}>
        {data.items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No items found.
          </Typography>
        ) : (
          <Stack spacing={1.2}>
            {data.items.map((item) => (
              <Paper
                key={item.code}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  backgroundColor: "#fff",
                  borderColor: "#e8ecf3",
                }}
              >
                <Typography variant="body2" fontWeight={700}>
                  {item.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.name}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

function KpiCard({ icon, label, value, accent }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        border: "1px solid #e8ecf3",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ mt: 1, color: "#0f172a" }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductHistoryAccordion({ item }) {
  return (
    <Accordion
      disableGutters
      sx={{
        mt: 2,
        borderRadius: 3,
        boxShadow: "none",
        border: "1px solid #e8ecf3",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#f8fafc",
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Scan History
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ backgroundColor: "#ffffff" }}>
        {item.scanEvents?.length ? (
          <Stack spacing={1.5}>
            {item.scanEvents.map((scan, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  backgroundColor: "#f8fafc",
                  borderColor: "#e8ecf3",
                }}
              >
                <Typography variant="body2" fontWeight={700}>
                  Scan #{index + 1}
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {new Date(scan.displayDateTime).toLocaleString()}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Difference: {scan.timeGap}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No scan history found.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default function Dashboard() {
  const scannedItems = useMemo(() => {
    const savedItems = sessionStorage.getItem("scannedItems");
    return savedItems ? JSON.parse(savedItems) : {};
  }, []);

  const products = useMemo(() => Object.values(scannedItems || {}), [scannedItems]);

  const summary = useMemo(() => {
    const initial = {
      workInProgress: {
        classic: { count: 0, items: [] },
        spicy: { count: 0, items: [] },
        veggie: { count: 0, items: [] },
      },
      completed: {
        classic: { count: 0, items: [] },
        spicy: { count: 0, items: [] },
        veggie: { count: 0, items: [] },
      },
    };

    products.forEach((item) => {
      const normalizedType = (item.type || "").toLowerCase();

      const target =
        (item.scanCount || 0) < 4
          ? initial.workInProgress[normalizedType]
          : initial.completed[normalizedType];

      target.count += 1;
      target.items.push({
        code: item.code,
        name: item.name,
      });
    });

    return initial;
  }, [products]);

  const kpi = useMemo(() => {
    const completedItems = products.filter((item) => (item.scanCount || 0) >= 4);
    const totalCompleted = completedItems.length;

    if (totalCompleted === 0) {
      return {
        totalCompleted: 0,
        avgTime: "0 sec",
        fastest: "0 sec",
        slowest: "0 sec",
      };
    }

    const times = completedItems.map(
      (item) => Number(item.totalTimeGapSeconds) || 0
    );

    const totalTime = times.reduce((sum, current) => sum + current, 0);
    const avg = Math.floor(totalTime / totalCompleted);
    const fastest = Math.min(...times);
    const slowest = Math.max(...times);

    return {
      totalCompleted,
      avgTime: formatSeconds(avg),
      fastest: formatSeconds(fastest),
      slowest: formatSeconds(slowest),
    };
  }, [products]);

  const exportSingleProductExcel = (item) => {
    const productRows = item.scanEvents?.length
      ? item.scanEvents.map((scan, index) => ({
          "Scan Number": index + 1,
          "Product Code": item.code,
          "Product Name": item.name,
          Type: item.type || "",
          Ingredients: item.ingredients?.join(", ") || "",
          "Total Scans": item.scanCount || 0,
          "Scanned At": new Date(scan.displayDateTime).toLocaleString(),
          "Time Difference": scan.timeGap || "0 sec",
          "Time Difference Seconds": scan.timeGapSeconds ?? 0,
          "Total Time Gap": item.totalTimeGap || "0 sec",
          "Total Time Gap Seconds": item.totalTimeGapSeconds ?? 0,
          Status: (item.scanCount || 0) >= 4 ? "Completed" : "Work In Progress",
        }))
      : [
          {
            "Product Code": item.code,
            "Product Name": item.name,
            Type: item.type || "",
            Ingredients: item.ingredients?.join(", ") || "",
            "Total Scans": item.scanCount || 0,
            "Last Scan": item.lastScan
              ? new Date(item.lastScan).toLocaleString()
              : "",
            "Total Time Gap": item.totalTimeGap || "0 sec",
            "Total Time Gap Seconds": item.totalTimeGapSeconds ?? 0,
            Status: (item.scanCount || 0) >= 4 ? "Completed" : "Work In Progress",
          },
        ];

    const worksheet = XLSX.utils.json_to_sheet(productRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Details");
    XLSX.writeFile(
      workbook,
      `${item.code}_${item.name.replace(/\s+/g, "_")}.xlsx`
    );
  };

  const exportAllProductsExcel = () => {
    const allRows = products.flatMap((item) =>
      item.scanEvents?.length
        ? item.scanEvents.map((scan, index) => ({
            "Scan Number": index + 1,
            "Product Code": item.code,
            "Product Name": item.name,
            Type: item.type || "",
            Ingredients: item.ingredients?.join(", ") || "",
            "Total Scans": item.scanCount || 0,
            "Scanned At": new Date(scan.displayDateTime).toLocaleString(),
            "Time Difference": scan.timeGap || "0 sec",
            "Time Difference Seconds": scan.timeGapSeconds ?? 0,
            "Total Time Gap": item.totalTimeGap || "0 sec",
            "Total Time Gap Seconds": item.totalTimeGapSeconds ?? 0,
            Status:
              (item.scanCount || 0) >= 4 ? "Completed" : "Work In Progress",
          }))
        : [
            {
              "Product Code": item.code,
              "Product Name": item.name,
              Type: item.type || "",
              Ingredients: item.ingredients?.join(", ") || "",
              "Total Scans": item.scanCount || 0,
              "Last Scan": item.lastScan
                ? new Date(item.lastScan).toLocaleString()
                : "",
              "Total Time Gap": item.totalTimeGap || "0 sec",
              "Total Time Gap Seconds": item.totalTimeGapSeconds ?? 0,
              Status:
                (item.scanCount || 0) >= 4 ? "Completed" : "Work In Progress",
            },
          ]
    );

    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Products");
    XLSX.writeFile(workbook, "all_scanned_products.xlsx");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
      }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 5,
          border: "1px solid #e8ecf3",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
          color: "#fff",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Burger Workflow Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.85 }}>
                Track work in progress, completed items, scan history, and timing insights.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={exportAllProductsExcel}
              disabled={products.length === 0}
              sx={{
                backgroundColor: "#fff",
                color: "#0f172a",
                fontWeight: 700,
                px: 2.5,
                "&:hover": {
                  backgroundColor: "#e2e8f0",
                },
              }}
            >
              Download All Excel
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <KpiCard
            label="Total Completed"
            value={kpi.totalCompleted}
            accent="#16a34a"
            icon={<CheckCircleOutlineIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            label="Average Output Cycle Time"
            value={kpi.avgTime}
            accent="#2563eb"
            icon={<ScheduleOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            label="Fastest Output Cycle Time"
            value={kpi.fastest}
            accent="#7c3aed"
            icon={<FlashOnOutlinedIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <KpiCard
            label="Slowest Output Cycle Time"
            value={kpi.slowest}
            accent="#ea580c"
            icon={<TrendingUpOutlinedIcon />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 5,
              border: "1px solid #e8ecf3",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Inventory2OutlinedIcon sx={{ color: "#2563eb" }} />
                <Typography variant="h5" fontWeight={800}>
                  Work In Progress
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Classic"
                    data={summary.workInProgress.classic}
                    color="#16a34a"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Spicy"
                    data={summary.workInProgress.spicy}
                    color="#2563eb"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Veggie"
                    data={summary.workInProgress.veggie}
                    color="#ea580c"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 5,
              border: "1px solid #e8ecf3",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: "#16a34a" }} />
                <Typography variant="h5" fontWeight={800}>
                  Completed
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Classic"
                    data={summary.completed.classic}
                    color="#16a34a"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Spicy"
                    data={summary.completed.spicy}
                    color="#2563eb"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SummaryAccordion
                    title="Veggie"
                    data={summary.completed.veggie}
                    color="#ea580c"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={800}>
          All Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {products.length} total items
        </Typography>
      </Stack>

      {products.length === 0 ? (
        <Card
          sx={{
            borderRadius: 5,
            border: "1px solid #e8ecf3",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No scanned product data found.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {products.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.code} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 5,
                  border: "1px solid #e8ecf3",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
                  backgroundColor: "#fff",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={800}>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          QR Code: {item.code}
                        </Typography>
                      </Box>

                      <Chip
                        label={(item.scanCount || 0) >= 4 ? "Completed" : "In Progress"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          color: (item.scanCount || 0) >= 4 ? "#15803d" : "#b45309",
                          backgroundColor:
                            (item.scanCount || 0) >= 4 ? "#dcfce7" : "#fef3c7",
                          border:
                            (item.scanCount || 0) >= 4
                              ? "1px solid #bbf7d0"
                              : "1px solid #fde68a",
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.3}>
                      {/* <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          backgroundColor: "#f8fafc",
                          borderColor: "#e8ecf3",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Type:</strong> {item.type || "N/A"}
                        </Typography>
                      </Paper> */}

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          backgroundColor: "#f8fafc",
                          borderColor: "#e8ecf3",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Ingredients:</strong>{" "}
                          {item.ingredients?.join(", ") || "N/A"}
                        </Typography>
                      </Paper>

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 2.5,
                              backgroundColor: "#f8fafc",
                              borderColor: "#e8ecf3",
                              height: "100%",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Total Scans
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={800}>
                              {item.scanCount || 0}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={6}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 2.5,
                              backgroundColor: "#f8fafc",
                              borderColor: "#e8ecf3",
                              height: "100%",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              Station Cycle Time 
                            </Typography>
                            <Typography variant="subtitle1" fontWeight={800}>
                              {item.totalTimeGap || "0 sec"}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          backgroundColor: "#f8fafc",
                          borderColor: "#e8ecf3",
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Last Scan:</strong>{" "}
                          {item.lastScan
                            ? new Date(item.lastScan).toLocaleString()
                            : "N/A"}
                        </Typography>
                      </Paper>
                    </Stack>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportSingleProductExcel(item)}
                    fullWidth
                    sx={{
                      mt: 2.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Download Excel
                  </Button>

                  <ProductHistoryAccordion item={item} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}